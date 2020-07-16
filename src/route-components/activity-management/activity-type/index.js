import React,{ useState }from "react";
import {makeStyles, withStyles} from "@material-ui/styles";
import {blue, green, red} from "@material-ui/core/colors";
import { Button, Divider, Grid, Paper, TableCell, TableRow,TextField, Typography} from "@material-ui/core";
import usePagination from "../../../hooks/use-pagination";
import useLanguages from "../../../hooks/use-languages";
import {ADD_ACTIVITY_TYPE, EVENTS_LIST, MODIFY_ACTIVITY_TYPE} from "../../../paths";
import {useMutation} from "@apollo/react-hooks";
import {
    GrowItem,
    Loading,
    SimpleTable
} from "../../../components";
import Title from "../../../components/title";
import {
    GAME_EVENT_DELETE_MUTATION,
    GAME_EVENT_STATUS_MUTATION
} from "../../../queries-graphql/activity-management/event-list/mutation/add-game-event-mutation";
import sweetAlert from 'sweetalert2';
import useActivityTypeListQuery
    from "../../../queries-graphql/activity-management/event-list/query/activity-type-query";

import Cookies from 'universal-cookie';
import {GAME_EVENT_TYPE_STATUS_MUTATION} from "../../../queries-graphql/activity-management/event-list/mutation/add-activity-type";

const cookies = new Cookies();

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
    red: {
        color: "#f44336"
    },
    green: {
        color: "#4caf50"
    },
    yellow: {
        color: "#ffeb3b"
    },
    blue: {
        color: "#508FF4"
    }
}));

