import { useLazyQuery, useMutation } from '@apollo/client';
import { PauseCircleFilledOutlined, PauseCircleFilledRounded, PlayArrowRounded, PlayCircleFilledOutlined } from '@mui/icons-material';

import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Grid, LinearProgress, Menu, MenuItem, Tooltip } from '@mui/material';
import { green, orange, red } from '@mui/material/colors';
import {
    DataGrid,
    GridActionsCellItem, GridColumns, GridRenderCellParams, GridRowId, GridSelectionModel, GridToolbarContainer
} from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { ACTIVATE_NUMBERS, DEACTIVATE_NUMBERS, REMOVE_NUMBERS } from '../../../lib/mutations';
import { SEARCH_NUMBERS } from '../../../lib/queries';
import BulkSMSDialog from '../messages/BulkSMSDialog';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
interface Row {
    id: number;
    number: string;
    numberActive: boolean
    deactivation_reason: string;
    contactId: number;
    first_name: string;
    last_name: string;
    campaignId: number;
    title: string;
    messagesCount: number;

}

const convertToRows = (items: Array<any>) => {

    const formattedRows: Row[] = []
    items.map(item => {
        const row: Row = {
            campaignId: item.contact.campaign.id,
            title: item.contact.campaign.title,
            contactId: item.contact.id,
            first_name: item.contact.first_name,
            last_name: item.contact.last_name,
            id: item.id,
            number: item.number,
            numberActive: item.active,
            deactivation_reason: item.deactivation_reason,
            messagesCount: item.messagesCount
        }
        formattedRows.push(row);
    })

    return formattedRows;
}

export default function PhoneNumbersDataTable({ filters }) {

    const [rows, setRows] = React.useState<Array<Row>>([]);

    const [isLoading, setIsLoading] = React.useState(false);

    const [pageNumber, setPageNumber] = React.useState<number>(0);

    const [totalItems, setTotlaItems] = React.useState<number>(0);

    const [itemsPerPage, setItemsPerPage] = React.useState<number>(25);

    const [searchNumbers, { data, error, loading, startPolling, stopPolling }] = useLazyQuery(SEARCH_NUMBERS);

    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

    const prevSelectionModel = React.useRef<GridSelectionModel>(selectionModel);

    const updateRows = useCallback(
        async () => {
            const { data } = await searchNumbers({
                variables: {
                    page: pageNumber,
                    limit: itemsPerPage,
                    filters
                }
            })

            return data.searchNumbers;
        },
        [filters, itemsPerPage, pageNumber, searchNumbers]
    );

    useEffect(() => {

        updateRows()
            .then(data => {
                console.log(data);
                let formattedRows = convertToRows(data.items);
                let numberWithConvCount = formattedRows.filter(row => row.messagesCount > 0).length;

                if (filters.noConversation) {
                    formattedRows = formattedRows.filter(row => row.messagesCount === 0);
                    setRows(formattedRows);
                    setTotlaItems(data.meta.totalItems - numberWithConvCount);
                    startPolling(1000);

                } else {
                    setRows(formattedRows);
                    setTotlaItems(data.meta.totalItems);
                    startPolling(1000);
                }

            })

        return () => stopPolling()
    }, [updateRows, data, startPolling, stopPolling, filters.noConversation]);


    const [activateNumbers, activateStatus] = useMutation(ACTIVATE_NUMBERS);

    const [deactivateNumbers, deactivateStatus] = useMutation(DEACTIVATE_NUMBERS);

    const [removeNumbers] = useMutation(REMOVE_NUMBERS);

    const router = useRouter();

    const viewContact = React.useCallback(
        (id: GridRowId) => () => {
            router.push(`/contacts/${id}`)
        },
        [router],
    );

    const deleteNumber = React.useCallback(
        (id: GridRowId) => async () => {
            setIsLoading(true)
            await removeNumbers({
                variables: {
                    ids: [id]
                }
            })
            setIsLoading(false)
        },
        [removeNumbers],
    );

    const pauseNumber = React.useCallback(
        (id: GridRowId) => async () => {
            setIsLoading(true)

            await deactivateNumbers({
                variables: {
                    ids: [id],

                }
            })

            setIsLoading(false)
        },
        [deactivateNumbers],
    );

    const resumeNumber = React.useCallback(
        (id: GridRowId) => async () => {
            setIsLoading(true)

            await activateNumbers({
                variables: {
                    ids: [id]

                }
            })

            setIsLoading(false)
        },
        [activateNumbers],
    );

    const columns = React.useMemo<GridColumns<any>>(
        () => [
            { field: 'id', headerName: 'ID', type: 'number' },
            { field: 'number', headerName: 'Number', type: 'string', align: 'center', flex: 1, headerAlign: 'center' },
            { field: 'messagesCount', type: 'number', headerName: 'MessagesCount', align: 'center', flex: 1, headerAlign: 'center' },
            { field: 'contactId', type: 'number', headerName: 'Contact ID', align: 'center', flex: 1, headerAlign: 'center' },
            { field: 'first_name', type: 'string', headerName: 'First Name', align: 'center', flex: 1, headerAlign: 'center' },
            { field: 'last_name', type: 'string', headerName: 'Last Name', align: 'center', flex: 1, headerAlign: 'center' },
            {
                field: 'numberActive', type: 'boolean', headerName: 'Active', align: 'center', flex: 1, headerAlign: 'center', renderCell: (params: GridRenderCellParams<Boolean>) => {
                    if (params.value) {
                        return <PlayArrowRounded style={{ color: 'green' }} />
                    }
                    return <PauseCircleFilledRounded style={{ color: 'orange' }} />
                },
            },
            { field: 'deactivation_reason', type: 'string', headerName: 'Remarks', align: 'center', flex: 1, headerAlign: 'center' },
            { field: 'campaignId', type: 'number', headerName: 'Campaign ID', resizable: true, align: 'center', flex: 1, headerAlign: 'center' },
            {
                field: 'actions',
                type: 'actions',
                width: 90,

                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<Tooltip title='View contact'><VisibilityOutlinedIcon color='primary' /></Tooltip>}
                        label="View Contact"
                        onClick={viewContact(params.row.contactId)}
                        key='view'

                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon sx={{ color: red[700] }} />}
                        label="Delete"
                        onClick={deleteNumber(params.id)}
                        key='delete'
                        showInMenu
                    />,

                    <GridActionsCellItem
                        icon={params.row.numberActive ? <PauseCircleFilledOutlined sx={{ color: orange[700] }} /> : <PlayCircleFilledOutlined sx={{ color: green[700] }} />}
                        label={params.row.numberActive ? 'Pause' : 'Resume'}
                        onClick={params.row.numberActive ? pauseNumber(params.id) : resumeNumber(params.id)}
                        showInMenu
                        key='something'
                    />,
                ],
            }
        ],
        [deleteNumber, pauseNumber, resumeNumber, viewContact],
    );

    return (
        <div style={{ height: 800, width: '100%' }}>
            <DataGrid
                columns={columns}
                rows={rows}
                loading={loading || isLoading || activateStatus.loading || deactivateStatus.loading || false}
                pageSize={itemsPerPage}
                onPageChange={(page) => {
                    prevSelectionModel.current = selectionModel;
                    setPageNumber(page);
                }}
                onPageSizeChange={(pageSize) => setItemsPerPage(pageSize)}

                rowCount={totalItems}

                paginationMode='server'

                pagination

                checkboxSelection={true}

                components={{
                    Toolbar: CustomToolbar,
                    LoadingOverlay: LinearProgress,
                }}

                componentsProps={{
                    toolbar: {
                        selectionModel,
                        setIsLoading,
                    }
                }}

                selectionModel={selectionModel}

                onSelectionModelChange={(newSelectionModel) => {
                    setSelectionModel(newSelectionModel);
                }}

                filterMode="server"

            />
        </div>
    );
}

