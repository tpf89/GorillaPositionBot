import { BaseCommandInteraction, Client, TextChannel } from "discord.js";
import { GoogleSpreadSheetHelper } from "../helpers/GoogleSpreadSheetHelper";
import Credentials from '../Credentials.json';
import Settings from '../Settings.json';
import { IWorkSheet } from "../models/IWorkSheet";

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }

        console.log(`${client.user.username} is online`);

        const workSheets: Array<IWorkSheet> = Settings.workSheets;
        const spreadSheetHelper = new GoogleSpreadSheetHelper(Settings.sheetId, Credentials.youTube.apiToken, Settings.intervalMinutes);

        setInterval(async () => {
            const shows = await spreadSheetHelper.getShows(workSheets);

            if (shows.length === 0) {
                return;
            }
            
            const guild = client.guilds.cache.get(Settings.guildId);
            const channel = client.channels.cache.get(Settings.channelId);

            for (let i = 0; i < shows.length; i++) {
                const show = shows[i];
                const role = guild?.roles.cache.find(r => r.name === show.Role);
                (channel as TextChannel).send(`${show.Title} starts in about ${Math.round(show.MinutesUntil as number)} minutes ${role ? `<@&${role.id}>` : ''}`);
            }

        }, Settings.intervalMinutes * 60000);
    });
}; 