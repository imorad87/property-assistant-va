import { useMutation } from '@apollo/client';
import { PauseCircleFilledRounded, PlayArrowRounded, Restore, Send } from '@mui/icons-material';
import DeleteForeverRounded from '@mui/icons-material/DeleteForeverRounded';
import { Chip, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React from 'react';
import { REMOVE_NUMBER, UPDATE_PHONE_NUMBER } from '../../../lib/mutations';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const PhoneNumberInfoPanel = ({ numberInfo }) => {

    const [message, setMessage] = React.useState('');

    const { enqueueSnackbar } = useSnackbar();

    const [updateNumber] = useMutation(UPDATE_PHONE_NUMBER);
    const [removeNumber] = useMutation(REMOVE_NUMBER);


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
        }
    }

    const resetNumber = async () => {
        await updateNumber({
            variables: {
                input: {
                    id: numberInfo.id,
                    deactivation_reason: null
                }
            }
        })
    }
    const pauseNumber = async () => {
        await updateNumber({
            variables: {
                input: {
                    id: numberInfo.id,
                    active: false
                }
            }
        })
    }
    const resumeNumber = async () => {
        await updateNumber({
            variables: {
                input: {
                    id: numberInfo.id,
                    active: true
                }
            }
        })
    }
    const deleteNumber = async () => {
        await removeNumber({
            variables: {
                id: numberInfo.id
            }
        })
    }

    return (
        <Grid container direction='column' rowSpacing={2} width='100%'>
            <Grid container direction='column' rowSpacing={2} width='100%'>
                <Grid container item direction='row' xs={4} >
                    <Grid item xs={3}><Typography variant="body2" style={{ color: grey[700] }}>ID</Typography></Grid>
                    <Grid item xs={9}><Typography variant="body2" style={{ color: grey[700] }}>{numberInfo.id}</Typography></Grid>
                </Grid>
                <Grid container item direction='row' xs={4} >
                    <Grid item xs={3}><Typography variant="body2" style={{ color: grey[700] }}>Status</Typography></Grid>
                    <Grid item xs={9}>
                        {
                            numberInfo.active ? <PlayArrowRounded style={{ color: 'green' }} />
                                : <PauseCircleFilledRounded style={{ color: 'orange' }} />
                        }
                    </Grid>
                </Grid>
                <Grid container item direction='row' xs={4} >
                    <Grid item xs={3}><Typography variant="body2" style={{ color: grey[700] }}>#</Typography></Grid>
                    <Grid item xs={9}><Typography variant="body2" style={{ color: grey[700] }}>{numberInfo.number}</Typography></Grid>
                </Grid>
            </Grid>


            <Grid container direction='column' rowSpacing={8} width='100%'>
                <Grid container item direction='row' xs={12} alignItems='center' marginTop={5}>
                    <Grid item container justifySelf='flex-start' justifyContent='flex-start' xs={6}>
                        {numberInfo.deactivation_reason &&
                            <Chip label={numberInfo.deactivation_reason} color={numberInfo.deactivation_reason === 'negative-response' ? 'error' : numberInfo.deactivation_reason === 'positive-converted' ? 'success' : 'warning'} />
                        }
                    </Grid>
                    <Grid item container justifySelf='flex-end' justifyContent='flex-end' xs={6}>
                        <Tooltip title='Delete Number'>
                            <IconButton onClick={deleteNumber}>
                                <DeleteForeverRounded style={{ color: 'red' }} />
                            </IconButton>
                        </Tooltip>
                        <IconButton onClick={numberInfo.active ? pauseNumber : resumeNumber}>
                            {numberInfo.active ?
                                <Tooltip title='Pause Number'>
                                    <PauseCircleFilledRounded style={{ color: 'orange' }} />
                                </Tooltip> :
                                <Tooltip title='Resume Number'>
                                    <PlayArrowRounded style={{ color: 'green' }} />
                                </Tooltip>
                            }
                        </IconButton>
                        {numberInfo.deactivation_reason &&
                            <IconButton onClick={resetNumber}>
                                <Tooltip title='Reset'>
                                    <Restore style={{ color: 'orange' }} />
                                </Tooltip>
                            </IconButton>
                        }
                    </Grid>
                </Grid>

                <Grid container item direction='row' xs={12} justifyContent='space-between' alignItems='center' flexWrap='nowrap' spacing={1}>
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
            </Grid >
        </Grid >
    );
}

export default PhoneNumberInfoPanel