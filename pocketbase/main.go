package main

import (
	"log"
	"os"
	"strings"
	"time"

	_ "app/migrations"

	"github.com/google/uuid"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/security"

	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

var unauthorizedErr = apis.NewUnauthorizedError("Invalid or expired OTP token", nil)
var notFoundErr = apis.NewNotFoundError("User not found", nil)
var badRequestErr = apis.NewBadRequestError("Invalid request", nil)

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

func main() {

	app := pocketbase.New()

	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: isGoRun,
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.Use(middleware.Decompress())
		e.Router.Use(middleware.BodyLimit(100 * 1024 * 1024))

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

			return c.JSON(200, record)
		})

		e.Router.POST("/otp-verify", func(c echo.Context) error {
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

		return nil
	})

	app.OnRecordBeforeCreateRequest("users").Add(func(e *core.RecordCreateEvent) error {
		uuid, _ := uuid.NewRandom()
		e.Record.Set("token", uuid)

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
