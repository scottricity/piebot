
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

//Path related variables, required if using commonJS
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//Load static settings
let settingsFile = "./bot_settings.yaml"

//Settings typedef
/**
 * @typedef Settings
 * @type {object}
 * @prop {string} client_id
 * @prop {string} app_id
 * @prop {string} client_secret
 * @prop {string} public_key
 * @prop {string} token
 * @prop {string} prefix
 * @prop {string} mongodb_uri
 */

/**
 * @type {Settings}
 */
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

var loadConstants = async () => {
	let file = await import(`./src/clientConstants.js`)
	client.constants = new file.default(client)
}

let commands = []

var loadCommands = async () => {
	for (const file of fs.readdirSync('./src/commands')){
		let f = await import(`./src/commands/${file}`)
		commands.push(new f.default(creator))
	}
}

try {
	await loadCommands()
} catch (error) {
	console.error(error)
}

creator
	.withServer(
		new GatewayServer(
			(handler) => client.ws.on('INTERACTION_CREATE', handler)
		)
	)
	.registerCommands(commands)
	.syncGlobalCommands().then((val) => {
		console.log(chalk.yellow(`Commands ${commands.map(e => e.commandName).join(",")} loaded`))
	})

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
