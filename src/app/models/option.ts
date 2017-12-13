export class Option {
    id: number;
    questionId: number;
    name: string;
    isAnswer: boolean;
    description: string;
    url: string;
    selected: boolean;

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.questionId = data.questionId;
        this.name = data.name;
        this.isAnswer = data.isAnswer;
        this.url = data.url;
        this.description = data.description;
    }
}
