import { UploadFileRounded } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { Checkbox, FormControl, FormControlLabel, FormLabel, Grid, GridProps, IconButton, Radio, RadioGroup, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { SyntheticEvent, useState } from 'react';
import CreateCustomMessage from './CreateCustomMessage';
import CustomMessageView from './CustomMessageView';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
};

const Container = ({ children, ...props }: GridProps) => (<Grid container {...props}>{children}</Grid>);
const Item = ({ children, ...props }: GridProps) => (<Grid item {...props}>{children}</Grid>);

export default function CreateCampaignModal({ isOpen, handleClose }) {

    const { enqueueSnackbar } = useSnackbar()

    const [customMessage, setCustomMessage] = React.useState('');

    const initialFile: any = null;

    const [file, setFile] = useState(initialFile);

    const [createMessages, setCreateMessages] = React.useState(true);

    const [showLoader, setShowLoader] = React.useState(false);

    const [showAlert, setShowAlert] = React.useState(false);

    const [title, setTitle] = React.useState('islam');

    const [customMessageEnabled, setCustomMessageEnabled] = React.useState(false);

    const [msgInterval, setMsgInterval] = React.useState(100);

    const [fileName, setFileName] = React.useState();

    const [campaignStatus, setCampaignStatus] = React.useState('all-active');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

    const resetState = () => {
        setCustomMessage('');
        setFile(null);
        setShowLoader(false);
        setShowAlert(false);
        setTitle('');
        setCustomMessageEnabled(false);
        setMsgInterval(100);
        setFileName(undefined);
        setCampaignStatus('all-active');
        setCreateMessages(true);
    }

    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setFile(file);
            setFileName(file.name);
        }
    };

    const handleCampaignStatus = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setCampaignStatus(value);
    };

    const handleReplaceMessage = () => {
        setCustomMessage('');
        setCustomMessageEnabled(false);
        setMsgInterval(100);
    };

    const submit = (e: SyntheticEvent) => {
        e.preventDefault();

        setShowLoader(true);

        if (!file || file.type != 'text/csv') {
            enqueueSnackbar('Please select a CSV file', { variant: 'error' })
            setShowLoader(false);
            return;
        }

        const body = new FormData();
        body.append('campaignStatus', campaignStatus);
        body.append('title', title);
        body.append("file", file!);
        body.append("interval", `${msgInterval}`);
        body.append("customMessageEnabled", `${customMessageEnabled}`);
        body.append("customMessage", `${customMessage}`);
        body.append("createMessages", `${createMessages}`);

        axios
            .post(`${apiUrl}upload`, body)
            .then(res => res.data)
            .then(data => {
                enqueueSnackbar('File Uploaded Succesfully. Processing...', { variant: 'success' })
                setShowLoader(false);
                resetState();
                handleClose();
            })
            .catch(err => {
                enqueueSnackbar(err.message, { variant: 'error' })
                resetState();
            });
    }

    const Input = styled('input')({
        display: 'none',
    });

    const handleTitleChange = (e) => {
        setTitle(e.currentTarget.value);
    };


    const handleCreateMessageChange = (e) => {
        setCreateMessages(prev => !prev);
        if (customMessageEnabled) {
            setCustomMessageEnabled(false);
        }
    };

    const handleIntervalChange = (e) => {
        setMsgInterval(e.currentTarget.value);
    };

    const handleCustomMessageEnabled = (e) => {
        if (customMessageEnabled) {
            setCustomMessageEnabled(false);
            setCustomMessage('');
            setMsgInterval(100);

        } else {
            setCustomMessageEnabled(true);
            setMsgInterval(0);
        }
    };

    const handleCustomMessage = (message) => {
        setCustomMessage(message);

        if (message === '') {
            setCustomMessageEnabled(false);
        } else {
            setCustomMessageEnabled(true);
        }
    }

    return (
        <div>
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <Grid container justifyContent='end'>
                        <Grid item>
                            <IconButton onClick={handleClose}>
                                <CloseIcon color='primary' />
                            </IconButton>
                        </Grid>
                    </Grid>

                    <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                        <div className="flex flex-col p-6 bg-white border-b border-gray-200 ">
                            <div className='text-gray-500 font-bold text-left w-full mb-5'>New Campaign</div>
                            <form onSubmit={submit}>
                                <div className="flex gap-3 flex-col">
                                    <Container spacing={1}>
                                        <Item flexGrow={1}>
                                            <TextField
                                                id="title"
                                                label="Title"
                                                placeholder='enter campaign title'
                                                required
                                                variant="outlined"
                                                value={title}
                                                onChange={handleTitleChange}
                                                fullWidth
                                                focused
                                            />

                                        </Item>
                                        <Item flexShrink={1}>
                                            <TextField
                                                id="interval"
                                                label="Intital Messages Interval"
                                                type="number"
                                                onChange={handleIntervalChange}
                                                value={customMessageEnabled ? '0' : msgInterval}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                disabled={customMessageEnabled}
                                            />
                                        </Item>
                                    </Container>

                                    <FormControl>
                                        <FormLabel id="active">Campaign Status</FormLabel>
                                        <RadioGroup
                                            aria-labelledby="ampaign-active-status"
                                            defaultValue={campaignStatus}
                                            name="radio-buttons-group"
                                            onChange={handleCampaignStatus}
                                            row
                                        >
                                            <FormControlLabel value="all-active" control={<Radio />} label="All Active" />
                                            <FormControlLabel value="all-inactive" control={<Radio />} label="All Inactive" />
                                            <FormControlLabel value="from-input" control={<Radio />} label="Detect from input" />
                                        </RadioGroup>
                                    </FormControl>

                                    <FormControlLabel control={<Checkbox checked={createMessages} onChange={handleCreateMessageChange} />} label="Create initital messages?" />

                                    <FormControlLabel control={<Checkbox checked={customMessageEnabled} onChange={handleCustomMessageEnabled} disabled={!createMessages} />} label="Custom Message?" />

                                    {
                                        customMessageEnabled && customMessage === '' ? <CreateCustomMessage setMessage={handleCustomMessage} /> : <CustomMessageView message={customMessage} replaceMessage={handleReplaceMessage} />

                                    }

                                    <label htmlFor="file">
                                        <Grid container spacing={2}>
                                            <Grid item flexGrow={1}>
                                                {
                                                    fileName && <TextField
                                                        name='filename'
                                                        fullWidth
                                                        variant="standard"
                                                        value={fileName}
                                                        disabled
                                                    />
                                                }
                                            </Grid>
                                            <Grid item>
                                                <Input accept="text/csv" id="file" type="file" onChange={uploadToClient} />
                                                <IconButton color="primary" aria-label="upload picture" component="span" size='large'>
                                                    <UploadFileRounded color='primary' />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </label>

                                    <LoadingButton
                                        size="small"
                                        endIcon={<SendIcon />}
                                        loading={showLoader}
                                        loadingPosition="end"
                                        variant="contained"
                                        type='submit'
                                        disabled={!title || !file}
                                    >
                                        Upload
                                    </LoadingButton>
                             
                                </div>
                            </form>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
