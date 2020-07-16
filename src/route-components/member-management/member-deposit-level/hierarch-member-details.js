import React, { useState } from 'react';
import {
    TableCell,
    TableRow,
    FormControlLabel,
    TextField,
    Grid,
    Paper,
    Typography,
    Divider,
    Checkbox,
    Select,
    MenuItem,
    OutlinedInput,
    Button,
    Box
} from '@material-ui/core';
import Title from '../../../components/title';
import { Loading, GrowItem, SimpleTable } from '../../../components';
import useLanguages from '../../../hooks/use-languages';
import { AppDateRangePicker } from '../../../components/date-picker';
import { MEMBER_DEPOSIT_LEVEL } from '../../../paths';
import { MEMBER_DEPOSIT_LEVEL_HIERARCHY_MEMBER_DETAILS_ITEM_QUERY } from '../../../queries/member-management';
import { Lock } from '@material-ui/icons';

import { statusFilter } from '../../../values';
import { Query } from 'react-apollo';
import { makeStyles } from '@material-ui/core/styles';
import { mockClient } from '../../../App'
import usePagination from '../../../hooks/use-pagination'

// import Dividerz from 'muicss/lib/react/divider';

const useStyles = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(2)
    },
    textfield: {
        backgroundColor: '#ffffff',
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
    buttonRed: {
        color: "#ff0000",
        '&:hover': {
            backgroundColor: "#ffcccc",
        }
    }
}));


