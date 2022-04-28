import { BadRequestException, Controller, Get, Logger, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { AppService } from './app.service';
import { CampaignsService } from './campaigns/campaigns.service';
import { ChatbotService } from './chatbot/chatbot.service';
import { ICampaignCreateObject, ProcessingConstraints } from './interfaces/types';
var matador = require('bull-ui/app')({
  redis: {
    host: '127.0.0.1',
    port: '6379',
  }
});

type RequestBody = {
  campaignStatus: string;
  title: string;
  file: string;
  interval: string;
  customMessageEnabled: string;
  customMessage: string;
}


@Controller()
export class AppController {

  private logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService, private chatbotService: ChatbotService, private campaignsService: CampaignsService) { }

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
  async uploadFile(@UploadedFile('file') file: Express.Multer.File, @Req() request: Request) {

    if (!file.mimetype.includes('csv')) {
      return new BadRequestException('File type must be CSV');
    }

    const body: RequestBody = request.body;

    const newCampaign = new ICampaignCreateObject();
    newCampaign.status = body.campaignStatus;
    newCampaign.title = body.title;
    newCampaign.file_path = file.path;

    const savedCampaign = await this.campaignsService.create(newCampaign);

    const processingConstraints: ProcessingConstraints = {
      recordsStatus: body.campaignStatus,
      customMessage: body.customMessage,
      interval: parseInt(body.interval),
    }

    await this.appService.processFile(file, savedCampaign, processingConstraints)

  }



  @Get("queues/*")
  activate(@Req() req, @Res() res) {
    matador(req, res)
  }

}
