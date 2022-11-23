import React from 'react';
import { Alert, AppBar, Avatar, Box, Button, CircularProgress, FormControl, Grid,
    IconButton,
    InputLabel, Menu, MenuItem, Select, Snackbar, Toolbar, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { useSearchParams } from 'react-router-dom';
import { authorize, upload, login, fetchGroups, fetchCategories, createExpenses } from '../util/httpClient';

const columns = [
    { field: 'transaction_date', headerName: 'Transaction Date', width: 200 },
    { field: 'transferred_to', headerName: 'Paid To', width: 250 },
    { field: 'mode', headerName: 'Payment Mode', width: 150},
    { field: 'amount', headerName: 'Amount', width: 150 },
];

const Home = () => {
    const [user, setUser] = React.useState(null);
    const [bank, setBank] = React.useState('');
    const [selectedRows, setSelectedRows] = React.useState(null);
    const [selectedGroup, setSelectedGroup] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const [groups, setGroups] = React.useState(null);
    const [categories, setCategories] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [pageLoading, setPageLoading] = React.useState(false);
    const changeBank = (e) => {
        setBank(e.target.value);
    };
    const [rows, setRows] = React.useState([]);
    const setFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        if (!user || !user.token || !bank) {
            return;
        }
        setLoading(true);
        upload(user.token, bank, e.target.files[0]).then(data => {
            setLoading(false);
            setRows(data);
        });
    };
    const [searchParams] = useSearchParams();
    const handleOpenUserMenu = (e) => {
        setAnchorElUser(e.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleLogout = () => {
        setUser(null);
        setRows([]);
        setGroups(null);
        setCategories(null);
    }
    const handleRowSelection = (selectedRowIds, details) => {
        setSelectedRows(selectedRowIds);
    };
    const handleExpenseSelect = (e) => {
        setLoading(true);
        const idSet = new Set(selectedRows);
        const filteredRows = rows.filter(row => {
            return idSet.has(row.description)
        });
        const payload = filteredRows.map(row => {
            row.groupId = selectedGroup;
            row.categoryId = selectedCategory;
            return row;
        });
        createExpenses(payload).then(data => {
            setLoading(false);
            setOpenSnackBar(true);
        }).catch(err => console.err(err));
    };
    const handleGroupChange = (e) => {
        setSelectedGroup(e.target.value);
    };
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };
    const handleSnackBarClose = (e) => {
        setOpenSnackBar(false);
    }
    const customToolbar = () => {
        return (
            <GridToolbarContainer>
                <FormControl sx={{m:1, minWidth:120}} size='small'>
                    <InputLabel id="select-group">Group</InputLabel>
                    <Select
                        labelId='select-group'
                        id='select-group'
                        value={selectedGroup}
                        label='Group'
                        onChange={handleGroupChange}
                    >
                        {
                            groups && groups.length > 0 &&
                            groups.map((group) => <MenuItem value={group.id} key={group.id}>{group.name}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <FormControl sx={{m:1, minWidth:120}} size='small'>
                    <InputLabel id="select-category">Category</InputLabel>
                    <Select
                        labelId='select-category'
                        id='select-category'
                        value={selectedCategory}
                        label='Category'
                        onChange={handleCategoryChange}
                    >
                        {
                            categories && categories.length > 0 &&
                            categories.map((category) => <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <Button variant='text' onClick={handleExpenseSelect}>Add as Expense</Button>
            </GridToolbarContainer>
        );
    };
    React.useEffect(() => {
        setPageLoading(true);
        if (user) {
            setPageLoading(false);
            return;
        }
        const code = searchParams.get('code');
        if (!code || code.length === 0) {
            setUser(null);
            setPageLoading(false);
            return;
        }
        setPageLoading(true);
        authorize(code).then(userData => {
            if (!userData) {
                setUser(null);
                setPageLoading(false);
                return;
            }
            setUser(userData);
            fetchGroups().then(data => setGroups(data));
            fetchCategories().then(data => {
                setCategories(data);
                setPageLoading(false);
            });
        }).catch(err => {
            console.err(err.data);
            setUser(null);
            return;
        });
    }, [searchParams, user]);
    return (
        <Box sx={{display: 'flex'}}>
            <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={handleSnackBarClose}>
                <Alert onClose={handleSnackBarClose} severity='success' sx={{width: '100%'}}>
                    Successfully added expenses to Splitwise!
                </Alert>
            </Snackbar>
            {loading && <CircularProgress  sx={{position: 'absolute', top: '40%', left: '50%'}}/>}
            {pageLoading && <CircularProgress  sx={{position: 'absolute', top: '40%', left: '50%'}}/>}
            <AppBar component='nav'>
                <Toolbar>
                    <Typography variant='h5' color='white' component='div' sx={{ flexGrow: 1, display: { xs: 'non', sm: 'block' }}}>
                        Samsaram
                    </Typography>
                    {
                        !user &&
                        <Button disabled={loading || pageLoading} sx={{color: '#ffffff'}} variant='text' onClick={login}>Login</Button>
                    }
                    {user && user.first_name && user.last_name && user.picture &&
                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Profile">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0}}>
                                <Avatar alt='Profile picture' src={user.picture}/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id='menu'
                            anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{vertical: 'top', horizontal: 'right'}}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem key='profileName'>{`${user.first_name} ${user.last_name}`}</MenuItem>
                            <MenuItem key='logout' onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                }
                </Toolbar>
            </AppBar>
            <Grid container style={{marginTop: '5rem'}}>
            {user && groups && groups.length > 0 && categories && categories.length > 0 && 
                <Grid container style={{marginTop: '2rem'}}>
                    <Grid item sm={4}></Grid>
                    <Grid item sm={2}>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="bank-selector">Bank</InputLabel>
                            <Select
                                onChange={changeBank}
                                label='Bank'
                                value={bank}
                                labelId='bank-selector'
                                id='bank-selector'
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value='icici'>ICICI</MenuItem>
                                <MenuItem value='sbi'>SBI</MenuItem>
                                <MenuItem value='axis'>Axis Bank</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={2}>
                        <Button component="label" variant='outlined' style={{margin: '0.5rem'}}>
                            Upload
                            <input hidden accept=".xlsx, .xls" type="file" onChange={setFile}/>
                        </Button>
                    </Grid>
                    <Grid item sm={3}></Grid>
                </Grid>
                }
                {
                user && groups && groups.length > 0 && rows && rows.length > 0 && 
                    <Grid container style={{marginTop: '2rem'}}>
                    <Grid item sm={2}></Grid>
                    <Grid item sm={8}>
                        <Box style={{width: '100%', display: 'flex', flexGrow: 1}}>
                        <DataGrid
                            autoHeight
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            getRowId={(row) => row.description}
                            checkboxSelection
                            onSelectionModelChange={handleRowSelection}
                            components={{
                                Toolbar: customToolbar,
                            }}
                        />
                        </Box>
                    </Grid>
                    <Grid item sm={2}></Grid>
                </Grid>
                }
            </Grid>
        </Box>
    );
}

export default Home;