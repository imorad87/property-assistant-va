import { useQuery } from '@apollo/client'
import { RefreshOutlined } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import Button from '@mui/material/Button'
import { grey } from '@mui/material/colors'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import { NextPage } from 'next'
import React, { useEffect } from 'react'
import CampaignsDataTable from '../components/campaigns/CampaignDataTable'
import CreateCampaignModal from '../components/campaigns/CreateCampaignModal'
import AppLayout from '../components/layouts/AppLayout'
import { GET_ALL_CAMPAIGNS } from '../lib/queries'


const Home: NextPage = () => {

  const { loading, error, data, refetch, startPolling, stopPolling } = useQuery(GET_ALL_CAMPAIGNS, {
    pollInterval: 500
  });


  const [campaignsData, setCampaignsData] = React.useState(null);

  const [modalOpen, setModalOpen] = React.useState(false);

  const openModal = () => {
    setModalOpen(true);
  }

  const closeModal = (event, reason) => {
    if (reason && reason == "backdropClick") return;

    setModalOpen(false);
  }

  useEffect(() => {
    startPolling(1000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  useEffect(() => {
    if (!loading && data.getAllCampaigns) {

      setCampaignsData(data.getAllCampaigns)
    }
  }, [data, loading])

  if (error) return <span>Error :(</span>;

  return (
    <AppLayout header='Dashboard'>
      <div className="w-full mx-auto py-12">
        <div className="bg-white overflow-hidden shadow-2xl sm:rounded-lg">

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', padding: 2 }}>
            <Typography variant="subtitle1" color={grey[500]} fontWeight={600}>Campaigns</Typography>
            <Box sx={{ display: 'flex', gap: '2' }}>
              <IconButton onClick={() => refetch()}>
                <RefreshOutlined color='primary' />
              </IconButton>
              <Button variant='outlined' onClick={openModal}>New</Button>
            </Box>
          </Box>

          <div className="py-12 px-5 bg-gray-50 ">
            <CampaignsDataTable campaigns={campaignsData} loading={loading} />
          </div>

        </div>
      </div><CreateCampaignModal isOpen={modalOpen} handleClose={closeModal} />
    </AppLayout >
  )
}






export default Home
