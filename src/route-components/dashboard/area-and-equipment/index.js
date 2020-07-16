import React, { useState } from 'react';
import {Grid, Typography, Paper, Button} from '@material-ui/core';
import {makeStyles, useTheme} from '@material-ui/styles';
import {DividerGridItem, AppDateRangePicker, Title} from '../../../components';
import useLanguages from '../../../hooks/use-languages';
import {AREA_AND_EQUIPMENT} from '../../../paths';
import moment from 'moment';
import { dateRangeNames } from '../../../values';
import { dateRanges } from '../../../helpers/dates';
import SquareIcon from '../../../icons/square';
import ChinaMap from './china-map';
import DeviceMembersTable from './device-members-table';
import DeviceMembersBarChart from './device-members-bar-chart';
import RegionMemberChart from './region-members-chart';
import RegionMemberList from './region-member-list';

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2),
		margin: 'auto',
		minHeight: 490
	},
	legends: {
		marginLeft: 0,
		[theme.breakpoints.up('sm')]: {
			marginLeft: -64
		},
	}
}));

export default function AreaAndEquipment() {
	const strings = useLanguages(AREA_AND_EQUIPMENT);
	const classes = useStyles();
	const theme = useTheme();
	const [focusedInput, setFocusedInput] = useState(null);
	const thisMonthDefault = dateRanges.thisMonth
	const [filterValues, setFilterValues] = React.useState({
		startDate: thisMonthDefault.startDate,
		endDate: thisMonthDefault.endDate,
		dateRangeName: 'thisMonth'
	});
	const [variables, setVariables] = useState({
		fromDate: moment(thisMonthDefault.startDate).format('YYYY-MM-DD'),
		toDate: moment(thisMonthDefault.endDate).format('YYYY-MM-DD')
	});
	const onButtonClick = (dateRangeName) => () => {
		console.log(dateRangeName, 'raaaaaange')
		let range = dateRanges[dateRangeName];
		setFilterValues(oldValues => ({
			...oldValues,
			startDate: range.startDate,
			endDate: range.endDate,
			dateRangeName
		}));
	}
	const onInquireClick = () => {
		if(filterValues.startDate || filterValues.endDate) {
			setVariables({
				fromDate: moment(filterValues.startDate).format('YYYY-MM-DD'),
				toDate: moment(filterValues.endDate).format('YYYY-MM-DD')
			})
		}
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
	return <Grid container direction="column" spacing={2}>
		<Title pageTitle={strings.areaAndEquipment}/>
		<Grid item><Typography variant="subtitle2">{strings.userAreaDistribution}</Typography></Grid>
		<DividerGridItem light={false}/>
		<Grid item>
			<Paper elevation={1} className={classes.paper}>
				<Grid container spacing={4}>
				<Grid item container spacing={2} alignItems="center">
					<Grid item>
						<Typography>{strings.date}</Typography>
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
						<Button style={{marginRight: 24}} color="primary" variant="contained" onClick={onInquireClick}>{strings.inquire}</Button>
					</Grid>
					<Grid item>
						<Grid container spacing={1}>
							<Grid item><Button variant="outlined" color={filterValues.dateRangeName === dateRangeNames.today ? "primary":"default"} onClick={onButtonClick(dateRangeNames.today)}>{strings.today}</Button></Grid>
							<Grid item><Button variant="outlined" color={filterValues.dateRangeName === dateRangeNames.yesterday ? "primary":"default"} onClick={onButtonClick(dateRangeNames.yesterday)}>{strings.yesterday}</Button></Grid>
							<Grid item><Button variant="outlined" color={filterValues.dateRangeName === dateRangeNames.thisWeek ? "primary":"default"} onClick={onButtonClick(dateRangeNames.thisWeek)}>{strings.thisWeek}</Button></Grid>
							<Grid item><Button variant="outlined" color={filterValues.dateRangeName === dateRangeNames.lastWeek ? "primary":"default"} onClick={onButtonClick(dateRangeNames.lastWeek)}>{strings.lastWeek}</Button></Grid>
							<Grid item><Button variant="outlined" color={filterValues.dateRangeName === dateRangeNames.thisMonth ? "primary":"default"} onClick={onButtonClick(dateRangeNames.thisMonth)}>{strings.thisMonth}</Button></Grid>
							<Grid item><Button variant="outlined" color={filterValues.dateRangeName === dateRangeNames.lastMonth ? "primary":"default"} onClick={onButtonClick(dateRangeNames.lastMonth)}>{strings.lastMonth}</Button></Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid item container justify="center" alignItems="center" spacing={2}>
					<Grid item xs={12} md={3}>
						<Grid container justify="center" alignItems="center" spacing={1} direction="column">
							<Grid item>
								<Grid container alignItems="center">
								<Typography component="span">{strings.high}</Typography>
								<SquareIcon style={{marginLeft: 2}} htmlColor={theme.palette.blue[600]} />
								<SquareIcon style={{marginLeft: 2}} htmlColor={theme.palette.blue[500]} />
								<SquareIcon style={{marginLeft: 2}} htmlColor={theme.palette.blue[400]} />
								<SquareIcon style={{marginLeft: 2}} htmlColor={theme.palette.blue[300]} />
								<SquareIcon style={{marginLeft: 2}} htmlColor={theme.palette.blue[200]} />
								<SquareIcon style={{marginLeft: 2}} htmlColor={theme.palette.blue[100]} />
								<SquareIcon style={{marginLeft: 2}} htmlColor={theme.palette.blue[50]} />
								<Typography style={{marginLeft: 2}} component="span">{strings.low}</Typography>
								</Grid>
							</Grid>
							<Grid item>
								<ChinaMap fromDate={variables.fromDate} toDate={variables.toDate}/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={6} container direction="row">
						<Grid item xs={8} >
							<RegionMemberChart fromDate={variables.fromDate} toDate={variables.toDate} />
						</Grid>
						<Grid item xs={4} className={classes.legends}>
							<RegionMemberList fromDate={variables.fromDate} toDate={variables.toDate} strings={strings}/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			</Paper>
		</Grid>
		<Grid item><Typography variant="subtitle2">{strings.recentUserDeviceUsage}</Typography></Grid>
		<DividerGridItem light={false}/>
		<Grid item>
			<Grid container spacing={4}>
				<Grid item sm={12} md={6}><DeviceMembersBarChart/></Grid>
				<Grid item sm={12} md={6}><DeviceMembersTable strings={strings}/></Grid>
			</Grid>
		</Grid>
	</Grid>
}
