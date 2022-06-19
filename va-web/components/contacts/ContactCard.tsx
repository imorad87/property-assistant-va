import { Chip, Grid, Tooltip, Typography } from '@mui/material'
import React from 'react'
import AlbumRoundedIcon from '@mui/icons-material/AlbumRounded';
import { grey } from '@mui/material/colors';

const ContactCard = ({ contactInfo }) => {

    const { first_name, last_name, active, status, id } = contactInfo;

    return (
        <Grid container direction='column' rowSpacing={2} >
            <Grid container item direction='row' xs={4} >
                <Grid item xs={4}><Typography variant="body2" style={{ color: grey[700] }}>ID</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2" style={{ color: grey[700] }}>{id}</Typography></Grid>
            </Grid>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={4}><Typography variant="body2" style={{ color: grey[700] }}>Active</Typography></Grid>
                <Grid item xs={8}>{
                    active ?
                        <Tooltip title="Active">
                            <AlbumRoundedIcon style={{ color: 'green' }} />
                        </Tooltip>
                        : <Tooltip title="Paused">
                            <AlbumRoundedIcon style={{ color: 'red' }} />
                        </Tooltip>
                }
                </Grid>
            </Grid>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={4}><Typography variant="body2" style={{ color: grey[700] }}>First Name</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2" style={{ color: grey[700] }}>{first_name}</Typography></Grid>
            </Grid>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={4}><Typography variant="body2" style={{ color: grey[700] }}>Last Name</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2" style={{ color: grey[700] }}>{last_name}</Typography></Grid>
            </Grid>

            <Grid container item direction='row' xs={4}>
                <Grid item xs={4}><Typography variant="body2" style={{ color: grey[700] }}>Status</Typography></Grid>
                <Grid item xs={8}><Chip label={status} color={status === 'lead' ? 'warning' : 'success'} /></Grid>
            </Grid>

        </Grid>
    )
}

export default ContactCard