import React from 'react';
import { Paper, Grid, Button, Typography, TextField, FormControlLabel, Radio } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import Title from '../../../components/title';
import useLanguages from '../../../hooks/use-languages';
import {
    GAME_RECOMMENDATION_CONFIGURATION
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


    textField: {
        width: 600
    },

    groupButton: {
        padding: theme.spacing(3)
    }
}));

export default function RegistrationAndLoginConfiguration(props) {
    const classes = useStyles();
    const strings = useLanguages(GAME_RECOMMENDATION_CONFIGURATION);

    const [filterValues, setFilterValues] = React.useState({
        startDate: null,
        endDate: null,
        account: '',
        commissionType: '',
        status: '',
        customerServiceType: '',
        onOrOffGameRecommendationFunctionNewStatus: false,
        electronicGamesPC: false,
        electronicGamesMobile: false,
        liveVideoPC: false,
        liveVideoMobile: false,
        chessGamePC: false,
        chessGameMobile: false,
        sportCompetitionPC: false,
        sportCompetitionMobile: false,
        lotteryGamePC: false,
        lotteryGameMobile: false,
        fishingGamePC: false,
        fishingGameMobile: false,
        systemRecommendedGameStat: false,
        platformRecommendationStat: false,
        recommendedQualityStat: false
    });

    function handleFilterChange(event) {
        event.persist();
        setFilterValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value
        }));
    }

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
                    transition: theme.transitions.create(["background-color", "border"])
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
        setFilterValues(event.target.checked);
    };

    return <FormLayoutSingleColumn>
        <Title pageTitle={strings.title} />
        
        <Paper className={classes.paper} elevation={1} style={{ marginTop: "20px" }}>
            <Grid container direction="column" alignItems="center">
                <Grid container md={5} style={{ paddingBottom: 40 }}>

                    <Grid container alignItems="center" alignContent="center" style={{ marginTop: 40 }}>
                        <ErrorOutline color="primary" style={{ marginRight: 10 }} />
                        <Grid item><Typography variant="h6">{strings.basicConfiguration} </Typography></Grid>
                    </Grid>

                    <Grid container direction="row" style={{ paddingLeft: 30 }} >
                        <Grid item md={3} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
                            <Typography>{strings.onOrOffGameRecommendationFunction}:</Typography>
                        </Grid>

                        <Grid container md={5} alignItems="center">
                            <IOSSwitch
                                checked={filterValues.onOrOffGameRecommendationFunctionNewStatus}
                                onChange={statusSwitchHandle()}
                                value={filterValues.onOrOffGameRecommendationFunctionNewStatus}
                                name="onOrOffGameRecommendationFunctionNewStatus"
                            />
                        </Grid>
                    </Grid>

                    <Grid container direction="row" style={{ paddingLeft: 30 }}>
                        <Grid item md={3} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
                            <Typography>{strings.recommendedSetting}:</Typography>
                        </Grid>

                        <Grid container md={5}>
                            <FormControlLabel onChange={handleFilterChange} control={<Radio color="primary" />} label={strings.recommendedByGameCategory} />
                            <FormControlLabel onChange={handleFilterChange} control={<Radio color="primary" />} label={strings.comprehensiveRecommendation} />
                        </Grid>
                    </Grid>

                    <Grid container direction="row" style={{ paddingLeft: 30 }}>
                        <Grid item md={3} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
                            <Typography>{strings.recommendationSort}:</Typography>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" style={{ paddingLeft: 30 }}>
                        <Grid item md={3} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
                        </Grid>

                        <Grid container md={8} style={{ border: '1px #80cbc4 solid', borderRadius: 3 }} className={classes.groupButton} justify="center">
                            <Button variant="contained" style={{ height: 30, marginRight: 10, backgroundColor: "#689f38", color: "#fff" }}>{strings.userBehaviorRecommendation}</Button>
                            <Button variant="contained" style={{ height: 30, marginRight: 10, backgroundColor: "#689f38", color: "#fff" }}>{strings.platformRecommendation}</Button>
                            <Button variant="contained" style={{ height: 30, marginRight: 10, backgroundColor: "#689f38", color: "#fff" }}>{strings.systemTecommendation}</Button>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" style={{ paddingLeft: 30 }}>
                        <Grid item md={3} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
                        </Grid>

                        <Grid container md={8}>
                            <Typography color="textSecondary">{strings.mouseDrag}:</Typography>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" style={{ paddingLeft: 30 }} >
                        <Grid item md={3} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
                            <Typography>{strings.displayRecommendedGames}:</Typography>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" style={{ paddingLeft: 30 }} >
                        <Grid item md={3} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}></Grid>
                        <Grid item md={7} container direction="column" style={{ marginRight: 10 }}>

                            <Grid container><Typography>{strings.electronicGames}</Typography></Grid>
                            <Grid container style={{ marginTop: 5, paddingLeft: 25 }}>
                                <Grid md={5} container alignItems="center">
                                    <Typography style={{ marginRight: 2 }}>{strings.computerSide}</Typography>
                                    <IOSSwitch
                                        checked={filterValues.electronicGamesPC}
                                        onChange={statusSwitchHandle()}
                                        value={filterValues.electronicGamesPC}
                                        name="electronicGamesPC"
                                    />
                                </Grid>
                                <Grid md={5} container alignItems="center">
                                    <Typography style={{ marginRight: 2 }}>{strings.mobileTerminal}</Typography>
                                    <IOSSwitch
                                        checked={filterValues.electronicGamesMobile}
                                        onChange={statusSwitchHandle()}
                                        value={filterValues.electronicGamesMobile}
                                        name="electronicGamesMobile"
                                    />
                                </Grid>
                            </Grid>

                            <Grid container style={{ marginTop: 10 }}><Typography>{strings.liveVideo}</Typography></Grid>
                            <Grid container style={{ marginTop: 5, paddingLeft: 25 }}>
                                <Grid md={5} container alignItems="center">
                                    <Typography style={{ marginRight: 2 }}>{strings.computerSide}</Typography>
                                    <IOSSwitch
                                        checked={filterValues.liveVideoPC}
                                        onChange={statusSwitchHandle()}
                                        value={filterValues.liveVideoPC}
                                        name="liveVideoPC"
                                    />
                                </Grid>
                                <Grid md={5} container alignItems="center">
                                    <Typography style={{ marginRight: 2 }}>{strings.mobileTerminal}</Typography>
                                    <IOSSwitch
                                        checked={filterValues.liveVideoMobile}
                                        onChange={statusSwitchHandle()}
                                        value={filterValues.liveVideoMobile}
                                        name="liveVideoMobile"
                                    />
                                </Grid>
                            </Grid>

                            <Grid container style={{ marginTop: 10 }}><Typography>{strings.chessGame}</Typography></Grid>
                            <Grid container style={{ marginTop: 5, paddingLeft: 25 }}>
                                <Grid md={5} container alignItems="center">
                                    <Typography style={{ marginRight: 2 }}>{strings.computerSide}</Typography>
                                    <IOSSwitch
                                        checked={filterValues.chessGamePC}
                                        onChange={statusSwitchHandle()}
                                        value={filterValues.chessGamePC}
                                        name="chessGamePC"
                                    />
                                </Grid>
                                <Grid md={5} container alignItems="center">
                                    <Typography style={{ marginRight: 2 }}>{strings.mobileTerminal}</Typography>
                                    <IOSSwitch
                                        checked={filterValues.chessGameMobile}
                                        onChange={statusSwitchHandle()}
                                        value={filterValues.chessGameMobile}
                                        name="chessGameMobile"
                                    />
                                </Grid>
                            </Grid>

                            <Grid container style={{ marginTop: 10 }}><Typography>{strings.sportCompetition}</Typography></Grid>
                            <Grid container style={{ marginTop: 5, paddingLeft: 25 }}>
                                <Grid md={5} container alignItems="center">
                                    <Typography style={{ marginRight: 2 }}>{strings.computerSide}</Typography>
                                    <IOSSwitch
                                        checked={filterValues.sportCompetitionPC}
                                        onChange={statusSwitchHandle()}
                                        value={filterValues.sportCompetitionPC}
                                        name="sportCompetitionPC"
                                    />
                                </Grid>
                                <Grid md={5} container alignItems="center">
                                    <Typography style={{ marginRight: 2 }}>{strings.mobileTerminal}</Typography>
                                    <IOSSwitch
                                        checked={filterValues.sportCompetitionMobile}
                                        onChange={statusSwitchHandle()}
                                        value={filterValues.sportCompetitionMobile}
                                        name="sportCompetitionMobile"
                                    />
                                </Grid>
                            </Grid>

                            <Grid container style={{ marginTop: 10 }}><Typography>{strings.lotteryGame}</Typography></Grid>
                            <Grid container style={{ marginTop: 5, paddingLeft: 25 }}>
                                <Grid md={5} container alignItems="center">
                                    <Typography style={{ marginRight: 2 }}>{strings.computerSide}</Typography>
                                    <IOSSwitch
                                        checked={filterValues.lotteryGamePC}
                                        onChange={statusSwitchHandle()}
                                        value={filterValues.lotteryGamePC}
                                        name="lotteryGamePC"
                                    />
                                </Grid>
                                <Grid md={5} container alignItems="center">
                                    <Typography style={{ marginRight: 2 }}>{strings.mobileTerminal}</Typography>
                                    <IOSSwitch
                                        checked={filterValues.lotteryGameMobile}
                                        onChange={statusSwitchHandle()}
                                        value={filterValues.lotteryGameMobile}
                                        name="lotteryGameMobile"
                                    />
                                </Grid>
                            </Grid>

                            <Grid container style={{ marginTop: 10 }}><Typography>{strings.fishingGame}</Typography></Grid>
                            <Grid container style={{ marginTop: 5, paddingLeft: 25 }}>
                                <Grid md={5} container alignItems="center">
                                    <Typography style={{ marginRight: 2 }}>{strings.computerSide}</Typography>
                                    <IOSSwitch
                                        checked={filterValues.fishingGamePC}
                                        onChange={statusSwitchHandle()}
                                        value={filterValues.fishingGamePC}
                                        name="fishingGamePC"
                                    />
                                </Grid>
                                <Grid md={5} container alignItems="center">
                                    <Typography style={{ marginRight: 2 }}>{strings.mobileTerminal}</Typography>
                                    <IOSSwitch
                                        checked={filterValues.fishingGameMobile}
                                        onChange={statusSwitchHandle()}
                                        value={filterValues.fishingGameMobile}
                                        name="fishingGameMobile"
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>

                    <Grid container alignItems="center" alignContent="center" style={{ marginTop: 40 }}>
                        <ErrorOutline color="primary" style={{ marginRight: 10 }} />
                        <Grid item><Typography variant="h6">{strings.systemRecommendedGame} </Typography></Grid>
                    </Grid>

                    <Grid container direction="row" style={{ paddingLeft: 30 }} >
                        <Grid item md={3} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
                            <Typography>{strings.onOrOff}:</Typography>
                        </Grid>

                        <Grid container md={5} alignItems="center">
                            <IOSSwitch
                                checked={filterValues.systemRecommendedGameStat}
                                onChange={statusSwitchHandle()}
                                value={filterValues.systemRecommendedGameStat}
                                name="systemRecommendedGameStat"
                            />
                        </Grid>
                    </Grid>

                    <Grid container direction="row" style={{ paddingLeft: 30 }} >
                        <Grid item md={3} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
                            <Typography>{strings.recommendedQuality}:</Typography>
                        </Grid>

                        <Grid container md={5} alignItems="center">
                            <TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="recommendedQuality" />
                        </Grid>
                    </Grid>

                    <Grid container alignItems="center" alignContent="center" style={{ marginTop: 40 }}>
                        <ErrorOutline color="primary" style={{ marginRight: 10 }} />
                        <Grid item><Typography variant="h6">{strings.platformRecommendationGame} ({strings.platformConfiguredGames}) </Typography></Grid>
                    </Grid>

                    <Grid container direction="row" style={{ paddingLeft: 30 }} >
                        <Grid item md={3} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
                            <Typography>{strings.onOrOff}:</Typography>
                        </Grid>

                        <Grid container md={5} alignItems="center">
                            <IOSSwitch
                                checked={filterValues.platformRecommendationStat}
                                onChange={statusSwitchHandle()}
                                value={filterValues.platformRecommendationStat}
                                name="platformRecommendationStat"
                            />
                        </Grid>
                    </Grid>

                    <Grid container direction="row" style={{ paddingLeft: 30 }} >
                        <Grid item md={3} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
                            <Typography>{strings.recommendedQuality}:</Typography>
                        </Grid>

                        <Grid container md={5} alignItems="center">
                            <TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="recommendedQuality" />
                        </Grid>
                    </Grid>

                    <Grid container alignItems="center" alignContent="center" style={{ marginTop: 40 }}>
                        <ErrorOutline color="primary" style={{ marginRight: 10 }} />
                        <Grid item><Typography variant="h6">{strings.recommendedQuantity} ( {strings.userBehaviorRecommendationGame} ) </Typography></Grid>
                    </Grid>

                    <Grid container direction="row" style={{ paddingLeft: 30 }} >
                        <Grid item md={3} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
                            <Typography>{strings.onOrOff}:</Typography>
                        </Grid>

                        <Grid container md={5} alignItems="center">
                            <IOSSwitch
                                checked={filterValues.recommendedQualityStat}
                                onChange={statusSwitchHandle()}
                                value={filterValues.recommendedQualityStat}
                                name="recommendedQualityStat"
                            />
                        </Grid>
                    </Grid>

                    <Grid container direction="row" style={{ paddingLeft: 30 }} >
                        <Grid item md={3} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
                            <Typography>{strings.recommendedQuality}:</Typography>
                        </Grid>

                        <Grid container md={5} alignItems="center">
                            <TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="recommendedQuality" />
                        </Grid>
                    </Grid>

                    <Grid container style={{ marginTop: 10 }}><Button variant="contained" color="primary">{strings.save}</Button></Grid>
                </Grid>
            </Grid>
        </Paper>
    </FormLayoutSingleColumn>
}