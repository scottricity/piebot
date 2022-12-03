import { SlashCommand , CommandContext } from "slash-create";
import { fileURLToPath } from "url"
import path, { dirname } from "path";
const fname = fileURLToPath(import.meta.url)
export class Command extends SlashCommand {
	constructor(creator){
		super(creator, {
			name: 'ping',
			description: "*pong* its a",
			throttling: {
				usages: 1,
				duration: 3
			}
		})

		this.filePath = fname;
	}

	/**
	 * 
	 * @param {CommandContext} ctx 
	 */
	async run(ctx) {
		await ctx.send('ye')
	}
}