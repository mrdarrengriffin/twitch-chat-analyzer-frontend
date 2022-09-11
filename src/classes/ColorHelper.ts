export class ColorHelper {
    private items: any;

    constructor(){
        this.items = [];
    }

    get(item: string): string{
        if(typeof this.items[item] == 'undefined'){
            this.items[item] =  Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
        }
        return this.items[item];
    }
}