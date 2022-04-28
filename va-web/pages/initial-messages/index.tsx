import { useQuery } from '@apollo/client'
import { Typography } from '@mui/material'
import React from 'react'
import AppLayout from '../../components/layouts/AppLayout'
import LeadsDataTable from '../../components/leads/LeadsDataTable'
import StatusCard from '../../components/StatusCard'
import { CONTACTS_PAGE_QUERY } from '../../lib/queries'

const InitialMessages = () => {

    // const { loading, error, data } = useQuery(CONTACTS_PAGE_QUERY, {
    //     pollInterval: 1000,
    // });

    // if (loading) return <p>Loading...</p>;

    // if (error) return <p>Error :(</p>;

    return (
        <AppLayout header='Initial Messages'>
            <div className="py-12 w-full">
                <div className="w-full mx-auto">
                    <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                        <div className="flex  gap-3 justify-around p-6 my-10 bg-white border-gray-200">
                            
                        </div>
                    </div>
                </div>
            </div>

        </AppLayout>
    )
}

export default InitialMessages;