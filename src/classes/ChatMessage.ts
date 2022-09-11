import { Timestamp } from "../interfaces/Timestamp";
import { IChatMessage } from "../interfaces/ChatMessage";

export class ChatMessage {

    private messageInstance: IChatMessage;

    constructor(messageInstance: IChatMessage){
        this.messageInstance = messageInstance;
    }


    getUserName() : string {
        return this.messageInstance.tags["display-name"];
    }
    getMessage(): string {
        return this.messageInstance.message.replaceAll('"','').replaceAll('\'','').trim();
    }

    getMessageWords(): string[] {
        return [this.getMessage().split(' ')[0]];
    }

    getTimestamp(): Timestamp {
        const epoch = parseInt(this.messageInstance.tags["tmi-sent-ts"]);

        const timestamp: Timestamp = {
            epoch: epoch,
            epochMinute: Math.round((epoch/1000/60)*6)
        };

        return timestamp;
    }
}