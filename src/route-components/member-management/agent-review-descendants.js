import React, { useState, Fragment } from 'react';
import { Paper, TableCell, TableRow, Grid, Button, Typography, Divider, TextField, OutlinedInput, Input, Select, MenuItem } from '@material-ui/core';
import { SimpleTable } from '../../components';
import { GrowItem } from '../../components';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import { AGENT_REVIEW } from '../../paths';
// import { AGENT_REVIEW_QUERY } from '../../queries/member-management';
// import { Query } from 'react-apollo';
import { AppDateRangePicker } from '../../components/date-picker';
import { statusesValues } from '../../values';
import Title from '../../components/title';
import { Loading } from '../../components';
// import useUserManagement, {  useUserBankCardQuery } from '../../queries-graphql/member-management/user-management';
import { useAgentReviewDescendantsQuery } from '../../queries-graphql/member-management/agent-review-descendants/query/agent-review-descendants'
import usePagination from '../../hooks/use-pagination'
import moment from 'moment'
// import { AGENT_REVIEW_STATUS_MUTATION } from '../../queries-graphql/member-management/agent-review/mutation/agent-review-mutation'


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    paper: {
        padding: theme.spacing(2)
    },
    fuzzy: {
        paddingLeft: theme.spacing(1)
    },
    textfield: {
        backgroundColor: '#ffffff',
    },
    fontColor: {
        color: 'textSecondary'
    },
    green: {
        backgroundColor: '#4caf50',
        minWidth: "10em",
        color: 'white',
        fontSize: 15,
        borderRadius: "0.3em",
        padding: theme.spacing(.5),
        "& option": {
            color: '#000'
        }
    },
    red: {
        backgroundColor: '#f44336',
        minWidth: "10em",
        color: 'white',
        fontSize: 15,
        borderRadius: "0.3em",
        padding: theme.spacing(.5),
        "& option": {
            color: '#000'
        }
    },

    blue: {
        backgroundColor: '#508FF4',
        minWidth: "10em",
        color: 'white',
        fontSize: 15,
        fontWeight: "bold",
        borderRadius: "0.3em",
        padding: theme.spacing(.5),
        "& option": {
            color: '#000'
        }
    },
    color: {
        color: 'black'
    },
    bankCardCointainer: {
        backgroundColor: '#FFFFFF',
        width: '50vh',
        height: '25vh',
        padding: '30px',
        marginLeft: '20px'
    },
    img: {
        maxWidth: 250,
        height: 50,
        objectFit: "cover"
    }
}));

