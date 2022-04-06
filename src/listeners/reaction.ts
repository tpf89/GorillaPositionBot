import { Client, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";

export default (client: Client): void => {
    client.on("messageReactionAdd", async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {

    });

    client.on("messageReactionRemove", async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
        
    });
};