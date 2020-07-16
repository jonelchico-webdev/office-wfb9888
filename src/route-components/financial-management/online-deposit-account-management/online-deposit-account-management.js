import React, { useState } from 'react';
import {
	Paper, TableCell, TableRow, Grid, Button, Typography,
	Divider, FormControl, Select, ListItemText,
	Input, MenuItem
} from '@material-ui/core';
import { SimpleTable, DeleteMutateModal, Loading } from '../../../components';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import { ONLINE_PAYMENT_PLATFORM_MANAGEMENT, ONLINE_PAYMENT_PLATFORM_MANAGEMENT_ADD, ONLINE_PAYMENT_PLATFORM_MANAGEMENT_UPDATE } from '../../../paths';
import StatusIcon from '../../shared-components/status';
import Title from '../../../components/title';
import useOnlinePaymentPlatform from '../../../queries-graphql/financial-management/online-payment-platform';
import usePagination from '../../../hooks/use-pagination';
import gql from 'graphql-tag'
// import { useMutation } from '@apollo/react-hooks'
// import swal from 'sweetalert2';
// import Cookies from 'universal-cookie';

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},
	// root: {
	// 	display: 'flex',
	// 	flexWrap: 'wrap',
	// },
	formControl: {
		// margin: theme.spacing(1),
		minWidth: 120,
		maxWidth: 300,
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	chip: {
		margin: 2,
	},
}));

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: 200,
			width: 170,
		},
	},
};

