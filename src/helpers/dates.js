import moment from 'moment';

export const getTodayDateRange = () => {
	const today = moment();
	return {
		startDate: today,
		endDate: today
	}
}

export const getYesterdayDateRange = () => {
	const yesterday = moment().subtract(1, 'days');
	return {
		startDate: yesterday,
		endDate: yesterday
	}
}

export const getThisWeekDateRange = () => {
	return {
		startDate: moment().startOf('week'),
		endDate: moment().endOf('week')
	}
}

export const getLastWeekDateRange = () => {
	return {
		startDate: moment().subtract(1, 'weeks').startOf('week'),
		endDate: moment().subtract(1, 'weeks').endOf('week')
	}
}

export const getThisMonthDateRange = () => {
	return {
		startDate: moment().startOf('month'),
		endDate: moment().endOf('month')
	}
}

export const getLastMonthDateRange = () => {
	return {
		startDate: moment().subtract(1, 'months').startOf('month'),
		endDate: moment().subtract(1, 'months').endOf('month')
	}
}

export const getLastNthDayRange = (day) => {
	return {
		startDate: moment().subtract(day - 1, "days"),
		endDate: moment()
	}
}

export const dateRanges = {
	today: getTodayDateRange(),
	yesterday: getYesterdayDateRange(),
	thisWeek: getThisWeekDateRange(),
	lastWeek: getLastWeekDateRange(),
	thisMonth: getThisMonthDateRange(),
	lastMonth: getLastMonthDateRange()
}