export default function MemberDepositLevelHierarchyMemberDetails(props) {
    const strings = useLanguages(MEMBER_DEPOSIT_LEVEL);
    const classes = useStyles();

    const pagination = usePagination()
    const [filterValues, setFilterValues] = React.useState({
        startDate: null,
        endDate: null,
        status: 'all',
        accountNumber: '',
        id: '',
        totalGeneration: '',
    });

    function handleFilterChange(event) {
        event.persist();
        setFilterValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value
        }));

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

    function onChangeClear() {
        setFilterValues(oldValues => ({
            ...oldValues,
            startDate: null,
            endDate: null,
            status: 'ALL',
            accountNumber: '',
            id: '',
            totalGeneration: '',
        }));
    }



    return <Query query={MEMBER_DEPOSIT_LEVEL_HIERARCHY_MEMBER_DETAILS_ITEM_QUERY} client={mockClient}>
        {({ loading, error, data }) => {
            if (loading) return <Loading />;
            const { hierarchyMemberDetails } = data;

            const isLockClick = index => event => {
                if (event.target.value === 0) {
                    hierarchyMemberDetails[index].isLock = 1
                    setFilterValues(oldValues => ({
                        ...oldValues,
                    }));
                } else if (event.target.value === 1) {
                    hierarchyMemberDetails[index].isLock = 0
                    setFilterValues(oldValues => ({
                        ...oldValues,
                    }));
                }
            }
            return <Paper elevation={1} className={classes.paper}>
                <Title pageTitle={strings.hierarchyMemberDetailss} />
                <Grid container spacing={2} alignItems="center">
                    <Grid item direction="column" >
                        <Typography>{strings.accountNumber}:</Typography>
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
                    <Grid item direction="column" >
                        <Typography>{strings.totalGeneration}:</Typography>
                        <TextField
                            style={{ width: 130 }}
                            className={classes.textfield}
                            variant="outlined"
                            margin="dense"
                            placeholder={strings.pleaseEnter}
                            name="totalGeneration"
                            onChange={handleFilterChange}
                            value={filterValues.totalGeneration}
                        />
                    </Grid>
                    <Grid item direction="column" >
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
                    <Grid item direction="column" >
                        <Typography>{strings.status}:</Typography>
                        <Select margin="dense"
                            className={classes.textfield}
                            name="status"
                            value={filterValues.status}
                            onChange={handleFilterChange}
                            input={<OutlinedInput notched={false} name="status" />}
                        >
                            <MenuItem value={statusFilter.all}>{strings.all}</MenuItem>
                            <MenuItem value={statusFilter.confirm}>{strings.confirm}</MenuItem>
                            <MenuItem value={statusFilter.reject}>{strings.reject}</MenuItem>
                            <MenuItem value={statusFilter.pendingReview}>{strings.pendingReview}</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item>
                        <Button style={{ marginTop: 20 }} color="primary" variant="text" onClick={onChangeClear}>{strings.clearAll}</Button>
                    </Grid>
                    <GrowItem />
                    <Grid item justify="flex-end">
                        <Button color="primary" variant="contained"  >{strings.searchFor}</Button>
                    </Grid>


                </Grid>
                <Grid container style={{ marginLeft: 1, marginBottom: 5 }} alignItems="center" spacing={1}  >
                    <FormControlLabel
                        value={true}
                        label={<Typography color="textSecondary">{strings.fuzzySearch}</Typography>}
                        labelPlacement="end"
                        name="fuzzySearch"
                        control={<Checkbox color="primary" />}
                        onChange={handleFilterChange}
                    />
                </Grid>

                <Divider />
                <Box my={1}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item direction="column" >


                            <Button style={{ fontSize: "14px" }} color="primary">{strings.selectAll}</Button>

                            <Button className={classes.buttonRed}>
                                {strings.batchLock}
                            </Button>
                            <Button color="secondary" >
                                {strings.bulkUnlock}
                            </Button>


                            <Button style={{ fontSize: "14px" }} color="primary">{strings.batchChange}</Button>
                        </Grid>
                    </Grid>
                </Box>
                <Grid item style={{ paddingTop: 0 }}>
                    <SimpleTable
                        tableProps={{ size: "small" }}
                        hasPagination={false}
                        pagination={pagination}
                        pageInfo={false}
                        count={hierarchyMemberDetails.length}
                        columns={
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>{strings.accountNumber}</TableCell>
                                <TableCell>{strings.affiliatedAgent}</TableCell>
                                <TableCell>{strings.totalGeneration}</TableCell>
                                <TableCell>{strings.addTime}</TableCell>
                                <TableCell>{strings.addTime}</TableCell>
                                <TableCell>{strings.totalDeposit}</TableCell>
                                <TableCell>{strings.numberOfWithdrawals}</TableCell>
                                <TableCell >{strings.balance}</TableCell>
                                <TableCell >{strings.memberShipLevel}</TableCell>
                                <TableCell >{strings.whetherToLock}</TableCell>
                            </TableRow>
                        }
                        rows={
                            hierarchyMemberDetails.length === 0 ?
                                <TableRow>
                                    <TableCell align="center" colSpan={12}>没有可用数据</TableCell>
                                </TableRow>
                                :
                                hierarchyMemberDetails.map((o, index) => <TableRow key={index}>
                                    <TableCell>
                                        <FormControlLabel
                                            value={true}
                                            labelPlacement="end"
                                            control={<Checkbox color="primary" />}
                                            onChange={handleFilterChange}
                                        />
                                    </TableCell>
                                    <TableCell>{o.id}</TableCell>
                                    <TableCell>{o.accountNumber}</TableCell>
                                    <TableCell>{o.affiliatedAgent}</TableCell>
                                    <TableCell>{o.totalGeneration}</TableCell>
                                    <TableCell>{o.registrationTime}</TableCell>
                                    <TableCell>{o.lastLoginTime}</TableCell>
                                    <TableCell>{o.totalDeposit}</TableCell>
                                    <TableCell>{o.numberOfWithdrawals}</TableCell>
                                    <TableCell>{o.balance}</TableCell>
                                    <TableCell >{o.affiliatedAgent}</TableCell>
                                    <TableCell>
                                        <Button data-value={o.isLock} onClick={isLockClick(index)} color={o.isLock === 1 ? "secondary" : null} className={o.isLock === 1 ? null : classes.buttonRed} >
                                            <Lock value="salock" id="1" />
                                        </Button>
                                        {/* jerico */}
                                    </TableCell>
                                </TableRow>)
                        }
                    />
                </Grid>

            </Paper>
        }}
    </Query>
}