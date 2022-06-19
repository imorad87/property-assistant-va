import { Send } from '@mui/icons-material';
import { Grid, TextField, IconButton } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React from 'react';
import SingleMessageCard from './SingleMessageCard';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const SentMessagesPanel = ({ messages, numberInfo }) => {

    const { enqueueSnackbar } = useSnackbar();


    const [message, setMessage] = React.useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.currentTarget.value);
    }
    const sendMessage = async () => {
        try {
            const res = await axios.post(`${apiUrl!}custom-sms-single`, {
                message,
                selectedContacts: [numberInfo.contact.id],
                messageActive: true,
                manualMessage: true,
                numberId: numberInfo.id
            });
            enqueueSnackbar('Custom Message Sent', {
                variant: 'success'
            });
            setMessage('');
        } catch (err) {
            enqueueSnackbar('Failed to send custom message', {
                variant: 'error'
            });
            console.log(err);

        }
    }
    return (
        <Grid container flexDirection='column' spacing={1} justifyContent='center' alignItems='center' height='100%' flexGrow={1}>
            {/* {JSON.stringify(numberInfo)} */}
            <Grid container item overflow='auto' maxHeight={750}>
                {
                    messages.map(message => {
                        if (message.status !== 'scheduled' && message.status !== 'queued' && message.status !== 'Send Failed') {
                            return (
                                <Grid item container flexDirection='row' justifyContent={message.type === 'incoming' ? 'flex-start' : 'flex-end'} marginY={1}>
                                    <SingleMessageCard message={message} />
                                </Grid>
                            )
                        }
                    })
                }


            </Grid>
            <Grid container item flexDirection='row' justifyContent='space-between' alignItems='center' flexWrap='nowrap' spacing={1} marginTop={5} sx={{ justifySelf: 'flex-start' }}>
                <TextField
                    autoFocus
                    label='Custom Message'
                    placeholder='enter your message here'
                    value={message}
                    fullWidth
                    variant='outlined'
                    onChange={handleChange}
                />
                <IconButton onClick={sendMessage}>
                    <Send color='primary' />
                </IconButton>
            </Grid>
        </Grid>
    )
}

export default SentMessagesPanel