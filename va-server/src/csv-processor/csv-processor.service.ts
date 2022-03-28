import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class CSVProcessorService {

    constructor(@InjectQueue('csv') private readonly csvQueue: Queue) { }


    processCSV(file: Express.Multer.File) {
        this.csvQueue.add('parse-csv', {
            file
        })
    }


    getQueueStatusInfo(){
        
    }
}
