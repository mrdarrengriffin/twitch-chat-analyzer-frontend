import { IEmote } from "../interfaces/Emote";
import axios from "axios";

export class Emotes {
    private channelEmotes: IEmote[];
    private globalEmotes: IEmote[];
    private channel;
    constructor(channel: string) {
        this.channel = channel;
    }

    getChannelEmotes(callbackFn?: Function) {
        axios
            .get(
                `https://emotes.adamcy.pl/v1/channel/${this.channel}/emotes/all`
            )
            .then((response) => {
                const data = <IEmote[]>response.data;
                this.channelEmotes = data;
                if (callbackFn) {
                    callbackFn();
                }
            });
    }
    getGlobalEmotes(callbackFn?: Function) {
        axios
            .get(`https://emotes.adamcy.pl/v1/global/emotes/all`)
            .then((response) => {
                const data = <IEmote[]>response.data;
                this.globalEmotes = data;
                if (callbackFn) {
                    callbackFn();
                }
            });
    }

    getEmote(emoteCode: string) {
        if (this.channelEmotes) {
            const emote = this.channelEmotes.find(
                (emote) => emote.code === emoteCode
            );
            if (emote) {
                return emote;
            }
        }
        if (this.globalEmotes) {
            const emote = this.globalEmotes.find(
                (emote) => emote.code === emoteCode
            );
            if (emote) {
                return emote;
            }
        }
    }
}
