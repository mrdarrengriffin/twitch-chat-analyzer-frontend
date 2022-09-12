import { io } from "socket.io-client";
import { IChatMessage } from "../interfaces/ChatMessage";
import { ChatMessage } from "../classes/ChatMessage";
import { Emotes } from "./Emotes";
import { IEmote } from "../interfaces/Emote";

export class TwitchChat {
    private streamer: string;
    private socket: any;
    private emotes: Emotes;

    constructor(streamer: string) {
        this.streamer = streamer;
        this.emotes = new Emotes(streamer);

        this.emotes.getGlobalEmotes();
        this.emotes.getChannelEmotes();
        this.connect();
    }
    
    private connect() {
        // Connect to the server
        this.socket = io("https://api.justchatting.io:2083");

        // Store copy if "this" for use in callbacks
        const _self = this;

        // On connect...
        this.socket.on("connect", function () {
            // Tell the sever which streamer you want to listen to
            _self.socket.emit("streamer", _self.streamer);
        });
    }

    onChat(callbackFn?: Function) {
        // On chat message...
        this.socket.on("chat", function (chat: IChatMessage) {
            const chatMessage = new ChatMessage(chat);
            // Pass ChatMessage instance to callback
            callbackFn(chatMessage);
        });
    }

    getEmote(emoteCode: IEmote['code']) {
        return this.emotes.getEmote(emoteCode);
    }

    renderEmote(word: string){
        let emote = this.getEmote(word);
        if(emote){
            return `<img src="${emote.urls[emote.urls.length - 1]['url']}" alt="${word}"/>`;
        }
        return word;
    }

    emoteExists(word: string){
        return !!this.getEmote(word);          
    }
}