export default function ActivityType(props) {
    const classes = useStyles();
    const strings = useLanguages(EVENTS_LIST);
    const {history} = props;

    const [filterValues, setFilterValues] = React.useState({
        eventName: "",
        founder: "",
        status: ""
    });

    const [refresh, setRefresh] = useState(false);

    function handleFilterChange(event) {
        event.persist();
        setFilterValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value
        }));
    }

    const [filter, setFilter] = useState({
        filterValues: [],
    });

    function clickSearch() {
        setFilter({
            filterValues: filterValues,
        });
        setCursor({
            before: null,
            after: null
        });
        setPage(0)
    }

    const [gameEventStatus] = useMutation(GAME_EVENT_TYPE_STATUS_MUTATION);

    async function modifyStatus(id, status, name) {
        await sweetAlert.fire({
            position: 'center',
            title: strings.updateStatus,
            text: strings.doUpdate + name + '?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: strings.yes,
            cancelButtonText: strings.cancel
        }).then((result) => {
            if(result.value) {
                changeStatus(id, status);
                sweetAlert.fire(
                    strings.update,
                    name + strings.hasBeenUpdated,
                    'success'
                )
                // setRefresh(!refresh)
            }
        })
    }

    async function changeStatus(id, status) {
        const res = await gameEventStatus({
            variables: {
                updatedBy: cookies.get('ID'),
                id: id,
                enabled: status
            }
        });

        if(res) {
            setRefresh(!refresh)
        }
    }

    function deleteEvent(id, name) {
        sweetAlert.fire({
            position: 'center',
            title: strings.delete,
            text: strings.doDelete + name + '?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: strings.yes,
            cancelButtonText: strings.cancel
        }).then((result) => {
            if(result.value) {
                deleteEventFunction(id);
                sweetAlert.fire(
                    strings.delete,
                    strings.commission + name + strings.hasBeenDeleted,
                    'success'
                )
            }
        })
    }

    async function deleteEventFunction(id) {
        /*
        const res = await gameEventDelete({
            variables: {
                updatedBy: cookies.get('ID'),
                id: id,
                deletedFlag: true
            }
        });

        if(res) {
            setRefresh(!refresh)
        }
        */
    }

    const pagination = usePagination();
    const { rowsPerPage, cursor: {before, after}, setCursor, setPage } = pagination;
    const {data, loading} = useActivityTypeListQuery({
        mutation: refresh,
        name: filter.filterValues.eventName,
        enabled: filter.filterValues.status,
        rowsPerPage,
        before,
        after,
    });

    if(loading) {
        return <Loading />
    }
    let gameEvent = [],page_info = {},total_count = 0;
    if (data && data.gameEventTypes) {
        const { edges ,pageInfo ,totalCount } = data.gameEventTypes;
        gameEvent = edges;
        page_info = pageInfo;
        total_count = totalCount;
    }
    return <Grid>
        <Title pageTitle={strings.eventTypeList} />
        <Paper className={classes.root} style={{ marginTop: "20px" }}>
            <Typography variant='h6'>{strings.eventTypeList}</Typography>
            <Divider light={true} style={{ marginTop: "2em", marginBottom: "1em" }} />
            <Grid container alignItems="center" spacing={1}>
                <Grid item container alignItems="center" style={{ marginBottom: "10px" }}>

                    <Grid item >
                        <Typography color="textSecondary">{strings.eventName}:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            type="text"
                            name="eventName"
                            variant="outlined"
                            margin="dense"
                            style={{ width: 100, marginLeft: 10, marginRight: 10 }}
                            onChange={handleFilterChange}
                        />
                    </Grid>
                    <GrowItem />
                    <Grid item>
                        <Button style={{ width: 100 }} color="primary" variant="contained" onClick={clickSearch}>{strings.searchFor}</Button>
                    </Grid>
                    <Grid item style={{ marginLeft: 10 }}>
                        <Button
                            style={{ width: 100, backgroundColor: "#ff0000", color: "white" }} variant="contained" onClick={() => history.push(ADD_ACTIVITY_TYPE)}>{strings.newActivityType}</Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <SimpleTable
                    tableProps={{size: "small"}}
                    hasPagination={true}
                    pageInfo={page_info}
                    count={total_count}
                    noBorder={true}
                    pagination={pagination}
                    columns={
                        <TableRow>
                            <TableCell align="right">{strings.serialNumber}</TableCell>
                            <TableCell>{strings.eventTypeName}</TableCell>
                            <TableCell>{strings.desc}</TableCell>
                            <TableCell>{strings.weight}</TableCell>
                            <TableCell>{strings.status}</TableCell>
                            <TableCell colSpan={4} align="center">{strings.execute}</TableCell>
                        </TableRow>
                    }
                    rows={
                        gameEvent.length === 0 ?
                            <TableRow>
                                <TableCell align="center" colSpan={12}>没有可用数据</TableCell>
                            </TableRow>
                            :
                            gameEvent.map((o, index) =>
                                o.node ?
                                    <TableRow key={index}>
                                        <TableCell align="right">{index+1}</TableCell>
                                        <TableCell>{o.node.name}</TableCell>
                                        <TableCell>{o.node.description }</TableCell>
                                        <TableCell>{o.node.weight }</TableCell>
                                        <TableCell>
                                            {
                                                (o.node.enabled) ?
                                                    <Typography color="primary">{strings.open}</Typography>
                                                    :
                                                    <Typography style={{ color: "red" }}>{strings.shutDown}</Typography>
                                            }
                                        </TableCell>
                                        <TableCell style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            {
                                                o.node.enabled === false ?
                                                    <Button color="primary" variant="outlined" className={classes.button} onClick={ () => modifyStatus(o.node.id, true, o.node.name)}>{strings.open}</Button>
                                                    :
                                                    <Button color="primary" variant="outlined" className={classes.button} onClick={ () => modifyStatus(o.node.id, false, o.node.name)}>{strings.shutDown}</Button>
                                            }
                                        </TableCell>

                                        <TableCell style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <Button color="primary" variant="outlined" className={classes.button} onClick={ () => history.push(`${MODIFY_ACTIVITY_TYPE}/${o.node.id}`)}>{strings.modify}</Button>
                                        </TableCell>

                                        {/*<TableCell style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <Button
                                                // color="primary"
                                                variant="outlined"
                                                style={{ color: 'red' }}
                                                className={classes.button}
                                                onClick={() => deleteEvent(o.node.id, o.node.name)}
                                            >
                                                {strings.delete}
                                            </Button>
                                        </TableCell>*/}

                                    </TableRow>
                                    :
                                    null
                            )
                    }
                />
            </Grid>
        </Paper>
    </Grid>
}