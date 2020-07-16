import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-apollo'
import {
	Paper,
	TableCell,
	TableRow,
	Grid,
	Button,
	Typography,
	TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { SimpleTable } from '../../../components/';
import { ContinueCancelModal, Loading } from '../../../components';
import Title from '../../../components/title';
import useLanguages from '../../../hooks/use-languages';
import { ELECTRONIC_GAME_MANAGEMENT } from '../../../paths';
import { useGameManagementWithVendorQuery } from '../../../queries-graphql/game-management/use-game-management'
import usePagination from '../../../hooks/use-pagination';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useGames } from '../../../queries-graphql/game-management/mutation/use-game-management-mutation'
import swal from 'sweetalert2';

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},
	number: {
		"& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
			"-webkit-appearance": "none",
			margin: 0
		}
	},
	input: {
		"&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
			"-webkit-appearance": "none",
			margin: 0
		}
	},
}));

const IOSSwitch = withStyles(theme => ({
	root: {
		width: 30,
		height: 15,
		padding: 0,
		margin: theme.spacing(1)
	},
	switchBase: {
		padding: 1,
		"&$checked": {
			color: theme.palette.common.white,
			"& + $track": {
				backgroundColor: "#689f38",
				opacity: 1,
				border: "none",
			}
		},
		"&$focusVisible $thumb": {
			color: "#689f38",
			border: "6px solid #fff"
		}
	},
	thumb: {
		width: 11,
		height: 10,
		marginTop: 1,
		marginLeft: 5
	},
	track: {
		borderRadius: 26 / 2,
		border: `1px solid #d84315`,
		backgroundColor: '#d84315',
		marginLeft: 1,
		opacity: 1,
		transition: theme.transitions.create(["background-color", "border"])
	},
	checked: {},
	focusVisible: {}
}))(({ classes, ...props }) => {
	return (
		<Switch
			focusVisibleClassName={classes.focusVisible}
			disableRipple
			classes={{
				root: classes.root,
				switchBase: classes.switchBase,
				thumb: classes.thumb,
				track: classes.track,
				checked: classes.checked
			}}
			{...props}
		/>
	);
});

