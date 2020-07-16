import React from 'react';
import {Grid, Typography, Paper} from '@material-ui/core';
import {makeStyles, useTheme} from '@material-ui/styles';
import SquareIcon from '../icons/square';
import {Bar} from 'react-chartjs-2';

const useStyles = makeStyles(theme => ({
	margin: {
		margin: theme.spacing(1)
	},
}));

export default function AppBarChart(props) {
	const {chartData, hideTitle} = props;
	const classes = useStyles();
	const theme = useTheme();
	return <Grid container direction="column" spacing={2}>
		{!hideTitle && <Grid item ><Typography>{chartData.title}</Typography></Grid>}
		<Grid item><Paper elevation={1}><Bar
			data={{
				labels: chartData.labels,
				datasets: chartData.datasets.map((ds, index) => {
					return {
						label: ds.label,
						data: ds.data,
						backgroundColor: theme.charts.bar.backgroundColors[index],
					}
				})
			}}
			legend={{
				display: false
			}}
			options= {{
				responsive: true,
				scales: {
					xAxes: [{
						gridLines: {
							display: false
						}
					}]
				},
				layout: {
					padding: 24
				}
			}}
		/></Paper></Grid>
		<Grid item>
			<Grid container spacing={4} justify="center">
				{chartData.datasets.map((ds, index) =>{
					return <Grid item key={index}>
						<Grid container alignItems="center">
							<SquareIcon className={classes.margin} fontSize="small" htmlColor={theme.charts.bar.backgroundColors[index]}/>
							<Typography component="span">{ds.label}</Typography>
						</Grid>
					</Grid>
				})}
			</Grid>
		</Grid>
	</Grid>
}