package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("9758pb20s5nlwc0")
		if err != nil {
			return err
		}

		// update
		edit_password := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "uwufhkbf",
			"name": "password",
			"type": "text",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), edit_password); err != nil {
			return err
		}
		collection.Schema.AddField(edit_password)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("9758pb20s5nlwc0")
		if err != nil {
			return err
		}

		// update
		edit_password := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "uwufhkbf",
			"name": "token",
			"type": "text",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), edit_password); err != nil {
			return err
		}
		collection.Schema.AddField(edit_password)

		return dao.SaveCollection(collection)
	})
}
