export interface IEmote {
    provider: number;
    code:     string;
    urls:     IEmoteURL[];
}

export interface IEmoteURL {
    size: IEmoteSize;
    url:  string;
}

export enum IEmoteSize {
    The1X = "1x",
    The2X = "2x",
    The3X = "3x",
    The4X = "4x",
}
