import React from 'react';
import {Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},
}));

export default function AppContainer(props) {
	const classes = useStyles();
	return <Paper className={classes.paper} elevation={1}>
		{props.children}
	</Paper>
}