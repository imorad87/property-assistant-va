import { Grid } from '@mui/material';
import React from 'react'
import ScheduledMessagesDataTable from './ScheduledMessagesDataTable';

const ScheduledMessagesPanel = ({ messages }) => {
    const [allMessages] = React.useState(messages);

    const filterMessages = () => {
        return allMessages.filter(message => (message.status === 'scheduled' || message.status === 'queued' || message.status === 'failed'));
    }

    return (
        <Grid container sx={{ width: '100%', minHeight: 500 }}>
            <ScheduledMessagesDataTable messages={filterMessages()} />
        </Grid >
    )
}

export default ScheduledMessagesPanel