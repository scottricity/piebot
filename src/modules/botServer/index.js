import express from "express";
import { Client } from "discord.js";
import fs from "fs-extra";
import {fileURLToPath} from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class BotServer {
	/**
	 * 
	 * @param { Client } client 
	 */
	constructor(client){
		this.client = client || console.error("No client provided.");
		this.active = false;
	}

	async init(){
		if (!this.client)
			throw "No client provided.";
			
		const app = express()

		//Define client
		app.client = this.client

		let paths = fs.readdirSync(path.join(__dirname, 'routes'), {withFileTypes: true}).filter(f => f.name.endsWith(".js"))

		
		for (const route of paths) {

			let r = await import(`./routes/${route.name}`)
			if (!r.default) throw `Route ${route.name} does not contain a default namespace`;
			app.use(`/${route.name == "index.js" ? "" : route.name.split('.')[0]}`, r.default)
		}

		app.use((req, res, next) => {
			if (res.statusMessage == undefined)
				res.json({status: 404})
			next()
		})

		app.listen(4001, () => {
			console.log("Bot Server listening on port 4001")
		})
	}
}

export default BotServer