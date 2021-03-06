import { gql } from "@apollo/client";

export const CONTACTS_PAGE_QUERY = gql`
query GetAllContacts($page: Int!, $limit: Int!, $filters: FilterStatus!) {
  getAllContacts(page: $page, limit: $limit, filters:$filters) {
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

export const NOT_RESPONDED_QUERY = gql`
query notResponded {
  getNotRespondedMessages {
    id
    created_at
    type
    phone_number {
      id
      contact {
        id
        property {
          id
          address
          type
          state
          apn
          zip
          county
          contacts {
            id
            last_name
            first_name
            phone_numbers {
              id
              number
              messages {
                id
                body
                status
                active
                type
                classification
                status_message
                created_at
              }
              contact {
                id
                active
                status
                first_name
                last_name
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
                  apn
                  zip
                  county
                }
              }
            }
          }
        }
      }
    }
  }
}

`;

export const SEARCH_NUMBERS = gql`
query SearchNumbers($page: Int!, $limit: Int!, $filters: FilterStatus) {
  searchNumbers(page: $page, limit: $limit, filters: $filters) {
    items {
      id
      number
      active
      deactivation_reason
      contact {
        id
        first_name
        last_name
        campaign {
          id
          title
        }
      }
      messagesCount
      messages {
        id
        body
        status
      }
    }
    meta {
      totalItems
      itemsPerPage
      totalPages
      currentPage
      itemCount
    }
  }
}

`;
