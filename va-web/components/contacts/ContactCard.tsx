import { Grid, Tooltip, Typography } from '@mui/material'
import React from 'react'
import AlbumRoundedIcon from '@mui/icons-material/AlbumRounded';

const ContactCard = ({ contactInfo }) => {

    const { first_name, last_name, active, status, id } = contactInfo.findContact;

    return (
        <Grid container direction='column' rowSpacing={2}>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={4}><Typography variant="body1" color="initial">ID</Typography></Grid>
                <Grid item xs={8}><Typography variant="body1" color="initial">{id}</Typography></Grid>
            </Grid>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={4}><Typography variant="body1" color="initial">Active</Typography></Grid>
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
                <Grid item xs={4}><Typography variant="body1" color="initial">First Name</Typography></Grid>
                <Grid item xs={8}><Typography variant="body1" color="initial">{first_name}</Typography></Grid>
            </Grid>
            <Grid container item direction='row' xs={4} >
                <Grid item xs={4}><Typography variant="body1" color="initial">Last Name</Typography></Grid>
                <Grid item xs={8}><Typography variant="body1" color="initial">{last_name}</Typography></Grid>
            </Grid>

            <Grid container item direction='row' xs={4}>
                <Grid item xs={4}><Typography variant="body1" color="initial">Status</Typography></Grid>
                <Grid item xs={8}><Typography variant="body1" color="initial">{status}</Typography></Grid>
            </Grid>

        </Grid>
    )
}

export default ContactCard