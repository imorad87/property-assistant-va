import { Button, Typography } from '@mui/material'
import React from 'react'
import AppLayout from '../components/layouts/AppLayout'
import LeadsDataTable from '../components/leads/LeadsDataTable'
import StatusCard from '../components/StatusCard'

const Leads = () => {
    return (
        <AppLayout header='Leads'>

            <div className="py-12 w-full">
                <div className="w-full mx-auto">
                    <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                        <div className="flex  gap-3 justify-around p-6 my-10 bg-white border-gray-200">
                            <StatusCard title='Leads' value={45} />
                            <StatusCard title='Converted' value={45} />
                            <StatusCard title='Paused' value={45} />
                            <StatusCard title='Deleted' value={45} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="w-full mx-auto">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <Typography variant='subtitle2' fontWeight={600} className='text-gray-500' padding={2}>Leads List</Typography>

                        <div className="flex  gap-3 justify-around p-6 my-10 bg-white border-b border-gray-200">
                            <LeadsDataTable />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Leads