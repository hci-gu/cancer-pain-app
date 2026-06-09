package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		resourceCollection, err := app.FindCollectionByNameOrId("pbc_1013479562")
		if err != nil {
			return err
		}

		if err := resourceCollection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "bool1780924200",
			"name": "visible_on_questions_and_answers",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "bool"
		}`)); err != nil {
			return err
		}

		return app.Save(resourceCollection)
	}, func(app core.App) error {
		resourceCollection, err := app.FindCollectionByNameOrId("pbc_1013479562")
		if err != nil {
			return err
		}

		resourceCollection.Fields.RemoveById("bool1780924200")
		return app.Save(resourceCollection)
	})
}
