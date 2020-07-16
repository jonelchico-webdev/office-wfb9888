import React, { Fragment, useState } from 'react';
import { Title, Loading, EditorShow } from '../../../components';
import {
    Paper,
    Grid,
    Typography,
    Button
} from '@material-ui/core';
import useLanguages from '../../../hooks/use-languages';
import { makeStyles } from '@material-ui/styles';
import { PreviewImage } from '../../../components';
import { SYSTEM_NOTIFICATION_VIEW, SYSTEM_NOTIFICATION } from '../../../paths';
import { useSystemData } from '../../../queries-graphql/announcement-management/announcement-query';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(1)
    },
    padding: {
        padding: theme.spacing(2)
    },
    margin: {
        margin: theme.spacing(1)
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


export default function View(props) {
    const classes = useStyles();
    const strings = useLanguages(SYSTEM_NOTIFICATION_VIEW);
    const { history } = props
    const ID = history.location.pathname.split('/', 5)[4]
    const dataQuery = AnnounceDataQuery(ID)



    const [imagePrev, setImagePrev] = useState(null);
    const [openImg, setOpenImg] = useState(false);
    const [previewImg, setPreviewImg] = useState()
    function previewImage(imageSource) {
        setOpenImg(true)
        setPreviewImg(imageSource)
    }

    return <Paper elevation={1} >
        <Title pageTitle={strings.systemNotificationView} />
        {dataQuery ?
            <Fragment>
                <Grid container className={classes.paper}>
                    <Grid item container alignItems="center" className={classes.margin}>
                        <Grid item xs={12} md={1}>
                            <Typography style={{ display: "inline-block" }}>{strings.announcementTitle}:</Typography>
                        </Grid>
                        <Grid item xs={12} md={11}>
                            <Typography style={{ fontWeight: "bold", display: "inline-block", marginLeft: '1rem' }}>{dataQuery ? dataQuery.title : "无题"}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item container alignItems="center" className={classes.margin}>
                        <Grid item xs={12} md={1} >
                            <Typography style={{ display: "inline-block" }}>{strings.displayTime}:</Typography>
                        </Grid>
                        <Grid item xs={12} md={11}>
                            <Typography style={{ fontWeight: "bold", display: "inline-block", marginLeft: '1rem' }}>{dataQuery ? dataQuery.createdAt : "未知"}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item container alignItems="center" className={classes.margin}>
                        <Grid item xs={12} md={1} >
                            <Typography style={{ display: "inline-block" }}>{strings.displayForm}:</Typography>
                        </Grid>
                        <Grid item xs={12} md={11}>
                            <Typography style={{ fontWeight: "bold", display: "inline-block", marginLeft: '1rem' }}>{dataQuery ? dataQuery.showType : "未知"}</Typography>
                        </Grid>
                    </Grid>

                    <Grid item container alignItems="center" className={classes.margin}>
                        <Grid item xs={12} md={1}>
                            <Typography style={{ display: "inline-block" }}>{strings.sortWeight}:</Typography>
                        </Grid>
                        <Grid item xs={12} md={11}>
                            <Typography style={{ fontWeight: "bold", display: "inline-block", marginLeft: '1rem' }}>{dataQuery ? dataQuery.weight : "未知"}</Typography>
                        </Grid>
                    </Grid>
                    {
                        dataQuery.showType === 'banner'
                            ?
                            <Fragment>
                                <Grid item container alignItems="center" className={classes.margin}>
                                    <Grid item xs={12} md={1}>
                                        <Typography style={{ display: "inline-block" }}>{strings.bannerPc}:</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={11}>
                                        <Button variant="contained" color="primary" style={{ marginLeft: "20px" }} onClick={() => previewImage(dataQuery.picUrlPc ? process.env.REACT_APP_IMAGE_URL_LOCAL + dataQuery.picUrlPc : null)}>
                                            {strings.previewImg}
                                        </Button>
                                    </Grid>
                                </Grid>

                                <Grid item container alignItems="center" className={classes.margin}>
                                    <Grid item xs={12} md={1}>
                                        <Typography style={{ display: "inline-block" }}>{strings.bannerMobile}:</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={11}>
                                        <Button variant="contained" color="primary" style={{ marginLeft: "20px" }} onClick={() => previewImage(dataQuery.picUrlMobile ? process.env.REACT_APP_IMAGE_URL_LOCAL + dataQuery.picUrlMobile : null)}>
                                            {strings.previewImg}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Fragment>
                            :
                            null
                    }


                    <Grid item container alignItems="start-end" className={classes.margin}>
                        <Grid item xs={12} md={1} >
                            <Typography >{strings.announcementContent}:</Typography>
                        </Grid>
                        <Grid id="editor-scroll" style={{ height: 300, overflowX: "auto", paddingLeft: 12 }} item xs={12} md={10}>
                            {
                                dataQuery.content !== undefined ?
                                    <EditorShow defaultValue={
                                        dataQuery ? dataQuery.content : ""} />
                                    :
                                    null
                            }
                        </Grid>
                    </Grid>
                    {/* <Grid item container alignItems="center" className={classes.margin}>
                <Grid item xs={12} md={1} >
                    <Typography style={{ display: "inline-block" }}>{strings.displayTime}:</Typography>
                </Grid>
                <Grid item xs={12} md={11}>
                    <Typography style={{ fontWeight: "bold", display: "inline-block", marginLeft: '1rem' }}>{moment(dataQuery.createdAt).format("YYYY-MM-DD HH:MM:SS")}</Typography>
                </Grid>
            </Grid> */}
                    <Grid item container justify="center" className={classes.margin}>
                        <Grid item >
                            <Button variant="contained" size="big" onClick={() => history.push(SYSTEM_NOTIFICATION)} color="primary">{strings.return}</Button>
                        </Grid>
                    </Grid>

                </Grid>

                {/* 
        <Title pageTitle={strings.systemNotificationView} />
        <Grid container className={classes.padding} >
            <Grid container>
                <Grid item style={{ marginBottom: 10 }}>
                    <Typography>{strings.announcementTitle}: {dataQuery ? dataQuery.title : ""}</Typography>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item style={{ marginBottom: 10 }}>
                    <Typography>{strings.displayTime}: {dataQuery ? dataQuery.createdAt : ""}</Typography>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item style={{ marginBottom: 10 }}>
                    <Typography>{strings.displayForm}: {dataQuery ? dataQuery.showType : ""}</Typography>
                </Grid>
            </Grid>
            <Grid container  >
                <Grid item md={10} style={{ marginBottom: 10, overflowX:"auto"}}>
                    <Typography>{strings.announcementContent}: 
                    {
                         dataQuery ? 
                         dataQuery.content !== undefined ?
                         <EditorShow defaultValue={
                             dataQuery ? dataQuery.content : ""} />
                         :
                         null
                         :
                         null
                    }
                         
                    </Typography>
                </Grid>
                <Grid container>
                    <Grid item style={{ paddingTop: '1rem', marginBottom: 60 }}>
                        <Typography>{strings.sortWeight}: {dataQuery ? dataQuery.weight : ""}</Typography>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item style={{ marginLeft: 30 }}>
                        <Button variant="contained" onClick={() => history.push(SYSTEM_NOTIFICATION)} color="primary">{strings.return}</Button>
                    </Grid>
                </Grid>
            </Grid>

        </Grid> */}

            </Fragment>
            : <Loading />
        }

        <PreviewImage
            open={openImg}
            setOpen={setOpenImg}
            imgSrc={previewImg}
            setPreviewImg={setPreviewImg}
        />
    </Paper>
}   