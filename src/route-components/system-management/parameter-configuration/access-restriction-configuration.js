import React, {useState} from 'react';
import {
    Card, CardHeader, List, ListItem, ListItemIcon,
    Paper, Grid, Button,
    Typography, Divider, TextField, Checkbox,
    ListItemText
} from '@material-ui/core';
import {Loading} from '../../../components';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import {ACCESS_RESTRICTION_CONFIGURATION} from '../../../paths';
import InfoIcon from '@material-ui/icons/Info';
import {ADD_CONFIG} from '../../../queries-graphql/system-management/parameter-configuration/mutation/access-restriction-config'
import { useMutation } from '@apollo/react-hooks'
import Swal from 'sweetalert2'
import useAccessRestrictionConfigurationQuery from '../../../queries-graphql/system-management/parameter-configuration/query/access-restriction-configuration'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        '& > span': {
            margin: theme.spacing(2),
        },
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
    button: {
        margin: theme.spacing(1),
    },
    transferList: {
        margin: 'auto',
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        height: 230,
        backgroundColor: 'white',
        overflow: 'auto',
    },
    buttonTransferList: {
        margin: theme.spacing(0.5, 0),
    },
}));

/* Transfer List */
function not(a, b) {
    return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter(value => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}
/* END */

export default function AccessRestrictionConfiguration(props) {
    const classes = useStyles();
    const strings = useLanguages(ACCESS_RESTRICTION_CONFIGURATION);

    const { history } = props;
    const [refresh, setRefresh] = useState(false)
	const [values, setValues] = useState({
        ipWhitelistFrontend: "",
        ipBlacklistFrontend: "",
        ipWhitelistBackend: "",
        ipBlacklistBackend: ""
    })

	const handleChange = (event) => {
		event.persist();
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));
	}
	const [addConfig] = useMutation(ADD_CONFIG)

    /*  Transfer List */
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(["China Mainland", "China Hong Kong", "Macao, China", "Taiwan Province of China", "United States"]);
    const [right, setRight] = React.useState(["Brazil", "Australia", "Japan", "Nepal"]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = items => intersection(checked, items).length;

    // const handleToggleAll = items => () => {
    //     if (numberOfChecked(items) === items.length) {
    //         setChecked(not(checked, items));
    //     } else {
    //         setChecked(union(checked, items));
    //     }
    // };

    // const handleCheckedRight = () => {
    //     setRight(right.concat(leftChecked));
    //     setLeft(not(left, leftChecked));
    //     setChecked(not(checked, leftChecked));
    // };

    // const handleCheckedLeft = () => {
    //     setLeft(left.concat(rightChecked));
    //     setRight(not(right, rightChecked));
    //     setChecked(not(checked, rightChecked));
    // };

    async function mutateAdd() {

		try{
			const res = await addConfig({
				variables: {
                    ipWhitelistFrontend: values.ipWhitelistFrontend === "" ? accessRestriction.ipWhitelistFrontend : values.ipWhitelistFrontend,
                    ipBlacklistFrontend: values.ipBlacklistFrontend === "" ? accessRestriction.ipBlacklistFrontend : values.ipBlacklistFrontend,
                    ipWhitelistBackend: values.ipWhitelistBackend === "" ? accessRestriction.ipWhitelistBackend : values.ipWhitelistBackend,
                    ipBlacklistBackend: values.ipBlacklistBackend === "" ? accessRestriction.ipBlacklistBackend : values.ipBlacklistBackend
                }
            })
            
            if(res){
                Swal.fire({
                    type: 'success',
                    title: '新配置成功保存',
                    showConfirmButton: false,
                    timer: 1500,
                    marginTop: '160px !important',
                    onClose: history.push(ACCESS_RESTRICTION_CONFIGURATION)
                })
                setRefresh(!refresh)
            }
		} catch (e){
		}
	}

	function addHandle(event) {
		event.preventDefault();
		mutateAdd(values);
	}

    // const customList = (title, items) => (
    //     <Card >
    //         <CardHeader
    //             className={classes.cardHeader}
    //             title={
    //                 <Typography>{title}
    //                     <TextField variant="outlined" margin="dense" style={{ width: 100, height: 10, marginLeft: '1rem' }} />
    //                 </Typography>
    //             }
    //             subheader={`${numberOfChecked(items)}/${items.length} Total`}
    //         />
    //         <Divider />
    //         <List className={classes.list} dense component="div" role="list">
    //             {items.map(value => {
    //                 const labelId = `transfer-list-all-item-${value}-label`;

    //                 return (
    //                     <ListItem style={{ borderBottom: '1px solid black' }} key={value} role="listitem" button onClick={handleToggle(value)}>
    //                         <ListItemIcon>
    //                             <Checkbox
    //                                 checked={checked.indexOf(value) !== -1}
    //                                 tabIndex={-1}
    //                                 disableRipple
    //                                 inputProps={{ 'aria-labelledby': labelId }}
    //                             />
    //                         </ListItemIcon>
    //                         <ListItemText
    //                             id={labelId}
    //                             primary={`${value}`}
    //                         />
    //                     </ListItem>
    //                 );
    //             })}
    //             <ListItem />
    //         </List>
    //     </Card>
    // );
    /* END */

    const {data, loading} = useAccessRestrictionConfigurationQuery({
        refresh: refresh
    })
    if(loading) {
        return <Loading/>
    }

    const accessRestriction = data.configurations

    return <form className={classes.container} onSubmit={addHandle} autoComplete="off">
        {/* <Title pageTitle={strings.accessRestrictionConfiguration} /> */}
        {/* <Grid container spacing={3}>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" style={{ marginLeft: "1em", marginTop: "1em" }} onClick={() => { history.push(PARAMETER_CONFIGURATION) }}>{strings.basicSetting}</Button>
                <Button variant="contained" color="primary" style={{ marginLeft: "1em", marginTop: "1em" }} onClick={() => { history.push(REGISTRATION_AND_LOGIN_CONFIGURATION) }}>{strings.registrationAndLoginConfiguration}</Button>
                <Button variant="contained" color="primary" style={{ marginLeft: "1em", marginTop: "1em" }} onClick={() => { history.push(FINANCIAL_CONFIGURATION) }}>{strings.financialConfiguration}</Button>
                <Button variant="contained" color="primary" style={{ marginLeft: "1em", marginTop: "1em" }} onClick={() => { history.push(CUSTOMER_SERVICE_CONFIGURATION) }}>{strings.customerServiceConfiguraion}</Button>
                <Button variant="contained" color="primary" style={{ marginLeft: "1em", marginTop: "1em" }} onClick={() => { history.push(DOWNLOAD_MOBILE_PHONE_QR_CODE_CONFIGURATION) }}>{strings.downloadMobilePhoneQRCodeConfiguration}</Button>
                <Button variant="contained" color="primary" style={{ marginLeft: "1em", marginTop: "1em", backgroundColor: '#651fff', color: '#fff' }} onClick={() => { history.push(ACCESS_RESTRICTION_CONFIGURATION) }}>{strings.accessRestrictionConfiguration}</Button>
                <Button variant="contained" color="primary" style={{ marginLeft: "1em", marginTop: "1em" }} onClick={() => { history.push(SMS_PLATFORM_CONFIGURATION) }}>{strings.SMSPlatformConfiguration}</Button>
                <Button variant="contained" color="primary" style={{ marginLeft: "1em", marginTop: "1em" }} onClick={() => { history.push(GAME_RECOMMENDATION_CONFIGURATION) }}>{strings.gameRecommendationConfiguration}</Button>
                <Button variant="contained" color="primary" style={{ marginLeft: "1em", marginTop: "1em" }} onClick={() => { history.push(HOME_FLOATING_WINDOW_CONFIGURATION) }}>{strings.homeFloating}</Button>
                <Button variant="contained" color="primary" style={{ marginLeft: "1em", marginTop: "1em" }} onClick={() => { history.push(MOBILE_PHONE_BAR_CONFIGURATION) }}>{strings.mobilePhoneConfig}</Button>
            </Grid>
        </Grid> */}

        <Paper className={classes.root} style={{ marginTop: "20px" }}>

            <Grid container style={{ paddingLeft: "15rem", paddingRight: "15rem" }}>

                <Grid container alignItems="center" spacing={1}>
                    <InfoIcon color="primary" />
                    <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.frontAccessRestriction}</Typography>
                </Grid>

                <Grid container style={{ paddingTop: "1rem", paddingLeft: "1rem" }}>
                    {/* <Grid item alignItems="center" spacing={1}>
                        <Typography>{strings.nationalAndRegionalRestrictions}</Typography>
                    </Grid> */}

                    {/* Transfer List */}
                    {/* <Grid container item style={{ border: "1px black solid" }}>
                        <Grid container spacing={1} justify="center" alignItems="center" className={classes.root}>
                            <Grid item md={5}>{customList(`${strings.countriesAndRegionsThatArePermittedToVisit}`, left)}</Grid>
                            <Grid item>
                                <Grid container md={1} direction="column" alignItems="center">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        className={classes.button}
                                        onClick={handleCheckedRight}
                                        disabled={leftChecked.length === 0}
                                        aria-label="move selected right"
                                    >
                                        <ArrowForward />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        className={classes.button}
                                        onClick={handleCheckedLeft}
                                        disabled={rightChecked.length === 0}
                                        aria-label="move selected left"
                                    >
                                        <ArrowBack />
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid item md={5}>{customList(`${strings.countriesAndRegionsThatAreProhibitedFromVisiting}`, right)}</Grid>
                            <Typography style={{ color: 'red' }}>{strings.instruction1}</Typography>
                        </Grid>
                    </Grid> */}

                    <Grid item alignItems="center" spacing={1} style={{ marginTop: '1rem' }}>
                        <Typography>{strings.ipWhitelistFrontend}</Typography>
                    </Grid>

                    {/* TextField MultiLine */}
                    <Grid container>
                        <TextField variant="outlined" margin="dense" name="ipWhitelistFrontend" 
                            onChange={handleChange} fullWidth defaultValue={accessRestriction.ipWhitelistFrontend} required/>
                        {/* <Box mx='auto'> */}
                            <Typography style={{ color: 'red' }}>{strings.instruction2}</Typography>
                        {/* </Box> */}
                    </Grid>

                    <Grid item alignItems="center" spacing={1} style={{ marginTop: '1rem' }}>
                        <Typography>{strings.ipBlacklistFrontend}</Typography>
                    </Grid>

                    <Grid container>
                        <TextField variant="outlined" margin="dense" name="ipBlacklistFrontend" 
                            onChange={handleChange} fullWidth defaultValue={accessRestriction.ipBlacklistFrontend} required/>
                        {/* <Box mx='auto'> */}
                            <Typography style={{ color: 'red' }}>{strings.instruction3}</Typography>
                        {/* </Box> */}
                    </Grid>

                </Grid>

                {/* END */}

                {/* START */}

                <Grid container alignItems="center" spacing={1} style={{ marginTop: '5rem' }}>
                    <InfoIcon color="primary" />
                    <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.backgroundAccessRestrictions}</Typography>
                </Grid>

                <Grid container style={{ paddingTop: "1rem", paddingLeft: "1rem" }}>
                    {/* <Grid item alignItems="center" spacing={1}>
                        <Typography>{strings.nationalAndRegionalRestrictions}</Typography>
                    </Grid>

                    <Grid container item style={{ border: "1px black solid" }}>
                        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                            <Grid item md={5}>{customList(`${strings.countriesAndRegionsThatArePermittedToVisit}`, left)}</Grid>
                            <Grid item>
                                <Grid md={1} container direction="column" alignItems="center">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        className={classes.button}
                                        onClick={handleCheckedRight}
                                        disabled={leftChecked.length === 0}
                                        aria-label="move selected right"
                                    >
                                        <ArrowForward />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        className={classes.button}
                                        onClick={handleCheckedLeft}
                                        disabled={rightChecked.length === 0}
                                        aria-label="move selected left"
                                    >
                                        <ArrowBack />
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid item md={5}>{customList(`${strings.countriesAndRegionsThatAreProhibitedFromVisiting}`, right)}</Grid>
                            <Typography style={{ color: 'red' }}>{strings.instruction1}</Typography>
                        </Grid>
                    </Grid> */}

                    <Grid item alignItems="center" spacing={1} style={{ marginTop: '1rem' }}>
                        <Typography>{strings.ipWhitelistBackend}</Typography>
                    </Grid>

                    {/* TextField MultiLine */}
                    <Grid container>
                        <TextField variant="outlined" margin="dense" name="ipWhitelistBackend" 
                            onChange={handleChange} fullWidth defaultValue={accessRestriction.ipWhitelistBackend} required/>
                        {/* <Box mx='auto'> */}
                            <Typography style={{ color: 'red' }}>{strings.instruction4}</Typography>
                        {/* </Box> */}
                    </Grid>

                    <Grid item alignItems="center" spacing={1} style={{ marginTop: '1rem' }}>
                        <Typography>{strings.ipBlacklistBackend}</Typography>
                    </Grid>

                    <Grid container>
                        <TextField variant="outlined" margin="dense" name="ipBlacklistBackend" 
                            onChange={handleChange} fullWidth defaultValue={accessRestriction.ipBlacklistBackend} required/>
                        {/* <Box mx='auto'> */}
                            <Typography style={{ color: 'red' }}>{strings.instruction5}</Typography>
                        {/* </Box> */}
                    </Grid>

                </Grid>

                {/* END */}

                <Grid style={{ paddingTop: 30, paddingRight: 50, marginBottom: 30 }} justify="center" container>
                    <Button style={{ width: 110, marginRight: 20, height: 30 }} color="primary" type="submit" variant="contained">{strings.save}</Button>
                </Grid>
            </Grid>

        </Paper>

    </form>
}