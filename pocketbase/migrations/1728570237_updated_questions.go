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

		// update
		edit_text := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "7zsngbib",
			"name": "text",
			"type": "editor",
			"required": false,
			"presentable": true,
			"unique": false,
			"options": {
				"convertUrls": false
			}
		}`), edit_text); err != nil {
			return err
		}
		collection.Schema.AddField(edit_text)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("dkx1rty080nyhlh")
		if err != nil {
			return err
		}

		// update
		edit_text := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "7zsngbib",
			"name": "text",
			"type": "editor",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"convertUrls": false
			}
		}`), edit_text); err != nil {
			return err
		}
		collection.Schema.AddField(edit_text)

		return dao.SaveCollection(collection)
	})
}
