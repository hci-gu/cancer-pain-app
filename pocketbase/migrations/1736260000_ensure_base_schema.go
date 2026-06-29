package migrations

import (
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(app core.App) error {
		if err := ensureUsersSchema(app); err != nil {
			return err
		}

		for _, jsonData := range baseCollectionJSON {
			if err := ensureCollection(app, []byte(jsonData)); err != nil {
				return err
			}
		}

		if err := ensureQuestionSelfRelations(app); err != nil {
			return err
		}

		return nil
	}, func(app core.App) error {
		return nil
	})
}

func ensureUsersSchema(app core.App) error {
	collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
	if err != nil {
		return err
	}

	if err := collection.Fields.AddMarshaledJSONAt(0, []byte(usersFieldsJSON)); err != nil {
		return err
	}

	collection.Fields.RemoveByName("name")
	collection.Fields.RemoveByName("avatar")

	collection.Indexes = types.JSONArray[string]{
		"CREATE UNIQUE INDEX `__pb_users_auth__username_idx` ON `users` (username COLLATE NOCASE)",
		"CREATE UNIQUE INDEX `__pb_users_auth__email_idx` ON `users` (`email`) WHERE `email` != ''",
		"CREATE UNIQUE INDEX `__pb_users_auth__tokenKey_idx` ON `users` (`tokenKey`)",
		"CREATE UNIQUE INDEX `idx_t1k08Pf` ON `users` (`phoneNumber`)",
	}
	collection.ListRule = strPtr("id = @request.auth.id")
	collection.ViewRule = strPtr("id = @request.auth.id")
	collection.CreateRule = strPtr("")
	collection.UpdateRule = strPtr("id = @request.auth.id")
	collection.DeleteRule = strPtr("id = @request.auth.id")

	return app.Save(collection)
}

func ensureCollection(app core.App, jsonData []byte) error {
	var collection core.Collection
	if err := json.Unmarshal(jsonData, &collection); err != nil {
		return err
	}
	if collection.Id == "dkx1rty080nyhlh" {
		collection.Fields.RemoveById("brjy2uwp")
		collection.Fields.RemoveById("relation488274491")
	}

	if _, err := app.FindCollectionByNameOrId(collection.Id); err == nil {
		return nil
	} else if !errors.Is(err, sql.ErrNoRows) {
		return err
	}

	return app.Save(&collection)
}

