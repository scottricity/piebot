import { fileURLToPath } from "url"
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default function(client) {
    console.log("Ready!")
}