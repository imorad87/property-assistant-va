import React from 'react'
import Grid from '@mui/material/Grid'

const ErrorBag = ({ errors }) => {

    const [errorList, setErrorList] = React.useState(errors);

    return (
        <Grid container spacing={1} flexDirection='column'>
            {errorList.map((err, i) => <Grid item key={i}>{err}</Grid>)}
        </Grid>
    )
}

export default ErrorBag