func ensureQuestionSelfRelations(app core.App) error {
	collection, err := app.FindCollectionByNameOrId("dkx1rty080nyhlh")
	if err != nil {
		return err
	}

	if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
		"cascadeDelete": false,
		"collectionId": "dkx1rty080nyhlh",
		"hidden": false,
		"id": "brjy2uwp",
		"maxSelect": 1,
		"minSelect": 0,
		"name": "dependency",
		"presentable": false,
		"required": false,
		"system": false,
		"type": "relation"
	}`)); err != nil {
		return err
	}

	if err := collection.Fields.AddMarshaledJSONAt(7, []byte(`{
		"cascadeDelete": false,
		"collectionId": "dkx1rty080nyhlh",
		"hidden": false,
		"id": "relation488274491",
		"maxSelect": 999,
		"minSelect": 0,
		"name": "followup",
		"presentable": false,
		"required": false,
		"system": false,
		"type": "relation"
	}`)); err != nil {
		return err
	}

	return app.Save(collection)
}

func strPtr(value string) *string {
	return &value
}

const usersFieldsJSON = `[{"autogeneratePattern":"[a-z0-9]{15}","hidden":false,"id":"text3208210256","max":15,"min":15,"name":"id","pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true,"required":true,"system":true,"type":"text"},{"cost":10,"hidden":true,"id":"password901924565","max":0,"min":8,"name":"password","pattern":"","presentable":false,"required":true,"system":true,"type":"password"},{"autogeneratePattern":"[a-zA-Z0-9_]{50}","hidden":true,"id":"text2504183744","max":60,"min":30,"name":"tokenKey","pattern":"","presentable":false,"primaryKey":false,"required":true,"system":true,"type":"text"},{"exceptDomains":null,"hidden":false,"id":"email3885137012","name":"email","onlyDomains":null,"presentable":false,"required":false,"system":true,"type":"email"},{"hidden":false,"id":"bool1547992806","name":"emailVisibility","presentable":false,"required":false,"system":true,"type":"bool"},{"hidden":false,"id":"bool256245529","name":"verified","presentable":false,"required":false,"system":true,"type":"bool"},{"autogeneratePattern":"users[0-9]{6}","hidden":false,"id":"text4166911607","max":150,"min":3,"name":"username","pattern":"^[\\w][\\w\\.\\-]*$","presentable":false,"primaryKey":false,"required":true,"system":false,"type":"text"},{"autogeneratePattern":"","hidden":false,"id":"users_name","max":0,"min":0,"name":"code","pattern":"","presentable":false,"primaryKey":false,"required":false,"system":false,"type":"text"},{"autogeneratePattern":"","hidden":false,"id":"gnwsou6o","max":0,"min":0,"name":"phoneNumber","pattern":"","presentable":false,"primaryKey":false,"required":false,"system":false,"type":"text"},{"hidden":false,"id":"jtgq63g4","maxSelect":1,"name":"diagnosis","presentable":false,"required":false,"system":false,"type":"select","values":["anal","corpus","cervix"]},{"hidden":false,"id":"oy2nwphz","max":"","min":"","name":"treatmentStart","presentable":false,"required":false,"system":false,"type":"date"},{"hidden":false,"id":"i4anrhwh","max":"","min":"","name":"treatmentEnd","presentable":false,"required":false,"system":false,"type":"date"},{"hidden":false,"id":"ykhdhq0y","maxSelect":1,"name":"type","presentable":false,"required":false,"system":false,"type":"select","values":["PRE","POST"]},{"hidden":false,"id":"autodate2990389176","name":"created","onCreate":true,"onUpdate":false,"presentable":false,"system":false,"type":"autodate"},{"hidden":false,"id":"autodate3332085495","name":"updated","onCreate":true,"onUpdate":true,"presentable":false,"system":false,"type":"autodate"}]`

var baseCollectionJSON = []string{
	`{"createRule":null,"deleteRule":null,"fields":[{"autogeneratePattern":"[a-z0-9]{15}","hidden":false,"id":"text3208210256","max":15,"min":15,"name":"id","pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true,"required":true,"system":true,"type":"text"},{"autogeneratePattern":"","hidden":false,"id":"uwufhkbf","max":0,"min":0,"name":"password","pattern":"","presentable":false,"primaryKey":false,"required":true,"system":false,"type":"text"},{"cascadeDelete":true,"collectionId":"_pb_users_auth_","hidden":false,"id":"phbtduzj","maxSelect":1,"minSelect":0,"name":"user","presentable":false,"required":true,"system":false,"type":"relation"},{"hidden":false,"id":"wsyvo8zw","max":"","min":"","name":"expiration","presentable":false,"required":false,"system":false,"type":"date"},{"hidden":false,"id":"bzsgrclt","max":null,"min":null,"name":"attempts","onlyInt":false,"presentable":false,"required":false,"system":false,"type":"number"},{"hidden":false,"id":"autodate2990389176","name":"created","onCreate":true,"onUpdate":false,"presentable":false,"system":false,"type":"autodate"},{"hidden":false,"id":"autodate3332085495","name":"updated","onCreate":true,"onUpdate":true,"presentable":false,"system":false,"type":"autodate"}],"id":"9758pb20s5nlwc0","indexes":[],"listRule":"","name":"otp","system":false,"type":"base","updateRule":null,"viewRule":null}`,
	`{"createRule":null,"deleteRule":null,"fields":[{"autogeneratePattern":"[a-z0-9]{15}","hidden":false,"id":"text3208210256","max":15,"min":15,"name":"id","pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true,"required":true,"system":true,"type":"text"},{"autogeneratePattern":"","hidden":false,"id":"dqnhlozp","max":0,"min":0,"name":"name","pattern":"","presentable":false,"primaryKey":false,"required":false,"system":false,"type":"text"},{"hidden":false,"id":"nfv4rbyj","maxSize":2000000,"name":"value","presentable":false,"required":false,"system":false,"type":"json"},{"hidden":false,"id":"json488274491","maxSize":0,"name":"followup","presentable":false,"required":false,"system":false,"type":"json"},{"hidden":false,"id":"autodate2990389176","name":"created","onCreate":true,"onUpdate":false,"presentable":false,"system":false,"type":"autodate"},{"hidden":false,"id":"autodate3332085495","name":"updated","onCreate":true,"onUpdate":true,"presentable":false,"system":false,"type":"autodate"}],"id":"zrrvm0txmszp005","indexes":[],"listRule":"@request.auth.id != \"\"","name":"questionOptions","system":false,"type":"base","updateRule":null,"viewRule":"@request.auth.id != \"\""}`,
	`{"createRule":null,"deleteRule":null,"fields":[{"autogeneratePattern":"[a-z0-9]{15}","hidden":false,"id":"text3208210256","max":15,"min":15,"name":"id","pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true,"required":true,"system":true,"type":"text"},{"autogeneratePattern":"","hidden":false,"id":"yjqis5io","max":0,"min":0,"name":"title","pattern":"","presentable":false,"primaryKey":false,"required":false,"system":false,"type":"text"},{"convertURLs":false,"hidden":false,"id":"lbrg7ocm","name":"description","presentable":false,"required":false,"system":false,"type":"editor"},{"hidden":false,"id":"autodate2990389176","name":"created","onCreate":true,"onUpdate":false,"presentable":false,"system":false,"type":"autodate"},{"hidden":false,"id":"autodate3332085495","name":"updated","onCreate":true,"onUpdate":true,"presentable":false,"system":false,"type":"autodate"}],"id":"pomqz7xg5a91qyl","indexes":[],"listRule":"@request.auth.id != \"\"","name":"resource","system":false,"type":"base","updateRule":null,"viewRule":"@request.auth.id != \"\""}`,
	`{"createRule":null,"deleteRule":null,"fields":[{"autogeneratePattern":"[a-z0-9]{15}","hidden":false,"id":"text3208210256","max":15,"min":15,"name":"id","pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true,"required":true,"system":true,"type":"text"},{"autogeneratePattern":"","hidden":false,"id":"text1579384326","max":0,"min":0,"name":"name","pattern":"","presentable":false,"primaryKey":false,"required":false,"system":false,"type":"text"},{"cascadeDelete":false,"collectionId":"pomqz7xg5a91qyl","hidden":false,"id":"relation4016499630","maxSelect":999,"minSelect":0,"name":"resources","presentable":false,"required":false,"system":false,"type":"relation"},{"hidden":false,"id":"bool1780924200","name":"visible_on_questions_and_answers","presentable":false,"required":false,"system":false,"type":"bool"},{"hidden":false,"id":"file1780920751","maxSelect":1,"maxSize":5242880,"mimeTypes":["image/svg+xml","image/png","image/jpeg","image/webp"],"name":"image","presentable":false,"protected":false,"required":false,"system":false,"thumbs":[],"type":"file"},{"hidden":false,"id":"number1780925300","max":null,"min":null,"name":"sort","onlyInt":true,"presentable":false,"required":false,"system":false,"type":"number"},{"hidden":false,"id":"autodate2990389176","name":"created","onCreate":true,"onUpdate":false,"presentable":false,"system":false,"type":"autodate"},{"hidden":false,"id":"autodate3332085495","name":"updated","onCreate":true,"onUpdate":true,"presentable":false,"system":false,"type":"autodate"}],"id":"pbc_1013479562","indexes":[],"listRule":"@request.auth.id != \"\"","name":"resourceCollection","system":false,"type":"base","updateRule":null,"viewRule":"@request.auth.id != \"\""}`,
	`{"createRule":null,"deleteRule":null,"fields":[{"autogeneratePattern":"[a-z0-9]{15}","hidden":false,"id":"text3208210256","max":15,"min":15,"name":"id","pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true,"required":true,"system":true,"type":"text"},{"convertURLs":false,"hidden":false,"id":"7zsngbib","maxSize":0,"name":"text","presentable":true,"required":false,"system":false,"type":"editor"},{"hidden":false,"id":"a0efcm3n","maxSelect":1,"name":"type","presentable":false,"required":false,"system":false,"type":"select","values":["text","number","painScale","singleChoice","multipleChoice","date","section"]},{"autogeneratePattern":"","hidden":false,"id":"r3sdjxjd","max":0,"min":0,"name":"placeholder","pattern":"","presentable":false,"primaryKey":false,"required":false,"system":false,"type":"text"},{"hidden":false,"id":"wfugtyku","name":"required","presentable":false,"required":false,"system":false,"type":"bool"},{"cascadeDelete":false,"collectionId":"zrrvm0txmszp005","hidden":false,"id":"r0fxdblj","maxSelect":1,"minSelect":0,"name":"options","presentable":false,"required":false,"system":false,"type":"relation"},{"cascadeDelete":false,"collectionId":"dkx1rty080nyhlh","hidden":false,"id":"brjy2uwp","maxSelect":1,"minSelect":0,"name":"dependency","presentable":false,"required":false,"system":false,"type":"relation"},{"cascadeDelete":false,"collectionId":"dkx1rty080nyhlh","hidden":false,"id":"relation488274491","maxSelect":999,"minSelect":0,"name":"followup","presentable":false,"required":false,"system":false,"type":"relation"},{"hidden":false,"id":"mc7tljjn","maxSize":2000000,"name":"dependencyValue","presentable":false,"required":false,"system":false,"type":"json"},{"cascadeDelete":false,"collectionId":"pomqz7xg5a91qyl","hidden":false,"id":"nb76ailf","maxSelect":1,"minSelect":0,"name":"resource","presentable":false,"required":false,"system":false,"type":"relation"},{"cascadeDelete":false,"collectionId":"pbc_1013479562","hidden":false,"id":"relation1447400544","maxSelect":1,"minSelect":0,"name":"resourceCollection","presentable":false,"required":false,"system":false,"type":"relation"},{"hidden":false,"id":"autodate2990389176","name":"created","onCreate":true,"onUpdate":false,"presentable":false,"system":false,"type":"autodate"},{"hidden":false,"id":"autodate3332085495","name":"updated","onCreate":true,"onUpdate":true,"presentable":false,"system":false,"type":"autodate"}],"id":"dkx1rty080nyhlh","indexes":[],"listRule":"@request.auth.id != \"\"","name":"questions","system":false,"type":"base","updateRule":null,"viewRule":"@request.auth.id != \"\""}`,
	`{"createRule":null,"deleteRule":null,"fields":[{"autogeneratePattern":"[a-z0-9]{15}","hidden":false,"id":"text3208210256","max":15,"min":15,"name":"id","pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true,"required":true,"system":true,"type":"text"},{"autogeneratePattern":"","hidden":false,"id":"jzpntdbv","max":0,"min":0,"name":"name","pattern":"","presentable":false,"primaryKey":false,"required":false,"system":false,"type":"text"},{"convertURLs":false,"hidden":false,"id":"szv0iipm","maxSize":0,"name":"description","presentable":false,"required":false,"system":false,"type":"editor"},{"convertURLs":false,"hidden":false,"id":"editor1780920751","maxSize":0,"name":"introText","presentable":false,"required":false,"system":false,"type":"editor"},{"hidden":false,"id":"7obzexgp","maxSelect":1,"name":"occurrence","presentable":false,"required":false,"system":false,"type":"select","values":["daily","weekly","monthly","once"]},{"cascadeDelete":false,"collectionId":"dkx1rty080nyhlh","hidden":false,"id":"epb1dgau","maxSelect":2147483647,"minSelect":0,"name":"questions","presentable":false,"required":false,"system":false,"type":"relation"},{"hidden":false,"id":"dynnsw3h","name":"enabled","presentable":false,"required":false,"system":false,"type":"bool"},{"hidden":false,"id":"autodate2990389176","name":"created","onCreate":true,"onUpdate":false,"presentable":false,"system":false,"type":"autodate"},{"hidden":false,"id":"autodate3332085495","name":"updated","onCreate":true,"onUpdate":true,"presentable":false,"system":false,"type":"autodate"}],"id":"kifc85jza42m44e","indexes":[],"listRule":"@request.auth.id != \"\" && enabled = true","name":"questionnaires","system":false,"type":"base","updateRule":null,"viewRule":"@request.auth.id != \"\""}`,
	`{"createRule":"@request.auth.id != \"\"","deleteRule":"user = @request.auth.id","fields":[{"autogeneratePattern":"[a-z0-9]{15}","hidden":false,"id":"text3208210256","max":15,"min":15,"name":"id","pattern":"^[a-z0-9]+$","presentable":false,"primaryKey":true,"required":true,"system":true,"type":"text"},{"cascadeDelete":false,"collectionId":"_pb_users_auth_","hidden":false,"id":"kqfshp20","maxSelect":1,"minSelect":0,"name":"user","presentable":false,"required":false,"system":false,"type":"relation"},{"cascadeDelete":false,"collectionId":"kifc85jza42m44e","hidden":false,"id":"z4vp4zsx","maxSelect":1,"minSelect":0,"name":"questionnaire","presentable":false,"required":false,"system":false,"type":"relation"},{"hidden":false,"id":"gbdl69pp","maxSize":2000000,"name":"answers","presentable":false,"required":false,"system":false,"type":"json"},{"hidden":false,"id":"31cjeori","max":"","min":"","name":"started","presentable":false,"required":false,"system":false,"type":"date"},{"hidden":false,"id":"yvnj01a4","max":"","min":"","name":"date","presentable":false,"required":false,"system":false,"type":"date"},{"hidden":false,"id":"autodate2990389176","name":"created","onCreate":true,"onUpdate":false,"presentable":false,"system":false,"type":"autodate"},{"hidden":false,"id":"autodate3332085495","name":"updated","onCreate":true,"onUpdate":true,"presentable":false,"system":false,"type":"autodate"}],"id":"uyx8dh36hxzop9h","indexes":[],"listRule":"user = @request.auth.id","name":"answers","system":false,"type":"base","updateRule":null,"viewRule":"user = @request.auth.id"}`,
}
