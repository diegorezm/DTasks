import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: ['.env.local', '.env'] })

export default defineConfig({
	out: './drizzle',
	schema: './src/db/schemas/',
	dialect: 'sqlite',
	casing: "snake_case",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
})
