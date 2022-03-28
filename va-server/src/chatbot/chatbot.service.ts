import { Injectable } from '@nestjs/common';
import { dockStart } from '@nlpjs/basic'
@Injectable()
export class ChatbotService {

    private bot;
    
    constructor() {
        (
            async () => {
                const dock = await dockStart();
                const nlp = dock.get('nlp');
                await nlp.train();
                this.bot = nlp;
            }
        )();
    }


    async testBot() {

        const response = await this.bot.process('en', 'Who are you');
        return response;

    }

}
