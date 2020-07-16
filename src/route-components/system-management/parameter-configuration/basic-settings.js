import React, { useEffect, Fragment } from 'react';
import { Paper, Grid, Button, Typography, TextField, IconButton } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import { Title } from '../../../components';
import useLanguages from '../../../hooks/use-languages';
import { PARAMETER_CONFIGURATION } from '../../../paths';
import { ErrorOutline, Help } from '@material-ui/icons';
import Switch from '@material-ui/core/Switch';
import { useFrontDeskMaintenanceManagementQuery, usePlatformConfigurationQuery } from '../../../queries-graphql/system-management/parameter-configuration/query/basic-settings'
import { FRONT_DESK_MAINTENANCE_MANAGEMENT_MUTATION, PLATFORM_CONFIGURATION_MUTATION } from '../../../queries-graphql/system-management/parameter-configuration/mutation/basic-settings'
import { useMutation } from '@apollo/react-hooks'
import swal from 'sweetalert2';
import { AppDateRangePicker } from '../../../components/date-picker';
import { Edit, Done } from '@material-ui/icons'
import { fromPromise } from 'apollo-link';
import moment from 'moment'

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},
	main: {
		paddingTop: theme.spacing(10),
		paddingLeft: theme.spacing(40),
		paddingRight: theme.spacing(40),
		paddingBottom: theme.spacing(10)
	}
}));

function FrontDeskMaintenanceManagementQuery() {
	const { data, loading } = useFrontDeskMaintenanceManagementQuery()

	if (loading) {
		return null
	} else if (data.configurations) {
		return data.configurations
	} else {
		return null
	}


}

function PlatformConfigurationQuery() {
	const { data, loading } = usePlatformConfigurationQuery()

	if (loading) {
		return null
	} else if (data.configurations) {
		return data.configurations
	} else {
		return null
	}
}

