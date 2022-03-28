import type { NextPage } from 'next'
import AppLayout from '../components/layouts/AppLayout'
import axios from 'axios'
import { SyntheticEvent, useState } from 'react'
import FileUploadStatusCard from '../components/FileUploadStatusCard'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Home: NextPage = () => {

  const initialFile = null;

  const [file, setFile] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');



  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setFile(i);
    }
  };

  const submit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!file || file.type !== 'text/csv') {
      setOpen(true);
      setMessage('Please select a CSV file')
      setSeverity('error')
      return;
    }

    const body = new FormData();
    body.append("file", file!);


    axios
      .post('http://localhost:3001/upload', body)
      .then(res => res.data)
      .then(data => {
        setOpen(true);
        setMessage('File Uploaded Succesfully. Processing...')
        setSeverity('success')
      })
      .catch(err => {
        setOpen(true);
        setMessage(err.message)
        setSeverity('error')
      });
  }


  return (
    <AppLayout header='Dashboard'>
      <div className="py-12 w-full">
        <div className="w-full mx-auto">
          <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
            <div className="flex flex-col p-6 bg-white border-b border-gray-200 items-center">
              <form onSubmit={submit}>
                <div className="flex gap-3 justify-between items-center">
                  <label htmlFor="file">Upload CSV File:</label>
                  <input type="file" name="file" id="file" onChange={uploadToClient} />
                  <Button variant="outlined" color="secondary" type='submit'>
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>


      <div className="w-full mx-auto">
        <div className="bg-white overflow-hidden shadow-2xl sm:rounded-lg">
          <Typography variant="subtitle1" padding={3} className='text-gray-500' fontWeight={600}>File Uploads</Typography>
          <div className="grid grid-cols-3 gap-10 py-12 px-5 bg-gray-50 justify-items-center">
            <FileUploadStatusCard csvFileUploadStatus={false} />
            <FileUploadStatusCard csvFileUploadStatus={false} />
            <FileUploadStatusCard csvFileUploadStatus={false} />
            <FileUploadStatusCard csvFileUploadStatus={false} />
            <FileUploadStatusCard csvFileUploadStatus={false} />
            <FileUploadStatusCard csvFileUploadStatus={false} />
          </div>

        </div>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </AppLayout>
  )
}






export default Home
