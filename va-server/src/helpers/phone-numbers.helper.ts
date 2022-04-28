import { SMSMessage } from "src/entities/sms-message.entity";
import { PhoneNumber } from "../entities/phone-number.entity";

export class PhoneNumbersHelper {

    static stringArrayToPhoneNumbers(numbers: string[], initialMessage: string, messageActive = false) {
        const phoneNumbers: PhoneNumber[] = [];
        if (numbers) {
            numbers.forEach(n => {
                const message = new SMSMessage()
                message.active = messageActive;
                message.body = initialMessage;
                // message.phone_number = newNumber;

                const newNumber = new PhoneNumber();
                newNumber.number = n;
                newNumber.messages = [
                    message
                ];

                phoneNumbers.push(newNumber);
            });
        }
        return phoneNumbers;
    }
}