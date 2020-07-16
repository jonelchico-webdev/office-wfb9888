import React, { Fragment } from 'react';
import { Typography, Grid, IconButton} from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/styles';
import clsx from 'clsx';
import useLanguages from '../hooks/use-languages';
import {ROOT} from '../paths';

const useStyle = makeStyles(theme => {

	return {
		buttonContainer: {
			display: 'none',
			[theme.breakpoints.up('lg')]: {
				backgroundColor: theme.palette.background.paper,
				display: 'flex',
				alignItems: 'flex-end',
				height: 65,
				marginBottom: -1,
				overflowX: 'hidden',
			},
			'& button + button': {
				marginLeft: -1
			},

		},
		padding: {
			paddingRight: theme.spacing(1),
		},
		button: {
			backgroundColor: theme.palette.background.paper,
			border: '1px solid #D0DBE5',
			boxShadow: 'none',
			borderRadius: 0,
			display: 'flex',
			borderTopLeftRadius: 4,
			borderTopRightRadius: 4,
			paddingLeft: theme.spacing(1),
			paddingBottom: theme.spacing(0.5),
			paddingTop: theme.spacing(0.5)
		},
		selected: {
			backgroundColor: theme.palette.background.default,
			borderBottom: `1px solid ${theme.palette.background.default}`,
		},
		root: {
			flexGrow: 1,
			backgroundColor: theme.palette.background.paper,
			display: "flex",
			height: 50
		},
		tabs: {
			borderRight: `1px solid ${theme.palette.divider}`
		},
		hoverPointer: {
			cursor: 'pointer'
		},
	}
});

export function TabButtonContainer(props) {
	const classes = useStyle();
	return <Fragment>

	<div id="noScrollAppBar" ref={props.ref} className={classes.buttonContainer}>{props.children}</div>

	</Fragment>	

}

export function TabButton({ ref, refresh, setRefresh, testArr, history, clickFunction, label, selected, key, index, tabss, setTabs, tabssURL, setTabsURL,  setTabSelected, setSelectedURL,...props }) {
	const classes = useStyle();
	const theme = useTheme();
	const strings = useLanguages(ROOT);

	// 	if((index+1) === array.length) {
	// 	let selected = array.length == 0 ? 0 : (array.length -1)
	// 	let selected = array.length == 0 ? 0 : (array.length -1)
	const handleDelete = deleteItem => () => {
		if(testArr.find(o => (o.url === history.location.pathname))) {
		  testArr.splice(deleteItem, 1)
		}
		setRefresh(!refresh)
	  }

	return <Fragment>

		<Grid className={clsx(classes.button, {
			[classes.selected]: selected,
		})} size="small" variant="scrollable" {...props} id={label}>
			<Typography 
				variant="button" 
				className={classes.hoverPointer}
				style={{display: "inline-block", marginRight: selected ? 12 : 0, marginBottom: 3}}
				noWrap={true} 
				onClick={clickFunction} 
				color={selected ? "primary" : "textSecondary"}
			>
				{strings[label]}
			</Typography>
		{
			selected ? null :
			<IconButton
			style={{marginLeft: 12}}
			size="small"
			onClick={handleDelete(index)}
			>
			<CloseOutlined style={{ fontSize: 12 }} htmlColor={theme.palette.text.secondary} />
		</IconButton>
		}
		
		</Grid>
	</Fragment>
}