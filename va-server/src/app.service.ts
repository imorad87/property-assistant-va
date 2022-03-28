import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Repository } from 'typeorm';
import { CSVProcessorService } from './csv-processor/csv-processor.service';
import { CSVFileUploadStatus } from './entities/csv-file-upload-status.entity';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppService {

  @WebSocketServer()
  server: Server;


  constructor(@InjectRepository(CSVFileUploadStatus) private csvFileRepo: Repository<CSVFileUploadStatus>, private csvProcessorService: CSVProcessorService) { }

  sendFile(file: Express.Multer.File) {
    this.server.emit('from-server', file);
  }

  @SubscribeMessage('sms-sent')
  smsSent(@MessageBody() data: any) {
    console.log(data);
  }

  async processFile(file: Express.Multer.File) {
    await this.saveFileToDB(file);
    this.csvProcessorService.processCSV(file);

  }


  async saveFileToDB(file: Express.Multer.File) {
    const fileEntity = this.csvFileRepo.create({
      file_path: `/storage/uploads/${file.filename}`
    });

    const savedFile = this.csvFileRepo.save(fileEntity);

    return savedFile;
  }

}
