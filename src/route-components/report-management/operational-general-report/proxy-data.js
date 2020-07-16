import React, { useEffect, useState, Fragment } from 'react'
import { Paper, Grid, Typography, Divider, TableRow, TableCell } from '@material-ui/core'
import { Loading, SimpleTable } from '../../../components'
import usePagination from '../../../hooks/use-pagination'
import SimpleTableAll from "../../../components/simple-table"
import { useOperationalAgentReports } from '../../../queries-graphql/report-management/operational-general-report';
import { UnfoldMore } from '@material-ui/icons'

export default function ProxyData({ strings, classes, filter, url, history}) {
	// const pagination = usePagination()
	// const { rowsPerPage, cursor: { before, after }, setCursor, setPage} = pagination;
	// useEffect(() => {
	// 	setCursor({
	// 		before: null,
	// 		after: null
	// 	})
	// 	setPage(0)
	// },[filter])
	const [sortFilter, setSortFilter] = useState(0)
	const [hoverMouse, setHoverMouse] = useState(0)
	const { data, loading } = useOperationalAgentReports({ isAgent: filter.isAgent, userName: filter.userName, startAt: filter.startAt, endAt: filter.endAt, });

	if (loading) {
		return <Loading />;
	}

	if(data.agentMemberReport) {
		
	}
		
	const pageSplit = history.location.pathname.split("=", 3);

	const pageValue = pageSplit == url  ? 1 : parseInt(pageSplit[1].charAt(0))

	const page =  pageValue == 1 ? 0 : pageValue - 1

	const rowsPerPageSplit = history.location.pathname.split("=", 3);
	
	const rowsPerPage = rowsPerPageSplit  == url ? 15 : parseInt(rowsPerPageSplit[2] )

	const rowsPerPagePosition = rowsPerPage == 15 ? 0 : rowsPerPage == 25 ? 1 : rowsPerPage == 35 ? 2 : 3 
	
	const agentReports = data.agentMemberReport ? data.agentMemberReport.edges  : null

	const newAgentReports = agentReports && agentReports.length > 0 ?
			sortFilter == 1 ? agentReports.sort((a, b) => a.node.username > b.node.username) :
			sortFilter == -1 ? agentReports.sort((a, b) => a.node.username < b.node.username) :
			sortFilter == 2 ? agentReports.sort((a, b) => a.node.activeMemberCount < b.node.activeMemberCount) :
			sortFilter == -2 ? agentReports.sort((a, b) => a.node.activeMemberCount > b.node.activeMemberCount) :
			sortFilter == 3 ? agentReports.sort((a, b) => a.node.depositAmount < b.node.depositAmount) :
			sortFilter == -3 ? agentReports.sort((a, b) => a.node.depositAmount > b.node.depositAmount) :
			sortFilter == 4 ? agentReports.sort((a, b) => a.node.depositCount < b.node.depositCount) :
			sortFilter == -4 ? agentReports.sort((a, b) => a.node.depositCount > b.node.depositCount) :
			sortFilter == 5 ? agentReports.sort((a, b) => a.node.depositUsers < b.node.depositUsers) :
			sortFilter == -5 ? agentReports.sort((a, b) => a.node.depositUsers > b.node.depositUsers) :
			sortFilter == 6 ? agentReports.sort((a, b) => a.node.withdrawalAmount < b.node.withdrawalAmount) :
			sortFilter == -6 ? agentReports.sort((a, b) => a.node.withdrawalAmount > b.node.withdrawalAmount) :
			sortFilter == 7 ? agentReports.sort((a, b) => a.node.withdrawalCount < b.node.withdrawalCount) :
			sortFilter == -7 ? agentReports.sort((a, b) => a.node.withdrawalCount > b.node.withdrawalCount) :
			sortFilter == 8 ? agentReports.sort((a, b) => a.node.withdrawalUsers < b.node.withdrawalUsers) :
			sortFilter == -8 ? agentReports.sort((a, b) => a.node.withdrawalUsers > b.node.withdrawalUsers) :
			sortFilter == 9 ? agentReports.sort((a, b) => a.node.betAmount < b.node.betAmount) :
			sortFilter == -9 ? agentReports.sort((a, b) => a.node.betAmount > b.node.betAmount) :
			sortFilter == 10 ? agentReports.sort((a, b) => a.node.betValidAmount < b.node.betValidAmount) :
			sortFilter == -10 ? agentReports.sort((a, b) => a.node.betValidAmount > b.node.betValidAmount) :
			sortFilter == 11 ? agentReports.sort((a, b) => a.node.betCount < b.node.betCount) :
			sortFilter == -11 ? agentReports.sort((a, b) => a.node.betCount > b.node.betCount) :
			sortFilter == 12 ? agentReports.sort((a, b) => a.node.betUsers < b.node.betUsers) :
			sortFilter == -12 ? agentReports.sort((a, b) => a.node.betUsers > b.node.betUsers) :
			sortFilter == 13 ? agentReports.sort((a, b) => a.node.subtraction < b.node.subtraction) :
			sortFilter == -13 ? agentReports.sort((a, b) => a.node.subtraction > b.node.subtraction) :
			agentReports : null

	// const pageInfo = data.agentMemberReport ? data.agentMemberReport.pageInfo  : false
	const count = data.agentMemberReport ? data.agentMemberReport.totalCount : 0
	return <Paper elevation={1} className={classes.paperSplit}>
		<Grid container direction="row" justify="space-between" alignItems="center" className={classes.paper}>
			<Typography variant="h6">{strings.proxyData}</Typography>
		</Grid>
		<Divider light={true} orientation="vertical" />
		<Grid item className={classes.paper}>
			<SimpleTableAll
				page={page}
				rowsPerPage={rowsPerPage}
				rowsPerPagePosition={rowsPerPagePosition}
				history={history}
				tableProps={{size: "small"}}
				hasPagination={true}
				pageInfo={false}
				noBorder={true}
				count={count}
				url={url}
				cols={13}
				columns={
					<TableRow>
						<TableCell onMouseEnter={() => setHoverMouse(1)} onMouseLeave={() => setHoverMouse(0)} className={classes.hoverPointer} onClick={() => setSortFilter(sortFilter !== 1 ? 1 : -1)}>{strings.proxyAccount}{hoverMouse === 1 ? <Fragment> <UnfoldMore fontSize="inherit" /></Fragment> : null}</TableCell>
						<TableCell onMouseEnter={() => setHoverMouse(2)} onMouseLeave={() => setHoverMouse(0)} className={classes.hoverPointer} onClick={() => setSortFilter(sortFilter !== 2 ? 2 : -2)}>{strings.activeMember}{hoverMouse === 2 ? <Fragment> <UnfoldMore fontSize="inherit" /></Fragment> : null}</TableCell>
						<TableCell onMouseEnter={() => setHoverMouse(3)} onMouseLeave={() => setHoverMouse(0)} className={classes.hoverPointer} onClick={() => setSortFilter(sortFilter !== 3 ? 3 : -3)}>{strings.rechargeAmount}{hoverMouse === 3 ? <Fragment> <UnfoldMore fontSize="inherit" /></Fragment> : null}</TableCell>
						<TableCell onMouseEnter={() => setHoverMouse(4)} onMouseLeave={() => setHoverMouse(0)} className={classes.hoverPointer} onClick={() => setSortFilter(sortFilter !== 4 ? 4 : -4)}>{strings.rechargeNumber}{hoverMouse === 4 ? <Fragment> <UnfoldMore fontSize="inherit" /></Fragment> : null}</TableCell>
						<TableCell onMouseEnter={() => setHoverMouse(5)} onMouseLeave={() => setHoverMouse(0)} className={classes.hoverPointer} onClick={() => setSortFilter(sortFilter !== 5 ? 5 : -5)}>{strings.numberOfRecharges}{hoverMouse === 5 ? <Fragment> <UnfoldMore fontSize="inherit" /></Fragment> : null}</TableCell>
						<TableCell onMouseEnter={() => setHoverMouse(6)} onMouseLeave={() => setHoverMouse(0)} className={classes.hoverPointer} onClick={() => setSortFilter(sortFilter !== 6 ? 6 : -6)}>{strings.withdrawalAmount}{hoverMouse === 6 ? <Fragment> <UnfoldMore fontSize="inherit" /></Fragment> : null}</TableCell>
						<TableCell onMouseEnter={() => setHoverMouse(7)} onMouseLeave={() => setHoverMouse(0)} className={classes.hoverPointer} onClick={() => setSortFilter(sortFilter !== 7 ? 7 : -7)}>{strings.numberOfWithdrawal}{hoverMouse === 7 ? <Fragment> <UnfoldMore fontSize="inherit" /></Fragment> : null}</TableCell>
						<TableCell onMouseEnter={() => setHoverMouse(8)} onMouseLeave={() => setHoverMouse(0)} className={classes.hoverPointer} onClick={() => setSortFilter(sortFilter !== 8 ? 8 : -8)}>{strings.numberOfPeopleWithdrawal}{hoverMouse === 8 ? <Fragment> <UnfoldMore fontSize="inherit" /></Fragment> : null}</TableCell>
						<TableCell onMouseEnter={() => setHoverMouse(9)} onMouseLeave={() => setHoverMouse(0)} className={classes.hoverPointer} onClick={() => setSortFilter(sortFilter !== 9 ? 9 : -9)}>{strings.betAmount}{hoverMouse === 9 ? <Fragment> <UnfoldMore fontSize="inherit" /></Fragment> : null}</TableCell>
						<TableCell onMouseEnter={() => setHoverMouse(10)} onMouseLeave={() => setHoverMouse(0)} className={classes.hoverPointer} onClick={() => setSortFilter(sortFilter !== 10 ? 10 : -10)}>{strings.effectiveBet}{hoverMouse === 10 ? <Fragment> <UnfoldMore fontSize="inherit" /></Fragment> : null}</TableCell>
						<TableCell onMouseEnter={() => setHoverMouse(11)} onMouseLeave={() => setHoverMouse(0)} className={classes.hoverPointer} onClick={() => setSortFilter(sortFilter !== 11 ? 11 : -11)}>{strings.numberOfBet}{hoverMouse === 11 ? <Fragment> <UnfoldMore fontSize="inherit" /></Fragment> : null}</TableCell>
						<TableCell onMouseEnter={() => setHoverMouse(12)} onMouseLeave={() => setHoverMouse(0)} className={classes.hoverPointer} onClick={() => setSortFilter(sortFilter !== 12 ? 12 : -12)}>{strings.numberOfPeopleBets}{hoverMouse === 12 ? <Fragment> <UnfoldMore fontSize="inherit" /></Fragment> : null}</TableCell>
						<TableCell onMouseEnter={() => setHoverMouse(13)} onMouseLeave={() => setHoverMouse(0)} className={classes.hoverPointer} onClick={() => setSortFilter(sortFilter !== 13 ? 13 : -13)}>{strings.profitAndLoss}{hoverMouse === 13 ? <Fragment> <UnfoldMore fontSize="inherit" /></Fragment> : null}</TableCell>
					</TableRow>
				}
				rows={
					newAgentReports ?

					newAgentReports.sort((a, b) => a.node.pk > b.node.pk).slice(page * rowsPerPage , page * rowsPerPage +  rowsPerPage).map((o, index) => {

							return <TableRow key={index}>
								<TableCell>{o.node.username}</TableCell>
								<TableCell align="right">{o.node.activeMemberCount}</TableCell>
								<TableCell align="right">{o.node.depositAmount}</TableCell>
								<TableCell align="right">{o.node.depositCount}</TableCell>
								<TableCell align="right">{o.node.depositUsers}</TableCell>
								<TableCell align="right">{o.node.withdrawalAmount}</TableCell>
								<TableCell align="right">{o.node.withdrawalCount}</TableCell>
								<TableCell align="right">{o.node.withdrawalUsers}</TableCell>
								<TableCell align="right">{o.node.betAmount}</TableCell>
								<TableCell align="right">{o.node.betValidAmount}</TableCell>
								<TableCell align="right">{o.node.betCount}</TableCell>
								<TableCell align="right">{o.node.betUsers}</TableCell>
								<TableCell align="right">{o.node.subtraction}</TableCell>
							</TableRow>
						})
						:

						<TableRow>
							<TableCell align="center" colSpan={13}>{strings.noDataAvailable}</TableCell>
						</TableRow>

				}
			/>
			{/* <SimpleTable
				tableProps={{ size: "small" }}
				hasPagination={pageInfo ? true : false}
				pageInfo={pageInfo}
				noBorder={true}
				count={count}
				pagination={pagination}
				columns={
					<TableRow>
						<TableCell>test</TableCell>
						<TableCell align="right">{strings.proxyAccount}</TableCell>
						<TableCell align="right">{strings.activeMember}</TableCell>
						<TableCell align="right">{strings.rechargeAmount}</TableCell>
						<TableCell align="right">{strings.rechargeNumber}</TableCell>
						<TableCell align="right">{strings.numberOfRecharges}</TableCell>
						<TableCell align="right">{strings.withdrawalAmount}</TableCell>
						<TableCell align="right">{strings.numberOfWithdrawal}</TableCell>
						<TableCell align="right">{strings.numberOfPeopleWithdrawal}</TableCell>
						<TableCell align="right">{strings.betAmount}</TableCell>
						<TableCell align="right">{strings.effectiveBet}</TableCell>
						<TableCell align="right">{strings.numberOfBet}</TableCell>
						<TableCell align="right">{strings.numberOfPeopleBets}</TableCell>
						<TableCell align="right">{strings.profitAndLoss}</TableCell>
					</TableRow>
				}
				rows={
					agentReports && agentReports.length > 0 ?
						agentReports.map((o, index) => {

							return <TableRow key={index}>
								<TableCell>{index}</TableCell>
								<TableCell>{o.node.username}</TableCell>
								<TableCell align="right">{o.node.activeMemberCount ? o.node.activeMemberCount : "-"}</TableCell>
								<TableCell align="right">{o.node.depositAmount ? o.node.depositAmount : "-"}</TableCell>
								<TableCell align="right">{o.node.depositCount ? o.node.depositCount : "-"}</TableCell>
								<TableCell align="right">{o.node.depositUsers ? o.node.depositUsers : "-"}</TableCell>
								<TableCell align="right">{o.node.withdrawalAmount ? o.node.withdrawalAmount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
								<TableCell align="right">{o.node.withdrawalCount ? o.node.withdrawalCount : "-"}</TableCell>
								<TableCell align="right">{o.node.withdrawalUsers ? o.node.withdrawalUsers : "-"}</TableCell>
								<TableCell align="right">{o.node.betAmount ? o.node.betAmount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
								<TableCell align="right">{o.node.betValidAmount ? o.node.betValidAmount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
								<TableCell align="right">{o.node.betCount ? o.node.betCount : "-"}</TableCell>
								<TableCell align="right">{o.node.betUsers ? o.node.betUsers : "-"}</TableCell>
								<TableCell align="right">{o.node.subtraction ? o.node.subtraction.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
							</TableRow>
						})
						:

						<TableRow>
							<TableCell align="center" colSpan={13}>{strings.noDataAvailable}</TableCell>
						</TableRow>

				}
			/> */}
		</Grid>
	</Paper>
}