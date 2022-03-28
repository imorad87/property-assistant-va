import { BadRequestException, Controller, Get, Logger, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppService } from './app.service';
import { ChatbotService } from './chatbot/chatbot.service';



@Controller()
export class AppController {

  private logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService, private chatbotService: ChatbotService) { }

  @Get()
  index() {
    return 'Hello';
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'storage/uploads',
        filename(req, file, callback) {
          callback(null, new Date().valueOf() + '_' + file.originalname);
        }
      })
    }))
  uploadFile(@UploadedFile('file') file: Express.Multer.File) {

    this.logger.log(`File Upload Requestd for ${file.filename}`)

    if (!file.mimetype.includes('csv')) {
      return new BadRequestException('File type must be CSV');
    }
    this.appService.processFile(file);
  }



  @Get('bot')
  async testBot() {
    return this.chatbotService.testBot();
  }
}
