import { useQuery } from '@apollo/client';
import { Chip, Skeleton, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { isEmpty, orderBy } from 'lodash';
import type { NextPage } from 'next';
import { Fragment, useEffect, useState } from 'react';
import AppLayout from '../components/layouts/AppLayout';
import NotRespondedContactsComponent from '../components/responses/NotRespondedContactsComponent';
import { NOT_RESPONDED_QUERY } from '../lib/queries';


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
function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}



const Responses: NextPage = ({ count, setCount }: any) => {
    const [value, setValue] = useState(0);

    const [propertiesTabs, setPropertiesTabs] = useState<Array<any>>([]);

    const [propertiesPanels, setPropertiesPanels] = useState<Array<any>>([]);



    const { data, loading, error } = useQuery(NOT_RESPONDED_QUERY, {
        pollInterval: 500
    });

    function generateTabLabel(propertyData: any) {
        return (
            <Fragment>
                <Stack>

                    <Typography variant='body1'>{propertyData.address}</Typography>

                    <Box sx={{ display: 'flex', flexFlow: 'row', justifyContent: 'center', gap:1, px:2 }}>
                        <Typography variant='caption'><Chip size='small' label={propertyData.county} /></Typography>
                        <Typography variant='caption'><Chip size='small' label={propertyData.state} /></Typography>
                    </Box>
                </Stack>
            </Fragment>
        )
    }
    useEffect(() => {

        const propertiesTabsList: Array<any> = [];

        const propertiesPanelsList: Array<any> = [];

        if (!loading && data.getNotRespondedMessages) {
            const sorted = orderBy(data.getNotRespondedMessages, ['created_at'], ['desc']);
            setCount(sorted.length ? sorted.length : 0);
            const validProperties: any = [];
            sorted.forEach((item, i) => {
                const property = item.phone_number.contact.property;
                const contacts = property.contacts;
                for (let i = 0; i < contacts.length; i++) {
                    const contact = contacts[i];
                    const numbers = contact.phone_numbers;
                    for (let ii = 0; ii < numbers.length; ii++) {
                        const number = numbers[ii];
                        if (!isEmpty(number.messages)) {
                            validProperties.push(property);
                        }
                    }
                }
            })

            if (!isEmpty(validProperties)) {
                validProperties.forEach((property, i) => {
                    propertiesTabsList.push(
                        <Tab
                            label={generateTabLabel(property)}
                            {...a11yProps(i)}
                            key={property.id}
                            sx={{ width: 'max-content' }}

                        />
                    );

                    propertiesPanelsList.push(
                        <TabPanel
                            index={i}
                            value={value}
                            key={i}>
                            <NotRespondedContactsComponent contacts={property.contacts} />
                        </TabPanel>
                    );
                })
            }
        }
        setPropertiesTabs(propertiesTabsList);

        setPropertiesPanels(propertiesPanelsList);

    }, [loading, data, value, setCount]);


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };



    if (loading) {
        return (
            <AppLayout header='Recenet Responses' count={count ? count : 0}>
                <div className="w-full mx-auto py-12">
                    <div className="bg-white overflow-hidden shadow-2xl sm:rounded-lg">
                        <Skeleton
                            // sx={{ bgcolor: 'grey.900' }}
                            variant="rectangular"
                            width='95vw'
                            height='80vh'
                        />
                    </div>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout header='Recenet Responses' count={count ? count : 0}>
            <div className="w-full mx-auto py-12">
                <div className="bg-white overflow-hidden shadow-2xl sm:rounded-lg">
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
                            {propertiesTabs.map(p => p)}
                        </Tabs>
                        {propertiesPanels.map(pp => pp)}
                    </Box>
                </div>
            </div>
        </AppLayout >
    )
}
export default Responses
