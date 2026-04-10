import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { config } from "dotenv";

// Load .env into process.env so DATABASE_URL (and other secrets)
// are available at runtime for the PostgreSQL connection.
config();

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
