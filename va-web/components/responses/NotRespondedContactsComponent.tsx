import { Box, Stack, Tab, Tabs } from '@mui/material';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import NotRespondedNumbersCompoenent from './NotRespondedNumbersCompoenent';

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    }
}


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            style={{ width: '100%' }}

            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}
function NotRespondedContactsComponent({ contacts }: any) {

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const [contactsTabs, setContactsTabs] = useState<Array<any>>([]);

    const [contactsPanels, setContactsPanels] = useState<Array<any>>([]);
    useEffect(() => {
        const contactsTabsList: Array<any> = [];
        const contactsPanelsList: Array<any> = [];

        const validContacts: any = [];
        contacts.forEach((contact, i) => {
            const numbers = contact.phone_numbers;
            for (const number of numbers) {
                if (!isEmpty(number.messages)) {
                    validContacts.push(contact);
                }
            }
        });

        if (!isEmpty(validContacts)) {
            validContacts.forEach((contact, i) => {
                contactsTabsList.push(
                    <Tab
                        label={<Stack>
                            <span>{contact.first_name + " " + contact.last_name}</span>
                            <span>ID: {contact.id}</span>
                        </Stack>}
                        {...a11yProps(i)}
                        key={contact.id}
                        sx={{ width: 'max-content' }}
                    />
                );
                contactsPanelsList.push(
                    <TabPanel
                        value={value}
                        index={i}
                        key={i}
                    >
                        <NotRespondedNumbersCompoenent
                            phoneNumbers={contact.phone_numbers}
                        />
                    </TabPanel>)
            });
        }

        setContactsTabs(contactsTabsList);

        setContactsPanels(contactsPanelsList);
    }, [contacts, value]);

    return (
        <Box
            sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "80vh", padding: 2 }}
        >

            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Not Responded Messages"
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                {contactsTabs.map(c => c)}
            </Tabs>

            {contactsPanels.map(cm => cm)}
        </Box>
    )
}

export default NotRespondedContactsComponent