export default function ElectronicGameManagement(props) {
	const classes = useStyles();
	const { history } = props;
	const strings = useLanguages(ELECTRONIC_GAME_MANAGEMENT);
	const [name, setName] = useState(null)
	const [modalOpen, setModalOpen] = useState(false);
	const [gameData, setGameData] = useState(null)
	const [mutated, setMutated] = useState(false)
	const [values, setValues] = useState(null)
	const historyArr = history.location.pathname.split("/", 5)
	const pagination = usePagination();
	const { rowsPerPage, cursor: { before, after }, page, setCursor, setPage } = pagination;
	const { setGameDataMutate, GAME_MANAGEMENT_BATCH_MUTATION, setRedo, redo } = useGames(gameData)
	const [gamesMutate] = useMutation(GAME_MANAGEMENT_BATCH_MUTATION)

	function mutateBatchQuery() {
		gamesMutate()
		setMutated(!mutated)
		swal.fire({
			position: 'center',
			type: 'success',
			title: '游戏更新成功',
			showConfirmButton: true
		})
	}

	const { data, loading } = useGameManagementWithVendorQuery({ gameType: "R2FtZVR5cGVOb2RlOjcxMw==", name: name, vendor: historyArr[4], rowsPerPage, before, mutated, after, page })

	if (loading) {
		return <Loading />;
	}

	const count = data.games.totalCount
	const games = data.games.edges
	const pageInfo = data.games.pageInfo

	const BatchMutate = ({ games }) => {
		useEffect(() => {
			if (gameData === null) {
				setGameData(games)
			}
		}, [])

		useEffect(() => {
			setGameDataMutate(games)
		}, [games])
		return null
	}

	function handleMutate(games) {
		setGameDataMutate(null)

		if (games) {
			setRedo(!redo)
			setGameDataMutate(games)
		}
	}

	function statChange() {
		setModalOpen(true);
	}

	function switchChange(event) {
		let id = event.currentTarget.id
		games[id].node.enabled = !games[id].node.enabled
		handleMutate(games)
	}

	function sortWeightHandle(event) {
		let index = event.currentTarget.id
		let value = event.currentTarget.value
		if (value === null || value === '') {
			value = 0
		}
		games[index].node.weight = parseInt(value)
		handleMutate(games)
	}

	function handleValueChange(event) {
		setValues(event.currentTarget.value)
	}

	function searchBtn() {
		setCursor({
            before: null,
            after: null
        })
        setPage(0)
		setName(values)
	}
	return <Paper elevation={1} className={classes.paper} >
		<Title pageTitle={strings.electronicGameManagement} />
		{games ? <BatchMutate games={games} /> : null}
		<Grid container direction="column" spacing={2}>
			<Grid item>
				<Grid container alignItems="center" spacing={2}>
					<Grid item>
						<Typography size="small">{strings.gameName} :</Typography>
					</Grid>
					<Grid item style={{ marginRight: -28 }}>
						<TextField
							style={{ maxHeight: 57, minWidth: "35%", paddingLeft: 12 }}
							variant="outlined"
							placeholder={strings.pleaseEnter}
							margin="dense"
							name="gameSortWeight"
							value={values}
							onChange={handleValueChange}
							InputProps={{
								endAdornment: (
									<Button variant="contained" color="primary" style={{ marginRight: -14 }} onClick={searchBtn} >{strings.searchFor}</Button>
								),
							}}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Grid item>

				<SimpleTable
					tableProps={{ size: "small" }}
					pagination={pagination}
					pageInfo={pageInfo}
					hasPagination={true}
					count={count}
					columns={
						<TableRow>
							<TableCell style={{ width: 180 }}>{strings.serialNumber}</TableCell>
							<TableCell style={{ width: 270 }}>{strings.vendor}</TableCell>
							<TableCell style={{ width: 220 }}>{strings.gameName}</TableCell>
							<TableCell style={{ width: 268 }}>{strings.gameCategory}</TableCell>
							<TableCell style={{ width: 180 }}>{strings.status}</TableCell>
							<TableCell style={{ width: 95 }} align="right">{strings.sortWeight}</TableCell>
						</TableRow>
					}
					rows={
						games.length === 0 ? 
						<TableRow>
							<TableCell align="center" colSpan={5}>没有可用数据</TableCell>
						</TableRow>
						:
						games ? data.games.edges
							.map((o, index) => <TableRow key={index}>
								<TableCell>{o.node.pk}</TableCell>
								<TableCell>{o.node.vendor.name}</TableCell>
								<TableCell>{o.node.name}</TableCell>
								<TableCell>{o.node.gameType.name}</TableCell>
								<TableCell>
									<IOSSwitch
										id={index}
										checked={o.node.enabled}
										onChange={switchChange}
									/>
								</TableCell>
								<TableCell width="10%" align="right">
									<TextField
										type="number"
										id={index}
										fullWidth
										variant="outlined"
										margin="dense"
										name="weight"
										onChange={sortWeightHandle}
										value={o.node.weight}
										style={{ minWidth: 70 }}
										// inputProps={{ className:classes.input}}
									/>
								</TableCell>
							</TableRow>) : null
					}
				/>
			</Grid>
			<Grid item md={12}>

				<Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper" spacing={1}>
					<Button size="small" style={{ minWidth: 100 }} justifyContent="center" onClick={() => history.goBack()} variant="outlined">{strings.cancel}</Button>
					<Button size="small" style={{ marginLeft: 30, minWidth: 100 }} justifyContent="center" variant="contained" onClick={statChange} color="primary">{strings.save}</Button>
				</Box>
			</Grid>
		</Grid>
		<ContinueCancelModal
			mutateQuery={mutateBatchQuery}
			open={modalOpen}
			setOpen={setModalOpen}
			title={strings.warning1}
			description={strings.warning2}
		/>
	</Paper>
}