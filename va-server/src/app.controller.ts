import { BadRequestException, Controller, Get, Logger, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { AppService } from './app.service';
import { CampaignsService } from './campaigns/campaigns.service';
import { ContactsService } from './contacts/contacts.service';
import { SMSMessage } from './entities/sms-message.entity';
import { Constants } from './enums/constants';
import { PodioLogger } from './helpers/podio-logger';
import { ICampaignCreateObject, ProcessingConstraints } from './interfaces/types';
import { PhoneNumbersService } from './phone-numbers/phone-numbers.service';
import { SMSMessagesService } from './sms-messages/sms-messages.service';

type RequestBody = {
  campaignStatus: string;
  title: string;
  file: string;
  interval: string;
  customMessageEnabled: string;
  customMessage: string;
  createMessages: string;
}


@Controller()
export class AppController {

  private logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService, private campaignsService: CampaignsService, private contactsService: ContactsService, private smsService: SMSMessagesService, private phoneNumbersService: PhoneNumbersService) { }

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
      createMessages: body.createMessages === 'true',
    }

    await this.appService.processFile(file, savedCampaign, processingConstraints)

  }

  @Post('custom-sms')
  async sendCustomSms(@Req() req: Request) {
    this.logger.log(`Custom SMS Request Receieved: Message[${req.body.message}] Contacts[${req.body.selectedContacts.length}] MessagesActive[${req.body.messageActive}]`)

    const message: string = req.body.message;
    const contactsIds: number[] = req.body.selectedContacts;
    const messageActive: boolean = req.body.messageActive;

    const firstnamePlaceholder = message.includes('{firstname}');
    const lastnamePlaceholder = message.includes('{lastname}');
    const addressPlaceholder = message.includes('{address}');
    const apnPlaceholder = message.includes('{apn}');

    const contacts = await this.contactsService.findMany(contactsIds);

    const smsList = [];

    for (const contact of contacts) {
      const { first_name, last_name, phone_numbers, property } = contact;

      const { address, apn } = property;

      let contactMessage = message;

      if (firstnamePlaceholder) {
        contactMessage = contactMessage.replace('{firstname}', first_name);
      }

      if (lastnamePlaceholder) {
        contactMessage = contactMessage.replace('{lastname}', last_name);
      }

      if (addressPlaceholder) {
        contactMessage = contactMessage.replace('{address}', address);
      }

      if (apnPlaceholder) {
        contactMessage = contactMessage.replace('{apn}', apn);
      }

      for (const number of phone_numbers) {

        if (!number.active) continue;



        const sms = new SMSMessage();

        sms.active = messageActive;
        sms.body = contactMessage;
        sms.phone_number = number;
        sms.status = Constants.SCHEDULED;
        sms.status_message = 'To be sent';
        sms.type = Constants.OUTGOING;

        smsList.push(sms);
      }

    }

    const savedMessages = await this.smsService.createMany(smsList);

    return {
      message: 'success'
    }
  }
  @Post('custom-sms-single')
  async sendSingleCustomSms(@Req() req: Request) {
    this.logger.log(`Single Custom SMS Request Receieved: Message[${req.body.message}] Contacts[${req.body.selectedContacts.length}] MessagesActive[${req.body.messageActive}]`)

    const message: string = req.body.message;
    const contactsIds: number[] = req.body.selectedContacts;
    const messageActive: boolean = req.body.messageActive;
    const numberId: number = req.body.numberId;

    const firstnamePlaceholder = message.includes('{firstname}');
    const lastnamePlaceholder = message.includes('{lastname}');
    const addressPlaceholder = message.includes('{address}');
    const apnPlaceholder = message.includes('{apn}');

    const contacts = await this.contactsService.findMany(contactsIds);

    const smsList = [];

    for (const contact of contacts) {
      const { first_name, last_name, phone_numbers, property } = contact;

      const { address, apn } = property;

      let contactMessage = message;

      if (firstnamePlaceholder) {
        contactMessage = contactMessage.replace('{firstname}', first_name);
      }

      if (lastnamePlaceholder) {
        contactMessage = contactMessage.replace('{lastname}', last_name);
      }

      if (addressPlaceholder) {
        contactMessage = contactMessage.replace('{address}', address);
      }

      if (apnPlaceholder) {
        contactMessage = contactMessage.replace('{apn}', apn);
      }

      for (const number of phone_numbers) {

        if (number.id != numberId) continue;

        const sms = new SMSMessage();

        sms.active = messageActive;
        sms.body = contactMessage;
        sms.phone_number = number;
        sms.status = Constants.SCHEDULED;
        sms.status_message = 'To be sent';
        sms.type = Constants.OUTGOING;

        smsList.push(sms);
      }

    }

    const savedMessages = await this.smsService.createMany(smsList);

    return {
      message: 'success'
    }
  }

  @Post('podio')
  async convertAndUpload(@Req() req: Request) {

  
    const { contactId, selectedNumberId } = req.body;
    const contact = await this.contactsService.findOne(contactId);
    const number = await this.phoneNumbersService.findOne(selectedNumberId);

    if (contact.status != Constants.CONVERTED) {

      await this.contactsService.setAsConverted(contactId);
      await this.phoneNumbersService.deactivateWithReason(selectedNumberId, Constants.POSITIVE_CONVERTED);
      await new PodioLogger().createLead({
        "id": `${contact.id}`,
        "firstname": contact.first_name,
        "lastname": contact.last_name,
        "propertyaddress": contact.property.address,
        "county": contact.property.county,
        "state": contact.property.state,
        "apn": contact.property.apn,
        "phonenumber": number.number
      })
    }
  }


  @Get('test')
  async test() {
    return await this.smsService.getLatestOutgoingMessages(1);
  }
  @Get('hello')
  async hello() {
    return 'Hello from docker'
  }
}
