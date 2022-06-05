import { Grid } from '@mui/material';
import React from 'react'
import ScheduledMessagesDataTable from './ScheduledMessagesDataTable';

const ScheduledMessagesPanel = ({ phoneNumber }) => {

    const filterMessages = () => {
        return phoneNumber.messages.filter(message => (message.status === 'scheduled' || message.status === 'queued' || message.status.includes('Failed')));
    }

    return (

        <Grid container sx={{ width: '100%', minHeight: 500 }}>
            <ScheduledMessagesDataTable messages={filterMessages()} />
        </Grid >

    )
}

export default ScheduledMessagesPanel