import { PhoneNumber } from "../entities/phone-number.entity";
import { Contact } from "../entities/contact.entity";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

export class IContact {
    id?: number
    name?: string;
    phone_numbers?: string[];
    active?: boolean;
    status?: string;
}

export class IContactView extends IContact {
    id?: number
    name?: string;
    phone_numbers?: string[];
    active?: boolean;
    status?: string;
    campaign_id?: number;
    created_at?: Date;
    updated_at?: Date;
}

@InputType()
export class IContactCreateObject extends IContact {
    @Field(type => Int, { nullable: true })
    id?: number

    @Field()
    name: string;

    @Field(type => [String!]!)
    phone_numbers: string[];

    @Field({ nullable: true })
    active?: boolean;

    @Field({ nullable: true })
    status?: string;

    @Field(type => Int, { nullable: true })
    campaign_id?: number;
}

@InputType()
export class IContactUpdateObject extends IContact {
    @Field(type => Int)
    id: number;
}

export class IPhoneNumber {
    id?: number;
    number?: string;
    active?: boolean;
    remark?: string;
}

export class IPhoneNumberView extends IPhoneNumber {
    contact_id?: number;
    created_at?: Date;
    updated_at?: Date;
}

@InputType()
export class IPhoneNumberCreateObject extends IPhoneNumber {
    @Field()
    number: string;

    @Field(type => Int, { nullable: true })
    contact_id?: number;
}

@InputType()
export class IPhoneNumberUpdateObject extends IPhoneNumber {
    @Field(type => Int)
    id: number;

    @Field({ nullable: true })
    number?: string;

    @Field({ nullable: true })
    active?: boolean;

    @Field({ nullable: true })
    remark?: string;
}

export class ICampaign {
    id?: number;
    title?: string;
    leads_count?: number;
    phone_numbers_count?: number;
    active?: boolean;
    parsing_status?: string;
    file_path?: string;
    failed_count?: number;
    success_count?: number;
}

export class ICampaignView extends ICampaign {
    contacts?: Contact[]
    created_at?: Date;
    updated_at?: Date;
}

@InputType()
export class ICampaignCreateObject extends ICampaign {
    @Field()
    title: string;
    @Field(type => [String!]!)
    phone_numbers: string[];
}

@InputType()
export class ICampaignUpdateObject extends ICampaign {
    @Field(type => Int)
    id: number;
}


@InputType()
export class ISMSMessage {
    @Field(type => Int)
    id?: number;
    @Field()
    body?: string;
    @Field()
    status?: string;
    @Field(type => Int)
    phone_number?: number;
    @Field()
    type?: string;
}

export class ISMSMessageView extends ISMSMessage {
    created_at?: Date;
    updated_at?: Date;
}

@InputType()
export class ISMSMessageCreateObject extends ISMSMessage {
    @Field()
    body: string;

    @Field()
    type: string;

    @Field()
    status: string;

    @Field(type => Int)
    phone_number: number;
}

@InputType()
export class ISMSMessageUpdateObject extends ISMSMessage {
    @Field(type => Int)
    id: number;

    @Field()
    body?: string;

    @Field()
    status?: string;

    @Field(type => Int)
    phone_number?: number;

    @Field()
    type?: string;
}

@ObjectType()
export class ContactsStats {
    @Field(type => Int!)
    allContactsCount: number;

    @Field(type => Int!)
    leadsCount: number;

    @Field(type => Int!)
    convertedCount: number;

    @Field(type => Int!)
    pausedCount: number;

    @Field(type => Int!)
    activeCount: number;

}





