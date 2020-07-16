import React, { useState } from 'react';
import { Paper,TableCell, TableRow, Grid, Button, Typography, Divider} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Title from '../../components/title';
import useLanguages from '../../hooks/use-languages';
import  { COMMISSION_MANAGEMENT, COMMISSION_MANAGEMENT_ADD, COMMISSION_MANAGEMENT_MODIFY } from '../../paths';
import {SimpleTable} from '../../components';
import usePagination from '../../hooks/use-pagination'
import { useCommissionQuery } from '../../queries-graphql/commission-system/commission-management'
import { DELETE_COMMISSION } from '../../queries-graphql/commission-system/mutation/commission-delete-mutation'
import swal from 'sweetalert2';
import { useMutation } from '@apollo/react-hooks'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
    }
}));

export default function CommissionManagement(props) {
	const classes = useStyles();
	const strings = useLanguages(COMMISSION_MANAGEMENT);

	const {history} = props;

	const [deleteCommission] = useMutation(DELETE_COMMISSION)
	const [mutate, setMutate] = useState(false)

	async function deleteCommissionId(id, name) {
		await swal.fire({
			title: strings.delete,
			text: strings.areYouSureYouWantToDelete + name + "?",
			// type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: strings.yesDeleteIt,
			cancelButtonText: strings.cancel
		  }).then((result) => {
			if (result.value) {
				deleteCommission({
					variables: {
						id: id
					}
				})
				swal.fire(
					strings.delete,
					strings.commission + name + strings.hasBeenDeleted,
					'success'
				)
			}
		  })
		setMutate(!mutate)
	}

	const pagination = usePagination()
	const { rowsPerPage, cursor: {before, after} } = pagination;
	const {data, loading} = useCommissionQuery({
		mutation: mutate,
		commissionType_In: "deposit, bet",
		before,
		after,
		rowsPerPage
	})

	if(loading) {
		return null
	}

	const commissions = data.commissions.edges
	const commissionsPageInfo = data.commissions.pageInfo
	const count = data.commissions.totalCount
	// console.log(commissions)

	return <Paper elevation={1}>
			<Title pageTitle={strings.commissionManagement} />
			<Grid container className={classes.paper} justify="space-between">
				<Typography variant="h6">{strings.commissionManagement}</Typography>
				<Grid>
					<Button variant="contained" style={{backgroundColor: 'rgb(255, 0, 0)', color: '#fff'}} onClick={() => history.push(COMMISSION_MANAGEMENT_ADD)}>{strings.newCommission}</Button>
				</Grid>
			</Grid>
			<Divider light={true}/>
			<Grid className={classes.paper}>
				<SimpleTable 
					tableProps={{size: "small"}}
					pageInfo={commissionsPageInfo}
					hasPagination={true}
					count={count} 
					noBorder={true}
					pagination={pagination}
					columns={
						<TableRow>
							<TableCell>{strings.serialNumber}</TableCell>
							<TableCell>{strings.commissionName}</TableCell>
							<TableCell>{strings.status}</TableCell>
							<TableCell>{strings.statisticalPeriod}</TableCell>
							<TableCell>{strings.creationTime}</TableCell>
							<TableCell>{strings.founder}</TableCell>
							<TableCell>{strings.lastUpdateTime}</TableCell>
							<TableCell>{strings.updater}</TableCell>
							<TableCell>{strings.operating}</TableCell>
						</TableRow>
					}
					rows={
						commissions.length === 0 ? 
						<TableRow>
							<TableCell align="center" colSpan={9}>没有可用数据</TableCell>
						</TableRow>
						:
						commissions.map((o, index) =>  <TableRow key={index}>
							<TableCell>{o.node.id ? o.node.id : "-"}</TableCell>
							<TableCell>{o.node.name ? o.node.name : "-"}</TableCell>
							<TableCell>{o.node.enabled ? strings.enable : strings.disable}</TableCell>
							<TableCell>
								{
									o.node.payPeriod === "THREE_DAYS" ?
									strings.threeDays
									:
									o.node.payPeriod === "WEEKLY" ?
									strings.week
									:
									o.node.payPeriod === "MONTHLY" ?
									strings.month
									:
									o.node.payPeriod === "DAILY" ?
									strings.day
									:
									"-"
								}
							</TableCell>
							<TableCell>{o.node.createdAt ? moment(o.node.createdAt).format("YYYY-MM-DD HH:mm:ss") : "-"}</TableCell>
							<TableCell>{o.node.createdBy ? o.node.createdBy.username : "-"}</TableCell>
							<TableCell>{o.node.createdAt ? moment(o.node.createdAt).format("YYYY-MM-DD HH:mm:ss") : "-"}</TableCell>
							<TableCell>{o.node.updatedBy ? o.node.updatedBy.username : "-"}</TableCell>
							<TableCell>
								<Grid container spacing={1} direction="row">
									<Grid item><Button size="small" onClick={() => history.push(`${COMMISSION_MANAGEMENT_MODIFY}/${o.node.id}`)}><Typography color="primary">{strings.modify}</Typography></Button></Grid>
									<Grid item><Button size="small" onClick={() => deleteCommissionId(o.node.id, o.node.name)}><Typography color="primary">{strings.delete}</Typography></Button></Grid>
								</Grid>
							</TableCell>
						</TableRow>)
					}
				/>
			</Grid>
		</Paper>
}