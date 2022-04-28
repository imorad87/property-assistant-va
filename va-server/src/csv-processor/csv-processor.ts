import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import Bull from "bull";
import { CSVProcessorService } from "./csv-processor.service";

@Processor('csv')
export class CSVProcessor {

    private readonly logger = new Logger(CSVProcessor.name);

    constructor(private csvService: CSVProcessorService) { }

    @Process('parse-csv')
    async parseCsv(job: Bull.Job) {
        this.logger.log(`New CSV Parsing Request`)
        await this.csvService.parseCSVFile(job);
    }
}