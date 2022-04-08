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
    name
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
      active
      created_at
    }
    created_at
    updated_at
  }
}

`;