import { SlashCommand , CommandContext , CommandOptionType } from "slash-create";
import { joinVoiceChannel } from "@discordjs/voice";
import { EmbedBuilder } from "@discordjs/builders";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { Client } from "discord.js";
const fname = fileURLToPath(import.meta.url)
export default class PingCommand extends SlashCommand {
	constructor(creator){
		super(creator, {
			name: 'radio',
			description: "radio SHEEEEESH",
			dmPermission: false,
			throttling: {
				usages: 1,
				duration: 3
			},
			options: [
				{
					type: CommandOptionType.SUB_COMMAND,
					name: 'play',
					description: 'ok shore'
				},
				{
					type: CommandOptionType.SUB_COMMAND,
					name: 'stop',
					description: ":("
				}
			]
		})

		this.examples = [
			`/radio play`,
			`/radio stop`
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
		if (client.guilds.cache.get(ctx.guildID)){
			let guildMember = client.guilds.cache.get(ctx.guildID).members.cache.get(ctx.member.id)
			if (guildMember && guildMember.voice){
				const conn = joinVoiceChannel({
					channelId: guildMember.voice.channelId,
					selfDeaf: true,
					guildId: ctx.guildID,
					adapterCreator: client.guilds.cache.get(ctx.guildID).voiceAdapterCreator
				})
			}
		}
		

		await ctx.send(ctx.subcommands[0])
	}
}