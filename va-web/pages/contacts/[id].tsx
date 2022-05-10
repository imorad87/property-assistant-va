import { useMutation, useQuery } from '@apollo/client'
import ChatIcon from '@mui/icons-material/Chat'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import { Grid, IconButton, Tooltip } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import React from 'react'
import CampaignInfoCard from '../../components/campaigns/CampaignCard'
import ContactCard from '../../components/contacts/ContactCard'
import PhoneNumbersPanel from '../../components/contacts/PhoneNumbersPanel'
import PropertyInfoCard from '../../components/contacts/PropertyInfoCard'
import AppLayout from '../../components/layouts/AppLayout'
import { ACTIVATE_CONTACT, DEACTIVATE_CONTACT } from '../../lib/mutations'
import { CONTACT_DETAIL_QUERY } from '../../lib/queries'

const Contact = () => {

    const router = useRouter()

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const { id } = router.query

    const { loading, error, data } = useQuery(CONTACT_DETAIL_QUERY, {
        variables: { findContactId: parseInt(id as string) },
        pollInterval: 1000,
    });

    const [activateContact, activateStatus] = useMutation(ACTIVATE_CONTACT);

    const [deactivateContact, deactivateStatus] = useMutation(DEACTIVATE_CONTACT);

    const c: any = {};

    if (loading) return <div>Loading....</div>

    if (!id || error || activateStatus.error || deactivateStatus.error) return <div>Something went wrong. Error.</div>

    const pauseContact = async () => {
        const { data, errors } = await deactivateContact({
            variables: {
                input: {
                    id: parseInt(id as string),
                    active: false
                },
                id: parseInt(id as string),
            }
        })

        if (data) {
            enqueueSnackbar('Contact Paused', { variant: 'success' })
        }
        
        if (errors) {
            enqueueSnackbar('Cannot deactivate', { variant: 'error' })
        }
    }

    const resumeContact = async () => {
        const { data, errors } = await activateContact({
            variables: {
                input: {
                    id: parseInt(id as string),
                    active: true
                },
                id: parseInt(id as string),
            }
        })
        if (data) {
            enqueueSnackbar('Contact Resumed', { variant: 'success' })
        }
        if (errors) {
            enqueueSnackbar('Cannot reactivate', { variant: 'error' })
        }
       
    }

    return (
        <AppLayout header={data.findContact.first_name + " " + data.findContact.last_name}>
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <div className="py-6 w-full">
                        <div className="w-full mx-auto">
                            <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                                <div className="flex flex-col p-6 bg-white border-b border-gray-200 ">
                                    <div className='text-gray-500 font-bold text-left w-full'><ChatIcon /> Numbers</div>
                                </div>
                                <div className="bg-gray-50">
                                    <PhoneNumbersPanel phoneNumbers={data.findContact.phone_numbers} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>

                <Grid item xs={3}>
                    <div className="py-6 w-full">
                        <div className="w-full mx-auto">
                            <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                                <div className="flex p-6 items-center justify-between bg-white border-b border-gray-200 ">
                                    <div className='text-gray-500 font-bold text-left w-full'>Contact Information</div>
                                    <div className='flex'>
                                        <Tooltip title={data.findContact.active ? 'Pause' : 'Resume'}>
                                            <IconButton onClick={data.findContact.active ? pauseContact : resumeContact}>
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
                                    <ContactCard contactInfo={data.findContact} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="py-6 w-full">
                        <div className="w-full mx-auto">
                            <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                                <div className="flex p-6 items-center justify-between bg-white border-b border-gray-200 ">
                                    <div className='text-gray-500 font-bold text-left w-full'>Property Information</div>
                                </div>
                                <div className='p-6 bg-gray-50'>
                                    <PropertyInfoCard propertyInfo={data.findContact.property} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" py-6 w-full">
                        <div className="w-full mx-auto">
                            <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                                <div className="flex p-6 items-center justify-between bg-white border-b border-gray-200 ">
                                    <div className='text-gray-500 font-bold text-left w-full'>Campaign Information</div>
                                </div>
                                <div className='p-6 bg-gray-50'>
                                    <CampaignInfoCard campaignInfo={data.findContact.campaign} />
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