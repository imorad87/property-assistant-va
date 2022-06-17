import { Button, ButtonBase, DialogContentText, FormControlLabel, Grid, Switch, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
export default function BulkSMSDialog({ selectedContacts, handleClose, open }) {

    const [hasPlaceholders, setHasPlaceholders] = React.useState(false);

    const [messageActive, setMessageActive] = React.useState(false);

    const [placeholders, setPlaceholders] = React.useState<Array<string>>([]);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [message, setMessage] = React.useState('');


    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.currentTarget.value);
    };

    const resetAll = () => {
        setHasPlaceholders(false);
        setMessageActive(false);
        setPlaceholders([]);
        setMessage('');
    }

    React.useEffect(() => {
        setPlaceholders([]);

        if (message.includes('{firstname}')) {
            setPlaceholders(prev => [...prev, '{firstname}']);
            setHasPlaceholders(true);
        }

        if (message.includes('{lastname}')) {
            setHasPlaceholders(true);
            setPlaceholders(prev => [...prev, '{lastname}']);

        }

        if (message.includes('{address}')) {
            setHasPlaceholders(true);
            setPlaceholders(prev => [...prev, '{address}']);

        }

        if (message.includes('{apn}')) {
            setHasPlaceholders(true);
            setPlaceholders(prev => [...prev, '{apn}']);
        }

        if (placeholders.length <= 0) {
            setHasPlaceholders(false);
        }

    }, [message, placeholders.length]);

    const sendMessage = () => {

        axios.post(`${apiUrl}custom-sms`, {
            message,
            messageActive,
            selectedContacts
        })
            .then(res => res.data)
            .then(data => {
                enqueueSnackbar('Bulk SMS Sent', { variant: 'success' })
                resetAll();
                handleClose();
            })
            .catch(err => {
                enqueueSnackbar('Bulk SMS Sent', { variant: 'success' })
            })
    }

    return (
        <Grid container>
            <Dialog maxWidth='md' open={open} fullWidth>
                <DialogTitle>ٍCreate Custom SMS</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the custom sms in the text area below. You can use place holders for first name, last name, address and APN. Place holders values will be populated at send time with the coresponding value for each place holder
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="custom-message"
                        label="Custom Message"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={message}
                        onChange={handleMessageChange}
                        multiline
                        minRows={2}
                        helperText={placeholders.length ? 'Detected Variables: ' + placeholders.join(', ') : ''}
                    />

                    <Grid container justifyContent='space-between' alignItems='center'>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={hasPlaceholders}
                                    onChange={() => setHasPlaceholders(!hasPlaceholders)}
                                />
                            }
                            label={hasPlaceholders ? 'Has Variables' : 'No Variables'}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={messageActive}
                                    onChange={() => setMessageActive(!messageActive)}
                                />
                            }
                            label={messageActive ? 'Active' : 'Inactive'}
                        />
                    </Grid>
                    {/* <CustomMessageStepper activeStep={activeStep} setActiveStep={setActiveStep} selectedContacts={selectedContacts} setContactsList={setContactsList} /> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant='contained'>Cancel</Button>
                    <Button onClick={sendMessage} variant='contained' disabled={message === ''}>Send</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}
