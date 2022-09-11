// Classes
import { ChatMessage } from './classes/ChatMessage';
import { TwitchChat } from './classes/TwitchChat';

// Helpers
import { ColorHelper } from './classes/ColorHelper';

const urlSearchParams = new URLSearchParams(window.location.search);
const streamer = urlSearchParams.get('streamer');

if(!streamer){
    return;
}

document.addEventListener("DOMContentLoaded", function(event) { 
    let largestGroupWordCount = 0;
    const chat = new TwitchChat(streamer);
    const colorHelper = new ColorHelper();

    // Top words
    const topWords = document.querySelector('#topWords');

    let previousChatItemGroup: HTMLElement;
    
    chat.onChat(function(chatMessage: ChatMessage){
        console.log(chatMessage.getMessage());
        // Get the bar for the current minute in time
        let chatItemGroup = topWords.querySelector('[data-time="'+ chatMessage.getTimestamp().epochMinute.toString() +'"]');

        // If no bar found, make one (probably start of new minute)
        if(!chatItemGroup){
            const newChatItemGroup = document.createElement('div');
            newChatItemGroup.classList.add('bar');
            newChatItemGroup.setAttribute('data-group-word-count', '0');
            newChatItemGroup.setAttribute('data-time', chatMessage.getTimestamp().epochMinute.toString());
            topWords.appendChild(newChatItemGroup);
            chatItemGroup = newChatItemGroup;

            if(previousChatItemGroup){

                // Go through all the previous items messages and trim and small counts
                previousChatItemGroup.querySelectorAll('[data-word]').forEach(wordItem => {
                    const currentWordCount = parseInt(wordItem.getAttribute('data-word-count'));
                    if(currentWordCount <= 2){
                        wordItem.remove();
                        const groupWordCount = parseInt(previousChatItemGroup.getAttribute('data-group-word-count'));
                        previousChatItemGroup.setAttribute('data-group-word-count', (groupWordCount - currentWordCount).toString());
                        if(groupWordCount == largestGroupWordCount){
                            largestGroupWordCount = largestGroupWordCount - groupWordCount;
                        }
                    }
                });

                // Loop through each word and adjust widths to scale
                const wordItems = previousChatItemGroup.querySelectorAll('[data-word]');
                // Store rankings for rerender later
                wordItems.forEach(function(wordItemElem: HTMLElement) {
                    wordItemElem.style.width = ((parseInt(wordItemElem.getAttribute('data-word-count')) / parseInt(previousChatItemGroup.getAttribute('data-group-word-count'))) * 100) + '%';    

                    //wordItemElem.setAttribute('data-word-rank', (wordItemsLargest - wordItemCount).toString());
                });

                const chatItemGroups = topWords.querySelectorAll('[data-time]').forEach(chatItemGroup => {
                    const chatItemGroupWordCount = parseInt(chatItemGroup.getAttribute('data-group-word-count'));
                    if(chatItemGroupWordCount > largestGroupWordCount){
                        largestGroupWordCount = chatItemGroupWordCount;
                    }
        
                    chatItemGroup.style.width = ((chatItemGroupWordCount / largestGroupWordCount) * 100) + '%';
                });
            }

        }

        previousChatItemGroup = chatItemGroup;

        // Get message words...
        chatMessage.getMessageWords().forEach(word => {

            // Get the word bar item
            let wordItem: HTMLElement = chatItemGroup.querySelector('[data-word="'+word+'"]');

            // If no word bar item, make one (probably first instance of word at this time)
            if(!wordItem){
                const newWordItem = document.createElement('div');
                newWordItem.classList.add('bar__item');
                newWordItem.setAttribute('data-word', word);
                newWordItem.setAttribute('data-word-count', '0');
                newWordItem.style.backgroundColor = '#' + colorHelper.get(word);
                newWordItem.innerText = word;
                chatItemGroup.appendChild(newWordItem);
                wordItem = newWordItem;
            }

            
            const currentWordCount = parseInt(wordItem.getAttribute('data-word-count'));
            wordItem.setAttribute('data-word-count', (currentWordCount+1).toString());
            wordItem.style.order = '-' + (currentWordCount+1).toString();
        });

        // Update group with total words after each message
        const currentGroupWordCount = parseInt(chatItemGroup.getAttribute('data-group-word-count'));
        chatItemGroup.setAttribute('data-group-word-count', (currentGroupWordCount + chatMessage.getMessageWords().length).toString());

        // Loop through each word and adjust widths to scale
        const wordItems = chatItemGroup.querySelectorAll('[data-word]');
        // Store rankings for rerender later
        wordItems.forEach(function(wordItemElem: HTMLElement) {
            wordItemElem.style.width = ((parseInt(wordItemElem.getAttribute('data-word-count')) / parseInt(chatItemGroup.getAttribute('data-group-word-count'))) * 100) + '%';    
            const wordItemCount = parseInt(wordItemElem.getAttribute('data-word-count'));

            //wordItemElem.setAttribute('data-word-rank', (wordItemsLargest - wordItemCount).toString());
        });

        // Get largest word count group and use as scale max

        const chatItemGroups = topWords.querySelectorAll('[data-time]').forEach(chatItemGroup => {
            const chatItemGroupWordCount = parseInt(chatItemGroup.getAttribute('data-group-word-count'));
            if(chatItemGroupWordCount > largestGroupWordCount){
                largestGroupWordCount = chatItemGroupWordCount;
            }

            chatItemGroup.style.width = ((chatItemGroupWordCount / largestGroupWordCount) * 100) + '%';
        });

    })
});
