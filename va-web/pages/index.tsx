import { useQuery } from '@apollo/client'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { NextPage } from 'next'
import React from 'react'
import CampaignsDataTable from '../components/campaigns/CampaignDataTable'
import CreateCampaignModal from '../components/campaigns/CreateCampaignModal'
import AppLayout from '../components/layouts/AppLayout'
import { GET_ALL_CAMPAIGNS } from '../lib/queries'


const Home: NextPage = ({ count }: any) => {

  const { loading, error, data } = useQuery(GET_ALL_CAMPAIGNS, {
    pollInterval: 1000,
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

  React.useEffect(() => {
    if (!loading) {

      setCampaignsData(data.getAllCampaigns)
    }
  }, [data, loading])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <AppLayout header='Dashboard' count={count ? count : 0}>
      <div className="w-full mx-auto py-12">
        <div className="bg-white overflow-hidden shadow-2xl sm:rounded-lg">

          <div className='flex  items-center justify-between p-5'>
            <Typography variant="subtitle1" className='text-gray-500' fontWeight={600}>Campaigns</Typography>
            <Button variant='outlined' onClick={openModal}>New</Button>
          </div>

          <div className="py-12 px-5 bg-gray-50 ">
            <CampaignsDataTable campaigns={campaignsData} />
          </div>

        </div>
      </div>

      <CreateCampaignModal isOpen={modalOpen} handleClose={closeModal} />
    </AppLayout>
  )
}






export default Home