export default function BasicSettings() {
	const classes = useStyles();
	const strings = useLanguages(PARAMETER_CONFIGURATION);

	const [websiteMaintainTimeEdit, setWebsiteMaintainTimeEdit] = React.useState(false)

	const [frontDeskValues, setFrontDeskValues] = React.useState({
		websiteMaintain: false,
		websiteMaintainTime: null,
		startDate: null,
		endDate: null
	})

	const [platformConfigurationValues, setplatformConfigurationValues] = React.useState({
		websiteTitle: null,
		websiteKeywords: null,
		websiteDescription: null
	})

	const [focusedInput, setFocusedInput] = React.useState(null);

	function onDatesChange({ startDate, endDate }) {
		setFrontDeskValues(oldValues => ({
			...oldValues,
			startDate,
			endDate
		}));
	}

	function onFocusChange(f) {
		setFocusedInput(f);
	}

	const configurationsFrontDeskMaintenance = FrontDeskMaintenanceManagementQuery()
	const platformConfiguration = PlatformConfigurationQuery()

	const [mutationFrontDeskMaintenance] = useMutation(FRONT_DESK_MAINTENANCE_MANAGEMENT_MUTATION)
	const [mutationPlatformConfiguration] = useMutation(PLATFORM_CONFIGURATION_MUTATION)
	const [defMaintain, setDefMain] = React.useState(null);

	useEffect(() => {
		if (configurationsFrontDeskMaintenance) {
			setFrontDeskValues({
				websiteMaintain: configurationsFrontDeskMaintenance.websiteMaintain,
				websiteMaintainTime: configurationsFrontDeskMaintenance.websiteMaintainTime
			})
			setDefMain([configurationsFrontDeskMaintenance.websiteMaintainTime.split(' ', [5])[3]])
		}
		if (platformConfiguration) {
			setplatformConfigurationValues({
				websiteTitle: platformConfiguration.websiteTitle,
				websiteKeywords: platformConfiguration.websiteKeywords,
				websiteDescription: platformConfiguration.websiteDescription
			})
		}

	}, [configurationsFrontDeskMaintenance, platformConfiguration])

	function handleConfigValuesChange(event) {
		event.persist()

		if (event.target.name === "websiteMaintain") {
			setFrontDeskValues(oldConfigValues => ({
				...oldConfigValues,
				websiteMaintain: !frontDeskValues.websiteMaintain
			}));
		} else {
			setFrontDeskValues(oldConfigValues => ({
				...oldConfigValues,
				[event.target.name]: event.target.value
			}));
		}
	}


	function handlePlatformConfigurationChange(event) {
		event.persist()
		setplatformConfigurationValues(oldConfigValues => ({
			...oldConfigValues,
			[event.target.name]: event.target.value
		}));
	}

	async function updateFrontDeskMaintenance() {
		await mutationFrontDeskMaintenance({ variables: frontDeskValues })
		swal.fire({
			position: 'center',
			type: 'success',
			title: strings.frontDeskMaintenanceUpdated,
			showConfirmButton: false,
			timer: 1500
		})
	}

	async function updatePlatformConfiguration() {
		await mutationPlatformConfiguration({ variables: platformConfigurationValues })
		swal.fire({
			position: 'center',
			type: 'success',
			title: strings.platformConfigurationUpdated,
			showConfirmButton: false,
			timer: 1500
		})
	}
	// function onFocusChange(f) {
	// 	setFocusedInput(f);
	// }

	const IOSSwitch = withStyles(theme => ({
		root: {
			width: 30,
			height: 15,
			padding: 0,
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

	// const statusSwitchHandle = agentId => event => {
	// 	setNewState(event.target.checked);
	// };

	function doneEdit() {
		if (frontDeskValues.startDate !== null && frontDeskValues.endDate !== null) {
			let startDate = moment(frontDeskValues.startDate).format("YYYY-MM-DD")
			let endDate = moment(frontDeskValues.endDate).format("YYYY-MM-DD")


			setFrontDeskValues(oldConfigValues => ({
				...oldConfigValues,
				"websiteMaintainTime": startDate + " -- " + endDate
			}));
		}

		setWebsiteMaintainTimeEdit(false)
	}

	return <Grid>
		<Title pageTitle={strings.basicSetting} />
		<Paper className={classes.paper} elevation={1} style={{ marginTop: "20px" }}>
			<Grid container className={classes.main} alignContent="center" alignItems="center">
				<Typography variant="h6">
					<Grid container alignContent="center">
						<Grid item style={{ marginRight: 5, paddingTop: 4 }}><ErrorOutline color="primary" /></Grid>
						{strings.frontDestMaintenanceManagement}
					</Grid>
				</Typography>
				<Grid container style={{ marginLeft: 25 }}>
					<Grid container alignItems="center">
						<Typography style={{ marginRight: 10 }}>{strings.weatherToOpenFrontDestMaintenance}</Typography>
						<IOSSwitch
							checked={frontDeskValues.websiteMaintain}
							onChange={handleConfigValuesChange}
							defaultValue={configurationsFrontDeskMaintenance ? configurationsFrontDeskMaintenance.websiteMaintain : false}
							name="websiteMaintain"
						/>
					</Grid>
					<Grid container style={{ marginTop: 10 }} alignItems="center">
						<Grid item style={{ width: '7rem' }}>
							<Typography style={{ marginRight: 10 }}>{strings.websiteMaintenanceTime}:</Typography>
						</Grid>

						{
							websiteMaintainTimeEdit ?
								<Fragment>
									<AppDateRangePicker
										focusedInput={focusedInput}
										onFocusChange={onFocusChange}
										onDatesChange={onDatesChange}
										startDate={frontDeskValues.startDate}
										endDate={frontDeskValues.endDate}
										startDateId="startDate"
										endDateId="endDate"
										startDatePlaceholderText={strings.startDate}
										endDatePlaceholderText={strings.endDate}
										inputIconPosition="after"
										showDefaultInputIcon
										small
										isOutsideRange={() => false}
									/>
									<IconButton style={{ marginLeft: 10 }} onClick={doneEdit} size="small">
										<Done color="primary" />
									</IconButton>
								</Fragment> :
								<Fragment>
									<TextField style={{ width: '21rem', marginRight: 10 }} variant="outlined" margin="dense" name="websiteMaintainTime"
										value={frontDeskValues.websiteMaintainTime} placeholder={strings.pleaseEnter} />
									<IconButton onClick={() => setWebsiteMaintainTimeEdit(true)} size="small">
										<Edit color="primary" />
									</IconButton>
								</Fragment>
						}


						{/* <AppDateRangePicker
							focusedInput={focusedInput}
							onFocusChange={onFocusChange}
							onDatesChange={onDatesChange}
							startDate={frontDeskValues.startDate}
							endDate={frontDeskValues.endDate}
							startDateId="startDate"
							endDateId="endDate"
							startDatePlaceholderText={strings.startDate}
							endDatePlaceholderText={strings.endDate}
							inputIconPosition="after"
							showDefaultInputIcon
							small
							isOutsideRange={() => false}
						/> */}
						{/* <Typography color="textSecondary"><Help /></Typography> */}
					</Grid>
					<Grid container style={{ marginTop: 10 }}><Button disabled={websiteMaintainTimeEdit} variant="contained" color="primary" onClick={updateFrontDeskMaintenance}>{strings.save}</Button></Grid>
				</Grid>

				<Typography variant="h6" style={{ marginTop: '2rem' }}>
					<Grid container alignContent="center">
						<Grid item style={{ marginRight: 5, paddingTop: 4 }}><ErrorOutline color="primary" /></Grid>
						{strings.platformConfiguration}
					</Grid>
				</Typography>
				<Grid container style={{ marginLeft: 25 }}>
					<Grid container alignItems="center">
						<Typography>{strings.weatherToOpenFrontDestMaintenance}</Typography>
					</Grid>
					<Grid container style={{ marginTop: 10 }} alignItems="center">
						<Grid item style={{ width: '7rem' }}>
							<Typography style={{ marginRight: 10 }}>{strings.websiteTitle}:</Typography>
						</Grid>
						<TextField fullWidth={true} value={platformConfigurationValues.websiteTitle} variant="outlined" margin="dense" name="websiteTitle"
							onChange={handlePlatformConfigurationChange} placeholder={strings.pleaseEnter} />
					</Grid>
					<Grid container style={{ marginTop: 10 }} alignItems="center">
						<Grid item style={{ width: '7rem' }}>
							<Typography style={{ marginRight: 10 }}>{strings.websiteKeyword}:</Typography>
						</Grid>
						<TextField fullWidth={true} value={platformConfigurationValues.websiteKeywords} variant="outlined" margin="dense" name="websiteKeywords"
							onChange={handlePlatformConfigurationChange} placeholder={strings.pleaseEnter} />
					</Grid>
					<Grid container style={{ marginTop: 10 }} alignItems="center">
						<Grid item style={{ width: '7rem' }}>
							<Typography style={{ marginRight: 10 }}>{strings.websiteDescription}:</Typography>
						</Grid>
						<TextField fullWidth={true} value={platformConfigurationValues.websiteDescription} variant="outlined" margin="dense" name="websiteDescription"
							onChange={handlePlatformConfigurationChange} placeholder={strings.pleaseEnter} />
					</Grid>
					<Grid container style={{ marginTop: 10 }}><Button variant="contained" color="primary" onClick={updatePlatformConfiguration}>{strings.save}</Button></Grid>
				</Grid>
			</Grid>
		</Paper>
	</Grid>
}