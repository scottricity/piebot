import { SlashCommand, CommandContext, ComponentType, TextInputStyle } from "slash-create";
import { EmbedBuilder } from "@discordjs/builders"
import { Client } from "discord.js";
import { inspect } from "util";
import { fileURLToPath } from "url"
import path, { dirname } from "path";
import chalk from "chalk";
const fname = fileURLToPath(import.meta.url)
export default class EvalCommand extends SlashCommand {
	constructor(creator) {
		super(creator, {
			name: 'eval',
			description: "Evaluate JavaScript code",
			throttling: {
				usages: 1,
				duration: 3
			}
		})

		this.examples = [
			`/eval`
		]
		this.filePath = fname;
	}

	/**
	 * 
	 * @param {CommandContext} ctx 
	 */
	async run(ctx) {
		/**
		 * @type {Client} client
		 * @returns {Client}
		 */
		var client = ctx.creator.client

		let clientApp = await client.application.fetch()
		if (!clientApp.owner?.members.has(ctx.user.id)) return ctx.send('This is for bot developers only.', { ephemeral: true });
		await ctx.sendModal({
			title: "PieBot DevModal",
			custom_id: "evaljs",
			components: [
				{
					type: ComponentType.ACTION_ROW,
					components: [
						{
							type: ComponentType.TEXT_INPUT,
							style: TextInputStyle.PARAGRAPH,
							label: "JavaScript Code",
							placeholder: 'console.log(String("b" + "a" + + "a" + "a").toLowerCase())',
							custom_id: "code_input"
						}
					]
				}
			]
		}, async (mctx) => {
			const clean = async (text) => {
				if (text && text.constructor.name == "Promise")
					text = await text

				if (typeof text !== "string")
					text = inspect(text, {depth: 1})

				text = text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
				text = text.replace(new RegExp(client.token, "g"), "[REDACTED]")
				return text
			}
			let code = eval(mctx.values?.code_input)
			let cleaned = await clean(code)
			console.log(chalk.bgCyanBright("hi"))
			return ctx.send(`\`\`\`\n${cleaned}\n\`\`\``);

		}).catch(async err => {
			await ctx.send('Error.')
		})
		console.log(chalk.bgCyanBright("hi"))
		return;
	}
}