export default function AgentReview(props) {
    const classes = useStyles();
    const strings = useLanguages(AGENT_REVIEW);
    const [filterValues, setFilterValues] = React.useState({
        accountNumber: '',
        startDate: null,
        endDate: null,
        accountBalanceMin: '',
        accountBalanceMax: '',
        status: '',
        affiliatedAgent: '',
        fuzzySearch: false,
    });

    const [filter, setFilter] = React.useState({
        filterValues: [],
        startDate: "",
        endDate: ""
    })

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
    function onFocusChange(f) {
        setFocusedInput(f);
    }

    function onDatesChange({ startDate, endDate }) {
        setFilterValues(oldValues => ({
            ...oldValues,
            startDate,
            endDate
        }));
    }

    function searchFor() {
        setCursor({
            before: null,
            after: null
        })
        setPage(0)
        setFilter(filterValues)
        if (filterValues.startDate === null && filterValues.endDate === null) {
            setFilter({
                filterValues: filterValues,
                startDate: "",
                endDate: ""
            })
        } else {
            setFilter({
                filterValues: filterValues,
                startDate: filterValues.startDate.format("YYYY-MM-DD").toString(),
                endDate: filterValues.endDate.format("YYYY-MM-DD").toString()
            })
        }
    }


    const [open, setOpen] = React.useState(false);
    const [setOpenTab] = React.useState(null);

    function handleClose() {
        setOpen(false);
        setOpenTab(null)
    }
    function handleClick(event) {
        setOpen(true);
        setOpenTab(event.currentTarget.id);
    }

    const pagination = usePagination();
    const { rowsPerPage, cursor: { before, after }, setCursor, setPage } = pagination;
    const { data, loading } = useAgentReviewDescendantsQuery({
        rowsPerPage,
        before,
        after,
        affiliateProfile_Status_In: "pending, confirmed, cancelled",
        username_Icontains: filter.filterValues.accountNumber,
        affiliateProfile_Status: filter.filterValues.status,
        startAt: filter.startDate, 
        endAt: filter.endDate
        // username_Icontains: filter.filterValues.username_Icontains, 
        // startAt: filter.startDate, 
        // endAt: filter.endDate,
        // balanceMin: filter.filterValues.balanceMin,
        // balanceMax: filter.filterValues.balanceMax,
        // isActive: filter.filterValues.status === "active" ? true : filter.filterValues.status === "inactive"? false : null,
        // affiliateProfile_Parent_User_Username: filter.filterValues.affiliateProfile_Parent_User_Username,
    })
    if (loading) {
        return <Loading />
    }

    const agentReview = data.descendants.edges;
    const pageInfo = data.descendants.pageInfo;
    const count = data.descendants.totalCount



    // return <Query query={AGENT_REVIEW_QUERY} client={mockClient}>
    //     {({ loading, error, data }) => {
    //         if (loading) return <div />;
    //         const { agentReview } = data;

    function onChangeClear() {
        setFilterValues(oldValues => ({
            ...oldValues,
            accountNumber: '',
            startDate: null,
            endDate: null,
            accountBalanceMin: '',
            accountBalanceMax: '',
            status: '',
            affiliatedAgent: ''
        }));
    }



    return <Paper elevation={1}>
        <Title pageTitle={strings.agentReview} />
        <Grid container direction="row" justify="space-between" alignItems="center">
            <Typography className={classes.paper} variant="h6">{strings.agentReview}</Typography>
            {/* <Grid className={classes.paper}>
                        <Button color="primary" variant="contained" style={{ fontSize: 15 }}><AddCircle style={{ marginRight: 5 }} />  {strings.addNewAgent}</Button>
                    </Grid> */}
        </Grid>
        <Divider light={true} />
        <Grid container className={classes.paper} alignItems="center" spacing={1}>
            <Grid item>
                <Typography>{strings.accountNumber}:</Typography>
            </Grid>
            <Grid item>
                <TextField
                    style={{ width: 130 }}
                    className={classes.textfield}
                    variant="outlined"
                    margin="dense"
                    placeholder={strings.pleaseEnter}
                    name="accountNumber"
                    onChange={handleFilterChange}
                    value={filterValues.accountNumber}
                />
            </Grid>
            <Grid item>
                <Typography>{strings.registrationTime}:</Typography>
            </Grid>
            <Grid item>
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
            {/* <Grid item>
                <Typography>{strings.accountBalance}:</Typography>
            </Grid> */}
            {/* <Grid item>
                <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                        <TextField
                            className={classes.textfield}
                            style={{ width: 80 }}
                            type="number"
                            variant="outlined"
                            margin="dense"
                            name="accountBalanceMin"
                            onChange={handleFilterChange}
                            value={filterValues.accountBalanceMin}
                        />
                    </Grid>
                    <Grid item><Typography>-</Typography></Grid>
                    <Grid item>
                        <TextField
                            className={classes.textfield}
                            style={{ width: 80 }}
                            type="number"
                            variant="outlined"
                            margin="dense"
                            name="accountBalanceMax"
                            onChange={handleFilterChange}
                            value={filterValues.accountBalanceMax}
                        />
                    </Grid>
                </Grid>
            </Grid> */}
            <Grid item>
                <Typography>{strings.status}:</Typography>
            </Grid>
            <Grid item>
                <Select margin="dense"
                    style={{ minWidth: 80 }}
                    className={classes.textfield}
                    name="status"
                    displayEmpty
                    value={filterValues.status}
                    onChange={handleFilterChange}
                    input={<OutlinedInput notched={false} name="status" />}
                >
                    <MenuItem value={""}>{strings.all}</MenuItem>
                    <MenuItem value={statusesValues.confirmed}>{strings.confirm}</MenuItem>
                    <MenuItem value={statusesValues.cancelled}>{strings.cancelled}</MenuItem>
                    <MenuItem value={statusesValues.pending}>{strings.pendingReview}</MenuItem>
                </Select>
            </Grid>
            {/* <Grid item>
                        <Typography>{strings.affiliatedAgent}:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            style={{ width: 100 }}
                            className={classes.textfield}
                            variant="outlined"
                            margin="dense"
                            name="affiliatedAgent"
                            placeholder={strings.pleaseEnter}
                            onChange={handleFilterChange}
                            value={filterValues.affiliatedAgent}
                        />
                    </Grid> */}

            {/* <Grid item className={classes.fuzzy} alignItems="center" spacing={1}>
                <FormControlLabel
                    value={true}
                    label={<Typography color="textSecondary">{strings.fuzzySearch}</Typography>}
                    labelPlacement="end"
                    name="fuzzySearch"
                    control={<Checkbox color="primary" />}
                    onChange={handleFilterChange}
                />
            </Grid> */}
            <GrowItem />
            {/* <Grid item>
                        <Button color="primary" variant="text">+ {strings.moreQueryConditions}</Button>
                    </Grid> */}
            <Grid item>
                <Button color="primary" variant="text" onClick={onChangeClear}>{strings.clearAll}</Button>
            </Grid>
            <Grid item justify="flex-end">
                <Button onClick={() => searchFor()} color="primary" variant="contained" style={{ fontSize: 15 }}>{strings.searchFor}</Button>
            </Grid>

        </Grid>
        <Grid className={classes.paper} item style={{ paddingTop: 0 }}>
            <SimpleTable
                tableProps={{ size: "small" }}
                hasPagination={true}
                noBorder={true}
                pagination={pagination}
                pageInfo={pageInfo}
                count={count}
                cols={8}
                columns={
                    <TableRow>
                        <TableCell align="right">{strings.memberNumber}</TableCell>
                        <TableCell>{strings.accountNumber}</TableCell>
                        <TableCell>{strings.sourceURL}</TableCell>
                        <TableCell>{strings.registrationTime}</TableCell>
                        <TableCell>{strings.registeredIP}</TableCell>
                        <TableCell>{strings.status}</TableCell>
                        {/* <TableCell>{strings.currentlySelected}</TableCell> */}
                        <TableCell>{strings.reviewer}</TableCell>
                        <TableCell>{strings.lastLoginTime}</TableCell>
                    </TableRow>
                }
                rows={
                    agentReview.length === 0 ? 
                            <TableRow>
                                <TableCell align="center" colSpan={8}>{"没有可用数据"}</TableCell>
                            </TableRow>
						    :
                    agentReview.map((o, index) => {
                        return (
                            
                            <Fragment>
                                <TableRow key={index}>
                                    <TableCell align="right">{o.node.pk}</TableCell>

                                    <TableCell style={{ minWidth: 250, maxWidth: 250 }} id={index} button onClick={!open ? handleClick : handleClose} >
                                        <Typography style={{ display: "inline-block" }} >{o.node.username}</Typography>
                                    </TableCell>

                                    <TableCell>{o.node.affiliateProfile ? o.node.affiliateProfile.affiliateUrl : null}</TableCell>
                                    <TableCell>{moment(o.node.registeredAt).format("YYYY-MM-DD HH:MM:SS")}</TableCell>
                                    <TableCell>{o.node.lastLoginIp ? o.node.notes ? o.node.lastLoginIp + " " + o.node.notes : o.node.lastLoginIp : null}</TableCell>
                                    <TableCell>
                                        <Grid item>
                                            <Select
                                                margin="dense"
                                                className={o.node.affiliateProfile.status === "confirmed" ? classes.green : o.node.affiliateProfile.status === "cancelled" ? classes.red : classes.blue}
                                                name="statusReview"
                                                value={o.node.affiliateProfile.status === "confirmed" ? statusesValues.confirmed : o.node.affiliateProfile.status === "cancelled" ? statusesValues.cancelled : statusesValues.pending}
                                                // onChange={onStatusReviewChange(o.node.affiliateProfile.id, index, o.node.username)}
                                                disabled={true}
                                                style={{color:"white"}}
                                                disableUnderline
                                                IconComponent={'disabled'}
                                                input={<Input notched={false} name="statusReview" />}
                                            >
                                                <MenuItem value={statusesValues.confirmed}>{strings.confirm}</MenuItem>
                                                <MenuItem value={statusesValues.cancelled}>{strings.cancelled}</MenuItem>
                                                <MenuItem value={statusesValues.pending}>{strings.pendingReview}</MenuItem>
                                            </Select>
                                        </Grid>
                                    </TableCell>
                                    {/* <TableCell>
                                                <InputLabel htmlFor="select-multiple-checkbox">{strings.agentLine}</InputLabel>
                                                <Select
                                                    multiple
                                                    value={personName}
                                                    onChange={handleChange(index)}
                                                    input={<Input style={{ width: '15vh' }} id="select-multiple-checkbox" />}
                                                    renderValue={selected => selected.join(', ')}
                                                    MenuProps={MenuProps}
                                                >
                                                    {names.map(name => (
                                                        <MenuItem key={name} value={name}>
                                                            <Checkbox checked={personName.indexOf(name) > -1} />
                                                            <ListItemText primary={name} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>

                                            </TableCell> */}
                                    <TableCell>{o.node.affiliateProfile ? o.node.affiliateProfile.statusChangedBy ? o.node.affiliateProfile.statusChangedBy.username : null : null}</TableCell>
                                    <TableCell>{o.node.lastOnlineAt ? moment(o.node.lastOnlineAt).format("YYYY-MM-DD HH:MM:SS") : null}</TableCell>
                                </TableRow>
                            


                            </Fragment>
                        )

                    })

                }

            />
        </Grid>
    </Paper>
}
//     }
//     </Query>
// }