export interface PlayerPreviewData {

    isNpc: boolean;
    level:number;
    color: string;
    id: number;
}

export interface PlayerData extends PlayerPreviewData {
    hand: Array<CardData>;
    stack: Array<CardData>;//old cards
    flipped: Array<CardData>;
    properties: Array<CardProperty>;
    timeBackup: boolean;
    milestone:MilestoneData;
    statistics:PlayerStatistics; 
}

export const HandLimit = 4;//4 cards per hand


export type TickSource = "tickUser" | "tickNpc";
export type CardPropertyType = 'knowledge' | 'motivation' | 'experience' | 'empowerment';
export type TheoryGroup = "darkgreen" | "blue" | "yellow" | "violet" | "rose" | "green" | "grey" | "orange";
export type SocialForm = "solo" | "student-council" | "group" | "negative-solo" | "negative-group";

export interface CardProperty {
    type: CardPropertyType;
    value: number;
}

export type CardDataType = "event"|"theory";
export interface CardData {
    type:CardDataType;
    name:string;
    properties:Array<CardProperty>;
    costs:number;
    desc:string;
    totalInDeck:number;

    //theory
    group?:TheoryGroup;

    //event
    socialForm?:SocialForm;  
    
    image?:string;
}

export const PropertyLimits:Array<CardProperty>=[
    {type:"knowledge",value:21},
    {type:"motivation",value:21},
    {type:"experience",value:7},
    {type:"empowerment",value:7},
];

export interface MilestoneData {
    name:string;
    requirements:Array<CardProperty>;
}

export interface PlayerStatistics {
    theoriesLearned:number;

    firstMoveTimestamp:number;//milliseconds
    lastMoveTimestamp:number;//milliseconds

    totalEventsParticipatedIn:number;
    totalEventsStarted:number;
    roundsFinished:number;
}

export const MilestoneLimits:Array<MilestoneData>=[
    {name:"praktika",requirements:[{type:"knowledge",value:3},{type:"experience",value:1},{type:"empowerment",value:1},{type:"motivation",value:5}]},
    {name:"bachelor",requirements:[{type:"knowledge",value:7},{type:"experience",value:2},{type:"empowerment",value:2},{type:"motivation",value:9}]},
    {name:"praxis",requirements:[{type:"knowledge",value:11},{type:"experience",value:3},{type:"empowerment",value:4},{type:"motivation",value:13}]},
    {name:"master",requirements:[{type:"knowledge",value:17},{type:"experience",value:6},{type:"empowerment",value:6},{type:"motivation",value:17}]},
];