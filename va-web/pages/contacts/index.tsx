import { useQuery } from '@apollo/client'
import { Typography } from '@mui/material'
import React from 'react'
import AppLayout from '../../components/layouts/AppLayout'
import LeadsDataTable from '../../components/leads/LeadsDataTable'
import StatusCard from '../../components/StatusCard'
import { CONTACTS_PAGE_QUERY } from '../../lib/queries'

const Contacts = () => {



    const [totalCount, setTotalCount] = React.useState(0)
    const [activeCount, setActiveCount] = React.useState(0)
    const [pausedCount, setPausedCount] = React.useState(0)
    const [convertedCount, setConvertedCount] = React.useState(0)

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error :( {JSON.stringify(error, null, 2)}</p>;



    return (
        <AppLayout header='Contacts'>
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
            <div className="w-full">
                <div className="w-full mx-auto">
                    <div className="bg-white overflow-hidden shadow-xl border-b-2 border-gray-50 sm:rounded-lg">
                        <Typography variant='subtitle2' fontWeight={600} className='text-gray-500' padding={2}>Leads List</Typography>
                    </div>
                    <div className="flex  gap-3 justify-around p-6 bg-white border-b border-gray-200">
                        <LeadsDataTable setTotalCount={setTotalCount} setActiveCount={setActiveCount} setPausedCount={setPausedCount} setConvertedCount={setConvertedCount} />
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Contacts