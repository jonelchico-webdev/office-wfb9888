import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles';
import {TableWithTotal, GrowItem, AppDateRangePicker, Title, Loading} from '../../../components';   
import useLanguages from '../../../hooks/use-languages';
import { EVENTS_LIST } from '../../../paths';
import { Paper, TableCell, TableRow, Grid, Button, Typography, Divider, TextField, Select, OutlinedInput, MenuItem } from '@material-ui/core';
import useGameEventParticipates from '../../../queries-graphql/activity-management/activity-review';
import usePagination from '../../../hooks/use-pagination'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        '& > span': {
            margin: theme.spacing(2),
        },
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    dense: {
        marginTop: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(1),
    },
}));

export default function ActivityReport(props) {
    const classes = useStyles();
    const strings = useLanguages(EVENTS_LIST);
    const {history} = props
    const eventID = history.location.pathname.split('ort/', [2])[1];

    const pagination = usePagination()
    const [filterValues, setFilterValues] = React.useState({
        startDate: null,
        endDate: null,
        account: '',
        commissionType: '',
        status: '',
        user: '', 
        id: '',
        rewardAmountMin: null,
        rewardAmountMax: null,
        gameEvent_Title_Icontains: '', 
        user_AffiliateUsername_Icontains: '',
    });

    function handleFilterChange(event) { 
		event.persist();
		setFilterValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value
		}));
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

    // const [filter, setFilter] = useState({
	// 	filterValues: [],
	// 	startDate: moment('01/01/2000').toISOString(true),
	// 	endDate: moment().toISOString(true)
    // })
    
    const [filter, setFilter] = React.useState({
		filterValues: [],
		startDate: "",
		endDate: ""
    })

    function searchFor() {
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
    const { rowsPerPage, cursor: {before, after}, page } = pagination;
    const {data, loading} = useGameEventParticipates({
        gameEvent: eventID, rowsPerPage, before, after, user_AffiliateUsername_Icontains: filter.filterValues.user_AffiliateUsername_Icontains,
        rewardAmountMin: filter.filterValues.rewardAmountMin, rewardAmountMax: filter.filterValues.rewardAmountMax,
        startAt: filter.startDate, endAt: filter.endDate, page
    });

    if(loading) {
        return <Loading />
    }

    const myPageInfo = ({
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
        __typename: "PageInfo"
    })

    console.log(data, ' game')
    const totalReceivingAmount = data.gameEventParticipates.edges.reduce((receivingAmount, o) => receivingAmount + o.node.gameEvent.rewardAmount, 0);
    const totalPerPage = data.gameEventParticipates.edges.reduce((totalPerPage, o) => totalPerPage + 1, 0);

    return <Grid>
        <Title pageTitle={strings.eventList} />

        <Paper className={classes.root} style={{ marginTop: "20px" }}>
            <Typography variant='h6'>{strings.eventList}</Typography>
            <Divider light={true} style={{ marginTop: "2em", marginBottom: "1em" }} />
            <Grid container alignItems="center" spacing={1}>
                <Grid item container alignItems="center" style={{ marginBottom: "10px" }}>

                <Grid item >
                    <Typography color="textSecondary">{strings.serialNumber}:</Typography>
                </Grid>
                <Grid item>
                    <TextField onChange={handleFilterChange} name="user_Username_Icontains" value={filterValues.user_Username_Icontains} variant="outlined" margin="dense" style={{ width: 100, marginLeft: 10, marginRight: 10 }} />
                </Grid>

                <Grid item >
                    <Typography color="textSecondary">{strings.date}:</Typography>
                </Grid>
                <Grid item style={{ marginLeft: 10 }}>
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

                <Grid item style={{ marginLeft: 10 }}>
                    <Typography color="textSecondary">{strings.affiliatedAgent}:</Typography>
                </Grid>
                <Grid item>
                    <TextField onChange={handleFilterChange} type="text" name="user_AffiliateUsername_Icontains" value={filterValues.user_AffiliateUsername_Icontains} variant="outlined" margin="dense" style={{ width: 100, marginLeft: 10 }} />
                </Grid>

                <Grid item style={{ marginLeft: 10, marginRight: 10 }}>
                    <Typography color="textSecondary">{strings.theCompany}:</Typography>
                </Grid>
                <Grid item>
                    <Select
                        onChange={handleFilterChange}
                        margin="dense"
                        className={classes.textfield}
                        name="status"
                        value={filterValues.status}
                        input={<OutlinedInput notched={false} name="selectStatus" />}
                        style={{width: 100}}
                    >
                        <MenuItem value="">{strings.all}</MenuItem>
                            <MenuItem value="frontDeskOne">{strings.frontDeskOne}</MenuItem>
                            <MenuItem value="frontDeskTwo">{strings.frontDeskTwo}</MenuItem>
                    </Select>
                </Grid>

                <Grid item style={{ marginLeft: 10, marginRight: 10 }}>
                    <Typography color="textSecondary">{strings.discountedPrice}:</Typography>
                </Grid>
                <Grid item>
                    <TextField onChange={handleFilterChange} type="number" name="rewardAmountMin" value={filterValues.rewardAmountMin} variant="outlined" margin="dense" style={{ width: 100, marginLeft: 10, marginRight: 10 }} />
                </Grid>

                <Grid item style={{ marginLeft: 10, marginRight: 10 }}>
                    <Typography color="textSecondary">{strings.to}:</Typography>
                </Grid>
                <Grid item>
                    <TextField onChange={handleFilterChange} type="number" name="rewardAmountMax" value={filterValues.rewardAmountMax} variant="outlined" margin="dense" style={{ width: 100, marginLeft: 10, marginRight: 10 }} />
                </Grid>

                <GrowItem />

                <Grid item>
                    <Button style={{ width: 100 }} color="primary" onClick={() => searchFor()} variant="contained">{strings.searchFor}</Button>
                </Grid>

                </Grid>
            </Grid>
            <Grid item>
                <TableWithTotal
                    tableProps={{size: "small"}}
                    hasPagination={true}
                    pageInfo={data.gameEventParticipates === null || data.gameEventParticipates.totalCount === 0 ? myPageInfo : data.gameEventParticipates.pageInfo}
                    count={data.gameEventParticipates === null || data.gameEventParticipates.totalCount === 0 ? 0 : data.gameEventParticipates.totalCount}
                    pagination={pagination}
                    totalReceivingAmount={totalReceivingAmount}
                    totalPerPage={totalPerPage}
                    columns={
                        <TableRow>
                            <TableCell>{strings.serialNumber}</TableCell>
                            <TableCell>{strings.eventName}</TableCell>
                            <TableCell>{strings.company}</TableCell>
                            <TableCell>{strings.accountNumber}</TableCell>
                            <TableCell>{strings.affiliatedAgent}</TableCell>
                            <TableCell>{strings.applicationTime}</TableCell>
                            <TableCell>{strings.pickUpTime}</TableCell>
                            <TableCell>{strings.receivingAmount}</TableCell>
                            <TableCell>{strings.reviewer}</TableCell>
                            <TableCell>{strings.reviewTime}</TableCell>
                        </TableRow>
                    }
                    rows={
                        data.gameEventParticipates === null || data.gameEventParticipates.totalCount === 0 ?
						<TableRow>
							<TableCell align="center" colSpan={10}>没有可用数据</TableCell>
						</TableRow>
                        :
                        data.gameEventParticipates.edges.map((o, index) =>
                            <TableRow>
                                <TableCell>{o.node.pk}</TableCell>
                                <TableCell>{o.node.gameEvent.title}</TableCell>
                                <TableCell>{o.node.user.userCompany ? o.node.user.userCompany.name : ''}</TableCell>
                                <TableCell>{o.node.user ? o.node.user.username : ''}</TableCell>
                                <TableCell>{o.node.user ? o.node.user.affiliateUsername : ''}</TableCell>
                                <TableCell>{o.node.createdAt.split('T', [2])[0]}</TableCell>
                                <TableCell>{o.node.gameEvent.startAt ? o.node.gameEvent.startAt.split('T', [2])[0] : ''}</TableCell>
                                <TableCell>{o.node.gameEvent.rewardAmount ? o.node.gameEvent.rewardAmount : ''}</TableCell>
                                <TableCell>{o.node.statusChangedBy ? o.node.statusChangedBy.name : ''}</TableCell>
                                <TableCell>{o.node.statusChangedAt ? o.node.statusChangedAt.split('T', [2])[0] : ''}</TableCell>
                            </TableRow>
                        )
                    }
                />
            </Grid>
        </Paper>
    </Grid>
}