import React from 'react';
import { Paper, Grid, Button, Typography, TextField } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import Title from '../../../components/title';
import useLanguages from '../../../hooks/use-languages';
import {
    FINANCIAL_CONFIGURATION
} from '../../../paths';
import { FormLayoutSingleColumn } from '../../../components/form-layouts';
import { ErrorOutline, } from '@material-ui/icons';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2)
    },

    main: {
        paddingTop: theme.spacing(10),
        paddingLeft: theme.spacing(20),
        paddingRight: theme.spacing(20),
        paddingBottom: theme.spacing(10)
    },

    slider: {
        padding: theme.spacing(3),
        border: '1px grey solid',
        borderRadius: 2,
        marginBottom: 50
    },

    gridList: {
        width: 500,
        height: 250,
    },

    scrollableGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderRadius: 5,
    },
}));

export default function RegistrationAndLoginConfiguration(props) {
    const classes = useStyles();
    const strings = useLanguages(FINANCIAL_CONFIGURATION);
    const [newStatus, setNewState] = React.useState(false);

    // const [filterValues, setFilterValues] = React.useState({
    //     startDate: null,
    //     endDate: null,
    //     account: '',
    //     commissionType: '',
    //     status: ''
    // });

    // function handleFilterChange(event) {
    //     event.persist();
    //     setFilterValues(oldValues => ({
    //         ...oldValues,
    //         [event.target.name]: event.target.value
    //     }));
    // }

    // function onFocusChange(f) {
    //     setFocusedInput(f);
    // }

    // const [focusedInput, setFocusedInput] = useState(null);
    // function onDatesChange({ startDate, endDate }) {
    //     setFilterValues(oldValues => ({
    //         ...oldValues,
    //         startDate,
    //         endDate
    //     }));
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

    const statusSwitchHandle = agentId => event => {
        setNewState(event.target.checked);
    };

    return <FormLayoutSingleColumn>
        <Title pageTitle={strings.title} />

        <Paper className={classes.paper} elevation={1} style={{ marginTop: "20px" }}>
            <Grid container direction="column" alignItems="center">
                <Grid container md={5}>
                    <Grid container alignItems="center" alignContent="center">
                        <ErrorOutline color="primary" style={{ marginRight: 10 }} />
                        <Grid item><Typography variant="h6">{strings.auditingFlowAndAdministrativeFeeAllocationRequiredForRechargeAmount} </Typography></Grid>
                    </Grid>

                    <Grid style={{ marginLeft: 32 }} container alignItems="center" alignContent="center">
                        <Typography>{strings.theAmountOfRechargeMustBeAudited}: </Typography>
                        <TextField style={{ marginLeft: 10 }} variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="theAmountOfRechargeMustBeAudited" /> %
                    </Grid>

                    <Grid style={{ marginLeft: 32 }} container alignItems="center" alignContent="center">
                        <Typography>{strings.proportionOrRechargeAmountIfAdministrativeFeesAreNotCollectedForAuditing}: </Typography>
                        <TextField style={{ marginLeft: 10 }} variant="outlined" margin="dense" placeholder={strings.pleaseEnter}
                            name="proportionOrRechargeAmountIfAdministrativeFeesAreNotCollectedForAuditing" /> %
                    </Grid>

                    <Grid container alignItems="center" alignContent="center" style={{ marginTop: 40 }}>
                        <ErrorOutline color="primary" style={{ marginRight: 10 }} />
                        <Grid item><Typography variant="h6">{strings.discountAmountDeductionConfiguration} </Typography></Grid>
                    </Grid>

                    <Grid style={{ marginLeft: 32 }} container alignItems="center" alignContent="center">
                        <Typography>{strings.proportionOfTheAmountIfTheAmountOfTheAuditedDeductibleBonusIsNotCompleted}: </Typography>
                        <TextField style={{ marginLeft: 10 }} variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="proportionOfTheAmountIfTheAmountOfTheAuditedDeductibleBonusIsNotCompleted" /> %
                    </Grid>

                    <Grid container alignItems="center" alignContent="center" style={{ marginTop: 40 }}>
                        <ErrorOutline color="primary" style={{ marginRight: 10 }} />
                        <Grid item><Typography variant="h6">{strings.firstWithdrawalConfiguration} </Typography></Grid>
                    </Grid>

                    <Grid style={{ marginLeft: 32 }} container alignItems="center" alignContent="center">
                        <Typography style={{ marginRight: 10 }}>{strings.wetherTheFirstPaymentRequiresAMobilePhoneAndSMSVerification}: </Typography>
                        <IOSSwitch
                            checked={newStatus}
                            onChange={statusSwitchHandle(newStatus)}
                            value={newStatus}
                            name="maintenance"
                        />
                    </Grid>

                    <Grid container alignItems="center" alignContent="center" style={{ marginTop: 40 }}>
                        <ErrorOutline color="primary" style={{ marginRight: 10 }} />
                        <Grid item><Typography variant="h6">{strings.VIPChargingTips} </Typography></Grid>
                    </Grid>

                    <Grid style={{ marginLeft: 32 }} container alignItems="center" alignContent="center">
                        <Typography>{strings.VIPLevel}: </Typography>
                        <TextField style={{ marginLeft: 10, marginRight: 10 }} variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="theAmountOfRechargeMustBeAudited" />
                        <Typography>{strings.companyColorChangeTips}</Typography>
                    </Grid>

                    <Grid style={{ marginLeft: 32 }} container alignItems="center" alignContent="center">
                        <Typography>{strings.VIPLevel}: </Typography>
                        <TextField style={{ marginLeft: 10, marginRight: 10 }} variant="outlined" margin="dense" placeholder={strings.pleaseEnter}
                            name="proportionOrRechargeAmountIfAdministrativeFeesAreNotCollectedForAuditing" />
                        <Typography>{strings.onlinePaymentColorChangeTips}</Typography>
                    </Grid>

                    <Grid style={{ marginLeft: 32 }} container alignItems="center" alignContent="center">
                        <Typography>{strings.VIPLevel}: </Typography>
                        <TextField style={{ marginLeft: 10, marginRight: 10 }} variant="outlined" margin="dense" placeholder={strings.pleaseEnter}
                            name="proportionOrRechargeAmountIfAdministrativeFeesAreNotCollectedForAuditing" />
                        <Typography>{strings.discolorationTips}</Typography>
                    </Grid>

                    <Grid container alignItems="center" alignContent="center" style={{ marginTop: 40 }}>
                        <ErrorOutline color="primary" style={{ marginRight: 10 }} />
                        <Grid item><Typography variant="h6">{strings.newBinding} </Typography></Grid>
                    </Grid>

                    <Grid style={{ marginLeft: 32 }} container alignItems="center" alignContent="center">
                        <Typography>{strings.firstBind}: </Typography>
                        <TextField style={{ marginLeft: 10, marginRight: 10 }} variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="firstBind" />
                        <Typography>{strings.effective}</Typography>
                    </Grid>

                    <Grid style={{ marginLeft: 32 }} container alignItems="center" alignContent="center">
                        <Typography>{strings.multipleTimes}: </Typography>
                        <TextField style={{ marginLeft: 10, marginRight: 10 }} variant="outlined" margin="dense" placeholder={strings.pleaseEnter}
                            name="multipleTimes" />
                        <Typography>{strings.effective}</Typography>
                    </Grid>

                    <Grid container alignItems="center" alignContent="center" style={{ marginTop: 40 }}>
                        <ErrorOutline color="primary" style={{ marginRight: 10 }} />
                        <Grid item><Typography variant="h6">{strings.bindBank} </Typography></Grid>
                    </Grid>

                    <Grid style={{ marginLeft: 32 }} container alignItems="center" alignContent="center">
                        <Typography style={{ marginRight: 10 }}>{strings.isItNeccessary}: </Typography>
                        <IOSSwitch
                            checked={newStatus}
                            onChange={statusSwitchHandle(newStatus)}
                            value={newStatus}
                            name="maintenance"
                        />
                    </Grid>
                    <Grid container style={{ marginTop: 10 }}><Button variant="contained" color="primary">{strings.save}</Button></Grid>
                </Grid>
            </Grid>
        </Paper>
    </FormLayoutSingleColumn>
}