import PhoneIcon from '@mui/icons-material/Phone';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import MessagesPanel from './messages/MessagesPanel';

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

export default function PhoneNumbersPanel({ phoneNumbers }) {


  const [value, setValue] = React.useState(0);

  const [tabs, setTabs] = React.useState<any>([]);

  const [panels, setPanels] = React.useState<any>([]);


  React.useEffect(() => {
    const mainsTabs: Array<any> = [];

    const mainPanels: Array<any> = [];

    phoneNumbers.forEach((n, i: number) => {
      mainsTabs.push(
        <Tab icon={<PhoneIcon />} iconPosition="start" key={n.id} label={n.number} {...a11yProps(i)} />
      );

      mainPanels.push(
        <TabPanel key={i} value={value} index={i}>
          <MessagesPanel />
        </TabPanel>
      );
    });

    setTabs(mainsTabs);
    setPanels(mainPanels);

  }, [phoneNumbers.length, value]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (

    <Box sx={{ flexGrow: 1, display: 'flex' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Phone Numbers Tabs"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        {tabs.map(t => t)}
      </Tabs>
      {panels.map(p => p)}
    </Box>
  );
}
