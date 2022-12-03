import {SlashCommandBuilder} from "@discordjs/builders"
import { Client , Integration } from "discord.js"

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Replies with Pong!"),
    /**
     * 
     * @param {Client} client 
     * @param {Integration} interaction 
     */
    async execute(client, interaction) {
        await interaction.reply(`\`${Math.floor(client.ws.ping)}ms\``)
    }
}