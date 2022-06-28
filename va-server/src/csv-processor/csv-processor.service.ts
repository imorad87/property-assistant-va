import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { includes, isEmpty } from 'lodash';
import { Contact } from 'src/entities/contact.entity';
import { Property } from 'src/entities/property.entity';
import { CampaignsService } from '../campaigns/campaigns.service';
import { ContactsService } from '../contacts/contacts.service';
import { PropertiesService } from '../contacts/properties/propert.service';
import { Campaign } from '../entities/campaign.entity';
import { Constants } from '../enums/constants';
import { InitialMessagesService } from '../initial-messages/initial-messages.service';
import { ContactRecord, CSVJobDescription, IContactCreateObject, ProcessingConstraints } from '../interfaces/types';
import { PhoneNumbersService } from '../phone-numbers/phone-numbers.service';
import { CSVParser } from './csv-parser';

@Injectable()
export class CSVProcessorService {
    private logger = new Logger(CSVProcessorService.name);

    private count: number = 0;
    private randomMessage: string;
    private campaign: Campaign;

    constructor(
        @InjectQueue('csv') private readonly csvQueue: Queue,
        private contactsService: ContactsService,
        private phoneNumbersService: PhoneNumbersService,
        private propertiesService: PropertiesService,
        private campaignsService: CampaignsService,
        private initialMessagesService: InitialMessagesService
    ) { }


    async addToQueue(csvJobDescription: CSVJobDescription) {
        await this.csvQueue.add('parse-csv', csvJobDescription);
    }

    async parseCSVFile(job: Job<CSVJobDescription>) {

        this.randomMessage = (await this.getRandomInitialMessage()).message;

        const { file, campaign, constraints } = job.data;

        this.campaign = campaign;

        const parser = new CSVParser(file.path);
        const csvFile = parser.getParser();

        for await (const record of csvFile) {
            this.count++;

            await this.parseAndSaveRecord(record, constraints);

            await this.campaignsService.incrementTotalRecords(this.campaign.id);
        }

        await this.campaignsService.updateParsingStatus(Constants.COMPLETED, this.campaign.id);

        this.count = 0;
    }

    private removeDuplicates = ((numbers: Array<string>) => {
        const validNumbers = [];

        for (const number of numbers) {
            if (!includes(validNumbers, number)) {
                validNumbers.push(number);
            }
        }
        return validNumbers;
    });


    private async parseAndSaveRecord(record: any, constraints: ProcessingConstraints) {

        const active = record.active === 'True' || record.active === 'true' || record.active === 'TRUE' ? true : false;

        const customMessage = constraints.customMessage;

        const property = {
            address: record.property_full_address,
            county: record.property_county,
            state: record.property_state,
            zip: record.property_zip,
            apn: record.property_apn,
            type: record.property_type
        }

        const owner1: ContactRecord = {
            firstname: record.owner_1_first_name,
            lastname: record.owner_1_last_name,
            phoneNumbers: !isEmpty(record.owner_1_numbers) ? record.owner_1_numbers.split('&') : [],
            campaignId: this.campaign.id,
        }

        let owner2: ContactRecord = null;

        if (record.owner_2_first_name) {
            owner2 = {
                firstname: record.owner_2_first_name,
                lastname: record.owner_2_last_name,
                phoneNumbers: !isEmpty(record.owner_2_numbers) ? record.owner_2_numbers.split('&') : [],
                campaignId: this.campaign.id,
            }
        }


        if (constraints.recordsStatus == Constants.ALL_ACTIVE) {
            owner1.active = true;
            if (owner2) {
                owner2.active = true;
            }
        } else if (constraints.recordsStatus == Constants.ALL_INACTIVE) {
            owner1.active = false;
            if (owner2) {
                owner2.active = false;
            }
        } else {
            owner1.active = active;
            if (owner2) {
                owner2.active = active;
            }
        }

        if (owner1.phoneNumbers) {
            owner1.phoneNumbers = this.removeDuplicates(owner1.phoneNumbers);
        }

        if (owner2 && owner2.phoneNumbers) {
            owner2.phoneNumbers = this.removeDuplicates(owner2.phoneNumbers);
        }

        for await (const n of owner1.phoneNumbers) {

            const duplicate = await this.phoneNumbersService.isDuplicate(n);




            if (duplicate) {
                owner1.phoneNumbers = owner1.phoneNumbers.filter(m => m != n);

                await this.campaignsService.incrementDuplicatesCount(this.campaign.id);
            }
        }

        if (owner2) {

            for await (const n of owner2.phoneNumbers) {

                const duplicate = await this.phoneNumbersService.isDuplicate(n);

                if (duplicate) {
                    owner2.phoneNumbers = owner2.phoneNumbers.filter((m) => m != n);
                    await this.campaignsService.incrementDuplicatesCount(this.campaign.id);
                }
            }
        }

        if (constraints.createMessages) {
            if (customMessage) {
                owner1.initialMessage = customMessage;
                if (owner2) owner2.initialMessage = customMessage;
            } else {

                if (this.count === constraints.interval) {
                    this.count = 0;
                    this.randomMessage = (await this.getRandomInitialMessage()).message;
                }

                owner1.initialMessage = this.randomMessage;

                if (owner2) owner2.initialMessage = this.randomMessage;
            }
        } else {
            owner1.initialMessage = null;

            if (owner2) owner2.initialMessage = null;
        }

        let savedProperty: Property;
        let savedContact1: Contact;

        if (!isEmpty(owner1.phoneNumbers)) {

            savedProperty = await this.propertiesService.create(property);

            owner1.propertyId = savedProperty.id;

            savedContact1 = await this.saveContact(owner1);
        }

        let savedContact2: Contact;

        if (owner2 && !isEmpty(owner2.phoneNumbers)) {
            if (!savedProperty) {
                savedProperty = await this.propertiesService.create(property);
            }
            owner2.propertyId = savedProperty.id;
            savedContact2 = await this.saveContact(owner2);
        }

        if (savedContact1) {
            await this.campaignsService.incrementSuccessCount(this.campaign.id);
        }

        if (savedContact2) {
            await this.campaignsService.incrementSuccessCount(this.campaign.id);
        }
    }


    private async saveContact(contactRecord: ContactRecord) {
        const contact = new IContactCreateObject();
        contact.active = contactRecord.active
        contact.campaign_id = contactRecord.campaignId
        contact.property_id = contactRecord.propertyId
        contact.first_name = contactRecord.firstname
        contact.last_name = contactRecord.lastname
        contact.phone_numbers = contactRecord.phoneNumbers
        contact.initital_message = contactRecord.initialMessage

        try {
            return await this.contactsService.create(contact);
        } catch (error) {
            this.logger.error(error.message);
            // console.log(error);
            await this.campaignsService.incrementFailedCount(this.campaign.id);
        }
    }

    private async getRandomInitialMessage() {
        const ids = await this.initialMessagesService.getAllIds()
        const randomId = this.getRandomInt(ids.length);
        const message = await this.initialMessagesService.findOne(ids[randomId]);
        return message;
    }

    private getRandomInt(max: number) {
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - 0) + 0); //The maximum is exclusive and the minimum is inclusive
    }
}
