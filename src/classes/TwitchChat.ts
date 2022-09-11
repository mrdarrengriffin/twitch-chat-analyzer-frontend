import { io } from 'socket.io-client';
import { IChatMessage } from "../interfaces/ChatMessage";
import { ChatMessage } from "../classes/ChatMessage";

export class TwitchChat {

    private streamer: string;
    private socket: any;

    constructor(streamer: string){
        this.streamer = streamer;
        this.connect();
    }
    
    private connect(){
        // Connect to the server
        this.socket = io('https://sandbox.mrdarrengriffin.com:8443');

        // Store copy if "this" for use in callbacks
        const _self = this;

        // On connect...
        this.socket.on('connect', function(){
            // Tell the sever which streamer you want to listen to
            _self.socket.emit('streamer', _self.streamer);
        });        
    }
    
    onChat(callbackFn: Function){
        // On chat message...
        this.socket.on('chat', function(chat: IChatMessage){
            const chatMessage = new ChatMessage(chat);
            // Pass ChatMessage instance to callback
            callbackFn(chatMessage);
        });
    }
}