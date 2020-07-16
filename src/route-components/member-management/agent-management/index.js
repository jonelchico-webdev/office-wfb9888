import React, { useState, Fragment } from 'react';
import { Paper, TableCell, TableRow, Grid, Button, Typography, Divider, TextField, Select, OutlinedInput, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { SimpleTable, Loading } from '../../../components';
import Title from '../../../components/title';
import useLanguages from '../../../hooks/use-languages';
import { AGENT_MANAGEMENT } from '../../../paths';
import { AppDateRangePicker } from '../../../components/date-picker';
import { statusFilter } from '../../../values';
import usePagination from '../../../hooks/use-pagination'
import { useAgentManagementQuery } from '../../../queries-graphql/member-management/agent-management'
import NewUserDialog from '../user-management/new-user-dialog';
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
        minWidth: 60,
        backgroundColor: '#fff'
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

function AgentManagementQuery(rowsPerPage, before, after, values) {
    const { data, loading } = useAgentManagementQuery({ rowsPerPage, before, after, values })
    if (loading) {
        return null
    }

    return data
}

export default function AgentManagement(props) {
    const classes = useStyles();
    const [values, setValues] = React.useState(null);
    const [openNewUserDialog, setOpenNewUserDialog] = useState(false);
	const [show, setShow] = useState(false)
    const strings = useLanguages(AGENT_MANAGEMENT);
    const { history } = props;
    const [filterValues, setFilterValues] = React.useState({
        startDate: null,
        endDate: null,
        // accountBalance: '',
        accountNumber: '',
        // sourceURL: '',
        // VIPRating: '',
        // memberLevel: '',
        // registrationTime: '',
        selectStatus: 'all',
        // status: true,
        accountBalanceMin: '',
        accountBalanceMax: '',
        // lastLoginIP: '',
        // lastLoginTime: '',
        // numberOfDaysNotLoggedIn: null,
        fuzzySearch: false,
        // statusSwitch: true,
    });
    const pagination = usePagination()
    const { rowsPerPage, cursor: { before, after }, setCursor, setPage} = pagination;
    const affiliateProfiles = AgentManagementQuery(rowsPerPage, before, after, values)

    function handleFilterChange(event) {
        event.persist();
        if (event.target.name === "fuzzySearch") {
            if (filterValues.fuzzySearch === false) {
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
                [event.target.name]: event.target.value,
            }));
        }
    }

    const [focusedInput, setFocusedInput] = useState(null);
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

    // const [openMore, setOpenMore] = React.useState(false);

    // function openMoreClick() {
    //     setOpenMore(!openMore);
    // }

    function searchBtn() {
        setCursor({
            before: null,
            after: null
        })
        setPage(0)
        setValues(filterValues)
    }

    function handleClose() {
        setOpenNewUserDialog(false);
        setShow(false)
    }  

    console.log(filterValues)

    function clearAllBtn() {
        setFilterValues({
            startDate: null,
            endDate: null,
            // accountBalance: '',
            accountNumber: '',
            // sourceURL: '',
            // VIPRating: '',
            // memberLevel: '',
            // registrationTime: '',
            selectStatus: 'all',
            // status: true,
            accountBalanceMin: '',
            accountBalanceMax: '',
            // lastLoginIP: '',
            // lastLoginTime: '',
            // numberOfDaysNotLoggedIn: null,
            fuzzySearch: false,
            // statusSwitch: true,
        })
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // const { agentManagement } = data;

    // const statusSwitchHandle = index => event => {
    //     agentManagement[index].status = event.target.checked
    //     setNewState(event.target.checked);
    // };

    return <Paper elevation={1}>
        <Title pageTitle={strings.pageTitle} />
        <Grid container justify="space-between">
            <Typography className={classes.paper} variant="h6">{strings.agentManagement}</Typography>
            {/* <Grid className={classes.paper}>
                <Button color="primary" variant="contained" onClick={() => setOpenNewUserDialog(true)}><AddCircle style={{ marginRight: 8 }} />{strings.newAgent}</Button>
            </Grid> */}
        </Grid>
        <Divider light={true} />
        <Grid container className={classes.padding} alignItems="center" spacing={4}>
            <Grid item container direcion="row" justify="space-between">
                <Grid item container xs={9} direction="row" alignItems="center" spacing={1}>
                    <Grid item>
                        <Typography>{strings.accountNumber}:</Typography>
                        <TextField
                            className={classes.textfield}
                            variant="outlined"
                            margin="dense"
                            placeholder={strings.accountNumber}
                            name="accountNumber"
                            onChange={handleFilterChange}
                            value={filterValues.accountNumber}
                        />
                    </Grid>
                    <Grid item>
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
                    <Grid item>
                        <Typography>{strings.accountBalance}:</Typography>
                        <Grid container alignItems="center" >
                            <Grid item style={{ width: 95 }}><TextField className={classes.textfield} type="number" variant="outlined" margin="dense" name="accountBalanceMin"
                                onChange={handleFilterChange} value={filterValues.accountBalanceMin}
                            /></Grid>
                            <Grid item><Typography>-</Typography></Grid>
                            <Grid item style={{ width: 95 }}><TextField className={classes.textfield} type="number" variant="outlined" margin="dense" name="accountBalanceMax"
                                onChange={handleFilterChange} value={filterValues.accountBalanceMax}
                            /></Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography>{strings.status}:</Typography>
                        <Select
                            style={{ minWidth: 80 }}
                            margin="dense"
                            className={classes.textfield}
                            name="selectStatus"
                            value={filterValues.selectStatus}
                            onChange={handleFilterChange}
                            input={<OutlinedInput notched={false} name="selectStatus" />}
                        >
                            <MenuItem value={statusFilter.all}>{strings.all}</MenuItem>
                            <MenuItem value={statusFilter.enable}>{strings.enable}</MenuItem>
                            <MenuItem value={statusFilter.disable}>{strings.disable}</MenuItem>
                        </Select>
                    </Grid>
                    {/* ************AffiliateAgent **************** */}

                    {/* <Grid item>
                        <Typography>{strings.affiliatedAgent}:</Typography>
                        <TextField className={classes.textfield} variant="outlined" margin="dense" placeholder={strings.affiliatedAgent} name="affiliatedAgent"
                            onChange={handleFilterChange} value={filterValues.affiliatedAgent}
                        />
                    </Grid> */}

                    {/* ************ End AffiliateAgent **************** */}
                    {/* <Collapse in={openMore} timeout="auto" unmountOnExit>
                        <Grid container className={classes.padding} spacing={2} style={{ marginTop: 12 }}>
                            <Grid item>
                                <Typography>{strings.agentNumber}:</Typography>
                                <TextField className={classes.textfield} variant="outlined" margin="dense" placeholder={strings.agentNumber} name="agentNumber" onChange={handleFilterChange} value={filterValues.agentNumber} />
                            </Grid>
                            <Grid item>
                                <Typography>{strings.sourceURL}:</Typography>
                                <TextField className={classes.textfield} variant="outlined" margin="dense" placeholder={strings.sourceURL} name="sourceURL" onChange={handleFilterChange} value={filterValues.sourceURL} />
                            </Grid>
                            <Grid item>
                                <Typography>{strings.VIPRating}:</Typography>
                                <TextField className={classes.textfield} variant="outlined" margin="dense" placeholder={strings.VIPRating} name="VIPRating" onChange={handleFilterChange} value={filterValues.VIPRating} />
                            </Grid>
                        </Grid>
                    </Collapse> */}
                </Grid>
                <Grid item xs={3} container justify="flex-end" alignItems="center" spacing={1}>
                    <Grid item>
                        <FormControlLabel
                            value={true}
                            label={strings.fuzzySearch}
                            labelPlacement="end"
                            name="fuzzySearch"
                            control={<Checkbox color="primary" />}
                            onChange={handleFilterChange}
                        />
                    </Grid>
                    <Grid item>
                        <Button style={{ backgroundColor: '#f1f4f9', color: '#508FF4' }} variant="outlined" onClick={clearAllBtn}>{strings.clearAll}</Button>
                    </Grid>
                    {/* <Grid item >
                        <Button onClick={openMoreClick} style={{ backgroundColor: '#f1f4f9', color: '#508FF4' }} variant="contained" >
                            {openMore ? strings.lessQueryConditions : strings.moreQueryConditions}
                        </Button>
                    </Grid> */}

                    <Grid item>
                        <Button color="primary" variant="contained" onClick={searchBtn} >{strings.searchFor}</Button>
                    </Grid>

                </Grid>
            </Grid>
            <Grid container className={classes.padding} direction="column" >
                {
                    affiliateProfiles !== null ?
                        <SimpleTable
                            tableProps={{ size: "small" }}
                            noBorder={true}
                            hasPagination={true}
                            pagination={pagination}
                            pageInfo={affiliateProfiles.users.pageInfo}
                            count={affiliateProfiles.users.totalCount}
                            columns={
                                <TableRow>
                                    <TableCell>{strings.memberNumber}</TableCell>
                                    <TableCell>{strings.accountNumber}</TableCell>
                                    <TableCell>{strings.sourceURL}</TableCell>
                                    <TableCell>{strings.descendantsCount}</TableCell>
                                    <TableCell align="right">{strings.VIPRating}</TableCell>
                                    <TableCell align="right">{strings.memberLevel}</TableCell>
                                    <TableCell>{strings.registrationTime}</TableCell>
                                    <TableCell>{strings.status}</TableCell>
                                    <TableCell align="right">{strings.accountBalance}</TableCell>
                                    <TableCell>{strings.lastLoginIP}</TableCell>
                                    <TableCell>{strings.lastLoginTime}</TableCell>
                                    <TableCell align="right">{strings.numberOfDaysNotLoggedIn}</TableCell>
                                    <TableCell>{strings.operating}</TableCell>
                                </TableRow>
                            }
                            rows={
                                affiliateProfiles.users.edges.length === 0 ? 
                                <TableRow>
                                    <TableCell align="center" colSpan={"100%"}>没有可用数据</TableCell>
                                </TableRow>
                                :
                                affiliateProfiles.users.edges.map((o, index) => {
                                    let lastLoginNoTime = moment(o.node.lastLogin).format( 'YYYY-MM-DD')
                                    let selectedDate = moment(lastLoginNoTime)
                                    let today = moment(new Date())
                                    let noDaysNotLogin = o.node.lastLogin ? today.diff(selectedDate, 'days') : null

                                    return <TableRow>
                                        <TableCell>{o.node.pk}</TableCell>
                                        <TableCell>{o.node.username}</TableCell>
                                        <TableCell  style={{whiteSpace: "nowrap"}}>{o.node.affiliateProfile.affiliateUrl}</TableCell>
                                        <TableCell  style={{whiteSpace: "nowrap"}}>{o.node.affiliateProfile.descendantsCount}</TableCell>
                                        <TableCell align="right">{!o.node.vipRating ? 0 : o.node.vipRating}</TableCell>
                                        <TableCell align="right">{!o.nodememberLevel ? 0 : o.nodememberLevel}</TableCell>
                                        <TableCell>{moment(o.node.registeredAt).format("YYYY-MM-DD HH:MM:SS")}</TableCell>
                                        <TableCell>
                                            {o.node.isActive ? <Typography noWrap={true} style={{ color: '#689f38' }}>{strings.enable}</Typography> : <Typography color="error">{strings.disable}</Typography>}
                                        </TableCell>
                                        <TableCell align="right">{o.node.balance ? o.node.balance.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
                                        <TableCell style={{whiteSpace: "nowrap"}}>{o.node.lastLoginIp ? <Fragment>{o.node.lastLoginIp} {o.node.notes}</Fragment> : "-"} </TableCell>
                                        <TableCell>{o.node.lastLogin ? moment(o.node.lastLogin).format("YYYY-MM-DD HH:MM:SS") : "-"}</TableCell>
                                        <TableCell align="center">{o.node.lastLogin ? noDaysNotLogin : 0}</TableCell>
                                        <TableCell justify="center">
                                            <Grid container spacing={1} direction="row">
                                                <Grid item>
                                                    <Button
                                                        size="small"
                                                        // style={{ width: 80, height: 30 }}
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => history.push(`${AGENT_MANAGEMENT}/${o.node.username}`)}
                                                    >
                                                        {strings.seeDetails}
                                                    </Button>
                                                </Grid>
                                                {/* <Grid item><Button size="small" style={{width: 80, height: 30}} variant="contained">{strings.dataModification}</Button></Grid> */}
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                })
                            }
                        /> : <Loading />
                }

            </Grid>
        </Grid>
        <NewUserDialog show={show} setShow={setShow} open={openNewUserDialog} handleClose={handleClose} strings={strings} />
    </Paper>
}