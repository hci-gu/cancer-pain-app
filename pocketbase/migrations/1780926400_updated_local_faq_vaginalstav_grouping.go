package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		vaginalstav, err := app.FindRecordById("resourceCollection", "1ei3zjui10q8q91")
		if err != nil {
			return err
		}

		vaginalstav.Set("resources", []string{
			"8vegqnt3c9mpnu7",
			"4mv1csl1xq95j2w",
			"540wnc1pz0k7v44",
			"v6uaw2lwupb43k1",
			"971931xhdhac75z",
			"0mo0p6jq95s71k0",
		})
		if err := app.Save(vaginalstav); err != nil {
			return err
		}

		sexualHealth, err := app.FindRecordById("resourceCollection", "94ze51rc8dz5oh6")
		if err != nil {
			return err
		}

		sexualHealth.Set("resources", []string{
			"2m43w22dg11hw9x",
			"i0y07b2txpy01z0",
			"sg7r3u1z24c50y9",
			"mutxh1m714r713u",
		})

		return app.Save(sexualHealth)
	}, func(app core.App) error {
		vaginalstav, err := app.FindRecordById("resourceCollection", "1ei3zjui10q8q91")
		if err != nil {
			return err
		}

		vaginalstav.Set("resources", []string{
			"540wnc1pz0k7v44",
			"v6uaw2lwupb43k1",
			"4mv1csl1xq95j2w",
			"3ws3117l02f50sb",
			"1m57av0v5v9s212",
		})
		if err := app.Save(vaginalstav); err != nil {
			return err
		}

		sexualHealth, err := app.FindRecordById("resourceCollection", "94ze51rc8dz5oh6")
		if err != nil {
			return err
		}

		sexualHealth.Set("resources", []string{
			"8vegqnt3c9mpnu7",
			"sg7r3u1z24c50y9",
			"mutxh1m714r713u",
			"2m43w22dg11hw9x",
			"i0y07b2txpy01z0",
		})

		return app.Save(sexualHealth)
	})
}
