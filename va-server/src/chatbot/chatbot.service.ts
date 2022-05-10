import { Injectable } from '@nestjs/common';
import { dockStart } from '@nlpjs/basic'
import { NeuralNetwork } from "@nlpjs/neural";
import * as fs from 'fs';

@Injectable()
export class ChatbotService {

    private bot;
    private net;

    constructor() {
        (
            async () => {
                const dock = await dockStart();

                const nlp = dock.get('nlp');

                this.bot = nlp;

                const corpus = fs.readFileSync('nnInput.json', 'utf-8');

                this.net = new NeuralNetwork({
                    log: true,
                    iterations: 60000
                });

                this.net.train(JSON.parse(corpus));

            }
        )();
    }


    getClassification(input) {

        const inputArray = input.split(" ");

        const nnInput = {};

        inputArray.forEach((word) => {
            nnInput[word] = 1;
        });

        const finalResult = {};

        const nnOutput = this.net.run(nnInput);

        for (const key of Object.keys(nnOutput)) {
            // finalResult[key] = nnOutput[key];
            finalResult[key] =
                Math.ceil(nnOutput[key] ? nnOutput[key] * 100 : 0).toString() + "%";
        }

        return finalResult;
    }

    async getResponse(input) {
        const res = await this.bot.process('en', input);
        return res;
    }

}
