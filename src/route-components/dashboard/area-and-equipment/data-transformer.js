export function getTop10RegionMembers(data) {
	const {regionMembers} = data;
	let dateRangeHistorySorted = regionMembers.sort((a, b) => {
		if (a.count > b.count) return -1;
		if (a.count < b.count) return 1;
		return 0;
	});
	let top10RegionMemberHistory = [...dateRangeHistorySorted].splice(0, 10);
	return top10RegionMemberHistory;
}
