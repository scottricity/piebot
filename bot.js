
/**
 TODO: Clean and optimize code, currently it's ugly because it's a concept build.
 */

import { REST, Routes, Client, GatewayIntentBits, Collection } from "discord.js";
import chalk from "chalk";
import { fileURLToPath } from "url"
import path, { dirname } from "path";
import { SlashCreator, GatewayServer } from "slash-create";
import fs from "fs-extra";
import yaml from "js-yaml";
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let settingsFile = "./bot_settings.yaml"
const settings = yaml.load(fs.readFileSync(settingsFile))

let events = {
	dir: "./src/events",
	connections: {}
}

//Create the client

const client = new Client({
	intents: Object.values(GatewayIntentBits).filter(e => typeof e == "number"),
	presence: {status: "dnd"}
})

let creator = new SlashCreator({
	applicationID: settings.app_id,
	publicKey: settings.public_key,
	token: settings.token,
	client
})

let s = []
for (const file of fs.readdirSync('./src/commands')){
	let f = await import(`./src/commands/${file}`)
	s.push(new f.default(creator))
}

creator
	.withServer(
		new GatewayServer(
			(handler) => client.ws.on('INTERACTION_CREATE', handler)
		)
	)
	.registerCommands(s)
	.syncGlobalCommands()

var loadConstants = async () => {
	let file = await import(`./src/clientConstants.js`)
	client.constants = new file.default(client)
}

try {
	await loadConstants()
	console.log(chalk.greenBright("Successfully loaded in constants"))
} catch (err) {
	console.error(err)
}

fs.readdirSync(events.dir).filter(f => f.endsWith(".js")).forEach(async (file) => {
	let ev = await import(`./src/events/${file}`)
	client.on(file.split('.')[0], ev.default.bind(null, client))
	console.log(chalk.yellow(`Successfully loaded in event ${file.split('.')[0]}`))
})

client.login(settings.token);