export default function OnlineDepositAccountManagement(props) {
	const classes = useStyles();
	const strings = useLanguages(ONLINE_PAYMENT_PLATFORM_MANAGEMENT);
	const { history } = props;
	const [modalOpen, setModalOpen] = useState(false);
	const [id, setID] = useState({ id: '' });

	function handleDeleteItem(bankID) {
		setModalOpen(true);
		setID({
			id: bankID
		});
	}

	// MUTATION DELETE

	const DELETE_BANK_MUTATE = gql` 
		mutation(
			$id: ID,
			$deletedFlag: Boolean
			){
			bank(input:{
				id: $id
				deletedFlag: $deletedFlag
			}) {
				clientMutationId
				errors{
					field
					messages
				}
				bank{
					pk
					id
					bankName
					businessCode
				}
			}
		}
		`

	const [mutate, setMutate] = React.useState(false)

	// function mutateRefresh() {
	// 	setMutate(!mutate)
	// }

	// END

	const pagination = usePagination();
	const { rowsPerPage, cursor: { before, after }, page } = pagination;
	const { data, loading } = useOnlinePaymentPlatform({
		depositType: "online",
		mutation: mutate,
		deletedFlag: false,
		rowsPerPage,
		before,
		after,
		page,
	});

	if (loading) {
		return <Loading />;
	}

	const depositAccounts = data.banks.edges;
	const pageInfo = data.banks.pageInfo;
	const count = data.banks.totalCount;

	// console.log(depositAccounts)

	return <Paper elevation={1} className={classes.paper}>
		<Title pageTitle={strings.onlinePaymentPlatformManagement} />
		<Grid container spacing={2} direction="column">
			<Grid item><Typography variant="h6">{strings.onlinePaymentPlatformManagement}</Typography></Grid>
			<Grid item style={{ paddingTop: 0, paddingBottom: 0 }}>
				<Divider light={true} />
			</Grid>
			<Grid item container alignItems="center" spacing={1}>
				<Grid item>
					<Button variant="contained" color="primary" onClick={(e) => {
						history.push(ONLINE_PAYMENT_PLATFORM_MANAGEMENT_ADD);
					}}>{strings.newPaymentPlatform}</Button>
				</Grid>
			</Grid>

			<Grid item style={{ paddingTop: 0 }}>
				<SimpleTable
					tableProps={{ size: "small" }}
					hasPagination={true}
					pageInfo={pageInfo}
					count={count}
					noBorder={true}
					pagination={pagination}
					columns={
						<TableRow>
							<TableCell align="right">{strings.id}</TableCell>
							<TableCell>{strings.businessName}</TableCell>
							<TableCell>{strings.paymentTypes}</TableCell>
							<TableCell>{strings.usingTheTerminal}</TableCell>
							<TableCell align="right">{strings.cumulativeAmount}</TableCell>
							<TableCell align="right">{strings.theAmountOfTheDaysDeposit}</TableCell>
							<TableCell align="right">{strings.automaticDeactivationAmount}</TableCell>
							<TableCell>{strings.status}</TableCell>
							<TableCell>{strings.availableMembershipLevel}</TableCell>
							<TableCell>{strings.actions}</TableCell>
						</TableRow>
					}
					rows={
						depositAccounts.length === 0 ? 
						<TableRow>
							<TableCell align="center" colSpan={14}>没有可用数据</TableCell>
						</TableRow>
						:
						depositAccounts.map((o, idx) => <TableRow key={idx}>
							<TableCell align="right">{o.node.pk ? o.node.pk : "-"}</TableCell>
							<TableCell>{o.node.payVendor ? o.node.payVendor.name : "-"}</TableCell>
							<TableCell>{o.node.payType ? o.node.payType.name : "-"}</TableCell>
							<TableCell>{o.node.platformType ? o.node.platformType : "-"}</TableCell>
							<TableCell align="right">{o.node.bankRule.edges.length >= 1 ?
								o.node.bankRule.edges.map((bankData) => bankData.node.singleMaxDeposit.toLocaleString('en', {maximumFractionDigits:2})) : '-'
							}</TableCell>
							<TableCell align="right">{o.node.bankRule.edges.length >= 1 ?
								o.node.bankRule.edges.map((bankData) => bankData.node.perDayMaxDepositTimes.toLocaleString('en', {maximumFractionDigits:2})) : '-'
							}</TableCell>
							<TableCell align="right">{o.node.bankRule.edges.length >= 1 ?
								o.node.bankRule.edges.map((bankData) => bankData.node.perDayMaxDepositAmount.toLocaleString('en', {maximumFractionDigits:2})) : '-'
							}</TableCell>
							<TableCell><StatusIcon status={(o.node.status.toLowerCase() === "valid") ? "completed" : "cancelled"} /></TableCell>
							<TableCell>
								<div className={classes.root}>
									<FormControl className={classes.formControl}>
										<Select
											multiple
											displayEmpty
											value={[]}
											input={<Input id="select-multiple-placeholder" />}
											// renderValue={selected => { return <em>{strings.availableMembershipLevels}</em> }}
											renderValue={selected => 
												o.node.bankRule.edges.length > 0 ?
													o.node.bankRule.edges.map((bankData) =>
														bankData.node.depositLevels.edges.length > 0 ?
															bankData.node.depositLevels.edges.map((o) => {
															return o.node.name + ", "
															})
															:
															"-"
													)
												:
												"-"
											}
											MenuProps={MenuProps}
											style={{ width: 150 }}
										>
											<MenuItem disabled value="">
												{strings.availableMembershipLevels}
											</MenuItem>
											{
												o.node.bankRule ?
													o.node.bankRule.edges.map((bankData) =>
														bankData.node.depositLevels ?
															bankData.node.depositLevels.edges.map((o) => {
															return <MenuItem key={o.node.name} value={o.node.name}>
																<ListItemText primary={o.node.name} />
															</MenuItem>
															})
															:
															"-"
													)
												:
												null
											}
										</Select>
									</FormControl>
								</div>
							</TableCell>
							<TableCell>
								<Grid container spacing={1} direction="row" style={{ width: 160 }}>
									<Grid item><Button size="small" variant="contained" color="primary" onClick={() => history.push(`${ONLINE_PAYMENT_PLATFORM_MANAGEMENT_UPDATE}/${o.node.id}`)}>{strings.update}</Button></Grid>
									<Grid item><Button size="small" onClick={() => handleDeleteItem(o.node.id)} >{strings.delete}</Button></Grid>
								</Grid>
							</TableCell>
						</TableRow>)
					}
				/>
			</Grid>
		</Grid>
		<DeleteMutateModal mutate={mutate} setMutate={setMutate} idMutate={id} mutateQuery={DELETE_BANK_MUTATE} open={modalOpen} setOpen={setModalOpen} title={strings.deleteModalTitle} />
	</Paper>
}
