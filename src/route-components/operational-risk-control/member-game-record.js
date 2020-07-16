import React, { useState } from 'react';
import {
	Paper,
	TableCell,
	TableRow,
	Grid,
	Button,
	Typography,
	Divider,
	TextField,
} from '@material-ui/core';
import { makeStyles} from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import { MEMBER_GAME_RECORD } from '../../paths';
import Title from '../../components/title';
import { SimpleTable, Loading, GrowItem } from '../../components';
import { AppDateRangePicker } from '../../components/date-picker';
import usePagination from '../../hooks/use-pagination'
import {useMemberGameRecordQuery} from '../../queries-graphql/operational-risk-control/member-game-record'

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},
	textfield: {
		backgroundColor: '#ffffff',
	},
	
}));

export default function MemberGameRecord(props) {
	const classes = useStyles();
	const strings = useLanguages(MEMBER_GAME_RECORD);
	const [filterValues, setFilterValues] = React.useState({
		startDate: null,
		endDate: null,
		orderId: '',
		user_Username: '',
		gameVendor: '',
		remark: ''
	});

	function handleFilterChange(event) {
		event.persist();
		setFilterValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
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
			startDate: null,
			endDate: null,
			orderId: '',
			user_Username: '',
			gameVendor: '',
			remark: ''
		}));
	}

	const [filter, setFilter] = React.useState({
		filterValues: [],
		startDate: null,
		endDate: null
	})

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
				startDate: null,
				endDate: null
			})
		} else {
			setFilter({
				filterValues: filterValues,
				startDate: filterValues.startDate.format("YYYY-MM-DD").toString(),
				endDate: filterValues.endDate.format("YYYY-MM-DD").toString()
			})
		}
	}
	
	const pagination = usePagination();

	const { rowsPerPage, cursor: { before, after }, page, setCursor, setPage } = pagination;
	const { data, loading } = useMemberGameRecordQuery({startAt: filter.startDate === null ? "2019-09-01" : filter.startDate,
		rowsPerPage, before, after, page, 
		mutation: false, 
		orderId: filter.filterValues.orderId, user_Username: filter.filterValues.user_Username, gameVendor: filter.filterValues.gameVendor, remark: filter.filterValues.remark,
		endAt: filter.endDate
	});

	if (loading) {
		return <Loading/>;
	}

	const pageInfo = data.memberGameRecords ? data.memberGameRecords.pageInfo : ''
	const count = data.memberGameRecords ? data.memberGameRecords.totalCount : 0
	
	return 	<Paper elevation={1}>
			<Title pageTitle={strings.noteManagement} />
			<Grid container direction="row" justify="space-between" alignItems="center">							
				<Typography className={classes.paper} variant="h6">{strings.noteManagement}</Typography>			
			</Grid>
			<Divider light={true} />
			<Grid container className={classes.paper} alignItems="center" spacing={1}>
				<Grid item>
					<Typography color="textSecondary">{strings.date}:</Typography>
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
				<Grid item>
					<Typography color="textSecondary">{strings.orderNumber}:</Typography>
				</Grid>	
				<Grid item>
					<TextField
						style={{width: 100}}
						className={classes.textfield}
						variant="outlined"
						margin="dense"
						name="orderId"
						placeholder={strings.pleaseEnter}
						onChange={handleFilterChange}
						value={filterValues.orderId}
						/>
				</Grid>	
				<Grid item>
					<Typography color="textSecondary">{strings.memberAccount}:</Typography>
				</Grid>	
				<Grid item>
					<TextField
						style={{width: 100}}
						className={classes.textfield}
						variant="outlined"
						margin="dense"
						name="user_Username"
						placeholder={strings.pleaseEnter}
						onChange={handleFilterChange}
						value={filterValues.user_Username}
						/>
				</Grid>	
				<Grid item>
					<Typography color="textSecondary">{strings.gameMaker}:</Typography>
				</Grid>	
				<Grid item>
					<TextField
						style={{width: 100}}
						className={classes.textfield}
						variant="outlined"
						margin="dense"
						name="gameVendor"
						placeholder={strings.pleaseEnter}
						onChange={handleFilterChange}
						value={filterValues.gameVendor}
						/>
				</Grid>	
				<Grid item>
					<Typography color="textSecondary">{strings.threePartyOrderNumber}:</Typography>
				</Grid>	
				<Grid item>
					<TextField
						style={{width: 100}}
						className={classes.textfield}
						variant="outlined"
						margin="dense"
						name="remark"
						placeholder={strings.pleaseEnter}
						onChange={handleFilterChange}
						value={filterValues.remark}
						/>
				</Grid>
				<GrowItem />
				<Grid item>
					<Button color="primary" variant="text" onClick={onChangeClear}>
						<Typography>
							{strings.clearAll}
						</Typography>
					</Button>
				</Grid>	
				<Grid item justify="flex-end">
					<Button color="primary" variant="contained" onClick={() => searchFor()} style={{fontSize: 15, minWidth: 90}}>{strings.searchFor}</Button>
				</Grid>
			</Grid>
			<Grid  className={classes.paper}  item style={{paddingTop: 0}}>
				<SimpleTable
					tableProps={{size: "small"}}
					hasPagination={true}
					noBorder={true}
					pagination={pagination}
					pageInfo={pageInfo}
					count={count}
					columns={
						<TableRow>
							<TableCell align="right">{strings.orderNumber}</TableCell>
							<TableCell>{strings.memberAccount}</TableCell>
							<TableCell>{strings.belongLevel}</TableCell>
							<TableCell>{strings.gameMaker}</TableCell>
							<TableCell>{strings.gameName}</TableCell>
							<TableCell>{strings.threePartyOrderNumber}</TableCell>
							<TableCell>{strings.betTime}</TableCell>
							<TableCell align="right">{strings.betAmount}</TableCell>
							{/* <TableCell>{strings.effectiveBet}</TableCell>
							<TableCell>{strings.awardTime}</TableCell> */}
							<TableCell align="right">{strings.prizeAmount}</TableCell>
							{/* <TableCell>{strings.handlingFee}</TableCell> */}
							<TableCell align="right">{strings.profitAndLoss}</TableCell>
						</TableRow>
					}
					rows={
						data.memberGameRecords.edges.length === 0 ? 
						<TableRow>
							<TableCell align="center" colSpan={10}>没有可用数据</TableCell>
						</TableRow>
						:
						count >= 1 ?
						data.memberGameRecords.edges.map((o, index) => {
							return <TableRow>
							<TableCell align="right">{o.node.orderId ? o.node.orderId : ''}</TableCell>
							<TableCell>{o.node.user ? o.node.user.username : ''}</TableCell>
							<TableCell>{o.node.memberLevel ? o.node.memberLevel.name : ''}</TableCell>
							<TableCell>{o.node.gameVendor ? o.node.gameVendor : ''}</TableCell>
							<TableCell>{o.node.gameName ? o.node.gameName : ''}</TableCell>
							<TableCell>{o.node.remark ? o.node.remark : ''}</TableCell>
							<TableCell>{o.node.gameServerTimestamp ? o.node.gameServerTimestamp.split('+', 2)[0] : ''}</TableCell>
							<TableCell>&#165;{o.node.bet ? Math.round(o.node.bet).toFixed(2) : 0}</TableCell>
							<TableCell>&#165;{o.node.payoff ? Math.round(o.node.payoff).toFixed(2) : 0}</TableCell>
							<TableCell>{Math.sign(o.node.subtraction) === -1 ? "-" : null}&#165;{o.node.subtraction ? Math.round(Math.abs(o.node.subtraction)).toFixed(2) : 0}</TableCell>
						</TableRow>
						})
						:
						<TableRow>
							<TableCell colSpan={10} align="center">没有可用数据</TableCell>
						</TableRow>
					}
					/>
			</Grid>					
		</Paper>
}