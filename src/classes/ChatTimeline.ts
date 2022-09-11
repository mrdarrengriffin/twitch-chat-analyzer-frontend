import { ChatTimelineItem } from "./ChatTimelineItem";
import { IChatMessage } from "../interfaces/ChatMessage";
import { ColorHelper } from "./ColorHelper";
import { TwitchChat } from "./TwitchChat";
export class ChatTimeline {
    // HTML Element to render the timeline to
    private targetElement: HTMLElement;
    // Minimum number of words to keep after line completes
    private minimumWordCount: number = 3;
    // How many seconds until a new line is created
    private newLineInterval: number = 60;

    private colorHelper: ColorHelper;

    private timelineItems: ChatTimelineItem[];

    private twitchChat: TwitchChat;

    private emoteOnly: boolean;

    constructor(
        element: HTMLElement,
        minimumWordCount: number,
        newLineInterval: number,
        twitchChat: TwitchChat,
        emoteOnly: boolean = false
    ) {
        this.targetElement = element;
        this.minimumWordCount = minimumWordCount;
        this.newLineInterval = newLineInterval;
        this.timelineItems = [];
        this.colorHelper = new ColorHelper();
        this.twitchChat = twitchChat;
        this.emoteOnly = emoteOnly;

        if (emoteOnly) {
            element.classList.add("timeline--emote-only");
        }
    }

    getNewLineInterval() {
        return this.newLineInterval;
    }

    addItem(item: ChatTimelineItem) {
        this.timelineItems.push(item);
        // Get row group by delta
        let timelineItemRowElem = this.targetElement.querySelector(
            `[data-delta="${item.getLineTimeDelta()}"]`
        );
        if (!timelineItemRowElem) {
            if (!this.emoteOnly) {
                this.trimTimelineItems();
            }
            timelineItemRowElem = document.createElement("div");
            timelineItemRowElem.classList.add("timeline__row");
            timelineItemRowElem.setAttribute(
                "data-delta",
                item.getLineTimeDelta().toString()
            );
            timelineItemRowElem.setAttribute("data-count", "0");
            timelineItemRowElem.style.width = "100%";
            this.targetElement.appendChild(timelineItemRowElem);
        }

        // Loop through all the messages and get all the individual words.
        const timelineItemWords = item.getMessage().getMessageWords();

        // Add or update the word items with the correct count
        timelineItemWords.forEach((word) => {
            if (this.emoteOnly && !this.twitchChat.emoteExists(word)) {
                return;
            }
            // Check to see if the word item exists in the row
            let timelineItemWordElem = timelineItemRowElem.querySelector(
                `[data-word="${word}"]`
            );
            // ... if not, create it
            if (!timelineItemWordElem) {
                timelineItemWordElem = document.createElement("div");
                timelineItemWordElem.classList.add("timeline__item");
                timelineItemWordElem.setAttribute("data-word", word);
                timelineItemWordElem.style.backgroundColor =
                    "#" + this.colorHelper.get(word);
                timelineItemWordElem.innerHTML =
                    this.twitchChat.renderEmote(word);
                timelineItemWordElem.setAttribute("data-count", "1");
                timelineItemRowElem.appendChild(timelineItemWordElem);
            } else {
                timelineItemWordElem.setAttribute(
                    "data-count",
                    (
                        parseInt(
                            timelineItemWordElem.getAttribute("data-count")
                        ) + 1
                    ).toString()
                );
            }

            if(parseInt(timelineItemWordElem.getAttribute("data-count")) < this.minimumWordCount){
                timelineItemWordElem.style.opacity = '0.25';
            }else{
                timelineItemWordElem.style.opacity = '1';
            }

        });

        timelineItemRowElem.setAttribute(
            "data-count",
            (
                parseInt(timelineItemRowElem.getAttribute("data-count")) +
                timelineItemWords.length
            ).toString()
        );

        // Go through the words, again after the message, ensuring all the widths are correct
        timelineItemWords.forEach((word) => {
            if (this.emoteOnly && !this.twitchChat.emoteExists(word)) {
                return;
            }
            let timelineItemWordElems =
                timelineItemRowElem.querySelectorAll("[data-word]");
            timelineItemWordElems.forEach((timelineItemWordElem) => {
                timelineItemWordElem.style.width =
                    (parseInt(timelineItemWordElem.getAttribute("data-count")) /
                        parseInt(
                            timelineItemRowElem.getAttribute("data-count")
                        )) *
                        100 +
                    "%";
                timelineItemWordElem.style.order =
                    -timelineItemWordElem.getAttribute("data-count");
            });
        });

        this.adjustTimelineItemScale();
    }

    // Remove words that have low counts. Keeps top 10 words
    trimTimelineItems() {
        const timelineItemRowElems =
            this.targetElement.querySelectorAll(".timeline__row");
        timelineItemRowElems.forEach((timelineItemRowElem) => {
            let timelineItemWordElems =
                timelineItemRowElem.querySelectorAll(".timeline__item");
            timelineItemWordElems.forEach((timelineItemWordElem) => {
                if (
                    parseInt(timelineItemWordElem.getAttribute("data-count")) <
                    this.minimumWordCount
                ) {
                    timelineItemRowElem.setAttribute(
                        "data-count",
                        (
                            parseInt(
                                timelineItemRowElem.getAttribute("data-count")
                            ) -
                            parseInt(
                                timelineItemWordElem.getAttribute("data-count")
                            )
                        ).toString()
                    );
                    timelineItemWordElem.remove();
                }
            });

            timelineItemWordElems.forEach((timelineItemWordElem) => {
                timelineItemWordElem.style.width =
                    (parseInt(timelineItemWordElem.getAttribute("data-count")) /
                        parseInt(
                            timelineItemRowElem.getAttribute("data-count")
                        )) *
                        100 +
                    "%";
                timelineItemWordElem.style.order =
                    -timelineItemWordElem.getAttribute("data-count");
            });

            const updatedTotalCount = parseInt(
                timelineItemRowElem.getAttribute("data-count")
            );
            if (updatedTotalCount == 0) {
                timelineItemRowElem.remove();
            }
        });
    }

    adjustTimelineItemScale() {
        let maxTimelineRowCount = 0;
        const timelineItemRowElems =
            this.targetElement.querySelectorAll(".timeline__row");
        // Get max row count first...
        timelineItemRowElems.forEach((timelineItemRowElem) => {
            let timelineItemRowCount = parseInt(
                timelineItemRowElem.getAttribute("data-count")
            );
            if (timelineItemRowCount > maxTimelineRowCount) {
                maxTimelineRowCount = timelineItemRowCount;
            }
        });
        // Then adjust the widths
        timelineItemRowElems.forEach((timelineItemRowElem) => {
            let timelineItemRowCount = parseInt(
                timelineItemRowElem.getAttribute("data-count")
            );
            timelineItemRowElem.style.width =
                (timelineItemRowCount / maxTimelineRowCount) * 100 + "%";
        });
    }

    getTimelineItems(): ChatTimelineItem[] {
        return this.timelineItems;
    }
    getTimelineItemsByIndex(index: number): ChatTimelineItem[] {
        return this.timelineItems.filter((item) => {
            return item.getLineTimeDelta() === index;
        });
    }
}
