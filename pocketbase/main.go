package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	_ "app/migrations"

	_ "github.com/joho/godotenv/autoload"

	"github.com/pocketbase/dbx"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/cron"
	"github.com/pocketbase/pocketbase/tools/security"
	"github.com/pocketbase/pocketbase/tools/types"

	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

var unauthorizedErr = apis.NewUnauthorizedError("Invalid or expired OTP token", nil)
var notFoundErr = apis.NewNotFoundError("User not found", nil)
var badRequestErr = apis.NewBadRequestError("Invalid request", nil)

const WEB_URL = "https://pre-rt.prod.appadem.in"
const INITIAL_FORM_ID = "muyb28eqa5xq39k"
const TREAMTMENT_START_QUESTION_ID = "242u8ha0yn8m06d"

func createOtp(app *pocketbase.PocketBase, user *models.Record) (*models.Record, error) {
	collection, err := app.Dao().FindCollectionByNameOrId("otp")

	if err != nil {
		return nil, err
	}

	record := models.NewRecord(collection)

	record.Set("user", user.Id)
	record.Set("expiration", time.Now().Add(5*time.Minute))
	record.Set("attempts", 0)
	record.Set("password", security.RandomStringWithAlphabet(6, "0123456789"))

	if err := app.Dao().SaveRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}

func sendText(phoneNumber string, text string) error {
	// replace 0 with +46 for phoneNumber
	phoneNumber = strings.Replace(phoneNumber, "0", "+46", 1)

	apiUsername := os.Getenv("ELKS_API_USERNAME")
	apiPassword := os.Getenv("ELKS_API_PASSWORD")
	auth := base64.StdEncoding.EncodeToString([]byte(apiUsername + ":" + apiPassword))

	// Prepare data
	data := url.Values{}
	data.Set("from", "Sahlgrenska")
	data.Set("to", phoneNumber)
	data.Set("message", text)

	// Create HTTP request
	req, err := http.NewRequest("POST", "https://api.46elks.com/a1/sms", strings.NewReader(data.Encode()))
	if err != nil {
		fmt.Println("Error creating request:", err)
		return err
	}

	// Set headers
	req.Header.Set("Authorization", "Basic "+auth)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return err
	}
	defer resp.Body.Close()

	// Read response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response:", err)
		return err
	}

	fmt.Println("Response:", string(body))

	return nil
}

func answeredQuestionnaire(answeredDate time.Time, occurance string) bool {
	var nextDueDate time.Time

	switch occurance {
	case "daily":
		// Add one day to the answered date, but ignore the time
		nextDueDate = answeredDate.AddDate(0, 0, 1) // Add one day
	case "weekly":
		weekday := answeredDate.Weekday()
		var daysUntilMonday int
		if weekday == time.Sunday {
			daysUntilMonday = 1
		} else {
			daysUntilMonday = (8 - int(weekday)) % 7
		}
		nextDueDate = answeredDate.AddDate(0, 0, daysUntilMonday)
	default:
		// Optionally handle unexpected occurrence value
		return false
	}
	nextDueDate = time.Date(nextDueDate.Year(), nextDueDate.Month(), nextDueDate.Day(), 0, 0, 0, 0, nextDueDate.Location())

	// Get the current date
	currentDate := time.Now()

	// log.Println("Answered date: " + answeredDate.String())
	// log.Println("Next due date: " + nextDueDate.String())
	return nextDueDate.After(currentDate)
}

func checkAndSendNotification(app *pocketbase.PocketBase, user *models.Record, questionnaire *models.Record) {
	answers, _ := app.Dao().FindRecordsByFilter("answers", "user = {:user} && questionnaire = {:questionnaire}", "-date", 1, 0, dbx.Params{
		"user":          user.Id,
		"questionnaire": questionnaire.Id,
	})

	for _, answer := range answers {
		if answer != nil && answeredQuestionnaire(answer.Get("date").(types.DateTime).Time(), questionnaire.Get("occurrence").(string)) {
			log.Println("Already answered")
			return
		}
	}

	date := time.Now().Format("2006-01-02")
	link := WEB_URL + "/forms/" + questionnaire.Id + "?date=" + date

	// log.Println("Hej! Glöm inte att svara på din enkät idag!" + link)
	sendText(user.GetString("phoneNumber"), "Hej! Glöm inte att svara på din enkät idag!"+link)
}

