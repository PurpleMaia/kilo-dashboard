### MAKE NEW MIGRATION
`migrate create -ext sql -dir db/migrations -seq <name of migration>`

### SET ENVIRONMENT
`export DATABASE_URL=<DATABASE_URL>?sslmode=disable`

### SEND THE MIGRATE
`migrate -database "${DATABASE_URL}" -path db/migrations up`

### IF NO WORK CUZ SQL ERRORS:
1. fix the sql 
2. go back to a previous version
`migrate -database "${DATABASE_URL}" -path db/migrations force <version that is good>`
3. then try again
`migrate -database "${DATABASE_URL}" -path db/migrations up `

### UPDATE KYSELY-CODEGEN
`pnpm kysely-codegen --out-file ./db/generated.d.ts`