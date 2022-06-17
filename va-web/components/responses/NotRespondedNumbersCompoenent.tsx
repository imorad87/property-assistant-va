import { Box, Button, Stack, Tab, Tabs } from '@mui/material';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import SentMessagesPanel from '../contacts/messages/SentMessagesPanel';

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
function NotRespondedNumbersCompoenent({ phoneNumbers }: any) {

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const [numbersTabs, setNumbersTabs] = useState<Array<any>>([]);

    const [numbersPanels, setNumbersPanels] = useState<Array<any>>([]);
    useEffect(() => {

        const numbersTabsList: Array<any> = [];
        const numbersPanelsList: Array<any> = [];

        const validNumbers: any = []

        for (let i = 0; i < phoneNumbers.length; i++) {
            const phoneNumber = phoneNumbers[i];
            if (!isEmpty(phoneNumber.messages)) {
                validNumbers.push(phoneNumber);
            }
        }

        if (!isEmpty(validNumbers)) {
            validNumbers.forEach((phoneNumber, i) => {
                numbersTabsList.push(
                    <Tab
                        label={<Stack>
                            <span># {phoneNumber.number}</span>
                            <span>ID: {phoneNumber.id}</span>
                        </Stack>}
                        {...a11yProps(i)}
                        key={phoneNumber.id}
                        sx={{ width: 'max-content' }}

                    />
                );

                numbersPanelsList.push(
                    <TabPanel
                        value={value}
                        index={i}
                        key={i}
                    >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <SentMessagesPanel messages={phoneNumber.messages} numberInfo={phoneNumber} key={i} />
                            <Box><Button variant='outlined'>View</Button></Box>
                        </Box>
                    </TabPanel>)
            })
        }

        setNumbersTabs(numbersTabsList);

        setNumbersPanels(numbersPanelsList);

    }, [phoneNumbers, value]);

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
                {numbersTabs.map(nt => nt)}
            </Tabs>

            {numbersPanels.map(np => np)}

        </Box>

    )
}

export default NotRespondedNumbersCompoenent