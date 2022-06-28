import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Paper, Tab } from '@mui/material'
import React, { useState } from 'react'
import ContactsFilters from '../../components/contacts/ContactsFilters'
import AppLayout from '../../components/layouts/AppLayout'
import LeadsDataTable from '../../components/leads/LeadsDataTable'
import StatusCard from '../../components/StatusCard'
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { ContactPhone } from '@mui/icons-material'
import PhoneNumbersDataTable from '../../components/contacts/phone-numbers/PhoneNumbersDataTable'
import PhoneNumbersFilters from '../../components/contacts/phone-numbers/PhoneNumbersFilters'
interface FilterStatus {
    name?: string,
    converted?: boolean,
    leads?: boolean,
    active?: boolean,
    inactive: boolean,
    unknownResponse?: boolean,
    negativeResponse?: boolean,
    noConversation?: boolean,
    noNumbers?: boolean,
    phoneNumber?: string,
    campaignId?: number,

}

const Contacts = () => {

    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const [totalCount, setTotalCount] = React.useState(0)

    const [activeCount, setActiveCount] = React.useState(0)

    const [pausedCount, setPausedCount] = React.useState(0)

    const [convertedCount, setConvertedCount] = React.useState(0)

    const [contactsFilters, setContactsFilters] = useState<FilterStatus>({
        name: '',
        phoneNumber: '',
        converted: false,
        leads: false,
        active: false,
        inactive: false,
        unknownResponse: false,
        negativeResponse: false,
        noConversation: false,
        campaignId: 0,
    });

    const [numbersFilters, setNumbersFilters] = useState<FilterStatus>({
        name: '',
        phoneNumber: '',
        converted: false,
        leads: false,
        active: false,
        inactive: false,
        unknownResponse: false,
        negativeResponse: false,
        noConversation: false,
        noNumbers: false,
        campaignId: 0,
    });

    return (
        <AppLayout header='Contacts' >

            <Paper elevation={3}>
                <Box sx={{ display: 'flex', flexDirection: 'colum', marginY: 3, paddingY: 3, justifyContent: 'space-around', maxHeight: 'max-content' }}>
                    <StatusCard title='All Contacts' value={totalCount} />
                    <StatusCard title='Active' value={activeCount} />
                    <StatusCard title='Paused' value={pausedCount} />
                    <StatusCard title='Converted' value={convertedCount} />
                </Box>
            </Paper>


            <Paper elevation={3} sx={{ height: 920 }}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Contacts" value="1" icon={<ContactPageIcon />} />
                                <Tab label="Numbers" value="2" icon={<ContactPhone />} />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'stretch' }}>
                                <ContactsFilters filters={contactsFilters} setFilters={setContactsFilters} />
                                <LeadsDataTable setTotalCount={setTotalCount} setActiveCount={setActiveCount} setPausedCount={setPausedCount} setConvertedCount={setConvertedCount} filters={contactsFilters} filtersActive={false} />
                            </Box>
                        </TabPanel>
                        <TabPanel value="2">
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <PhoneNumbersFilters filters={numbersFilters} setFilters={setNumbersFilters} />
                                <PhoneNumbersDataTable filters={numbersFilters} />
                            </Box>

                        </TabPanel>
                    </TabContext>
                </Box>
            </Paper>
        </AppLayout>
    )
}

export default Contacts