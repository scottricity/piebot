import Provider from "../modules/clientDatabase/index.js";
import { fileURLToPath } from "url"
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default function(client) {
    console.log("Ready!")
	client.db = new Provider(client)
	client.db.setUser("1", {xp: '233'}).then(d => {
		console.log(d)
	})
}