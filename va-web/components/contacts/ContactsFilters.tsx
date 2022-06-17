import { Button, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { useState } from 'react'




const ContactsFilters = ({ filters, setFilters }) => {

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setFilters(prev => ({ ...prev, [event.target.name]: checked }));

    }
    const handleTextboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, [event.target.name]: event.target.value }));

    }

    const Field = ({ title, name, value }) => {
        return <TextField id={title} label={title} variant="standard" name={name} onChange={handleTextboxChange} value={value} />
    }

    return (
        <Stack
            gap={2}
            minWidth='max-content'
            border='solid'
            padding={1}
            borderColor={grey[200]}
            sx={{ height: '100%' }}
            divider={<Divider orientation="horizontal" />}
        >
            <Typography variant="h5" color="primary">Filters</Typography>
            <Field title='Name' name='name' value={filters.name} />
            <Field title='Number' name='number' value={filters.phoneNumber} />
            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Contacts Status</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox onChange={handleCheckboxChange} name="leads" />
                        }
                        label="Leads"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox onChange={handleCheckboxChange} name="converted" />
                        }
                        label="Converted"
                    />
                </FormGroup>
            </FormControl>
            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Contacts State</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox onChange={handleCheckboxChange} name="active" />
                        }
                        label="Active"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox onChange={handleCheckboxChange} name="inactive" />
                        }
                        label="Inactive"
                    />
                </FormGroup>
            </FormControl>
            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Response Types</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox onChange={handleCheckboxChange} name="unknownResponse" />
                        }
                        label="Unknown Responses"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox onChange={handleCheckboxChange} name="negativeResponse" />
                        }
                        label="Negative Responses"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox onChange={handleCheckboxChange} name="noConversation" />
                        }
                        label="No Conversation"
                    />
                </FormGroup>
            </FormControl>
            <Button variant='outlined' sx={{ justifySelf: 'flex-end' }}>Apply</Button>
        </Stack>
    )
}

export default ContactsFilters