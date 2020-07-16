import React, { useState, Fragment } from 'react';
import {Title, AppDateRangePicker, Loading} from '../../../components';
import {
    Paper,
    Grid,
    Divider,
    Typography,
    Button,
    FormControlLabel,
    RadioGroup,
    Radio,
    TextField,
    Dialog,
    DialogActions,
    DialogTitle,
    Box
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import useLanguages from '../../../hooks/use-languages';
import { makeStyles } from '@material-ui/styles';
import {ACTIVITY_TYPE_MANAGEMENT, ADD_ACTIVITY_TYPE, SYSTEM_NOTIFICATION} from '../../../paths';
import {
    ADD_ACTIVITY_TYPE_MUTATION,
    UPDATE_ACTIVITY_TYPE_MUTATION
} from '../../../queries-graphql/activity-management/event-list/mutation/add-activity-type'
import EditorContainer from '../../member-management/editor';
import { ANNOUNCEMENT_ADD_MUTATION, ANNOUNCEMENT_IMAGE_UPLOAD } from '../../../queries-graphql/announcement-management/announcement-mutation';
import moment from 'moment'

import { PreviewImage } from '../../../components';
import { useMutation } from '@apollo/react-hooks'
import swal from 'sweetalert2';
import useGameEventValueQuery
    from "../../../queries-graphql/activity-management/event-list/query/event-list-activity-value-query";
import useActivityTypeQuery from "../../../queries-graphql/activity-management/event-list/query/activity-id-query";
import useGameEventModify from "../../../queries-graphql/activity-management/event-list/query/event-id-query";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    paper: {
        padding: theme.spacing(2)
    },
    padding: {
        padding: theme.spacing(2)
    },
    textfield: {
        backgroundColor: '#ffffff',
    },
    button: {
        width: "150px",
        // justify: "space-between"
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    }
}));

export default function ActivityType(props) {
    const classes = useStyles();
    const strings = useLanguages(ADD_ACTIVITY_TYPE);
    const { history } = props;
    const id = history.location.pathname.split('/', 5)[4];
    const [refresh, setRefresh] = useState(false);
    const [state, setState] = React.useState({
        name: '',
        description: '',
        weight: null,
        id:id
    });

    const [open, setOpen] = useState(false);

    const [activityTypeModify] = useMutation(UPDATE_ACTIVITY_TYPE_MUTATION);

    async function mutateUpdate() {
        if (
            state.name !== '' &&
            state.description !== '' &&
            state.weight !== null
        ) {
            console.log(state);
            try {
                const res = await activityTypeModify({
                    variables: {
                        id:state.id,
                        name: state.name,
                        description: state.description,
                        weight: state.weight
                    }
                });

                if (res.data.gameEventType.errors.length <= 0) {
                    swal.fire({
                        position: 'center',
                        type: 'success',
                        title: strings.successfullySaved,
                        confirmButtonText: strings.confirm,
                        showConfirmButton: true
                    }).then((result) => {
                        history.goBack()
                    })

                } else {
                    swal.fire({
                        position: 'center',
                        type: 'error',
                        title: res.data.gameEventType.errors[0].messages[0],
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            } catch (e) {

            }
        } else {
            swal.fire({
                position: 'center',
                type: 'error',
                title: strings.fillOut,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }
    function handleChange(event,eventType) {
        event.persist();
        let x = event.target.value;
        setState(oldValues => ({
            ...eventType,
            [event.target.name]: x,
        }));

    }

    function handleClose() {
        setOpen(false);
    }
    const {data, loading} = useActivityTypeQuery({ id: id, mutation: refresh })

    if(loading) {
        return <Loading/>
    }
    const {gameEventTypes} = data;
    const eventType = gameEventTypes.edges[0].node;
    return <Paper elevation={1}  >
        <Title pageTitle={strings.ModifyActivity} />
        <Grid container direction="row" justify="space-between" alignItems="center">
            <Typography className={classes.paper} variant="h6">{strings.ModifyActivity}</Typography>
        </Grid>
        <Divider light={true} />
        <Grid container className={classes.paper} alignItems="center" spacing={2}>
            <Grid item container alignItems="center">
                <Typography style={{ marginRight: 15 }}>{strings.name}: </Typography>
                <TextField
                    style={{ width: 230 }}
                    onChange={e=>handleChange(e,eventType)}
                    name="name"
                    defaultValue={eventType.name}
                    className={classes.textfield}
                    variant="outlined"
                    margin="dense"
                    placeholder={strings.pleaseEnter}
                />
            </Grid>
            <Grid item container alignItems="center">
                <Typography style={{ marginRight: 15 }}>{strings.description}: </Typography>
                <TextField
                    style={{ width: 230 }}
                    onChange={e=>handleChange(e,eventType)}
                    name="description"
                    defaultValue={eventType.description}
                    className={classes.textfield}
                    variant="outlined"
                    margin="dense"
                    placeholder={strings.pleaseEnter}
                />
            </Grid>

            <Grid item container alignItems="center" >

                <Typography style={{ marginRight: 15 }}>{strings.weight}: </Typography>
                <TextField
                    style={{ width: 230 }}
                    className={classes.textfield}
                    variant="outlined"
                    margin="dense"
                    defaultValue={eventType.weight}
                    placeholder={strings.pleaseEnter}
                    name="weight"
                    type="number"
                    onChange={e=>handleChange(e,eventType)}
                />
            </Grid>

            <Grid item container direction="row" justify="center" alignItems="center" spacing={2} >
                <Grid item>
                    <Button variant="outlined" color="primary" onClick={mutateUpdate}>
                        {strings.save}
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle style={{ paddingTop: 30 }} variant="h1" id="alert-dialog-title">
                            <Grid container alignItems="center">
                                <CheckCircleIcon padding={100} fontSize="large" color="secondary" style={{ marginRight: 5 }} />
                                <Typography fontSize="inherit">{strings.successfullySaved}</Typography>
                            </Grid>
                        </DialogTitle>
                        <DialogActions style={{ paddingBottom: 30 }} >
                            <Box mx="auto">
                                <Button onClick={handleClose} variant="contained" color="primary" autoFocus>
                                    {strings.confirm}
                                </Button>
                            </Box>
                        </DialogActions>
                    </Dialog>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={() => history.push(ACTIVITY_TYPE_MANAGEMENT)} color="primary">{strings.return}</Button>
                </Grid>
            </Grid>

        </Grid>
    </Paper>
}