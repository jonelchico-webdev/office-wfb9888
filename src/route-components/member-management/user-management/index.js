import React, { useState } from 'react';
import { Paper, TableCell, TableRow, Grid, Button, Typography, Divider, TextField, Select, OutlinedInput, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import { SimpleTable, Loading } from '../../../components';
import { GrowItem } from '../../../components';
import Title from '../../../components/title';
import useLanguages from '../../../hooks/use-languages';
import { AppDateRangePicker } from '../../../components/date-picker';
import { USER_MANAGEMENT, LOGIN } from '../../../paths';
import { AddCircle } from '@material-ui/icons';
import Switch from '@material-ui/core/Switch';
import Collapse from '@material-ui/core/Collapse';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import NewUserDialog from './new-user-dialog';
import useUserManagement, { useUserTransactionStatses } from '../../../queries-graphql/member-management/user-management';
import usePagination from '../../../hooks/use-pagination';
import moment from 'moment'

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2)
    },

    padding: {
        padding: theme.spacing(2)
    },

    padding1: {
        padding: theme.spacing(1)
    },


    clearButton: {
        height: 30
    },

    textfield: {
        backgroundColor: '#fff',
    },

    pagination: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    button: {
        ...theme.typography.body1,
        minWidth: 36
    },
    inputMarginDense: {
        paddingTop: 10.5,
        paddingBottom: 7.5
    }
}));

