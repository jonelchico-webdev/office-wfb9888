import React, { useState, Fragment } from 'react';
import { useMutation } from 'react-apollo'
import { Paper, TableCell, TableRow, Grid, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { SimpleTable } from '../../components';
import { ContinueCancelModal, SortChangeModal, Loading } from '../../components';
import Title from '../../components/title';
import useLanguages from '../../hooks/use-languages';
import { ELECTRONIC_GAMES, ELECTRONIC_GAME_MANAGEMENT } from '../../paths';
import { useGameManagementVendorQuery } from '../../queries-graphql/game-management/use-game-management'
import { GAME_MANAGEMENT_VENDOR_STATUS_MUTATE, GAME_MANAGEMENT_VENDOR_WEIGHT_MUTATE } from '../../queries-graphql/game-management/mutation/use-game-management-mutation'
import usePagination from '../../hooks/use-pagination';

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},
}));

export default function ElectronicGames(props) {
	const classes = useStyles();
	const strings = useLanguages(ELECTRONIC_GAMES);
	const { history } = props;

	const [id, setId] = useState(null)
	const [name, setName] = useState(null)
	const [status, setStatus] = useState(null)
	const [initialWeight, setInitialWeight] = useState(null);
	const [mutate, setMutate] = useState(false)
	const [open, setOpen] = useState(false)
	const [sortOpenModal, setSortModalOpen] = useState(false);

	const pagination = usePagination();
	const { rowsPerPage, cursor: { before, after } } = pagination;

	const [gameVendorStatusMutate] = useMutation(GAME_MANAGEMENT_VENDOR_STATUS_MUTATE)
	const [gameVendorWeightMutate] = useMutation(GAME_MANAGEMENT_VENDOR_WEIGHT_MUTATE)

	const { data, loading } = useGameManagementVendorQuery({ gameType: "R2FtZVR5cGVOb2RlOjcxMw==", rowsPerPage, before, after, mutate, open })
	if (loading) {
		return <Loading />
	}
	const count = data.gameVendors.totalCount
	const vendors = data.gameVendors.edges
	const pageInfo = data.gameVendors.pageInfo

	{/* console.log(vendors.sort((a, b) => a.weight - b.weight)) */}

	function statChange(status, statusId, nameId) {
		setStatus(!status)
		setId(statusId)
		setName(nameId)
		setOpen(true)
	}

	function mutateStatusQuery(variables) {
		gameVendorStatusMutate({
			variables: variables,
		})
		setMutate(!mutate)
	}

	function sortChange(initialWeight, weightId, nameId) {
		setId(weightId)
		setName(nameId)
		setInitialWeight(initialWeight);
		setSortModalOpen(true);
	}

	function mutateWeightQuery(variables) {
		gameVendorWeightMutate({
			variables: variables,
		})
		setMutate(!mutate)
	}


	// const TableCellMod = ({ idValue, index, mutate }) => {
	// 	const { data, loading } = useGameManagementVendorQuery({ id: idValue, mutate })
	// 	if (loading) {
	// 		return null
	// 	}
	// 	const vendorValue = data

	// 	return <Fragment>
	// 		<TableRow>
	// 			<TableCell>{vendorValue.gameVendor.id}</TableCell>
	// 			<TableCell>{vendorValue.gameVendor.name}</TableCell>
	// 			<TableCell><Typography color={vendorValue.gameVendor.enabled ? "secondary" : "error"}>{vendorValue.gameVendor.enabled ? "Enabled" : "Disabled"}</Typography></TableCell>
	// 			<TableCell>{vendorValue.gameVendor.weight}</TableCell>
	// 			<TableCell style={{ textAlign: "center" }}>
	// 				<Grid container spacing={1} direction="row">
	// 					<Grid item><Button size="small" variant="contained" color="primary" onClick={() => history.push(`${ELECTRONIC_GAME_MANAGEMENT}/${vendorValue.gameVendor.id}`)}>{strings.gameManagement}</Button></Grid>
	// 					<Grid item><Button size="small" variant="outlined" id={index} onClick={statChange} >{strings.statusChange}</Button></Grid>
	// 					<Grid item><Button size="small" variant="outlined" onClick={() => sortChange(vendorValue.gameVendor.sortWeight)} >{strings.sortChange}</Button></Grid>
	// 				</Grid>
	// 			</TableCell>
	// 		</TableRow>
	// 	</Fragment>
	// }

	// const VendorCell = ({ items, mutate }) => {
	// 	return items.map((o, index) => {
	// 		// const isModalSelected = isOpen(index)
	// 		return <Fragment>
	// 			<TableCellMod idValue={o} index={index} mutate={mutate} />
	// 			
	// 		</Fragment>
	// 	})
	// }

	return <Paper elevation={1} className={classes.paper}>
		<Title pageTitle={strings.electronicGames} />
		<Grid item style={{ paddingTop: 0 }}></Grid>

		<SimpleTable
			tableProps={{ size: "small" }}			
			pagination={pagination}
			pageInfo={pageInfo}
			noBorder={true}
			hasPagination={true}
			count={count}
			columns={
				<TableRow>
					<TableCell width="5%" align="center">{strings.serialNumber}</TableCell>
					<TableCell width="17%">{strings.vendor}</TableCell>
					<TableCell width="17%">{strings.status}</TableCell>
					<TableCell width="10%" align="center">{strings.sortWeight}</TableCell>
					<TableCell width="32%" style={{ textAlign: "center" }}>{strings.operating}</TableCell>
				</TableRow>
			}
			rows={
				vendors.length === 0 ? 
				<TableRow>
					<TableCell align="center" colSpan={5}>没有可用数据</TableCell>
				</TableRow>
				:
				vendors ? vendors.map((o, index) => {
						return <Fragment>
							<TableRow>
								<TableCell>{o.node.pk}</TableCell>
								<TableCell>{o.node.name}</TableCell>
								<TableCell><Typography color={o.node.enabled ? "secondary" : "error"}>{o.node.enabled ? strings.enable : strings.disable }</Typography></TableCell>
								<TableCell align="center">{o.node.weight}</TableCell>
								<TableCell style={{ textAlign: "center" }}>
									<Grid container spacing={1} direction="row" justify="center">
										<Grid item><Button size="small" variant="contained" color="primary" onClick={() => history.push(`${ELECTRONIC_GAME_MANAGEMENT}/${o.node.id}`)}>{strings.gameManagement}</Button></Grid>
										<Grid item><Button size="small" variant="outlined" onClick={() => statChange(o.node.enabled, o.node.id, o.node.name)} >{strings.statusChange}</Button></Grid>
										<Grid item><Button size="small" variant="outlined" onClick={() => sortChange(o.node.weight, o.node.id, o.node.name)}>{strings.sortChange}</Button></Grid>
									</Grid>
								</TableCell>
							</TableRow>


						</Fragment>
					}) : null
			}
		/>
		<ContinueCancelModal
			open={open}
			setOpen={setOpen}
			id={id}
			setId={setId}
			status={status}
			setStatus={setStatus}
			name={name}
			setName={setName}
			mutateQuery={mutateStatusQuery}
			title={ status ? strings.warning1Close : strings.warning1 }
			description={strings.warning2}
		/>
		<SortChangeModal
			open={sortOpenModal}
			setOpen={setSortModalOpen}
			id={id}
			setId={setId}
			name={name}
			setName={setName}
			weight={initialWeight}
			mutateQuery={mutateWeightQuery}
			setWeight={setInitialWeight}
			title={strings.currentManufacturer}
			title2={strings.pleaseEnterTheSortWeight}
			description={strings.warning3}
		/>
	</Paper>
}