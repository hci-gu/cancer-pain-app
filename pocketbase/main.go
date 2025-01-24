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

	// _ "app/migrations"

	// _ "github.com/joho/godotenv/autoload"
	// "github.com/labstack/echo"
	// "github.com/labstack/echo/v5/middleware"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/cron"
	"github.com/pocketbase/pocketbase/tools/security"
	"github.com/pocketbase/pocketbase/tools/types"
)

func isDevEnv() bool {
	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())
	log.Println("isGoRun: ", isGoRun)
	return isGoRun
}

var unauthorizedErr = apis.NewUnauthorizedError("Invalid or expired OTP token", nil)
var notFoundErr = apis.NewNotFoundError("User not found", nil)
var badRequestErr = apis.NewBadRequestError("Invalid request", nil)

const WEB_URL = "https://pre-rt.prod.appadem.in"

// const WEB_URL = "http://localhost:5173"
const TREATMENT_END_FORM_ID = "p8ow7xj8h4uuv43"
const TREATMENT_END_QUESTION_ID = "242u8ha0yn8m06d"

func createOtp(app *pocketbase.PocketBase, user *core.Record) (*core.Record, error) {
	return createOtpWithExpiration(app, user, false)
}

func getLastCreatedUserWithDiagnosis(app *pocketbase.PocketBase, diagnosis string) (*core.Record, error) {
	users, err := app.FindRecordsByFilter("users", "diagnosis = {:diagnosis}", "-created", 1, 0, dbx.Params{
		"diagnosis": diagnosis,
	})
	if err != nil {
		println("error", err)
		return nil, err
	}

	if len(users) == 0 {
		return nil, nil
	}

	return users[0], nil
}

func createOtpWithExpiration(app *pocketbase.PocketBase, user *core.Record, useLongExpiration bool) (*core.Record, error) {
	collection, err := app.FindCollectionByNameOrId("otp")
	if err != nil {
		return nil, err
	}

	record := core.NewRecord(collection)

	if useLongExpiration {
		record.Set("expiration", time.Now().AddDate(0, 0, 7))
	} else {
		record.Set("expiration", time.Now().Add(time.Hour))
	}

	record.Set("user", user.Id)
	record.Set("attempts", 0)
	record.Set("password", security.RandomStringWithAlphabet(6, "0123456789"))

	if err := app.Save(record); err != nil {
		return nil, err
	}
	return record, nil
}

