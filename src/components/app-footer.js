import React from 'react'
import { Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useLanguages from '../hooks/use-languages'
import { Help } from '@material-ui/icons'


// function Copyright() {
// 	return (

// 	);
// }

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100vh',
	},
	grid: {
		color: theme.palette.text.primaryOpacity65,
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1)
	},
	footer: {
		padding: theme.spacing(1.5),
		marginBottom: theme.spacing(-2),
		marginLeft: theme.spacing(-2),
		marginRight: theme.spacing(-2),
		marginTop: 'auto',
		backgroundColor: theme.palette.background.paper,
		borderTop: '1px solid rgba(0, 0, 0, 0.12)',
	},
	footerDrawer: {
		color: "#616f7c",
		backgroundColor: "#f6f7fb",
		borderTop: '1px solid rgba(0, 0, 0, 0.12)',
		padding: theme.spacing(1.5),
		marginTop: 'auto',
		width: "100% !important",
		height: "118px !important",
	}
}));
export function AppFooterDrawer() {
	const classes = useStyles();
	const strings = useLanguages('footer')

	return (

		<footer className={classes.footerDrawer}>
			<Grid container direction="row" style={{paddingLeft: 12}} alignItems="center">

				<Help style={{marginRight: 8}}/>
			<Typography  >
				{strings.helpAndSupport}
			</Typography>
			</Grid>
		</footer>
	)
}

export default function MyAppFooter() {
	const classes = useStyles();
	const strings = useLanguages('footer')
	
	return (
		//   <div className={classes.main}>

		<footer className={classes.footer}>
			<Grid container direction="row" className={classes.grid} justify="space-between">
				<Grid item>
					<Typography variant="body2" align="center">
						&copy;{` ${new Date().getFullYear()} ${strings.companyName}  ${strings.allRightsReserved}`}
					</Typography>
				</Grid>
				<Grid item spacing={5} direction="row">
					<Typography variant="body2" align="center" style={{ display: "inline-block", marginRight: 25 }}>
						{strings.privacy}
					</Typography>
					<Typography style={{ display: "inline-block" }} variant="body2" align="center">
						{strings.terms}
					</Typography>
				</Grid>
			</Grid>
		</footer>
		//  </div>
	)
}


