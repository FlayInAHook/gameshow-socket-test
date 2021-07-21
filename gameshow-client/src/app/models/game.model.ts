export class Game {
    gameID: string = "";
    players: Map<string,number> = new Map<string, number>();
    question: Question = new Question();
    buzz: boolean = false;
    buzzing: string = "";
}

export class Question {
    message: string = "";
    image: string = "";
}