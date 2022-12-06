import { SlashCommand , CommandContext } from "slash-create";
import { EmbedBuilder } from "@discordjs/builders";
import got from "got";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const fname = fileURLToPath(import.meta.url)
export default class CattoCommand extends SlashCommand {
	constructor(creator){
		super(creator, {
			name: 'catto',
			description: "meow",
			throttling: {
				usages: 1,
				duration: 3
			}
		})

		this.examples = [
			`/catto`
		]
		this.filePath = fname;
	}

	/**
	 * 
	 * @param {CommandContext} ctx 
	 */
	async run(ctx) {
		let client = ctx.creator.client
		let base
		let img
		try {
			base = await got("https://cataas.com/cat?json=true")
			img = await got(`https://cataas.com/cat/${JSON.parse(base.body)._id}`)
		}catch(err){
			console.error(err)
		}
		let embed = new EmbedBuilder()
		embed.setColor(client.constants.dColor)
		embed.setImage(img.url)
		embed.setTimestamp()
		await ctx.send({embeds: [embed]})
	}
}