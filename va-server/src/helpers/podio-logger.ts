import path = require('path');
import moment from 'moment';
import { Logger } from '@nestjs/common';
const Podio = require('podio-js').api;


export class PodioLogger {
    private logger = new Logger(PodioLogger.name);
    private podio: any;
    constructor() {
        this.podio = new Podio({
            authType: 'server',
            clientId: process.env.PODIO_CLIENT_ID,
            clientSecret: process.env.PODIO_CLIENT_SECRET
        });
    }

    async createLead(record: any) {
        this.podio.authenticateWithApp(process.env.PODIO_APP_ID, process.env.PODIO_APP_TOKEN, (err: any) => {
            if (err) throw new Error(err);
            this.podio.isAuthenticated().then(() => {
                this.podio.request('POST', `/item/app/${process.env.PODIO_APP_ID}`, {
                    "fields": {
                        "title": record['id'],
                        "firstname": record['firstname'],
                        "lastname": record['lastname'],
                        "propertyaddress": record['propertyaddress'],
                        "county": record['county'],
                        "state": record['state'],
                        "apn": record['apn'],
                        "phonenumber": [{ type: "work", value: record['phonenumber'] }]
                    }
                })
                    .then(async () => await new Promise(r => setTimeout(r, 2000)))
                    .catch((err: any) => console.log(err));

            }).catch((err: any) => console.log(err));
        });
    }
}