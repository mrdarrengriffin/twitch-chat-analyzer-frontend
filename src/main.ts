// Classes
import { ChatTimeline } from "./classes/ChatTimeline";
import { ChatTimelineItem } from "./classes/ChatTimelineItem";
import { ChatMessage } from "./classes/ChatMessage";
import { TwitchChat } from "./classes/TwitchChat";

// Helpers
import { ColorHelper } from "./classes/ColorHelper";

const urlSearchParams = new URLSearchParams(window.location.search);
const streamer = urlSearchParams.get("streamer");
const emoteOnly = !!urlSearchParams.get("emoteOnly");

if (!streamer) {
    return;
}

document.addEventListener("DOMContentLoaded", function (event) {
    
    const timelimeElement = document.getElementById("timeline");

    const chat = new TwitchChat(streamer);
    const timeline = new ChatTimeline(timelimeElement, 3, 10, chat, emoteOnly);

    chat.onChat(function (chatMessage: ChatMessage) {
        const chatTimelineItem = new ChatTimelineItem(timeline, chatMessage);
        timeline.addItem(chatTimelineItem);
    });

});
