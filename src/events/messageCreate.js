import { Client , Message } from "discord.js";

/**
 * 
 * @param { Client } client 
 * @param { Message } msg 
 */
export default function(client, msg) {
    console.log(msg)
	process.emit("message", {data: "hi"})
}