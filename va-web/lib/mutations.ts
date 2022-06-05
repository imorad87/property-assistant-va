import { gql } from "@apollo/client";

export const ACTIVATE_CONTACT = gql`
  mutation Mutation($input: IContactUpdateObject!, $id: Int!) {
  updateContact(input: $input) {
    active
    phone_numbers {
      active
    }
  }
  activateAllNumbers(id: $id)
}
`;

export const UPDATE_CONTACT = gql`
mutation UpdateContact($input: IContactUpdateObject!) {
  updateContact(input: $input) {
    id
  }
}
`;
export const DEACTIVATE_CONTACT = gql`
  mutation Mutation($input: IContactUpdateObject!, $id: Int!) {
  updateContact(input: $input) {
    active
    phone_numbers {
      active
    }
  }
  deactivateAllNumbers(id: $id)
}
`;
export const ACTIVATE_CONTACTS = gql`
  mutation Mutation($ids: [Int!]!) {
  activateManyContacts(ids: $ids)
}
`;

export const DEACTIVATE_CONTACTS = gql`
  mutation Mutation($ids: [Int!]!) {
  deactivateManyContacts(ids: $ids)
}
`;
export const UPDATE_CAMPAIGN_MUTATION = gql`
   mutation UpdateCampaign($input: ICampaignUpdateObject!) {
  updateCampaign(input: $input) {
    id
  }
}
`;


export const REMOVE_MANY_CONTACTS = gql`
mutation RemoveManyContacts($ids: [Int!]!) {
  removeManyContacts(ids: $ids)
}
`;

export const CREATE_INTIAL_MESSAGE_MUTATION = gql`
mutation CreateInitialMessage($input: InitialMessageCreateObject!) {
  createInitialMessage(input: $input) {
    id
    message
    created_at
    updated_at
  }
}
`;
export const REMOVE_NUMBER = gql`
mutation RemovePhoneNumber($id: Int!) {
  removePhoneNumber(id: $id)
}
`;
export const REMOVE_INITIAL_MESSAGE = gql`
mutation Mutation($id: Int!) {
  removeInitialMessage(id: $id)
}
`;
export const UPDATE_INITIAL_MESSAGE = gql`
mutation UpdateInitialMessage($input: InitialMessageUpdateObject!) {
  updateInitialMessage(input: $input) {
    id
    message
  }
}
`;
export const UPDATE_PHONE_NUMBER = gql`
mutation UpdatePhoneNumber($input: IPhoneNumberUpdateObject!) {
  updatePhoneNumber(updatePhoneNumberInput: $input) {
    id
    number
  }
}
`;
export const UPDATE_SMS = gql`
mutation Mutation($input: ISMSMessageUpdateObject!) {
  updateMessage(input: $input) {
  id  
  }
}
`;
export const DELETE_SMS = gql`
mutation($id: Int!){
  removeMessage(id:$id)
}
`;



