import { Button, Container, Grid, IconButton, Typography } from '@mui/material'
import React from 'react'
import DownloadIcon from '@mui/icons-material/Download';

const FileUploadStatusCard = ({ csvFileUploadStatus }) => {
    return (
        <div className='w-96 border-2 border-gray-100 flex flex-col bg-white rounded-lg shadow-xl'>
            <Grid container justifyContent='space-between' alignItems='center'>
                <Grid item>
                    <Typography variant='subtitle2' fontWeight={600} className='text-gray-500' paddingX={2}>Fake CSV.csv</Typography>
                </Grid>
                <Grid item padding={1}>
                    <IconButton>
                        <DownloadIcon className='text-indigo-500' />
                    </IconButton>
                </Grid>

            </Grid>


            <div className="bg-gray-100 p-5 space-y-1">
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant='subtitle2' fontWeight={600} className='text-gray-500'>ID</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2' className='text-gray-500'>500</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant='subtitle2' fontWeight={600} className='text-gray-500'>Upload Date:</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2' className='text-gray-500'>March 23 2020</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant='subtitle2' fontWeight={600} className='text-gray-500'>Leads Discovered</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2' className='text-gray-500'>45</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant='subtitle2' fontWeight={600} className='text-gray-500'>Numbers Discovered</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2' className='text-gray-500'>45</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant='subtitle2' fontWeight={600} className='text-gray-500'>SMSs Created</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2' className='text-gray-500'>45</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant='subtitle2' fontWeight={600} className='text-gray-500'>Status</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2' className='text-gray-500'>Completed</Typography>
                    </Grid>
                </Grid>
            </div>

        </div>
    )
}

export default FileUploadStatusCard