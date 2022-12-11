import Provider from "../modules/clientDatabase/index.js";
import BotServer from "../modules/botServer/index.js"
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default function(client) {
    console.log("Ready!")
	client.db = new Provider(client)
	client.botServer = new BotServer(client)

	client.botServer.init()

	process.on("message", (msg) => {
		console.log(msg)
	})
}