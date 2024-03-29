import {
    uploadPomf2
} from '../../lib/scraper/scraper-toolv2.js';
import fetch from 'node-fetch';

let handler = async (m, {
    text,
    usedPrefix,
    command
}) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        let [text1, text2] = text.split("|");

        if (!mime) throw 'Media not found';

        let media = await q.download();
        let waitMessage = 'Please wait...';
        await m.reply(waitMessage);

        let linkPom = await uploadPomf2(media);

        const response = linkPom;
        if (response.success) {
            const fileSize = formatBytes(response.files[0].size);
            let linkVideo = await TextInVideo(response.files[0].url, text1, text2);

            const message = `*Your message was successfully sent! 🚀*\n\n*File Details:*\n*URL:* ${linkVideo}\n*Size:* ${fileSize}`;
            await conn.sendFile(m.chat, await fetchData(linkVideo), '', message, m);
        } else {
            await m.reply('Your message failed to send. 🙁');
        }
    } catch (error) {
        console.error(error);
        await m.reply('An error occurred while processing your request. 🙁');
    }
};

handler.help = ['textinvideo'].map(v => `${v} teks1|teks2`);
handler.tags = ['tools'];
handler.command = /^(textinvideo)$/i;
export default handler;

function formatBytes(bytes) {
    if (bytes === 0) {
        return '0 B';
    }
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

const TextInVideo = async (link, text1, text2) => {
    try {
        const response = await fetch('https://api.creatomate.com/v1/renders', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 960789f9b7ea4a9b9311e7b35eb3d3b515492c525dd19f54b692ba3027d3c424d6d0595595a6ba8b368d8226fda382a6',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                template_id: '872df3b2-46fa-4547-b55c-190d92cceb99',
                modifications: {
                    'ecf1a01d-ff16-4b5f-a58c-a4998b02e502': link,
                    'Text-1': text1,
                    'Text-2': text2,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data[0].url;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const fetchData = async (url) => {
    try {
        const referer = new URL(url).origin;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Referer': referer,
                'Accept': '*/*',
            },
        });

        const data = await response.arrayBuffer();

        return data;
    } catch (error) {
        throw new Error('Error fetching data:', error);
    }
};