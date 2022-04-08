import { gql, useQuery } from '@apollo/client'
import ChatIcon from '@mui/icons-material/Chat'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import { Grid, IconButton, Tooltip } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import ContactCard from '../../components/contacts/ContactCard'
import PhoneNumbersPanel from '../../components/contacts/PhoneNumbersPanel'
import AppLayout from '../../components/layouts/AppLayout'

const Contact = () => {


    const router = useRouter()
    const { id } = router.query

    const contactQuery = gql`
    query FindContact($findContactId: Int!) {
                findContact(id: $findContactId) {
                    id
                    name
                    active
                    status
                    phone_numbers {
                    id
                    number
                    active
                    remark
                    }
                    # campaign {
                    # id
                    # title
                    # active
                    # }
                }
            }
    `;


    const { loading, error, data } = useQuery(contactQuery, {
        variables: { findContactId: parseInt(id as string) },
        pollInterval: 5000,

    });



    if (loading) return <div>Loading....</div>

    if (error) return <div>Something went wrong. Error.</div>




    return (
        <AppLayout header={data.findContact.name}>
            <Grid container spacing={2}>
                <Grid item xs={8}>

                    <div className="py-12 w-full">
                        <div className="w-full mx-auto">
                            <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                                <div className="flex flex-col p-6 bg-white border-b border-gray-200 ">
                                    <div className='text-gray-500 font-bold text-left w-full'><ChatIcon /> Conversations</div>
                                </div>
                                <div className="bg-gray-50">
                                    <PhoneNumbersPanel phoneNumbers={data.findContact.phone_numbers} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>

                <Grid item xs={4}>
                    <div className="py-12 w-full">
                        <div className="w-full mx-auto">
                            <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                                <div className="flex p-6 items-center justify-between bg-white border-b border-gray-200 ">
                                    <div className='text-gray-500 font-bold text-left w-full'>Contact Information</div>
                                    <div className='flex'>
                                        <Tooltip title={data.findContact.active ? 'Pause' : 'Resume'}>
                                            <IconButton>
                                                {data.findContact.active ? <PauseCircleFilledRoundedIcon style={{ color: 'orange' }} /> : <PlayArrowRoundedIcon />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Delete Contact'>
                                            <IconButton>
                                                <DeleteForeverRoundedIcon style={{ color: 'red' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                                <div className='p-6 bg-gray-50'>
                                    <ContactCard contactInfo={data} />
                                </div>
                            </div>
                        </div>
                    </div>

                </Grid>
            </Grid>


        </AppLayout>
    )
}

export default Contact