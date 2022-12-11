import { SlashCommand, CommandContext } from "slash-create";
import { EmbedBuilder } from "@discordjs/builders"
import { fileURLToPath } from "url"
import path, { dirname } from "path";
import { Client } from "discord.js";
const fname = fileURLToPath(import.meta.url)
export default class PingCommand extends SlashCommand {
	constructor(creator) {
		super(creator, {
			name: 'ping',
			description: "pong",
			throttling: {
				usages: 1,
				duration: 3
			}
		})

		this.examples = [
			`/ping`
		]
		this.filePath = fname;
	}

	/**
	 * 
	 * @param {CommandContext} ctx 
	 */
	async run(ctx) {

		/** 
		 * @type {Client}
		*/
		var client = ctx.creator.client


		let embed = new EmbedBuilder()
		embed.setColor(client.constants.dColor)
		embed.addFields([
			{
				name: ":ping_pong:",
				value: `I ponged back at the speed of **${Math.floor(client.ws.ping)} ms**!`
			}
		])
		embed.setFooter({ text: `Pinged by ${ctx.user.username}` })
		embed.setTimestamp()
		await ctx.send({ embeds: [embed] })
	}
}