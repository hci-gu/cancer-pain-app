package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1013479562")
		if err != nil {
			return err
		}

		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"hidden": false,
			"id": "number1780925300",
			"max": null,
			"min": null,
			"name": "sort",
			"onlyInt": true,
			"presentable": false,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		if err := app.Save(collection); err != nil {
			return err
		}

		records := []struct {
			id      string
			name    string
			visible bool
			sort    int
		}{
			{
				id:      "85071a5innq3o43",
				name:    "Om strålbehandling och biverkningar",
				visible: true,
				sort:    10,
			},
			{
				id:      "1ei3zjui10q8q91",
				name:    "Om användning av vaginalstav",
				visible: true,
				sort:    20,
			},
			{
				id:      "94ze51rc8dz5oh6",
				name:    "Om sexuell hälsa",
				visible: true,
				sort:    30,
			},
			{
				id:      "23s6oyiql5gc9qi",
				name:    "Om intimvård",
				visible: true,
				sort:    40,
			},
			{
				id:      "7d5griw67n84z36",
				name:    "Om våld",
				visible: true,
				sort:    50,
			},
			{
				id:      "417f26j6i21zuk2",
				name:    "Test",
				visible: false,
				sort:    900,
			},
			{
				id:      "e5rho8cztsxe34f",
				name:    "Välkommen att svara på frågorna i vår studie",
				visible: false,
				sort:    910,
			},
		}

		for _, data := range records {
			record, err := app.FindRecordById("resourceCollection", data.id)
			if err != nil {
				return err
			}

			record.Set("name", data.name)
			record.Set("visible_on_questions_and_answers", data.visible)
			record.Set("sort", data.sort)

			if err := app.Save(record); err != nil {
				return err
			}
		}

		return nil
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1013479562")
		if err != nil {
			return err
		}

		collection.Fields.RemoveById("number1780925300")
		return app.Save(collection)
	})
}
