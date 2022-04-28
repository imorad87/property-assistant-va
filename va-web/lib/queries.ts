import { gql } from "@apollo/client";

export const CONTACTS_PAGE_QUERY = gql`
query ContactsStats {
  contactsStats {
    allContactsCount
    leadsCount
    convertedCount
    pausedCount
    activeCount
  }
  getAllContacts {
    id
    first_name
    last_name
    active
    status
    phone_numbers {
      id
      number
      active
      remark
      messages {
        id
        body
        status
        status_message
        classification
        type
        created_at
        updated_at
      }
      created_at
      updated_at
    }
    campaign {
      id
      title
      status
      created_at
    }
    created_at
    updated_at
  }
}
`;

export const CONTACT_DETAIL_QUERY = gql`
query FindContact($findContactId: Int!) {
  findContact(id: $findContactId) {
    id
    first_name
    last_name
    active
    status
    phone_numbers {
      id
      number
      active
      remark
      messages {
        id
        body
        status
        active
        classification
        status_message
        type
        created_at
        updated_at
      }
    }
    campaign {
      id
      title
      status
    }
    property {
      id
      address
      type
      state
      zip
      county
    }
  }
}
`;

export const GET_ALL_CAMPAIGNS = gql`
query GetAllCampaigns {
  getAllCampaigns {
    id
    title
    total_records
    duplicates_count
    phone_numbers_count
    status
    parsing_status
    file_path
    failed_count
    success_count
    created_at
    updated_at
  }
}
`;
export const GET_ALL_Initial_MESSAGES = gql`
query GetAllInitialMessage {
  getAllInitialMessage {
    id
    message
    created_at
    updated_at
  }
}
`;
export const SEARCH_INITIAL_MESSAGE = gql`
query SearchInitialMessages($body: String!) {
  searchInitialMessages(body: $body) {
    id
    message
    created_at
    updated_at
  }
}
`;