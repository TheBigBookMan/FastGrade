import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/__tests__/**/*.{js,cjs}", "**/*.test.{js,cjs}"],
        languageOptions: {
            globals: {
                ...globals.node,
                describe: "readonly",
                it: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                vi: "readonly",
            },
        },
    },

]);
