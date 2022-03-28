import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import Bull from "bull";

@Processor('csv')
export class CSVProcessor {

    private readonly logger = new Logger(CSVProcessor.name);


    @Process('parse-csv')
    parseCsv(job: Bull.Job) {
        console.log(job);
    }

}