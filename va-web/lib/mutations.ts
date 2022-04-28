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
  activateAllMessages(id: $id)
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
  deactivateAllMessages(id: $id)
}
`;
export const UPDATE_CAMPAIGN_MUTATION = gql`
   mutation UpdateCampaign($input: ICampaignUpdateObject!) {
  updateCampaign(input: $input) {
    id
  }
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



