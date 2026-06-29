package migrations

import (
	"database/sql"
	"errors"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		daily, err := app.FindRecordById("questionnaires", "sdzkpd49ndccf5b")
		if errors.Is(err, sql.ErrNoRows) {
			daily = nil
		} else if err != nil {
			return err
		}
		if daily != nil {
			daily.Set("name", "Användning av vaginalstav")
			daily.Set("description", "<p>Detta är ett snabbt formulär kring din dagliga användning av vaginalstaven.</p><p>Formuläret består av 6-8 frågor<br>(beroende på om du gjort terapin eller inte)<br>och tar ca 1-2 min</p>")
			daily.Set("introText", "<p>Detta är ett snabbt formulär kring din dagliga användning av vaginalstaven.</p><p>Formuläret består av 6-8 frågor<br>och tar ca 1-2 min</p>")
			if err := app.Save(daily); err != nil {
				return err
			}
		}

		initial, err := app.FindRecordById("questionnaires", "u6917wm639q1d01")
		if errors.Is(err, sql.ErrNoRows) {
			return nil
		}
		if err != nil {
			return err
		}

		initial.Set("name", "Inledande frågor")
		initial.Set("description", "<p>Detta är ett längre formulär där vi samlar in grundläggande information om dig som behövs för studien.</p><p>Formuläret består av 37 frågor<br>och tar ca 20 min</p>")
		initial.Set("introText", "<p>Detta är ett längre formulär där vi samlar in grundläggande information om dig som behövs för studien.</p><p>Formuläret består av 37 frågor<br>och tar ca 20 min</p>")

		return app.Save(initial)
	}, func(app core.App) error {
		daily, err := app.FindRecordById("questionnaires", "sdzkpd49ndccf5b")
		if errors.Is(err, sql.ErrNoRows) {
			daily = nil
		} else if err != nil {
			return err
		}
		if daily != nil {
			daily.Set("name", "Dagligt formulär")
			daily.Set("description", "<p>Det h&auml;r formul&auml;ret ska du svara p&aring; varje dag under din behandling.</p>")
			daily.Set("introText", "")
			if err := app.Save(daily); err != nil {
				return err
			}
		}

		initial, err := app.FindRecordById("questionnaires", "u6917wm639q1d01")
		if errors.Is(err, sql.ErrNoRows) {
			return nil
		}
		if err != nil {
			return err
		}

		initial.Set("name", "Din startpunkt")
		initial.Set("description", "<p>N&auml;r du fyllt i din startpunkt kommer du kunna se den h&auml;r.</p>")
		initial.Set("introText", "")

		return app.Save(initial)
	})
}
