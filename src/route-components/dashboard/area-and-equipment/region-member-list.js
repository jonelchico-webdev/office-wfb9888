import React from 'react';
import {Loading} from '../../../components';
import {useTheme, makeStyles} from '@material-ui/styles';
import {getTop10RegionMembers} from './data-transformer';
import CircleIcon from '../../../icons/circle';
import {Grid, Typography} from '@material-ui/core';
import useRegionMembers from './use-region-members';

const useStyles = makeStyles(theme => ({
	circleIcon : {
		fontSize: 8
	},
}));

export default function RegionMemberList({fromDate, toDate, strings}) {
	const theme = useTheme();
	const classes = useStyles();
	let {data, loading} = useRegionMembers({fromDate, toDate});
	if(loading) {
		return <Loading/>
	}
	let top10RegionMemberHistory = getTop10RegionMembers(data.dashboard);
	return <Grid container spacing={1} direction="column">
		{
			top10RegionMemberHistory.map((o, index) => (
				<Grid item key={index}>
					<Grid container spacing={1} alignItems="center" >
						<Grid item><CircleIcon htmlColor={theme.charts.doughnut.backgroundColors[index]} className={classes.circleIcon}/></Grid>
						<Grid item style={{width: 120}}><Typography>{strings[o.regionCode]}</Typography></Grid>
						<Grid item><Typography color="textSecondary">| &nbsp;&nbsp;&nbsp; {o.count}</Typography></Grid>
					</Grid>
				</Grid>
				
			))
		}
	</Grid>
}