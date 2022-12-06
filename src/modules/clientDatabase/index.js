import { Client } from "discord.js";
import mongoose, { Schema } from "mongoose";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uri = fs.readFileSync(path.join(__dirname, 'settings.protected'), {encoding: "utf8"})

/*TODO: Optimize/clean and secure

	⚠️ migrate to mongodb ⚠️

	howtohardcode?

*/

/**
 Theoretical concept

 client.on('ready', () => {
	client.db = new Provider(client)
 })
 */

class Provider {
	name = "db"
	/**
	 * Discord.js Client
	 * @param {Client} client 
	 */
	constructor(client) {
		this.client = client;

		this.uri = uri

		this.guildModel = new Schema({
			guildId: Schema.Types.String,
			settings: Schema.Types.Map
		})

		this.userModel = new Schema({
			userId: Schema.Types.String,
			settings: Schema.Types.Map
		})

		this.conn = mongoose.createConnection(uri)
	}

	async getUser(userid){
		let userCol = this.conn.collection('users')
		let userDoc
		try {
			let search = await userCol.findOne({"userId": userid})
			userDoc = search
		} catch (error) {
			console.error(`Unable to find document with userId ${userid}`)
		}
		return userDoc
	}

	async setUser(userid, settings){
		let userCol = this.conn.collection('users')
		let userDoc
		try {
			let search = await userCol.findOne({"userId": userid})
			userDoc = search
		} catch (error) {
			userDoc = null
		}
		if (userDoc){
			userCol.updateOne({"userId": userid}, {"$set": {"settings": settings}})
		}else{
			let model = this.conn.model('user', this.userModel, 'users')
			let newDoc = new model()
			newDoc.settings = settings
			newDoc.userId = userid
			newDoc.save()
		}
	}


}

export default Provider