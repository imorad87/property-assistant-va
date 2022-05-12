import { gql } from "@apollo/client";

export const CONTACTS_PAGE_QUERY = gql`
query GetAllContacts($page: Int!, $limit: Int!, $search: String!) {
  getAllContacts(page: $page, limit: $limit, search:$search) {
    meta {
      itemCount
      totalItems
      itemsPerPage
      totalPages
      currentPage
    }
    
    items {
      id
      first_name
      last_name
      active
      status
      phone_numbers {
        id
        number
        active
        number_base10
        deactivation_reason
        remark
        messages {
          id
          body
          status
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
  contactsStats {
    allContactsCount
    leadsCount
    convertedCount
    pausedCount
    activeCount
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
      number_base10
      active
      deactivation_reason
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
      contact{
        id
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

export const INITIAL_MESSAGES_PAGE = gql`
query initialMessages {
  getAllInitialMessage {
    id
    message
  }
}
`;