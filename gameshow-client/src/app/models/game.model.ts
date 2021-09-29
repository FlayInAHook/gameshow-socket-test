

export abstract class Game {

    constructor(gameType: GameType){
        this.gameType = gameType;
    }

    gameID: string = "";
    gameType: GameType;
    players: Map<string,number> = new Map<string, number>();
    question: Question = new Question();
    end: boolean = false;
}

export enum GameType {
    BUZZGUESS = 0,
    SORT = 1,
}

class Question {
    message: string = "";
    image: string = "";
    input: boolean = false;
}



export class BuzzGame extends Game {

    constructor(){
        super(GameType.BUZZGUESS);
    }

    buzz: boolean = false;
    buzzing: string = "";
}


export class SortGame extends Game {

    constructor(maxRounds: number){
        super(GameType.SORT);
        this.maxRounds = maxRounds;
        for (let i = 1; i <= maxRounds; i++){
            this.rounds.push(new SortRound());
        }
    }

    maxRounds: number;

    rounds: Array<SortRound> = [];
    round: number = 0;
}

class SortRound {
    options: Array<String> = [];
    notes: string = "";
    solution: Array<String> = [];
    current: Array<String> = [];
}