package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		questionnaires, err := app.FindCollectionByNameOrId("kifc85jza42m44e")
		if err != nil {
			return err
		}

		if err := questionnaires.Fields.AddMarshaledJSONAt(3, []byte(`{
			"convertURLs": false,
			"hidden": false,
			"id": "editor1780920751",
			"name": "introText",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "editor"
		}`)); err != nil {
			return err
		}

		if err := app.Save(questionnaires); err != nil {
			return err
		}

		resourceCollection, err := app.FindCollectionByNameOrId("pbc_1013479562")
		if err != nil {
			return err
		}

		if err := resourceCollection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "file1780920751",
			"maxSelect": 1,
			"maxSize": 5242880,
			"mimeTypes": [
				"image/svg+xml",
				"image/png",
				"image/jpeg",
				"image/webp"
			],
			"name": "image",
			"presentable": false,
			"protected": false,
			"required": false,
			"system": false,
			"thumbs": [],
			"type": "file"
		}`)); err != nil {
			return err
		}

		return app.Save(resourceCollection)
	}, func(app core.App) error {
		questionnaires, err := app.FindCollectionByNameOrId("kifc85jza42m44e")
		if err != nil {
			return err
		}

		questionnaires.Fields.RemoveById("editor1780920751")
		if err := app.Save(questionnaires); err != nil {
			return err
		}

		resourceCollection, err := app.FindCollectionByNameOrId("pbc_1013479562")
		if err != nil {
			return err
		}

		resourceCollection.Fields.RemoveById("file1780920751")
		return app.Save(resourceCollection)
	})
}
