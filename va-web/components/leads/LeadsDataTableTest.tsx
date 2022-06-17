import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteForeverRounded from '@mui/icons-material/DeleteForeverRounded';
import PauseCircleFilledRounded from '@mui/icons-material/PauseCircleFilledRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Chip, Grid, IconButton, LinearProgress, TextField } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid, GridActionsCellItem, GridRenderCellParams, GridRowId, GridRowParams, GridSelectionModel, GridToolbarContainer } from '@mui/x-data-grid';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import React from 'react';
import { ACTIVATE_CONTACT, ACTIVATE_CONTACTS, DEACTIVATE_CONTACT, DEACTIVATE_CONTACTS, REMOVE_MANY_CONTACTS } from '../../lib/mutations';
import { CONTACTS_PAGE_QUERY } from '../../lib/queries';
import BulkSMSDialog from '../contacts/messages/BulkSMSDialog';

const LeadsDataTable = ({ setTotalCount, setActiveCount, setPausedCount, setConvertedCount }) => {


    const [getContacts, { startPolling, stopPolling }] = useLazyQuery(CONTACTS_PAGE_QUERY);

    const [removeContacts] = useMutation(REMOVE_MANY_CONTACTS);

    const [contacts, setContacts] = React.useState<Array<any>>([]);

    const [pageSize, setPageSize] = React.useState(25);

    const [isLoading, setIsLoading] = React.useState(false);

    const [pageNumber, setPageNumber] = React.useState<number>(0);

    const [totalItems, setTotalItems] = React.useState<number>(0);

    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

    const prevSelectionModel = React.useRef<GridSelectionModel>(selectionModel);

    const [filterValue, setFilterValue] = React.useState<string | undefined>('');


    const requestData = React.useCallback(
        async () => {
            setIsLoading(true)
            const res = await getContacts({
                variables: {
                    page: pageNumber + 1,
                    limit: pageSize,
                    search: filterValue
                }
            });

            setIsLoading(false)
            return res.data;
        },
        [filterValue, getContacts, pageNumber, pageSize],
    );


    React.useEffect(() => {
        (
            async () => {
                setIsLoading(true);
                const data = await requestData()
                setContacts(data.getAllContacts.items);
                setTotalItems(data.getAllContacts.meta.totalItems)
                setActiveCount(data.contactsStats.activeCount);
                setConvertedCount(data.contactsStats.convertedCount);
                setTotalCount(data.contactsStats.allContactsCount);
                setPausedCount(data.contactsStats.pausedCount);
                setIsLoading(false);
                setSelectionModel(prevSelectionModel.current);
                startPolling(500);
            }
        )();

    }, [requestData, setActiveCount, setConvertedCount, setPausedCount, setTotalCount]);


    const [activateContacts, activateStatus] = useMutation(ACTIVATE_CONTACT);

    const [deactivateContacts, deactivateStatus] = useMutation(DEACTIVATE_CONTACT);

    const router = useRouter();

    const viewContact = React.useCallback(
        (id: GridRowId) => () => {
            router.push(`/contacts/${id}`)
        },
        [router],
    );

    const deleteContact = React.useCallback(
        (id: GridRowId) => async () => {
            setIsLoading(true)
            await removeContacts({
                variables: {
                    ids: [id]
                }
            })
            setIsLoading(false)
        },
        [removeContacts],
    );

    const pauseContact = React.useCallback(
        (id: GridRowId) => async () => {
            setIsLoading(true)

            await deactivateContacts({
                variables: {
                    input: {
                        id,
                        active: false
                    },
                    id
                }
            })

            setIsLoading(false)
        },
        [deactivateContacts],
    );

    const resumeContact = React.useCallback(
        (id: GridRowId) => async () => {
            setIsLoading(true)

            await activateContacts({
                variables: {
                    input: {
                        id,
                        active: true
                    },
                    id
                }
            })

            setIsLoading(false)
        },
        [activateContacts],
    );


    const filterChangehandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectionModel([]);
        prevSelectionModel.current = []
        setFilterValue(e.target.value)
    }



    const columns = React.useMemo(

        () => [
            { field: 'id', headerName: 'ID', width: 150 },
            { field: 'first_name', headerName: 'First Name', width: 150 },
            { field: 'last_name', headerName: 'last Name', width: 150 },
            {
                field: 'active',
                headerName: 'Status',
                width: 150,
                renderCell: (params: GridRenderCellParams<Boolean>) => {
                    if (params.value) {
                        return <PlayArrowRounded style={{ color: 'green' }} />
                    }
                    return <PauseCircleFilledRounded style={{ color: 'orange' }} />
                },
            },
            {
                field: 'status',
                headerName: 'Contact Status',
                width: 150,
                renderCell: (params: GridRenderCellParams<string>) => (
                    <Chip label={params.row.status} color={params.row.status === 'lead' ? 'warning' : 'success'} />
                )
            },

            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<VisibilityOutlinedIcon color='primary' />}
                        label="View"
                        onClick={viewContact(params.id)}
                        showInMenu
                        key='item1'
                    />,
                    <GridActionsCellItem
                        icon={params.row.active ? <PauseCircleFilledRounded style={{ color: 'orange' }} /> : <PlayArrowRounded style={{ color: 'green' }} />}
                        label={params.row.active ? 'Pause' : 'Resume'}
                        onClick={params.row.active ? pauseContact(params.id) : resumeContact(params.id)}
                        showInMenu
                        key='item2'
                    />,
                    <GridActionsCellItem
                        icon={<DeleteForeverRounded style={{ color: 'red' }} />}
                        label="Delete"
                        onClick={deleteContact(params.id)}
                        showInMenu
                        key='item3'
                    />,
                ],
            },

        ],
        [deleteContact, pauseContact, resumeContact, viewContact]
    );


    return (
        <div style={{ height: 700, width: '100%' }}>
            {JSON.stringify({ pagenumber: pageNumber, pageSize: pageSize, totalItems: totalItems })}
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            <div style={{ height: 700, width: '100%' }}>
                <DataGrid
                    isRowSelectable={(params: GridRowParams) => params.row.status === 'lead'}
                    loading={isLoading}
                    rows={contacts}
                    columns={columns}
                    // page={pageNumber === 0 ? pageNumber : pageNumber - 1}
                    pageSize={pageSize}
                    rowCount={totalItems}
                    paginationMode='server'
                    pagination
                    checkboxSelection={true}

                    onPageChange={(page) => {
                        console.log(page);

                        prevSelectionModel.current = selectionModel;
                        setPageNumber(page);
                    }}
                    onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                    components={{
                        Toolbar: CustomToolbar,
                        LoadingOverlay: LinearProgress,
                    }}
                    componentsProps={{
                        toolbar: {
                            selectionModel,
                            setIsLoading,
                            filterValue,
                            changeHandler: filterChangehandler,
                            clearHandler: () => setFilterValue('')
                        }
                    }}
                    selectionModel={selectionModel}
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                    }}
                    filterMode="server"
                />
            </div>
        </div>
    );
}

