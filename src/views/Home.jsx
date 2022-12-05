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

const Home = () => {
    const [user, setUser] = React.useState(null);
    const [bank, setBank] = React.useState('');
    const [selectedRows, setSelectedRows] = React.useState(null);
    const [selectedGroup, setSelectedGroup] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const [groups, setGroups] = React.useState(null);
    const [categories, setCategories] = React.useState(null);
    const [categoryMap, setCategoryMap] = React.useState({});
    const [categoryCount, setCategoryCount] = React.useState([]);
    const [paymentPie, setPaymentPie] = React.useState([]);
    const [pTypePie, setpTypePie] = React.useState([]);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([]);
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
        if (!user || !bank) {
            return;
        }
        setLoading(true);
        upload(bank, e.target.files[0]).then((data) => {
            setRows(data);
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
        setUser(null);
        setRows([]);
        setGroups(null);
        setCategories(null);
    };

    const handleRowSelection = (selectedRowIds, details) => {
        setSelectedRows(selectedRowIds);
    };

    const handleExpenseSelect = (e) => {
        setLoading(true);
        const idSet = new Set(selectedRows);
        const filteredRows = rows.filter((row) => {
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
        createExpenses(payload)
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
        if (!code || code.length === 0) {
            setUser(null);
            setLoading(false);
            return;
        }
        if (!user) {
            authorize(code)
                .then((userData) => {
                    if (!userData) {
                        setUser(null);
                        setLoading(false);
                        return;
                    }
                    setUser(userData);
                    fetchGroups().then((data) => setGroups(data));
                    fetchCategories().then((data) => {
                        setCategories(data);
                        setCategoryMap(generateCategoryMap(data));
                        setLoading(false);
                    });
                })
                .catch((err) => {
                    console.err(err.data);
                    setLoading(false);
                    setUser(null);
                    return;
                });
        }
    }, [searchParams, user]);

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
                user={user}
                anchorElUser={anchorElUser}
                handleOpenUserMenu={handleOpenUserMenu}
                handleCloseUserMenu={handleCloseUserMenu}
                handleLogout={handleLogout}
            />
            <Grid container style={{ marginTop: '5rem' }}>
                {user && groups && groups.length > 0 &&
                    categories && categories.length > 0 &&
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
                {user && groups && groups.length > 0 && rows && rows.length > 0 &&
                    <Grid container style={{ marginTop: '2rem' }}>
                        <Grid item sm={12}>
                            <ExpenseTable
                                rows={rows}
                                columns={columns}
                                categories={categories}
                                groups={groups}
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