func sendText(phoneNumber string, text string) error {
	if isDevEnv() {
		// just print the message to console
		log.Println("Sending message to", phoneNumber, ":", text)
		return nil
	}
	// replace 0 with +46 for phoneNumber
	phoneNumber = strings.Replace(phoneNumber, "0", "+46", 1)

	apiUsername := os.Getenv("ELKS_API_USERNAME")
	apiPassword := os.Getenv("ELKS_API_PASSWORD")
	auth := base64.StdEncoding.EncodeToString([]byte(apiUsername + ":" + apiPassword))

	// Prepare data
	data := url.Values{}
	data.Set("from", "StudiePreRT")
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

func sendTreatmentEndReminder(app *pocketbase.PocketBase, user *core.Record) {
	link := WEB_URL + "/forms/" + TREATMENT_END_FORM_ID

	sendText(user.GetString("phoneNumber"), "Hej! Det är nu 5 veckor efter behandlingsstart, du kan fylla i slutdatum här: "+link)
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

func userShouldBeRemindedAboutTreatmentEnd(user *core.Record) bool {
	// does user already have a treatment end date?
	treatmentEnd := user.GetDateTime("treatmentEnd").Time()

	// if its set no need to be reminded
	if !treatmentEnd.IsZero() {
		return false
	}
	// send reminder if day is 5 weeks after treatment start
	treatmentStart := user.GetDateTime("treatmentStart").Time()
	fiveWeeksAfterTreatmentStart := treatmentStart.AddDate(0, 0, 35)

	today := time.Now()

	// check if today is the day 5 weeks after treatment start
	if today.Year() == fiveWeeksAfterTreatmentStart.Year() && today.YearDay() == fiveWeeksAfterTreatmentStart.YearDay() {
		return true
	}

	return false
}

func userShouldBeNotified(user *core.Record) bool {
	userType := user.GetString("type")

	treatmentEnd := user.GetDateTime("treatmentEnd").Time()

	// if treatmentEnd is set, it should be 6 weeks after
	if !treatmentEnd.IsZero() {
		sixWeeksAfterTreatmentEnd := treatmentEnd.AddDate(0, 0, 42)
		return time.Now().After(sixWeeksAfterTreatmentEnd)
	}

	// if user.type == "PRE" it should be 2 weeks before treatment start
	if userType == "PRE" {
		treatmentStart := user.GetDateTime("treatmentStart").Time()
		twoWeeksBeforeTreatmentStart := treatmentStart.AddDate(0, 0, -14)
		return time.Now().After(twoWeeksBeforeTreatmentStart)
	}

	return false
}

func checkAndSendNotification(app *pocketbase.PocketBase, user *core.Record, questionnaire *core.Record) {
	answers, _ := app.FindRecordsByFilter("answers", "user = {:user} && questionnaire = {:questionnaire}", "-date", 1, 0, dbx.Params{
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

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		scheduler := cron.New()

		se.Router.Bind(apis.Gzip())

		se.Router.POST("/otp-create", func(e *core.RequestEvent) error {
			data := struct {
				PhoneNumber string `json:"phoneNumber"`
			}{}

			if err := e.BindBody(&data); err != nil {
				log.Println("bind error", err)
				return badRequestErr
			}

			user, err := app.FindFirstRecordByData("users", "phoneNumber", data.PhoneNumber)
			if err != nil {
				return notFoundErr
			}

			record, err := createOtp(app, user)

			if err != nil {
				return badRequestErr
			}

			sendText(data.PhoneNumber, "Din engångskod är: "+record.GetString("password"))

			return e.JSON(200, record)
		})

		se.Router.POST("/otp-verify", func(e *core.RequestEvent) error {
			println("/POST otp-verify")
			data := struct {
				VerifyToken string `json:"verifyToken"`
				OTP         string `json:"otp"`
			}{}

			if err := e.BindBody(&data); err != nil {
				log.Println("bind error", err)
				return unauthorizedErr
			}

			record, err := app.FindRecordById("otp", data.VerifyToken)
			if err != nil {
				return unauthorizedErr
			}

			if record.GetDateTime("expiration").Time().Before(time.Now()) {
				app.Delete(record)
				return unauthorizedErr
			}

			if !security.Equal(record.GetString("password"), data.OTP) {
				attempts := record.GetInt("attempts") + 1
				if attempts > 3 {
					app.Delete(record)
					return unauthorizedErr
				}

				record.Set("attempts", attempts)
				if err := app.Save(record); err != nil {
					log.Println("save error", err)
				}

				return unauthorizedErr
			}

			if err := app.ExpandRecord(record, []string{"user"}, nil); len(err) > 0 {
				log.Println("expand error", err)
				return unauthorizedErr
			}

			user := record.ExpandedOne("user")
			if user == nil {
				return unauthorizedErr
			}

			defer app.Delete(record)
			return apis.RecordAuthResponse(e, user, "user", nil)
		})

		scheduler.MustAdd("notifications", "0 18 * * *", func() {
			users, err := app.FindRecordsByFilter("users", "phoneNumber != ''", "", 0, 0, nil)
			if err != nil {
				log.Println("error", err)
			}

			questionnaire, _ := app.FindFirstRecordByFilter("questionnaires", "occurrence = 'daily'")

			for _, user := range users {
				if userShouldBeNotified(user) {
					checkAndSendNotification(app, user, questionnaire)
				}
			}
		})

		scheduler.MustAdd("treatment-end-reminders", "0 17 * * *", func() {
			users, err := app.FindRecordsByFilter("users", "phoneNumber != ''", "", 0, 0, nil)
			if err != nil {
				log.Println("error", err)
			}

			for _, user := range users {
				if userShouldBeRemindedAboutTreatmentEnd(user) {
					sendTreatmentEndReminder(app, user)
				}
			}
		})

		scheduler.Start()

		return se.Next()
	})

	app.OnRecordCreate("users").BindFunc(func(e *core.RecordEvent) error {
		diagnosis := e.Record.GetString("diagnosis")

		if diagnosis == "cervix" {
			e.Record.Set("type", "POST")
		} else {
			previousUser, err := getLastCreatedUserWithDiagnosis(app, diagnosis)

			if err != nil {
				return err
			}

			if previousUser != nil {
				if previousUser.GetString("type") == "POST" {
					e.Record.Set("type", "PRE")
				} else {
					e.Record.Set("type", "POST")
				}
			} else {
				e.Record.Set("type", "PRE")
			}
		}

		return e.Next()
	})

	app.OnRecordAfterCreateSuccess("users").BindFunc(func(e *core.RecordEvent) error {
		phoneNumber := e.Record.GetString("phoneNumber")

		otp, err := createOtpWithExpiration(app, e.Record, true)

		if err != nil {
			return badRequestErr
		}

		link := WEB_URL + "/login/" + otp.Id + "?code=" + otp.GetString("password")

		sendText(phoneNumber, "Välkommen till Sahlgrenska forskningsprojekt PreRT. registrera dig här: "+link)

		return nil
	})

	app.OnRecordAfterCreateSuccess("answers").BindFunc(func(e *core.RecordEvent) error {
		questionnaireId := e.Record.GetString("questionnaire")

		if questionnaireId != TREATMENT_END_FORM_ID {
			return nil
		}

		userId := e.Record.GetString("user")

		user, err := app.FindRecordById("users", userId)

		if err != nil {
			return notFoundErr
		}

		answersString := e.Record.GetString("answers")
		// parse json string to map
		var answers map[string]interface{}
		if err := json.Unmarshal([]byte(answersString), &answers); err != nil {
			return badRequestErr
		}

		treatmentEnd := answers[TREATMENT_END_QUESTION_ID]
		log.Println("treatmentEnd", treatmentEnd)
		user.Set("treatmentEnd", treatmentEnd)
		log.Println("user", user)
		if err := app.Save(user); err != nil {
			return badRequestErr
		}

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
