import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["**/dist/**", "**/build/**", "**/coverage/**", "**/node_modules/**"]),
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: {...globals.browser, ...globals.node} }
},
  tseslint.configs.strict,
  tseslint.configs.stylistic  
]);
