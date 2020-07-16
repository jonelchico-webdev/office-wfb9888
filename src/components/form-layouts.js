import React from 'react';
import {Grid, Button} from '@material-ui/core';
import useLanguages from '../hooks/use-languages';
import {COMMON} from '../paths';
import {makeStyles} from '@material-ui/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
	container: {
		'& .MuiFormControl-root':{ 
			width: 290
		},
		'& .MuiSelect-selectMenu': {
			width: 244
		}
	},
	formGroup: {
		paddingTop: '0 !important'
	},
	singleColumnContainer: {

	},
	rightContainer: {
		maxWidth: 572
	},
	filterBar: {
		'& .MuiFormControl-root':{ 
			width: 140
		},
		'& .MuiSelect-root': {
			width: 140
		}
	}
}))


export function FormRowCenterItems({leftComponent, rightComponent, rightContainerProps, leftComponentProps, containerProps, isFormGroup}) {
	const classes = useStyles();
	return <Grid item container alignItems={isFormGroup ? "flex-start":"center"} spacing={2} {...containerProps} >
		<Grid item xs={4} container justify="flex-end" {...leftComponentProps}>{leftComponent}</Grid>
		<Grid item xs={8} container justify="flex-start" {...rightContainerProps}
			className={clsx(classes.rightContainer, {
				[classes.formGroup]: isFormGroup,
			})}
		>
			{rightComponent}
		</Grid>
	</Grid>
}

// export function FormRowCenterItems({leftComponent, rightComponent, rightContainerProps, leftComponentProps, containerProps, isFormGroup}) {
// 	const classes = useStyles();
// 	return <Grid item container alignItems={isFormGroup ? "flex-start":"center"} spacing={2} {...containerProps} >
// 		<Grid item xs={4} container justify="flex-end" {...leftComponentProps}>{leftComponent}</Grid>
// 		<Grid item xs={8} container justify="flex-start" {...rightContainerProps} className={isFormGroup ? classes.formGroup : ''}>
// 			{rightComponent}
// 		</Grid>
// 	</Grid>
// }

export function FormRowLeftAlign({label, components}) {
	return <Grid item container alignItems="center" spacing={2}>
		<Grid item xs={2}>{label}</Grid>
		{
			components.map(c => <Grid item>
				{c}
			</Grid>)
		}
	</Grid>
}

export function FormLayoutTwoColumns({form, hideSecondColumn, saveButtonProps, backButtonProps}) {
	const strings = useLanguages(COMMON);
	const classes = useStyles();
	return <Grid container spacing={2} className={classes.container}>
		<Grid item md={6}>
			{form}
		</Grid>
		<Grid item md={6}>
			{!hideSecondColumn && <Grid container direction="column" spacing={1}>
				<Grid item container justify="flex-end">
					<Grid item md={4}>
						<Button variant="contained" color="primary" fullWidth={true} {...saveButtonProps}>{strings.save}</Button>
					</Grid>
				</Grid>
				<Grid item container justify="flex-end">
					<Grid item md={4}>
						<Button variant="outlined" fullWidth={true} {...backButtonProps}>{strings.return}</Button>
					</Grid>
				</Grid>
			</Grid>}
		</Grid>
	</Grid>
}

export function FormLayoutSingleColumn(props) {
	const classes = useStyles();
	return <div className={classes.singleColumnContainer}>
		{props.children}
	</div>
}

export function FormFilterLayout(props) {
	const classes = useStyles();
	return <Grid item container alignItems="center" spacing={1} className={classes.filterBar}>
		{props.children}
	</Grid>
}