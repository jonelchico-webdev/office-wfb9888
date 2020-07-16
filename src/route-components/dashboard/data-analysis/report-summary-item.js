import React from 'react';
import { Grid, Paper, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {InfoOutlined} from '@material-ui/icons';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
	paper: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		height: 188,
		transition: 'all .2s ease-in-out',
		'&:hover': {
			transform: 'scale(1.1)'
		}
	},
	container: {
		height: '100%',
	},
	item: {
		height: '33%',
	},
	itemPadding: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2)
	},
	cardLabel: {
		color: theme.palette.text.secondary,
		border: `1px solid #E3E9F0`,
		borderRadius: 30,
		padding: 6
	},
	divider: {
		flexGrow: 1
	}
}));

export default function ReportSummary(props) {
	const {label, unit, number, icon, reverse} = props;
	const classes = useStyles();
	// console.log(number)
	return <Paper elevation={1} className={classes.paper}>
		<Grid className={classes.container} container direction={reverse ? "column-reverse":"column"} >
			<Grid item className={clsx(classes.item, classes.itemPadding)} container alignContent="center" justify="space-between">
				<div></div>
				<Typography color="textPrimary" variant="h5">{ number ? unit == "People" || unit == "人" ? number :  number.toLocaleString('en', {maximumFractionDigits:2}) : 0} ({unit})</Typography>
				{!reverse ? <InfoOutlined fontSize="small"/> : <div></div>}
			</Grid>
			<Grid item className={classes.item} container alignItems="center" justify="center">
				<Divider light={true} classes={{root: classes.divider}}/>
				<Typography classes={{root: classes.cardLabel}}>{label}</Typography>
				<Divider light={true} classes={{root: classes.divider}}/>
				</Grid>
			<Grid item className={clsx(classes.item, classes.itemPadding)} container alignContent="center" justify="space-between">
				<div></div>
				{icon}
				{reverse ? <InfoOutlined fontSize="small"/> : <div></div>}
			</Grid>
		</Grid>
	</Paper>
}