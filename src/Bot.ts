import { Client, Intents } from 'discord.js';
import ready from './listeners/ready';
import Credentials from './Credentials.json';

const token = Credentials.discord.authToken;
console.log('Bot is starting...');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  })

ready(client);

client.login(token);
//console.log(client); 