import React, { Fragment, useState, useEffect } from 'react';
import { Title, AppDateRangePicker, Loading } from '../../../components';
import {
    Paper,
    Grid,
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
import useLanguages from '../../../hooks/use-languages';
import { makeStyles } from '@material-ui/styles';
import { SYSTEM_NOTIFICATION_UPDATE, SYSTEM_NOTIFICATION } from '../../../paths';
import EditorContainer from '../../member-management/editor';
import { useSystemData } from '../../../queries-graphql/announcement-management/announcement-query';
import { ANNOUNCEMENT_UPDATE_MUTATION } from '../../../queries-graphql/announcement-management/announcement-mutation';
import Cookies from 'universal-cookie';
import moment from 'moment'
import { useMutation } from '@apollo/react-hooks'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import swal from 'sweetalert2';
import { PreviewImage } from '../../../components';

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


function AnnounceDataQuery(id) {
    const { data, loading } = useSystemData({
        id: id,
        startat: "2000-01-01"
    });
    if (loading) {
        return null;
    }

    if (data) {
        if (data.announcements) {
            if (data.announcements.edges) {
                return data.announcements.edges[0].node
            }
        } else {
            return null
        }
    } else {
        return null
    }

}

export default function Update(props) {
    const classes = useStyles();
    const strings = useLanguages(SYSTEM_NOTIFICATION_UPDATE);
    const { history } = props
    const [focusedInput, setFocusedInput] = useState(null);
    const [state, setState] = React.useState({
        startDate: null,
        endDate: null,
        showType: '',
        title: '',
        weight: null,
        imagePC: null,
        imageMobile: null
        
    });

    const [imagePrev, setImagePrev] = useState(null);

    const [previewImg, setPreviewImg] = useState()
    const [openImg, setOpenImg] = useState(false);
    function previewImage(imageSource) {
        setOpenImg(true)
        setPreviewImg(imageSource)
    }
    const cookies = new Cookies();
    const [content, setContent] = useState("");
    const [open, setOpen] = useState(false);
    const ID = history.location.pathname.split('/', 5)[4]
    const dataQuery = AnnounceDataQuery(ID);
    const [control, setControl] = useState(false)
    const [announcementUpdate] = useMutation(ANNOUNCEMENT_UPDATE_MUTATION)

    useEffect(() => {
        if (dataQuery) {
            setState({
                ...state,
                id: dataQuery.id ? dataQuery.id : '',
                title: dataQuery.title ? dataQuery.title : '',
                content: dataQuery.content ? dataQuery.content : null,
                startDate: dataQuery.startAt ? moment(dataQuery.startAt) : null,
                endDate: dataQuery.endAt ? moment(dataQuery.endAt) : null,
                weight: dataQuery.weight ? dataQuery.weight : null,
                showType: dataQuery.showType ? dataQuery.showType : null,
                updatedBy: cookies.get("ID")
            })

            if (dataQuery.showType === 'banner') {
                setControl(true)
            } else {
                setControl(false)
            } 

            if (state.imagePC === null && dataQuery.picUrlPc !== "") { 
                setState(oldValues => ({
                    ...oldValues,
                    ["imagePC"]: process.env.REACT_APP_IMAGE_URL_LOCAL + dataQuery.picUrlPc
                }))
            }

            if (state.imageMobile === null && dataQuery.picUrlMobile !== "") {
                setState(oldValues => ({
                    ...oldValues,
                    ["imageMobile"]: process.env.REACT_APP_IMAGE_URL_LOCAL + dataQuery.picUrlMobile
                }))
            }


        }
    }, [dataQuery]) 

    async function mutateUpdate() {
        try {
            const res = await announcementUpdate({
                variables: {
                    id: state.id !== "" ? state.id : dataQuery.id,
                    title: state.title !== "" ? state.title : dataQuery.title,
                    content: content !== "" ? content : dataQuery.content,
                    weight: state.weight !== "" ? state.weight : dataQuery.weight,
                    showType: state.showType !== "" ? state.showType : dataQuery.showType,
                    updatedBy: state.updatedBy !== "" ? state.updatedBy : dataQuery.updatedBy,
                    startAt: state.startDate ? state.startDate.toISOString() : dataQuery.startAt,
                    endAt: state.endDate ? state.endDate.toISOString() : dataQuery.endAt,
                }
            })

            if (res.data.announcement.errors.length <= 0) {
                swal.fire({
                    position: 'center',
                    type: 'success',
                    title: strings.successfullySaved,
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                swal.fire({
                    position: 'center',
                    type: 'error',
                    title: res.data.announcement.errors[0].messages[0],
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (e) {

        }
    }



    function imageFileHandler(event) {
        event.persist()
        let image = event.target.files[0]

        setState(oldValues => ({
            ...oldValues,
            [event.target.name]: image
        }))

    }

    function handleChange(event) {
        event.persist();
        let x = event.target.value
        if (event.target.name === "showType") {
            if (x === 'banner') {
                setControl(true)
            } else {
                setControl(false)
            }
        }
        setState(oldValues => ({
            ...oldValues,
            [event.target.name]: x,
        }));
    };

    function onDatesChange({ startDate, endDate }) {
        setState(oldValues => ({
            ...oldValues,
            startDate,
            endDate
        }));
    }


    function onFocusChange(f) {
        setFocusedInput(f);
    }

    // function handleClickOpen() {
    //     setOpen(true);
    // }

    function handleClose() {
        setOpen(false);
    }

    return <Paper elevation={1} style={{ padding: 30 }}>
        <Title pageTitle={strings.systemNotificationUpdate} />
        {dataQuery ?
            <Grid container className={classes.paper} alignItems="center" spacing={2}>
                <Grid item md={12}>
                    <Grid item container direction="row" alignItems="center">
                        <Typography style={{ marginRight: 15 }}>{strings.displayForm}: </Typography>
                        <RadioGroup aria-label="showType" name="showType" defaultValue={dataQuery ? dataQuery.showType : ""} onChange={handleChange} row>
                            <FormControlLabel
                                value={"popout"}
                                control={<Radio color="primary" />}
                                label={strings.popUps}
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value={"scrolling"}
                                control={<Radio color="primary" />}
                                label={strings.marquee}
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value={"banner"}
                                control={<Radio color="primary" />}
                                label={strings.banner}
                                labelPlacement="end"
                            />
                        </RadioGroup>

                    </Grid>
                </Grid>
                <Grid item container alignItems="center">
                    <Typography style={{ marginRight: 15 }}>{strings.announcementTitle}: </Typography>
                    <TextField
                        style={{ width: 230 }}
                        onChange={handleChange}
                        name="title"
                        className={classes.textfield}
                        variant="outlined"
                        defaultValue={dataQuery ? dataQuery.title : ''}
                        margin="dense"
                        placeholder={strings.pleaseEnter}
                    />
                </Grid>

                <Grid item>

                    <Grid container alignItems="center">
                        <Typography style={{ marginRight: 15 }}>{strings.displayTime}: </Typography>
                        <AppDateRangePicker
                            focusedInput={focusedInput}
                            onFocusChange={onFocusChange}
                            onDatesChange={onDatesChange}
                            focused={focusedInput}
                            // startDate={dataQuery ? dataQuery.startAt ? moment(moment(dataQuery.startAt).format("YYYY-MM-DD")) : state.startDate : state.startDate}
                            // endDate={dataQuery ? dataQuery.endAt ? moment(moment(dataQuery.endAt).format("YYYY-MM-DD")) : state.endDate : state.endDate} 
                            startDate={state.startDate}
                            endDate={state.endDate}
                            startDateId="startDate"
                            endDateId="endDate"
                            startDatePlaceholderText={strings.startDate}
                            endDatePlaceholderText={strings.endDate}
                            inputIconPosition="after"
                            showDefaultInputIcon
                            small
                            isOutsideRange={() => false}
                        />
                    </Grid>
                </Grid>
                <Grid item container alignItems="center">
                    <Typography style={{ marginRight: 15 }}>{strings.sortWeight}: </Typography>
                    <TextField
                        style={{ width: 230 }}
                        className={classes.textfield}
                        variant="outlined"
                        margin="dense"
                        defaultValue={dataQuery ? dataQuery.weight : ''}
                        placeholder={strings.pleaseEnter}
                        name="weight"
                        type="number"
                        onChange={handleChange}
                    />
                </Grid>

                {
                    control == false ?
                        null :
                        <Fragment>
                            <Grid item container alignItems="center">
                                <Typography style={{ marginRight: 15 }}>{strings.bannerPc}:</Typography>
                                <input
                                    accept="image/*"
                                    id="imagePC-button-file"
                                    multiple
                                    type="file"
                                    name="imagePC"
                                    onChange={imageFileHandler}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="imagePC-button-file">
                                    <Button component="span" variant="contained" color="default" className={classes.button}>
                                        {strings.uploadBanner}
                                        <CloudUploadIcon className={classes.rightIcon} />
                                    </Button>
                                </label>
                                <Button variant="contained" color="primary" style={{ marginLeft: "20px" }} onClick={() => previewImage(state.imagePC)}>
                                    {strings.previewImg}
                                </Button>
                            </Grid>

                            <Grid item container alignItems="center"  >
                                <Typography style={{ marginRight: 15 }}>{strings.bannerMobile}:</Typography>
                                <input
                                    accept="image/*"
                                    id="imageMobile-button-file"
                                    multiple
                                    type="file"
                                    name="imageMobile"
                                    onChange={imageFileHandler}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="imageMobile-button-file">
                                    <Button component="span" variant="contained" color="default" className={classes.button}>
                                        {strings.uploadBanner}
                                        <CloudUploadIcon className={classes.rightIcon} />
                                    </Button>
                                </label>
                                <Button variant="contained" color="primary" style={{ marginLeft: "20px" }} onClick={() => previewImage(state.imageMobile)}>
                                    {strings.previewImg}
                                </Button>
                            </Grid>
                        </Fragment>
                }

                <Grid item container alignItems="center-start" spacing={1} style={{ marginTop: 10 }}>
                    <Grid item xs={12}>
                        <Typography>{strings.announcementContent}: </Typography>
                        <EditorContainer setContent={setContent} defaultValue={dataQuery ? `${dataQuery.content}` : ''} />
                    </Grid>
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
                        <Button variant="contained" onClick={() => history.push(SYSTEM_NOTIFICATION)} color="primary">{strings.return}</Button>
                    </Grid>
                </Grid>
            </Grid>
            : null}

        <PreviewImage
            open={openImg}
            setOpen={setOpenImg}
            imgSrc={previewImg}
            setPreviewImg={setPreviewImg}
        />
    </Paper>
}