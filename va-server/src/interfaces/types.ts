import { Field, GraphQLTimestamp, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Campaign } from "src/entities/campaign.entity";
import { Contact } from "../entities/contact.entity";

@InputType()
export class IContact {
    @Field(type => Int)
    id?: number

    @Field({ nullable: true })
    first_name?: string;

    @Field({ nullable: true })
    last_name?: string;

    @Field(type => [String!]!, { nullable: true })
    phone_numbers?: string[];

    @Field({ nullable: true })
    active?: boolean;

    @Field({ nullable: true })
    status?: string;

    @Field({ nullable: true })
    initital_message?: string;

    @Field(type => Int, { nullable: true })
    campaign_id?: number;

    @Field(type => Int, { nullable: true })
    property_id?: number;
}

@InputType()
export class IContactCreateObject extends IContact {
    @Field(type => Int, { nullable: true })
    id?: number

    @Field({ nullable: true })
    first_name: string;

    @Field({ nullable: true })
    last_name: string;

    @Field(type => [String!]!)
    phone_numbers: string[];

    @Field({ nullable: true })
    active?: boolean;

    @Field({ nullable: true })
    status?: string;

    @Field({ nullable: true })
    initital_message?: string;

    @Field(type => Int, { nullable: true })
    campaign_id?: number;

    @Field(type => Int, { nullable: true })
    property_id: number;
}

@InputType()
export class IContactUpdateObject extends IContact {
    @Field(type => Int)
    id: number;

    @Field({ nullable: true })
    active?: boolean;

    @Field({ nullable: true })
    status?: string;
}

export class IPhoneNumber {
    id?: number;
    number?: string;
    active?: boolean;
    remark?: string;
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
    
    @Field({ nullable: true })
    deactivation_reason?: string | null;
}


@InputType()
export class ICampaign {
    @Field(type => Int, { nullable: true })
    id?: number;

    @Field()
    title?: string;

    @Field()
    status?: string;

    @Field({ nullable: true })
    file_path?: string;

    @Field(type => Int, { nullable: true })
    success_count?: number;

    @Field(type => Int, { nullable: true })
    failed_count?: number;

    @Field(type => Int, { nullable: true })
    total_records?: number;

    @Field(type => Int, { nullable: true })
    duplicates_count?: number;
}


@InputType()
export class ICampaignCreateObject extends ICampaign {
    @Field()
    title: string;

    @Field()
    file_path: string;

    @Field()
    status: string;
}

@InputType()
export class ICampaignUpdateObject extends ICampaign {
    @Field(type => Int)
    id: number;
}


@InputType()
export class ISMSMessage {
    @Field(type => Int, { nullable: true })
    id?: number;

    @Field({ nullable: true })
    body?: string;

    @Field({ nullable: true })
    status?: string;

    @Field({ nullable: true })
    status_message?: string;

    @Field({ nullable: true })
    active?: Boolean;

    @Field({ nullable: true })
    classification?: string;

    @Field(type => Int, { nullable: true })
    phone_number?: number;

    @Field({ nullable: true })
    type?: string;
}

@InputType()
export class ISMSMessageCreateObject extends ISMSMessage {
    @Field()
    body: string;

    @Field()
    type: string;

    @Field()
    status: string;

    @Field({ nullable: true })
    status_message?: string;

    @Field()
    active: boolean;

    @Field(type => Int)
    phone_number: number;

    @Field({ nullable: true })
    classification?: string;
}

@InputType()
export class ISMSMessageUpdateObject extends ISMSMessage {
    @Field(type => Int)
    id: number;

    @Field({ nullable: true })
    body?: string;

    @Field({ nullable: true })
    status_message?: string;

    @Field({ nullable: true })
    status?: string;

    @Field({ nullable: true })
    active?: boolean;

    @Field(type => Int, { nullable: true })
    phone_number?: number;

    @Field({ nullable: true })
    type?: string;

    @Field({ nullable: true })
    classification?: string;
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

@InputType()
export class InitialMessage {
    @Field(type => Int, { nullable: true })
    id?: number;

    @Field()
    message?: string;
}

@InputType()
export class InitialMessageCreateObject extends InitialMessage {

    @Field()
    message: string;
}

@InputType()
export class InitialMessageUpdateObject extends InitialMessage {
    @Field(type => Int!)
    id: number;

    @Field()
    message: string;
}

@InputType()
export class IProperty {

    @Field(type => Int, { nullable: true })
    id?: number;

    @Field({ nullable: true })
    address?: string;

    @Field({ nullable: true })
    type?: string;

    @Field({ nullable: true })
    state?: string;

    @Field({ nullable: true })
    zip?: string;

    @Field({ nullable: true })
    county?: string;

    @Field({ nullable: true })
    apn?: string;

    @Field(type => GraphQLTimestamp, { nullable: true })
    created_at?: Date;

    @Field(type => GraphQLTimestamp, { nullable: true })
    updated_at?: Date;
}

@InputType()
export class IPropertyCreateObject extends IProperty {

    @Field()
    address: string;

    @Field()
    type: string;

    @Field()
    state: string;

    @Field()
    zip: string;

    @Field()
    county: string;

    @Field()
    apn: string;
}

@InputType()
export class IPropertyUpdateObject extends IProperty {
    @Field(type => Int!)
    id: number;
}

export type ProcessingConstraints = {
    recordsStatus: string;
    customMessage?: string;
    interval?: number;
    createMessages?: boolean;
};

export type CSVJobDescription = {
    file: Express.Multer.File,
    campaign: Campaign,
    constraints: ProcessingConstraints
};

export type ContactRecord = {
    firstname: string,
    lastname: string,
    phoneNumbers: string[],
    active?: boolean,
    initialMessage?: string
    propertyId?: number,
    campaignId: number
}

@ObjectType()
class Meta {
    @Field(type => Int)
    itemCount: number;
    @Field(type => Int)
    totalItems: number;
    @Field(type => Int)
    itemsPerPage: number;
    @Field(type => Int)
    totalPages: number;
    @Field(type => Int)
    currentPage: number;
}

@ObjectType()
class Links {
    @Field()
    first: string;
    @Field()
    previous: string;
    @Field()
    next: string;
    @Field()
    last: string;
}

@ObjectType()
export class PaginationResult {
    @Field(type => [Contact]!)
    items: Contact[];
    @Field(type => Meta!)
    meta: Meta;
    @Field(type => Links!)
    links: Links;
}