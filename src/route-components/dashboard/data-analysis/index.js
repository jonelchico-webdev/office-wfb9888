import React, {useState} from 'react';
import {Grid, Typography, Paper, Button, RadioGroup, Radio, FormControlLabel, Divider} from '@material-ui/core';
import {GrowItem} from '../../../components';
import { makeStyles } from '@material-ui/core/styles';
import ReportSummaryList from './report-summary-list';
import RecentOperationTable from './recent-operation-table';
import InformationOverviewTable from './information-overview-table';
import RecentOperationCharts from './recent-operation-charts';
import useLanguages from '../../../hooks/use-languages';
import {DATA_ANALYSIS} from '../../../paths';
import Title from '../../../components/title';

const useStyles = makeStyles(theme => ({
	paper: {
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(2),
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		margin: 'auto',
	},
	button : {
		color: '#B3B8BD',
	},
	margin: {
		margin: theme.spacing(1)
	},
}));

export default function DataAnalysis(){
	const classes = useStyles();	

	const strings = useLanguages(DATA_ANALYSIS);

	const [selectedGames, setSelectedGames] = useState([]);
	const [radioValue, setRadioValue] = React.useState('view');
	function handleRadioChange(event) {
		setRadioValue(event.target.value);
	}
	const games = ['Electronic Games', 'PT', 'MG', 'CQ9', 'Live Video', 'AG', 'BBIN', 'Sports Competition', 'Sabah', 'Chess Game', 'Kaiyuan', 'Lottery Game', 'VR'];
	// const toolbar = <Paper elevation={1} className={classes.paper}><Grid container spacing={1} alignItems="center">
	// 	<Grid item ><Typography variant="subtitle2">{strings.pleaseSelectGame}:</Typography></Grid>
	// 	{games.map((o, index) => {
	// 		const isSelected = selectedGames.find(name => name === o);
	// 		return <Grid item key={index}><Button onClick={() => {
	// 			if(isSelected) {
	// 				setSelectedGames(selectedGames.filter(name => name !== o));
	// 			} else {
	// 				setSelectedGames([...selectedGames, o]);
	// 			}
	// 		}} disableRipple={true} className={isSelected ? '' : classes.button} color={isSelected ? 'primary' : 'default'} variant={isSelected ? 'contained' : 'text'}>{o}</ Button></Grid>})}
	// 		<GrowItem/>
	// 		<Grid item><Button disableRipple={true} variant="outlined" onClick={() => setSelectedGames([])}>Clear</Button></Grid>
	// 		<Grid item><Button disableRipple={true} variant="contained" color="secondary">Submit</ Button></Grid>
	// </Grid></Paper>;
	return <div>
		<Title pageTitle={strings.headerTitle}/>
		<Grid container direction="column" spacing={2}>
			<Grid item sm={12} md={12}><ReportSummaryList strings={strings}/></Grid>
			{/* <Grid item>{toolbar}</Grid> */}
			<Grid item><Typography variant="subtitle2">{strings.recentOperation}</Typography></Grid>
			<Divider className={classes.margin}/>
			<Grid item>
				<RadioGroup value={radioValue} onChange={handleRadioChange} row>
					<FormControlLabel
						value="view"
						control={<Radio color="primary" />}
						label={strings.view}
						labelPlacement="end"
					/>
					<FormControlLabel
						value="report"
						control={<Radio color="primary" />}
						label={strings.report}
						labelPlacement="end"
					/>
				</RadioGroup>
			</Grid>
			{radioValue === "view" && <Grid item>
					<RecentOperationCharts strings={strings}/>
				</Grid>
			}
			{radioValue === "report" && <Grid item>
				<RecentOperationTable strings={strings}/>
			</Grid>
			}
			<Grid item container spacing={2} direction="column">
				<Grid item><Typography variant="subtitle2">{strings.informationOverview}</Typography></Grid>
				<Grid item><Divider/></Grid>
				<Grid item>
					<InformationOverviewTable strings={strings}/>
				</Grid>
			</Grid>
		</Grid>
	</div>
}