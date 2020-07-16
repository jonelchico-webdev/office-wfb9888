import React from 'react';
import { ButtonGroup, Paper, TableCell, TableRow, Grid, Button, Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { SimpleTable } from '../../../components';
import useLanguages from '../../../hooks/use-languages';
import Title from '../../../components/title';
import { VIP_WELFARE_CONFIGURATION, CONSUMPTION_BACKWATER, BASIC_GIFT_SETTING, WINNING_PRIZE, TRANSFER_GOLD } from '../../../paths';
import { CreateOutlined } from '@material-ui/icons/';
import usePagination from '../../../hooks/use-pagination'

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(3, 2),
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	dense: {
		marginTop: theme.spacing(2),
	},
}));

export default function ConsumptionBackwater(props) {
	const classes = useStyles();
	const strings = useLanguages(VIP_WELFARE_CONFIGURATION);
	// const [values, setValues] = React.useState({
	// 	name: 'DSDSDSDSDSASASAD',
	// 	age: '',
	// 	multiline: 'Controlled',
	// 	currency: 'EUR',
	// });
	const pagination = usePagination()

	const { history } = props;

	// const handleChange = name => event => {
	// 	setValues({ ...values, [name]: event.target.value });
	// };

	return <Grid>
		<Title pageTitle={strings.vipWelfareConfiguration} />
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<ButtonGroup fullWidth aria-label="full width outlined button group">
					<Button style={{ backgroundColor: "white" }} onClick={() => { history.push(VIP_WELFARE_CONFIGURATION) }}>{strings.giftOpeningClosingSettings}</Button>
					<Button style={{ backgroundColor: "white", color: "blue", borderColor: "blue", marginRight: '0.1rem' }} onClick={() => { history.push(BASIC_GIFT_SETTING) }}>{strings.basicGiftSetting}</Button>
					<Button style={{ backgroundColor: "white" }} onClick={() => { history.push(CONSUMPTION_BACKWATER) }}>{strings.consumptionBackwater}</Button>
					<Button style={{ backgroundColor: "white" }} onClick={() => { history.push(WINNING_PRIZE) }}>{strings.winningPrize}</Button>
					<Button style={{ backgroundColor: "white" }} onClick={() => { history.push(TRANSFER_GOLD) }}>{strings.transferGold}</Button>
				</ButtonGroup>
			</Grid>
		</Grid>
		<Paper className={classes.root} style={{ marginTop: "20px" }}>
			<Grid container justify="space-between">
				<Grid item style={{ marginBottom: "10px" }}>
					<Grid alignItems="center" container>
						<Typography>{strings.giftGoldAuditingMultiple}:</Typography>
						<TextField type="number" variant="outlined" margin="dense" style={{ width: 70, marginLeft: 5 }} />
						<CreateOutlined />
					</Grid>
				</Grid>
				<Grid item style={{ marginBottom: "10px" }}>
					<Button variant="contained" color="primary" >{strings.save}</Button>
				</Grid>
			</Grid>
			<Grid item>
				<SimpleTable
					hasPagination={false}
					pagination={pagination}
					pageInfo={false}
					columns={
						<TableRow>
							<TableCell>{strings.grade}</TableCell>
							<TableCell>{strings.rankName}</TableCell>
							<TableCell>{strings.promotionGift}</TableCell>
							<TableCell>{strings.relegationGift}</TableCell>
							<TableCell>{strings.loginGift}</TableCell>
						</TableRow>
					}

					rows={<TableRow key="asdasdad">
						<TableCell style={{ width: '20%' }}>{0}</TableCell>
						<TableCell style={{ width: '20%' }}>VIP0</TableCell>
						<TableCell style={{ width: '20%' }}>
							<TextField
								variant="outlined"
								margin="dense"
								name="accountNumber"
								style={{ backgroundColor: "white" }}
							>

							</TextField>
						</TableCell>
						<TableCell style={{ width: '20%' }}>
							<TextField
								variant="outlined"
								margin="dense"
								name="accountNumber"
								style={{ backgroundColor: "white" }}
							>

							</TextField>
						</TableCell>
						<TableCell style={{ width: '20%' }}>
							<TextField
								variant="outlined"
								margin="dense"
								name="accountNumber"
								style={{ backgroundColor: "white" }}
							>

							</TextField>
						</TableCell>
					</TableRow>
					}
				/>
			</Grid>
		</Paper>
	</Grid>
}