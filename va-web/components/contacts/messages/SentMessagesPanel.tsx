import { Grid } from '@mui/material'
import React from 'react'
import SingleMessageCard from './SingleMessageCard'

const SentMessagesPanel = ({ messages }) => {
    return (
        <Grid container flexDirection='column' spacing={1}>
            {
                messages.map(message => {
                    if (message.status !== 'scheduled' && message.status !== 'queued' && message.status !== 'Send Failed') {
                        return (
                            <Grid item container flexDirection='row' justifyContent={message.type === 'incoming' ? 'flex-start' : 'flex-end'}>
                                <SingleMessageCard message={message} />
                            </Grid>
                        )
                    }
                })
            }
        </Grid>
    )
}

export default SentMessagesPanel