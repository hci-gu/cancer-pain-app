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

		collection, err := dao.FindCollectionByNameOrId("dkx1rty080nyhlh")
		if err != nil {
			return err
		}

		// add
		new_required := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "wfugtyku",
			"name": "required",
			"type": "bool",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {}
		}`), new_required); err != nil {
			return err
		}
		collection.Schema.AddField(new_required)

		// update
		edit_type := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "a0efcm3n",
			"name": "type",
			"type": "select",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"text",
					"painScale",
					"singleChoice",
					"multipleChoice"
				]
			}
		}`), edit_type); err != nil {
			return err
		}
		collection.Schema.AddField(edit_type)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("dkx1rty080nyhlh")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("wfugtyku")

		// update
		edit_type := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "a0efcm3n",
			"name": "type",
			"type": "select",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"text",
					"painScale"
				]
			}
		}`), edit_type); err != nil {
			return err
		}
		collection.Schema.AddField(edit_type)

		return dao.SaveCollection(collection)
	})
}
