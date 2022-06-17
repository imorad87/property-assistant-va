import { useQuery } from '@apollo/client'
import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import AppLayout from '../../components/layouts/AppLayout'
import LeadsDataTableTest from '../../components/leads/LeadsDataTableTest'
import LeadsDataTable from '../../components/leads/LeadsDataTable'
import StatusCard from '../../components/StatusCard'
import { CONTACTS_PAGE_QUERY } from '../../lib/queries'
import ContactsFilters from '../../components/contacts/ContactsFilters'

const Contacts = () => {



    const [totalCount, setTotalCount] = React.useState(0)
    const [activeCount, setActiveCount] = React.useState(0)
    const [pausedCount, setPausedCount] = React.useState(0)
    const [convertedCount, setConvertedCount] = React.useState(0)

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error :( {JSON.stringify(error, null, 2)}</p>;


    interface FilterStatus {
        name?: string,
        converted?: boolean,
        leads?: boolean,
        active?: boolean,
        inactive: boolean,
        unknownResponse?: boolean,
        negativeResponse?: boolean,
        noConversation?: boolean,
        phoneNumber?: string,

    }


    const [filters, setFilters] = useState<FilterStatus>({
        name: '',
        phoneNumber: '',
        converted: false,
        leads: false,
        active: false,
        inactive: false,
        unknownResponse: false,
        negativeResponse: false,
        noConversation: false,
    });

    return (
        <AppLayout header='Contacts' >
            <div className="py-12 w-full">
                <div className="w-full mx-auto">
                    <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                        <div className="flex  gap-3 justify-around p-6 my-10 bg-white border-gray-200">
                            <StatusCard title='All Contacts' value={totalCount} />
                            <StatusCard title='Active' value={activeCount} />
                            <StatusCard title='Paused' value={pausedCount} />
                            <StatusCard title='Converted' value={convertedCount} />
                        </div>
                    </div>
                </div>
            </div>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, height: 800 }}>
                <ContactsFilters filters={filters} setFilters={setFilters} />
                <LeadsDataTable setTotalCount={setTotalCount} setActiveCount={setActiveCount} setPausedCount={setPausedCount} setConvertedCount={setConvertedCount} filters={filters} />
            </Box>
        </AppLayout>
    )
}

export default Contacts