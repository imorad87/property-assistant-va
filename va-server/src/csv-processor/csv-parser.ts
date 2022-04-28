import { Logger } from '@nestjs/common';
import { parse, Parser } from 'csv-parse';
import * as fs from 'fs';

export class CSVParser {

    private logger = new Logger(CSVParser.name);

    private parser: Parser;


    constructor(path: string) {
        try {

            this.parser = fs.createReadStream(path, {
                encoding: 'utf-8',
            })
                .pipe(parse({
                    columns: true,
                    delimiter: ','
                }));
        } catch (error) {
            this.logger.error(error.message);
            throw new Error("CSV Parser couldn't be created");
        }
    }


    getParser() {
        return this.parser;
    }
}