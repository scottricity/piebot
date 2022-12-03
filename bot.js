
/**
 TODO: Clean and optimize code, currently it's ugly because it's a concept build.
 */

import { REST, Routes, Client, GatewayIntentBits, Collection } from "discord.js";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import yaml from "js-yaml";

let settingsFile = "./bot_settings.yaml"
const settings = yaml.load(fs.readFileSync(settingsFile))



let events = {
    dir: "./src/events",
    connections: {}
}

var commands = {
    dir: "./src/commands",
    paths: [],
    list: {}
}

//Command Handler
//Load the command paths
for (const file of fs.readdirSync(commands.dir).filter(file => file.endsWith('.js'))) {
    if (!file) break;
    commands.paths.push(`${commands.dir}/${file}`)
}
var loadCMDs = async () => {
    for (const file of commands.paths){
        let cmd = await import(file)
        let cmdData = cmd.default
        commands.list[cmdData.data.name] = {data: cmdData.data, fn: cmdData.execute}
    }
}

await loadCMDs()


//Create the client
let rest = new REST({ version: "10" }).setToken(settings.token);

const client = new Client({
    intents: Object.values(GatewayIntentBits).filter(e => typeof e == "number")
})

fs.readdirSync(events.dir).filter(f => f.endsWith(".js")).forEach(async (file) => {
    let ev = await import(`./src/events/${file}`)
    client.on(file.split('.')[0], ev.default.bind(null, client))
})
client.on('interactionCreate', (int) => {
    if (!int.isCommand()) return;
    commands.list[int.commandName].fn(client, int)
})

//Set up slash commands
var setupCommands = async () => {
    try {
        console.log("Refreshing (/) commands");
        await rest.put(Routes.applicationCommands(settings.client_id), { body: Object.values(commands.list).map((value, key, ar) => { return value.data }) })
        console.log("Slash commands loaded.")
    } catch (error) {
        console.error(error)
    }
}

await setupCommands()
client.login(settings.token)
