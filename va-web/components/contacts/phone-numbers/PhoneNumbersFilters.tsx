import { RestoreOutlined } from '@mui/icons-material'
import { Box, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { isNumber } from 'lodash'
import React from 'react'




const PhoneNumbersFilters = ({ filters, setFilters }) => {

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setFilters(prev => ({ ...prev, [event.target.name]: checked }));
    }

    const handleTextboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (event.target.name == 'campaignId' && !isNumber(event.target.value)) {
            setFilters(prev => ({ ...prev, campaignId: parseInt(event.target.value as string) }));
            return;
        }
        setFilters(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const clearFilters = () => {
        setFilters({
            name: '',
            phoneNumber: '',
            active: false,
            inactive: false,
            noConversation: false,
            noNumbers: false,
        })
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
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Filters</Typography>
                <IconButton onClick={clearFilters}>
                    <Tooltip title='CLear filters'>
                        <RestoreOutlined color='primary' />
                    </Tooltip>
                </IconButton>
            </Box>
            <TextField id='Name' label='Name' variant="standard" name='name' onChange={handleTextboxChange} value={filters.name} />

            <TextField id='phoneNumber' label='Number' variant="standard" name='phoneNumber' onChange={handleTextboxChange} value={filters.phoneNumber} />



            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Number State</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox onChange={handleCheckboxChange} name="active" checked={filters.active} />
                        }
                        label="Active"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox onChange={handleCheckboxChange} name="inactive" checked={filters.inactive} />
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
                            <Checkbox onChange={handleCheckboxChange} name="noConversation" checked={filters.noConversation} />
                        }
                        label="No Conversation"
                    />
                </FormGroup>
            </FormControl>

        </Stack>
    )
}

export default PhoneNumbersFilters