func main() {
	app := pocketbase.New()

	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: isGoRun,
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		scheduler := cron.New()

		e.Router.Use(middleware.Decompress())
		e.Router.Use(middleware.BodyLimit(100 * 1024 * 1024))

		e.Router.Use(middleware.CORSWithConfig(middleware.CORSConfig{
			AllowOrigins: []string{"*"}, // You can restrict this to specific domains if needed
			AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
		}))

		e.Router.POST("/otp-create", func(c echo.Context) error {
			data := struct {
				PhoneNumber string `json:"phoneNumber"`
			}{}

			if err := c.Bind(&data); err != nil {
				log.Println("bind error", err)
				return badRequestErr
			}

			user, err := app.Dao().FindFirstRecordByData("users", "phoneNumber", data.PhoneNumber)
			if err != nil {
				return notFoundErr
			}

			record, err := createOtp(app, user)

			if err != nil {
				return badRequestErr
			}

			sendText(data.PhoneNumber, "Din engångskod är: "+record.GetString("password"))

			return c.JSON(200, record)
		})

		e.Router.POST("/otp-verify", func(c echo.Context) error {
			println("/POST otp-verify")
			data := struct {
				VerifyToken string `json:"verifyToken"`
				OTP         string `json:"otp"`
			}{}

			if err := c.Bind(&data); err != nil {
				log.Println("bind error", err)
				return unauthorizedErr
			}

			record, err := app.Dao().FindRecordById("otp", data.VerifyToken)
			if err != nil {
				return unauthorizedErr
			}

			if record.GetDateTime("expiration").Time().Before(time.Now()) {
				app.Dao().DeleteRecord(record)
				return unauthorizedErr
			}

			if !security.Equal(record.GetString("password"), data.OTP) {
				attempts := record.GetInt("attempts") + 1
				if attempts > 3 {
					app.Dao().DeleteRecord(record)
					return unauthorizedErr
				}

				record.Set("attempts", attempts)
				if err := app.Dao().SaveRecord(record); err != nil {
					log.Println("save error", err)
				}

				return unauthorizedErr
			}

			if err := app.Dao().ExpandRecord(record, []string{"user"}, nil); len(err) > 0 {
				log.Println("expand error", err)
				return unauthorizedErr
			}

			user := record.ExpandedOne("user")
			if user == nil {
				return unauthorizedErr
			}

			defer app.Dao().DeleteRecord(record)
			return apis.RecordAuthResponse(app, c, user, nil)
		})

		scheduler.MustAdd("notifications", "0 19 * * *", func() {
			users, err := app.Dao().FindRecordsByFilter("users", "phoneNumber != ''", "", 0, 0, nil)
			if err != nil {
				log.Println("error", err)
			}

			questionnaire, _ := app.Dao().FindFirstRecordByFilter("questionnaires", "occurrence = 'daily'")

			for _, user := range users {
				log.Println("user", user)
				checkAndSendNotification(app, user, questionnaire)
			}
		})

		scheduler.Start()

		return nil
	})

	app.OnRecordAfterCreateRequest("users").Add(func(e *core.RecordCreateEvent) error {
		phoneNumber := e.Record.GetString("phoneNumber")

		otp, err := createOtp(app, e.Record)

		if err != nil {
			return badRequestErr
		}

		link := WEB_URL + "/login/" + otp.Id + "?code=" + otp.GetString("password")

		sendText(phoneNumber, "Välkommen till Sahlgrenska forskningsprojekt! vänligen fyll i formuläret på "+link)

		return nil
	})

	app.OnRecordAfterCreateRequest("answers").Add(func(e *core.RecordCreateEvent) error {
		questionnaireId := e.Record.GetString("questionnaire")

		if questionnaireId != INITIAL_FORM_ID {
			return nil
		}

		userId := e.Record.GetString("user")

		user, err := app.Dao().FindRecordById("users", userId)

		if err != nil {
			return notFoundErr
		}

		answersString := e.Record.GetString("answers")
		// parse json string to map
		var answers map[string]interface{}
		if err := json.Unmarshal([]byte(answersString), &answers); err != nil {
			return badRequestErr
		}

		treatmentStart := answers[TREAMTMENT_START_QUESTION_ID]
		log.Println("treatmentStart", treatmentStart)
		user.Set("treatmentStart", treatmentStart)
		log.Println("user", user)
		if err := app.Dao().SaveRecord(user); err != nil {
			return badRequestErr
		}

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
