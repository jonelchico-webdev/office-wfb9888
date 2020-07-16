import React, {useContext} from 'react';
import { DateRangePicker } from 'react-dates';
import {makeStyles} from '@material-ui/styles';
import {LanguageContext, ZH} from '../language-context';

const useStyle = makeStyles(theme => ({
	root: {
		'& .DateRangePickerInput': {
			backgroundColor: "#ffffff",
			borderRadius: 5
		},
		'& .DateInput_input': {
			// backgroundColor: theme.palette.background.paper
			backgroundColor: '#fff',
		},
		'& .DateInput_input__focused': {
			borderBottom: `2px solid ${theme.palette.primary.main}`,
		},
		'& .DayPickerKeyboardShortcuts_show__bottomRight::before': {
			borderRight: `33px solid ${theme.palette.primary.main}`
		},
		// '& .CalendarDay__selected': {
		// 	background: theme.palette.primary.main,
		// 	border: `1px double ${theme.palette.primary.main}`,
		// },
		// '& .CalendarDay__selected:active, .CalendarDay__selected:hover': {
		// 	background: theme.palette.primary.main,
		// 	border: `1px double ${theme.palette.primary.main}`,
		// },
		// '& .CalendarDay__selected_span': {
		// 	background: theme.palette.primary.main,
		// 	border: `1px double ${theme.palette.primary.main}`,
		// },
		// '& .CalendarDay__selected_span:active, .CalendarDay__selected_span:hover': {
		// 	background: theme.palette.primary.main,
			
		// 	color: '#007a8'
		// },
		// '& .CalendarDay__hovered_span, .CalendarDay__hovered_span:hover': {
		// 	background: theme.palette.primary.main,
		// 	border: `1px double ${theme.palette.primary.main}`,
		// 	color: '#007a8'
		// }
		zIndex: 1000
	},
	height: {
		maxHeight: 34
	}
}))

export function AppDateRangePicker(props) {
	const classes = useStyle();
	const {language} = useContext(LanguageContext);
	let monthFormat = "MMMM YYYY";
	if(language === ZH) {
		monthFormat = "YYYY[年]MMMM";
	}
	else {
		monthFormat = "MMMM YYYY";
	}
	return <div className={classes.root}>
		<DateRangePicker						 	
			showClearDates
			monthFormat={monthFormat}
			minimumNights={0}
		{...props}/>
	</div>
}