import React from 'react'
import Grid from '@mui/material/Grid'

const ErrorBag = ({ errors }) => {

    const [errorList, setErrorList] = React.useState(errors);

    return (
        <Grid container spacing={1} flexDirection='column'>
            {errorList.map(err => <Grid item>{err}</Grid>)}
        </Grid>
    )
}

export default ErrorBag