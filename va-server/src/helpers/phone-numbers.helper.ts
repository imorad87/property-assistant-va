import { PhoneNumber } from "../entities/phone-number.entity";

export class PhoneNumbersHelper {

    static stringArrayToPhoneNumbers(numbers: string[]) {
        const phoneNumbers: PhoneNumber[] = [];
        if (numbers) {
            numbers.forEach(n => {
                const newNumber = new PhoneNumber();
                newNumber.number = n;
                phoneNumbers.push(newNumber);
            });
        }
        return phoneNumbers;
    }
}