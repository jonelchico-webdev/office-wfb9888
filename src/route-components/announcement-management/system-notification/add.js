import React, { useState, Fragment } from 'react';
import { Title, AppDateRangePicker } from '../../../components';
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
import { SYSTEM_NOTIFICATION_UPDATE, SYSTEM_NOTIFICATION } from '../../../paths';
import EditorContainer from '../../member-management/editor';
import { ANNOUNCEMENT_ADD_MUTATION, ANNOUNCEMENT_IMAGE_UPLOAD } from '../../../queries-graphql/announcement-management/announcement-mutation';
import moment from 'moment'

import { PreviewImage } from '../../../components';
import { useMutation } from '@apollo/react-hooks'
import swal from 'sweetalert2';

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
        imagePC: "",
        imageMobile: "",
        hidden: false,
    });
    const [previewImg, setPreviewImg] = useState()
    const [control, setControl] = useState(false)
    const [content, setContent] = useState(null);
    const [open, setOpen] = useState(false);

    const [announcementAdd] = useMutation(ANNOUNCEMENT_ADD_MUTATION)
    const [announcementImage] = useMutation(ANNOUNCEMENT_IMAGE_UPLOAD)


    const [imagePrev, setImagePrev] = useState(null);
    const [openImg, setOpenImg] = useState(false);
    function previewImage(imageSource) {
        setOpenImg(true)
        setPreviewImg(imageSource)
    }
    function imageFileHandler(event) {
        event.persist()
        let image = event.target.files[0]
        setImagePrev(URL.createObjectURL(event.target.files[0]))
        setState(oldValues => ({
            ...oldValues,
            [event.target.name]: image
        }))

    }

    // console.log(content ? content.JSON.stringify())
    async function mutateUpdate() {
        if (
            state.startDate !== null &&
            state.endDate !== null &&
            state.showType !== '' &&
            state.title !== '' &&
            state.weight !== null &&
            content !== null
        ) {
            try {
                const res = await announcementAdd({
                    variables: {
                        title: state.title,
                        content: content,
                        weight: state.weight,
                        showType: state.showType,
                        createdAt: moment().toISOString(),
                        startAt: state.startDate.toISOString(),
                        endAt: state.endDate.toISOString(),
                    }
                })

                if (res.data.announcement.errors.length <= 0) {

                    if (res.data) {
                        announcementImage({
                            variables: {
                                id: res.data.announcement.announcement.id,
                                deviceType: "pc",
                                file: state.imagePC
                            }
                        })
                        announcementImage({
                            variables: {
                                id: res.data.announcement.announcement.id,
                                deviceType: "mobile",
                                file: state.imageMobile
                            }
                        })
                    }


                    swal.fire({
                        position: 'center',
                        type: 'success',
                        title: strings.successfullySaved,
                        // showConfirmButton: false,
                        // timer: 1500,
                        confirmButtonText: strings.confirm,
                        showConfirmButton: true
                    }).then((result) => {
                        history.goBack()
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

    function handleClose() {
        setOpen(false);
    }

    return <Paper elevation={1}  >
        <Title pageTitle={strings.systemNotificationUpdate} />
        <Grid container direction="row" justify="space-between" alignItems="center">
            <Typography className={classes.paper} variant="h6">{strings.newSystemNotif}</Typography>
        </Grid>
        <Divider light={true} />
        <Grid container className={classes.paper} alignItems="center" spacing={2}>
            <Grid item md={12}>
                <Grid item container direction="row" alignItems="center">
                    <Typography style={{ marginRight: 15 }}>{strings.displayForm}: </Typography>
                    <RadioGroup aria-label="showType" name="showType" onChange={handleChange} row>
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
                    defaultValue={state.title}
                    margin="dense"
                    placeholder={strings.pleaseEnter}
                />
            </Grid>
            <Grid item container alignItems="center">
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
            <Grid item container alignItems="center" >

                <Typography style={{ marginRight: 15 }}>{strings.sortWeight}: </Typography>
                <TextField
                    style={{ width: 230 }}
                    className={classes.textfield}
                    variant="outlined"
                    margin="dense"
                    defaultValue={state.weight}
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
                    <EditorContainer setContent={setContent} />
                </Grid>
            </Grid>


            {/* <Grid item xs={12}>
                <Grid container alignItems="center">

                    <Grid item xs={1}>
                        <Typography style={{ marginRight: 15 }}>{strings.sortWeight}: </Typography>
                    </Grid>
                    <Grid item xs={11}>
                        <Grid container spacing={2}>
                            <Grid item container direction="column" className={classes.paper} md={4}>
                               <Grid item md={10}>
                                asd
                               </Grid>
                               <Grid item md={2}>
                                                a
                               </Grid>
                            </Grid>
                            <Grid item className={classes.paper} md={4}>
                                
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
          */}
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

        <PreviewImage
            open={openImg}
            setOpen={setOpenImg}
            imgSrc={previewImg}
            setPreviewImg={setPreviewImg}
        />
    </Paper>
}