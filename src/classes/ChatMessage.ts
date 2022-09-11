import { IChatMessage } from "../interfaces/ChatMessage";
import { Emotes } from "./Emotes";

export class ChatMessage {
    messageInstance: IChatMessage;

    constructor(messageInstance: IChatMessage) {
        this.messageInstance = messageInstance;
    }

    getUserName(): string {
        return this.messageInstance.tags["display-name"];
    }
    
    getMessage(): string {
        return this.messageInstance.message
            .replaceAll('"', "")
            .replaceAll("'", "")
            .trim();
    }

    getMessageWords(): string[] {
        return this.getMessage().split(" ");
    }

    getTimestamp(): number {
        const epoch = parseInt(this.messageInstance.tags["tmi-sent-ts"]);
        return epoch;
    }
}
