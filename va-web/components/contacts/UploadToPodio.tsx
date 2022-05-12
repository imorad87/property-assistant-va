import { Button, DialogContentText, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React from 'react';

export default function UploadToPodio({ contact, handleClose, open }) {


    const [selectedNumberId, setSelectedNumberId] = React.useState<number>(0);

    const { enqueueSnackbar} = useSnackbar();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedNumberId(parseInt(e.currentTarget.value));
    };

    const resetAll = () => {
        setSelectedNumberId(0);
    }

    const uploadToPodio = async () => {
        const res = await axios.post(process.env.NEXT_PUBLIC_API_URL + 'podio', {
            contactId: contact.id,
            selectedNumberId
        });
        handleClose();
        enqueueSnackbar('Contact Converted', { variant: 'success' });
        resetAll();
    }

    return (
        <Grid container>
            <Dialog maxWidth='md' open={open} fullWidth>
                <DialogTitle>ٍCreate Custom SMS</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select the number to upload
                    </DialogContentText>
                    <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group">Phone Numbers</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={selectedNumberId}
                            onChange={handleChange}
                        >
                            {contact.phone_numbers.map(n => <FormControlLabel value={n.id} control={<Radio />} label={n.number} />)}
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant='contained'>Cancel</Button>
                    <Button onClick={uploadToPodio} variant='contained' disabled={!selectedNumberId}>Upload</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}