export default function UserManagement(props) {
    const classes = useStyles();
    const strings = useLanguages(USER_MANAGEMENT);
    const { history } = props;

    const [openNewUserDialog, setOpenNewUserDialog] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [openMore, setOpenMore] = useState(false);
    const [show, setShow] = useState(false)
    const [filterValues, setFilterValues] = useState({
        username: '',
        startDate: null,
        endDate: null,
        accountBalance: '',
        accountNumber: '',
        sourceURL: '',
        vipLevel: '',
        pk: null,
        memberLevel: '',
        affiliatedAgent: '',
        registrationTime: '',
        selectStatus: '',
        status: 'all',
        accountBalanceMin: null,
        accountBalanceMax: null,
        lastLoginIP: '',
        lastLoginTime: '',
        numberOfDaysNotLoggedIn: null,
        fuzzySearch: false,
        statusSwitch: true,
        perPage: 15
    });
    const [searchValue, setSearchValue] = useState(filterValues)


    function handleFilterChange(event) {
        event.persist();
        let x = event.target.value
        if (event.target.name === "accountBalanceMin" || event.target.name === "accountBalanceMax") {
            if (x < 0) {
                x = 0
            }
            parseInt(x)
        }


        if (event.target.name === "pk") {
            if (x < 0) {
                x = 0
            }
            parseInt(x)
        }
        if (event.target.name == "fuzzySearch") {
            if (filterValues.fuzzySearch == false) {
                setFilterValues(oldValues => ({
                    ...oldValues,
                    [event.target.name]: event.target.value,
                }));
            } else {
                setFilterValues(oldValues => ({
                    ...oldValues,
                    [event.target.name]: false,
                }));
            }
        } else {
            setFilterValues(oldValues => ({
                ...oldValues,
                [event.target.name]: x,
            }));
        }



    }

    function clickSearch() {
        setCursor({
            before: null,
            after: null
        })
        setPage(0)
        setSearchValue(filterValues)
    }

    function handleClose() {
        setOpenNewUserDialog(false);
        setShow(false)
    }
    function onDatesChange({ startDate, endDate }) {
        setFilterValues(oldValues => ({
            ...oldValues,
            startDate,
            endDate
        }));
    }
    function onFocusChange(f) {
        setFocusedInput(f);
    }
    function handleClickOpen() {
        setOpenNewUserDialog(true);
    }
    function btnClear() {
        setFilterValues({
            username: '',
            startDate: null,
            endDate: null,
            accountBalance: '',
            accountNumber: '',
            sourceURL: '',
            pk: null,
            vipLevel: '',
            memberLevel: '',
            affiliatedAgent: '',
            registrationTime: '',
            selectStatus: '',
            status: 'all',
            accountBalanceMin: '',
            accountBalanceMax: '',
            lastLoginIP: '',
            lastLoginTime: '',
            numberOfDaysNotLoggedIn: null,
            fuzzySearch: false,
            statusSwitch: true,
            perPage: 15
        })
    }
    // const IOSSwitch = withStyles(theme => ({
    //     root: {
    //         width: 27,
    //         height: 17,
    //         padding: 0,
    //     },
    //     switchBase: {
    //         padding: 2,
    //         color: theme.palette.grey[500],
    //         '&$checked': {
    //             transform: 'translateX(12px)',
    //             color: "#689f38",
    //             '& + $track': {
    //                 opacity: 1,
    //                 backgroundColor: "#fff",
    //                 border: "2px solid #d84315",
    //             },
    //         },
    //     },
    //     thumb: {
    //         width: 10,
    //         height: 10,
    //         boxShadow: 'none',
    //         marginTop: 1,
    //     },
    //     track: {
    //         border: `2px solid ${theme.palette.grey[500]}`,
    //         paddingLeft: 6,
    //         borderRadius: 16 / 2,
    //         opacity: 1,
    //         backgroundColor: theme.palette.common.white,
    //     },
    //     checked: {},
    // }))(Switch);

    function openMoreClick() {
        setOpenMore(!openMore);
    }

    const pagination = usePagination();
    const { rowsPerPage, cursor: { before, after }, page, setCursor, setPage } = pagination;
    const { data, loading } = useUserManagement({
        username: searchValue.accountNumber ? searchValue.accountNumber : "",
        balanceMin: searchValue.accountBalanceMin !== '' ? searchValue.accountBalanceMin : "",
        balanceMax: searchValue.accountBalanceMax !== '' ? searchValue.accountBalanceMax : "",
        memberLevel_Name: searchValue.memberLevel !== '' ? searchValue.memberLevel : "",
        vipLevel_Name: searchValue.vipLevel !== '' ? searchValue.vipLevel : "",
        pk: searchValue.pk !== '' ? searchValue.pk : "",
        status: searchValue.status !== '' ? searchValue.status : "",
        startAt: searchValue.startDate && searchValue.startDate ? searchValue.startDate.format("YYYY-MM-DD").toString() : "",
        endAt: searchValue.endDate && searchValue.endDate ? searchValue.endDate.format("YYYY-MM-DD").toString() : "",
        rowsPerPage,
        before,
        after,
        page,
        fuzzySearch: searchValue.fuzzySearch
    });

    if (loading) {
        return <Loading />;
    }


    const userAccounts = data.users.edges;
    const userAccountsPageInfo = data.users.pageInfo;
    const count = data.users.totalCount;

    return <Paper elevation={1}>
        <Title pageTitle={strings.pageTitle} />
        <Grid container justify="space-between">
            <Typography className={classes.paper} variant="h6">{strings.userManagement}</Typography>
            <Grid className={classes.paper}>
                <Button color="primary" onClick={handleClickOpen} variant="contained"><AddCircle style={{ marginRight: 8 }} />{strings.newUsers}</Button>
            </Grid>
        </Grid>
        <Divider light={true} />
        <Grid container className={classes.padding} alignItems="center" spacing={2}>

            <Grid item container alignItems="center" spacing={2}>
                <Grid item   >
                    <Typography>{strings.accountNumber}:</Typography>
                    <TextField className={classes.textfield} style={{ width: 120 }} variant="outlined" margin="dense" placeholder={strings.accountNumber} name="accountNumber" onChange={handleFilterChange} value={filterValues.accountNumber}
                    />
                </Grid>
                <Grid item  >
                    <Typography>{strings.registrationTime}:</Typography>
                    <AppDateRangePicker
                        focusedInput={focusedInput}
                        onFocusChange={onFocusChange}
                        onDatesChange={onDatesChange}
                        startDate={filterValues.startDate}
                        endDate={filterValues.endDate}
                        startDateId="startDate"
                        endDateId="endDate"
                        startDatePlaceholderText={strings.startDate}
                        endDatePlaceholderText={strings.endDate}
                        inputIconPosition="after"
                        showDefaultInputIcon
                        small
                        isOutsideRange={() => false}
                    />
                </Grid>
                <Grid item  >
                    <Typography>{strings.accountBalance}:</Typography>
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item style={{ width: 95 }}><TextField className={classes.textfield} inputProps={{ min: 0 }} type="number" variant="outlined" margin="dense" name="accountBalanceMin"
                            onChange={handleFilterChange} value={filterValues.accountBalanceMin}
                        /></Grid>
                        <Grid item><Typography>-</Typography></Grid>
                        <Grid item style={{ width: 95 }}>
                            <TextField className={classes.textfield} type="number" variant="outlined" inputProps={{ min: 0 }} margin="dense" name="accountBalanceMax"
                                onChange={handleFilterChange} value={filterValues.accountBalanceMax} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item    >
                    <Typography>{strings.status}:</Typography>
                    <Select
                        margin="dense"
                        style={{ width: 100 }}
                        className={classes.textfield}
                        name={"status"}
                        value={filterValues.status}
                        displayEmpty
                        onChange={handleFilterChange}
                        input={<OutlinedInput notched={false} name="selectStatus" />}
                    >
                        <MenuItem value={"all"}>{strings.all}</MenuItem>
                        <MenuItem value={"enable"}>{strings.enabled}</MenuItem>
                        <MenuItem value={"disable"}>{strings.disabled}</MenuItem>
                    </Select>
                </Grid>
                <Grid item  >
                    <Typography>{strings.affiliatedAgent}:</Typography>
                    <TextField className={classes.textfield} style={{ width: 120 }} variant="outlined" margin="dense" placeholder={strings.affiliatedAgent} name="affiliatedAgent"
                        onChange={handleFilterChange} value={filterValues.affiliatedAgent}
                    />
                </Grid>

                <GrowItem />
                <Grid item  >
                    <Button color="primary" onClick={btnClear}  >{strings.clearAll}</Button>
                </Grid>
                {/* <Grid item  >
                    <FormControlLabel
                        value={true}
                        label={strings.fuzzySearch}
                        labelPlacement="end"
                        name="fuzzySearch"
                        control={<Checkbox color="primary" />}
                        onChange={handleFilterChange}
                    />
                </Grid> */}
                <Grid item  >
                    <Button onClick={openMoreClick} color="primary" >
                        {openMore ? strings.lessQueryConditions : strings.moreQueryConditions}
                        {openMore ? <ExpandLess /> : <ExpandMore />}
                    </Button>
                </Grid>
                <Grid item  >
                    <Button color="primary" onClick={clickSearch} variant="contained" >{strings.searchFor}</Button>
                </Grid>
            </Grid>
            <Collapse in={openMore} timeout="auto" unmountOnExit>
                <List>
                    <ListItem>
                        <Grid container spacing={2}>

                            <Grid item  >
                                <Typography>{strings.memberNumber}:</Typography>
                                <TextField className={classes.textfield} type="number" variant="outlined" margin="dense" placeholder={strings.memberNumber} name="pk" onChange={handleFilterChange} value={filterValues.pk} />
                            </Grid>
                            <Grid item >
                                <Typography>{strings.memberLevel}:</Typography>
                                <TextField className={classes.textfield} variant="outlined" margin="dense" placeholder={strings.memberLevel} name="memberLevel" onChange={handleFilterChange} value={filterValues.memberLevel} />
                            </Grid>
                            <Grid item >
                                <Typography>{strings.VIPRating}:</Typography>
                                <TextField className={classes.textfield} variant="outlined" margin="dense" placeholder={strings.VIPRating} name="vipLevel" onChange={handleFilterChange} value={filterValues.vipLevel} />
                            </Grid>
                        </Grid>
                        {/* <Grid item style={{width: 120}} >
                            <Typography>{strings.userName}:</Typography>
                            <TextField className={classes.textfield} variant="outlined" margin="dense" placeholder={strings.userName} name="userName" onChange={handleFilterChange} value={filterValues.userName} />
                        </Grid> */}
                    </ListItem>
                </List>
            </Collapse>
            <Grid container direction="column" className={classes.padding1}>
                <SimpleTable
                    tableProps={{ size: "small" }}
                    hasPagination={true}
                    pageInfo={userAccountsPageInfo}
                    pagination={pagination}
                    count={count}
                    noBorder={true}
                    columns={
                        <TableRow>
                            <TableCell>{strings.memberNumber}</TableCell>
                            <TableCell>{strings.accountNumber}</TableCell>
                            <TableCell>{strings.VIPRating}</TableCell>
                            <TableCell>{strings.memberLevel}</TableCell>
                            <TableCell>{strings.affiliatedAgent}</TableCell>
                            <TableCell>{strings.registrationTime}</TableCell>
                            <TableCell>{strings.status}</TableCell>
                            <TableCell align="right">{strings.accountBalance}</TableCell>
                            <TableCell align="right">{strings.totalDepositAmount}</TableCell>
                            <TableCell align="right">{strings.totalWithdrawalAmount}</TableCell>
                            <TableCell>{strings.phoneNumber}</TableCell>
                            <TableCell>{strings.lastLoginIP}</TableCell>
                            <TableCell>{strings.lastLoginTime}</TableCell>
                            <TableCell>{strings.numberOfDaysNotLoggedIn}</TableCell>
                            <TableCell>{strings.operating}</TableCell>
                        </TableRow>
                    }
                    rows={
                        userAccounts.length === 0 ?
                            <TableRow>
                                <TableCell align="center" colSpan={15}>{strings.nothing}</TableCell>
                            </TableRow>
                            :
                            userAccounts.map((o, index) => {
                                let lastLogin = new Date(o.node.lastLogin)
                                let dateNow = new Date()
                                let diffTime = dateNow.getTime() - lastLogin.getTime()
                                let result = diffTime / (1000 * 3600 * 24)

                                return <TableRow key={index}>
                                    <TableCell align="center">{o.node.pk}</TableCell>
                                    <TableCell>{o.node.username}</TableCell>
                                    <TableCell>{o.node.vipLevel ? o.node.vipLevel.name : "-"}</TableCell>
                                    <TableCell>{o.node.memberLevel ? o.node.memberLevel.name : "-"}</TableCell>
                                    <TableCell>{o.node.affiliateProfile ? o.node.affiliateProfile.parent ? o.node.affiliateProfile.parent.user ? o.node.affiliateProfile.parent.user.username : "-" : "-" : "-"}</TableCell>
                                    <TableCell>{o.node.registeredAt ? moment(o.node.registeredAt).format("YYYY-MM-DD hh:mm:ss") : "-"}</TableCell>
                                    <TableCell >
                                        <Typography style={{ width: 50 }} color={o.node.isActive === true ? "secondary" : "error"}>{o.node.isActive === true ? strings.enabled : strings.disabled}</Typography>
                                    </TableCell>
                                    <TableCell align="right">{o.node.balance ? o.node.balance.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
                                    <TableCell align="right">{
                                        o.node.userTransaction.edges.length > 0 ? o.node.userTransaction.edges.map((item) =>
                                            item.node.depositTotal.toLocaleString('en', {maximumFractionDigits:2})
                                        ): "-"}</TableCell>
                                    <TableCell align="right">{
                                        o.node.userTransaction.edges.length > 0 ? o.node.userTransaction.edges.map((item) =>
                                            item.node.withdrawalTotal.toLocaleString('en', {maximumFractionDigits:2})
                                        ): "-"}</TableCell>
                                    <TableCell align="right">{o.node.phone ? o.node.phone : "-"}</TableCell>
                                    <TableCell>{o.node.lastLoginIp ? o.node.notes ? o.node.lastLoginIp + " " + o.node.notes : o.node.lastLoginIp : "-"}</TableCell>
                                    <TableCell>{o.node.lastLogin ? moment(o.node.lastLogin).format("YYYY-MM-DD hh:mm:ss") : "-"}</TableCell>
                                    <TableCell align="center">{o.node.lastLogin && o.node.lastLoginIp ? parseInt(result) : "-"}</TableCell>
                                    <TableCell>
                                        <Button color="primary" variant="contained" onClick={() => history.push(`${USER_MANAGEMENT}/${o.node.username}`)}>
                                            {strings.seeDetails}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            })
                    }
                />
            </Grid>
        </Grid>
        <NewUserDialog show={show} setShow={setShow} open={openNewUserDialog} handleClose={handleClose} strings={strings} />
    </Paper>
}