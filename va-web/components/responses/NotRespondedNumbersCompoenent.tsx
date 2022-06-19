import { RestartAltRounded, UploadRounded } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, Stack, Tab, Tabs, Tooltip } from '@mui/material';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import CampaignInfoCard from '../campaigns/CampaignCard';
import ContactCard from '../contacts/ContactCard';
import SentMessagesPanel from '../contacts/messages/SentMessagesPanel';
import PropertyInfoCard from '../contacts/PropertyInfoCard';

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

    const router = useRouter();

    const viewContact = React.useCallback(
        (id: number) => () => {
            router.push(`/contacts/${id}`)
        },
        [router],
    );
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
                            <Stack sx={{ width: 'max-content' }}>
                                <Grid item container>
                                    <div className="py-6 w-full">
                                        <div className="w-full mx-auto">
                                            <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                                                <div className="flex p-6 items-center justify-between bg-white border-b border-gray-200 ">
                                                    <div className='text-gray-500 font-bold text-left w-full'>Contact Information</div>
                                                    <Button variant='outlined' onClick={viewContact(phoneNumber.contact.id)}>View</Button>

                                                </div>
                                                <div className='p-6 bg-gray-50'>
                                                    <ContactCard contactInfo={phoneNumber.contact} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-6 w-full">
                                        <div className="w-full mx-auto">
                                            <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                                                <div className="flex p-6 items-center justify-between bg-white border-b border-gray-200 ">
                                                    <div className='text-gray-500 font-bold text-left w-full'>Property Information</div>
                                                </div>
                                                <div className='p-6 bg-gray-50'>
                                                    <PropertyInfoCard propertyInfo={phoneNumber.contact.property} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" py-6 w-full">
                                        <div className="w-full mx-auto">
                                            <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                                                <div className="flex p-6 items-center justify-between bg-white border-b border-gray-200 ">
                                                    <div className='text-gray-500 font-bold text-left w-full'>Campaign Information</div>
                                                </div>
                                                <div className='p-6 bg-gray-50'>
                                                    <CampaignInfoCard campaignInfo={phoneNumber.contact.campaign} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Stack>
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