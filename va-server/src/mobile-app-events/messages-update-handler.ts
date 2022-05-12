import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import Bull from "bull";
import { PodioLogger } from "src/helpers/podio-logger";
import { ChatbotService } from "../chatbot/chatbot.service";
import { ContactsService } from "../contacts/contacts.service";
import { Constants } from "../enums/constants";
import { PhoneNumbersService } from "../phone-numbers/phone-numbers.service";
import { SMSMessagesService } from "../sms-messages/sms-messages.service";

class IncomingEvent {
    numberId?: number;
    number: string;
    messageId?: number;
    message: string;
    status?: string;
    error?: string;
}

@Processor('message-update')
export class MessagesUpdateHandler {

    private readonly logger = new Logger(MessagesUpdateHandler.name);

    constructor(private smsService: SMSMessagesService,
        private chatbotService: ChatbotService,
        private phoneNumbersService: PhoneNumbersService,
        private contactsService: ContactsService,
    ) { }

    @Process('update-message')
    async updateMessage(job: Bull.Job) {
        await this.smsService.setMessageStatus(job.data.messageId, job.data.status, job.data.statusMessage);
    }

    @Process('message-received')
    async handleReceivedMessage(job: Bull.Job) {

        const payload: IncomingEvent = job.data;

        try {
            this.logger.log(`New Message Recieved: ${JSON.stringify(payload)}`);

            const from: string = payload.number;

            const rawNumber = from.replace('+', '');
            const asNumber = parseInt(rawNumber, 10);
            
            const foundNumber = await this.phoneNumbersService.findByNumberExact(`${asNumber}`);

            if (foundNumber) {

                this.logger.log(`Found a matching number ${foundNumber.number}`);

                const responseObject = await this.chatbotService.getResponse(payload.message);

                const response = responseObject.answer;

                this.logger.log(`Chatbot Response: ${response}`);

                const classification = responseObject.intent;

                this.logger.log(`Received Message Classification: ${classification}`);

                if (response === 'unknown') {
                    await this.phoneNumbersService.deactivateWithReason(foundNumber.id, Constants.UNKNOWN_RESPONSE);
                    return;
                }


                //create a message for the received one
                const recievedMessage = await this.smsService.create({
                    body: payload.message,
                    status: Constants.RECEIEVED,
                    status_message: 'recieved message',
                    type: Constants.INCOMING,
                    phone_number: foundNumber.id,
                    active: foundNumber.active,
                    classification
                });

                if (responseObject.intent === 'positive') {
                    const previousMessages = await this.smsService.getLatestOutgoingMessages(foundNumber.id);

                    const hasCallMessage = previousMessages.find(message => message.body.includes('call'));

                    if (hasCallMessage) {
                        await this.contactsService.setAsConverted(foundNumber.contact.id);
                        const contact = await this.contactsService.findOne(foundNumber.contact.id);
                        await this.phoneNumbersService.deactivateWithReason(foundNumber.id, Constants.POSITIVE_CONVERTED);
                        await new PodioLogger().createLead({
                            "id": foundNumber.contact.id,
                            "firstname": foundNumber.contact.first_name,
                            "lastname": foundNumber.contact.last_name,
                            "propertyaddress": contact.property.address,
                            "county": contact.property.county,
                            "state": contact.property.state,
                            "apn": contact.property.apn,
                            "phonenumber": foundNumber.number
                        })
                    }
                }

                //create a message for the response
                const responseMessage = await this.smsService.create({
                    body: response,
                    status: Constants.SCHEDULED,
                    status_message: 'To be sent',
                    type: Constants.OUTGOING,
                    phone_number: foundNumber.id,
                    active: foundNumber.active
                });


                if (classification === 'negative') {
                    await this.phoneNumbersService.deactivateWithReason(foundNumber.id, Constants.NEGATIVE_RESPONSE);
                }

            }else{
                this.logger.log('No matching mnumber for recieved message')
            }

        } catch (error) {
            console.error(error);
        }
    }
}