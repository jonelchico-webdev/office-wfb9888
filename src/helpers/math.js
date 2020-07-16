export function round(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

export function getPercentage(num, total) {
	if(!num) {
		return 0;
	}
	return round(num/total*100, 2);
}