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
		new_dependency := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "brjy2uwp",
			"name": "dependency",
			"type": "relation",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "dkx1rty080nyhlh",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_dependency); err != nil {
			return err
		}
		collection.Schema.AddField(new_dependency)

		// add
		new_dependencyValue := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "mc7tljjn",
			"name": "dependencyValue",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 2000000
			}
		}`), new_dependencyValue); err != nil {
			return err
		}
		collection.Schema.AddField(new_dependencyValue)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("dkx1rty080nyhlh")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("brjy2uwp")

		// remove
		collection.Schema.RemoveField("mc7tljjn")

		return dao.SaveCollection(collection)
	})
}