const CustomToolbar = ({ selectionModel, filterValue, changeHandler, clearHandler, setIsLoading }) => {
    return (
        <GridToolbarContainer>
            {/* <GridToolbarExport /> */}
            <Grid container justifyContent='space-between' alignItems='center'>
                <Grid item>
                    <BasicMenu selectedContacts={selectionModel} setIsLoading={setIsLoading} />
                </Grid>
                <Grid item>
                    <QuickSearchToolbar value={filterValue} clearSearch={clearHandler} onChange={changeHandler} />
                </Grid>
            </Grid>
        </GridToolbarContainer>
    );
}

function BasicMenu({ selectedContacts, setIsLoading }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const [removeContacts] = useMutation(REMOVE_MANY_CONTACTS);
    const [activateContacts] = useMutation(ACTIVATE_CONTACTS);
    const [deactivateContacts] = useMutation(DEACTIVATE_CONTACTS);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        setIsLoading(true)
        await removeContacts({
            variables: {
                ids: selectedContacts
            }
        });
        setIsLoading(false)
        setAnchorEl(null);

    };
    const handlePause = async () => {
        setIsLoading(true)
        await deactivateContacts({
            variables: {
                ids: selectedContacts
            }
        });
        setIsLoading(false)
        setAnchorEl(null);

    };

    const handleResume = async () => {
        setIsLoading(true)
        await activateContacts({
            variables: {
                ids: selectedContacts
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
                variant='contained'
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
                <MenuItem disabled={!selectedContacts.length} onClick={handleClickOpen}>
                    Send Custom SMS
                </MenuItem>
                <MenuItem disabled={!selectedContacts.length} onClick={handlePause}>Pause</MenuItem>
                <MenuItem disabled={!selectedContacts.length} onClick={handleResume}>Resume</MenuItem>
                <MenuItem disabled={!selectedContacts.length} onClick={handleDelete}>Delete</MenuItem>
            </Menu>
            <BulkSMSDialog selectedContacts={selectedContacts} open={dialogOpen} handleClose={handleDialogClose} />
        </div>
    );
}


interface QuickSearchToolbarProps {
    clearSearch: () => void;
    onChange: () => void;
    value: string;
}

function QuickSearchToolbar(props: QuickSearchToolbarProps) {
    return (
        <Box
            sx={{
                p: 0.5,
                pb: 0,
            }}
        >
            <TextField
                variant="standard"
                value={props.value}
                onChange={props.onChange}
                placeholder="Search…"
                InputProps={{
                    startAdornment: <SearchIcon fontSize="small" />,
                    endAdornment: (
                        <IconButton
                            title="Clear"
                            aria-label="Clear"
                            size="small"
                            style={{ visibility: props.value ? 'visible' : 'hidden' }}
                            onClick={props.clearSearch}
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    ),
                }}
                sx={{
                    width: {
                        xs: 1,
                        sm: 'auto',
                    },
                    m: (theme) => theme.spacing(1, 0.5, 1.5),
                    '& .MuiSvgIcon-root': {
                        mr: 0.5,
                    },
                    '& .MuiInput-underline:before': {
                        borderBottom: 1,
                        borderColor: 'divider',
                    },
                }}
            />
        </Box>
    );
}

export default LeadsDataTable