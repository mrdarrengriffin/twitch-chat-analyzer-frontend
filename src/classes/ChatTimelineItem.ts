import { ChatTimeline } from "./ChatTimeline";
import { ChatMessage } from "./ChatMessage";

export class ChatTimelineItem {
    private timeline: ChatTimeline;
    private message: ChatMessage;

    constructor(timeline: ChatTimeline, message: ChatMessage){
        this.timeline = timeline;
        this.message = message;
    }

    // Takes the message time and converts it to the time delta based on the newLineInterval
    // Used as the identifier for the line item
    getLineTimeDelta(){
        return Math.round((this.message.getTimestamp() / 1000) / this.timeline.getNewLineInterval());
    }

    getMessage(){
        return this.message;
    }
}