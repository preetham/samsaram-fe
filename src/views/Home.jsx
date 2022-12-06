import React from 'react';
import {
    Box,
    Grid,
    Typography,
} from '@mui/material';
import Image from 'mui-image';
import { useSearchParams } from 'react-router-dom';
import {
    authorize,
    upload,
    login,
    fetchGroups,
    fetchCategories,
    createExpenses,
} from '../util/httpClient';
import {
    calculatePaymentModes,
    calculatePaymentReceivers,
} from '../util/converter';
import { MessageAlert } from '../components/MessageAlert';
import { ExpenseTable } from '../components/ExpenseTable';
import { UploadSection } from '../components/UploadSection';
import { Loader } from '../components/Loader';
import { ChartSection } from '../components/ChartSection';
import { TitleBar } from '../components/TitleBar';
import { reducer } from '../util/stateManager';

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    groups: [],
    categories: [],
    rows: [],
};

const Home = () => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const [bank, setBank] = React.useState('');
    const [selectedRows, setSelectedRows] = React.useState(null);
    const [selectedGroup, setSelectedGroup] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const [categoryMap, setCategoryMap] = React.useState({});
    const [categoryCount, setCategoryCount] = React.useState([]);
    const [paymentPie, setPaymentPie] = React.useState([]);
    const [pTypePie, setpTypePie] = React.useState([]);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [severity, setSeverity] = React.useState('info');
    const [alertMessage, setAlertMessage] = React.useState('');

    const changeBank = (e) => {
        setBank(e.target.value);
    };

    const paidToComparator = (t1, t2) => {
        return t1.name > t2.name;
    };

    const generateCategoryMap = (data) => {
        const catMap = {};
        data.forEach((d) => {
            catMap[d.id] = d.name;
        });
        return catMap;
    };

    const getCategoryName = (params) => {
        if (params && params.value) {
            return `${categoryMap[params.value] || ''}`;
        }
        return `${categoryMap[params] || ''}`;
    };

    const getCategoryCount = (data) => {
        const catCount = {};
        let totalAmount = Number(0);
        data.forEach((d) => {
            if (d.category_id && d.category_id in catCount) {
                catCount[d.category_id] =
                    Number(catCount[d.category_id]) + Number(d.amount);
            } else {
                catCount[d.category_id] = Number(d.amount);
            }
            totalAmount = totalAmount + Number(d.amount);
        });
        const pieData = [];
        for (const key in catCount) {
            pieData.push({
                id: key,
                label: getCategoryName(key),
                value: parseFloat(((catCount[key] / totalAmount) * 100).toFixed(2)),
            });
        }
        return pieData;
    };

    const setFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        if (!state.user || !bank) {
            return;
        }
        setLoading(true);
        upload(bank, e.target.files[0]).then((data) => {
            dispatch({
                type: "SET_ROWS",
                payload: data,
            });
            setPaymentPie(calculatePaymentModes(data));
            setpTypePie(calculatePaymentReceivers(data));
            setCategoryCount(getCategoryCount(data));
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
            setSeverity('error');
            setAlertMessage('Error parsing statement!');
            setOpenSnackBar(true);
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
        dispatch({
            type: "LOGOUT",
        });
    };

    const handleRowSelection = (selectedRowIds, details) => {
        setSelectedRows(selectedRowIds);
    };

    const handleExpenseSelect = (e) => {
        setLoading(true);
        const idSet = new Set(selectedRows);
        const filteredRows = state.rows.filter((row) => {
            return idSet.has(row.description);
        });
        const payload = filteredRows.map((row) => {
            row.groupId = selectedGroup;
            if (selectedCategory && selectedCategory > 0) {
                row.categoryId = Number(selectedCategory);
            } else {
                row.categoryId = Number(row.category_id);
            }
            return row;
        });
        createExpenses(payload, state.token)
            .then((data) => {
                setLoading(false);
                setSeverity('success');
                setAlertMessage('Successfully added to Splitwise!');
                setOpenSnackBar(true);
            })
            .catch((err) => {
                console.err(err);
                setSeverity('error');
                setAlertMessage('Error adding to Splitwise!');
                setOpenSnackBar(true);
            });
    };

    const handleGroupChange = (e) => {
        setSelectedGroup(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSnackBarClose = (e) => {
        setOpenSnackBar(false);
    };

    React.useEffect(() => {
        setLoading(true);
        const code = searchParams.get('code');
        const tokenStr = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        let token;
        let user;
        try {
            token = JSON.parse(tokenStr);
            user = JSON.parse(userStr);
        } catch (err) {
            setLoading(false);
            setSeverity('info');
            setAlertMessage('Please Login!');
            setOpenSnackBar(true);
        }
        if (token && token.length > 0 && user && user.id) {
            dispatch({
                type: "LOGIN",
                payload: {
                    token: token,
                    user: user
                }
            });
            if (state.groups.length === 0) {
                console.log(state);
                fetchGroups(token || state.token).then((data) => {
                    dispatch({
                        type: "SET_GROUPS",
                        payload: data,
                    });
                    setLoading(false);
                });
            }
            setLoading(true);
            if (state.categories.length === 0) {
                fetchCategories(token || state.token).then((data) => {
                    dispatch({
                        type: "SET_CATEGORIES",
                        payload: data,
                    })
                    setCategoryMap(generateCategoryMap(data));
                    setLoading(false);
                });
            }
            setLoading(false);
            return;
        }
        if (!state.user || !state.isAuthenticated) {
            if (!code || code.length === 0) {
                return;
            }
            authorize(code)
                .then((userData) => {
                    if (!userData) {
                        setLoading(false);
                        setSeverity('error');
                        setAlertMessage('Invalid Login!');
                        setOpenSnackBar(true);
                        return;
                    }
                    dispatch({
                        type: "LOGIN",
                        payload: userData,
                    });
                    if (state.groups.length === 0) {
                        fetchGroups(token || userData.token).then((data) => {
                            dispatch({
                                type: "SET_GROUPS",
                                payload: data,
                            });
                            setLoading(false);
                        });
                    }
                    if (state.categories.length === 0) {
                        fetchCategories(token || userData.token).then((data) => {
                            dispatch({
                                type: "SET_CATEGORIES",
                                payload: data,
                            })
                            setCategoryMap(generateCategoryMap(data));
                        });
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.err(err.data);
                    setLoading(false);
                    setSeverity('error');
                    setAlertMessage('Invalid Login!');
                    setOpenSnackBar(true);
                    return;
                });
        }
    }, []);

    const columns = [
        { field: 'transaction_date', headerName: 'Transaction Date', width: 200 },
        {
            field: 'transferred_to',
            headerName: 'Paid To',
            align: 'center',
            width: 350,
            sortComparator: paidToComparator,
            renderCell: (params) => (
                <>
                    {params.value && params.value.logo && params.value.name && (
                        <Image fit='contain' height='1.4rem' src={params.value.logo} />
                    )}
                    {params.value && params.value.name && !params.value.logo && (
                        <Typography variant='body2'>{params.value.name}</Typography>
                    )}
                </>
            ),
        },
        { field: 'mode', headerName: 'Payment Mode', width: 150 },
        { field: 'amount', headerName: 'Amount', width: 150 },
        {
            field: 'category_id',
            headerName: 'Category',
            type: 'string',
            width: 150,
            valueFormatter: getCategoryName,
        },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <MessageAlert
                handleSnackBarClose={handleSnackBarClose}
                duration={3000}
                severity={severity}
                openSnackBar={openSnackBar}
                message={alertMessage}
            />
            <Loader showLoader={loading} />

            <TitleBar
                title='Samsaram'
                login={login}
                loading={loading}
                user={state.user}
                anchorElUser={anchorElUser}
                handleOpenUserMenu={handleOpenUserMenu}
                handleCloseUserMenu={handleCloseUserMenu}
                handleLogout={handleLogout}
            />
            <Grid container style={{ marginTop: '5rem' }}>
                {state.isAuthenticated && !loading && state.groups && state.groups.length > 0 &&
                    state.categories && state.categories.length > 0 &&
                    <UploadSection
                        changeBank={changeBank}
                        bank={bank}
                        setFile={setFile}
                    />
                }
                {paymentPie &&
                    pTypePie &&
                    categoryCount &&
                    paymentPie.length > 0 &&
                    pTypePie.length > 0 &&
                    categoryCount.length > 0 &&
                    <ChartSection
                        paymentPie={paymentPie}
                        pTypePie={pTypePie}
                        categoryCount={categoryCount}
                    />
                }
                {state.isAuthenticated && state.groups && state.groups.length > 0 &&
                    state.rows && state.rows.length > 0 &&
                    <Grid container style={{ marginTop: '2rem' }}>
                        <Grid item sm={12}>
                            <ExpenseTable
                                rows={state.rows}
                                columns={columns}
                                categories={state.categories}
                                groups={state.groups}
                                selectedCategory={selectedCategory}
                                selectedGroup={selectedGroup}
                                handleGroupChange={handleGroupChange}
                                handleCategoryChange={handleCategoryChange}
                                handleExpenseSelect={handleExpenseSelect}
                                handleRowSelection={handleRowSelection}
                            />
                        </Grid>
                    </Grid>
                }
            </Grid>
        </Box>
    );
};

export default Home;
