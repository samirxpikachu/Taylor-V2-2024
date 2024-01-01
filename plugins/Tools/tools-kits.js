import {
	VoiceAPI
} from '../../lib/tools/kits-ai.js'
const kits = new VoiceAPI()

let handler = async (m, {
	conn,
	usedPrefix,
	command,
	text
}) => {
	if (command === "kitsvtv") {
		if (!text) return m.reply("model")
		try {
			let q = m.quoted ? m.quoted : m
			let mime = (q.msg || q).mimetype || q.mediaType || ''
			if (/video/audio/.test(mime)) {
				let buffer = await q.download()
				await m.reply(wait)
				let output = await kits.createVoice(text || "221129", buffer)
				await conn.sendFile(m.chat, output.audioUrl, '', output.type, m, null, {
					ptt: true,
					waveform: [100, 0, 100, 0, 100, 0, 100],
					contextInfo: adReplyS.contextInfo
				});
			} else throw `Reply audio/video with command ${usedPrefix + command}`
		} catch (e) {
			console.log("error")
		}
	}

	if (command === "kitsmodel") {
		if (!text) return m.reply("eleven/kits")
		try {

			let output = await kits.getModelData(text)
			await m.reply(output.map((v) => v.lable + "\n" + v.value).join("\n\n"))
		} catch (e) {
			console.log("error")
		}
	}

	if (command === "kitstts") {
		if (!text.split("|")[0]) return m.reply("model|text")
		if (!text.split("|")[1]) return m.reply("model|text")
		try {

			let output = await kits.createTTS(text)
			await m.reply(output.map((v, index) => `${index + 1}. ${v.label}: ${v.value}`).join("\n\n"))
		} catch (e) {
			console.log("error")
		}
	}
}
handler.help = ['kitsvtv <model>', 'kitsmodel <model>', 'kitstts <model|text>']
handler.tags = ['tools']
handler.command = /^(kitsvtv|kitsmodel|kitstts)$/i

export default handler