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

		collection, err := dao.FindCollectionByNameOrId("kifc85jza42m44e")
		if err != nil {
			return err
		}

		// update
		edit_occurrence := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "7obzexgp",
			"name": "occurrence",
			"type": "select",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"daily",
					"weekly",
					"monthly",
					"once"
				]
			}
		}`), edit_occurrence); err != nil {
			return err
		}
		collection.Schema.AddField(edit_occurrence)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("kifc85jza42m44e")
		if err != nil {
			return err
		}

		// update
		edit_occurrence := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "7obzexgp",
			"name": "occurance",
			"type": "select",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"daily",
					"weekly",
					"monthly",
					"once"
				]
			}
		}`), edit_occurrence); err != nil {
			return err
		}
		collection.Schema.AddField(edit_occurrence)

		return dao.SaveCollection(collection)
	})
}