const CustomToolbar = ({ selectionModel, changeHandler, clearHandler, setIsLoading }) => {
    return (
        <GridToolbarContainer>
            {/* <GridToolbarExport /> */}
            <Grid container justifyContent='space-between' alignItems='center'>
                <Grid item>
                    <BasicMenu selectedNumbers={selectionModel} setIsLoading={setIsLoading} />
                </Grid>
            </Grid>
        </GridToolbarContainer>
    );
}

function BasicMenu({ selectedNumbers, setIsLoading }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const [removeNumbers] = useMutation(REMOVE_NUMBERS);
    const [activateNumbers] = useMutation(ACTIVATE_NUMBERS);
    const [deactivateNumbers] = useMutation(DEACTIVATE_NUMBERS);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        setIsLoading(true)
        await removeNumbers({
            variables: {
                ids: selectedNumbers
            }
        });
        setIsLoading(false)
        setAnchorEl(null);

    };
    const handlePause = async () => {
        setIsLoading(true)
        await deactivateNumbers({
            variables: {
                ids: selectedNumbers
            }
        });
        setIsLoading(false)
        setAnchorEl(null);

    };

    const handleResume = async () => {
        setIsLoading(true)
        await activateNumbers({
            variables: {
                ids: selectedNumbers
            }
        });
        setIsLoading(false)
        setAnchorEl(null);
    };

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const handleClickOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <div>
            <Button
                id="custom-actions"
                variant='outlined'
                aria-controls={open ? 'bulk-actions-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                Actions
            </Button>
            <Menu
                id="bulk-actions-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'custom-actions',
                }}
            >
                <MenuItem disabled={!selectedNumbers.length} onClick={handleClickOpen}>
                    Send Custom SMS
                </MenuItem>
                <MenuItem disabled={!selectedNumbers.length} onClick={handlePause}>Pause</MenuItem>
                <MenuItem disabled={!selectedNumbers.length} onClick={handleResume}>Resume</MenuItem>
                <MenuItem disabled={!selectedNumbers.length} onClick={handleDelete}>Delete</MenuItem>
            </Menu>
            <BulkSMSDialog selectedContacts={selectedNumbers} open={dialogOpen} handleClose={handleDialogClose} byNumbers={true} />
        </div>
    );
}