import React, { useState, useEffect } from 'react';
import { Paper, Grid, Button, Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Title from '../../../components/title';
import useLanguages from '../../../hooks/use-languages';
import {
    DOWNLOAD_MOBILE_PHONE_QR_CODE_CONFIGURATION
} from '../../../paths';
import { FormLayoutSingleColumn } from '../../../components/form-layouts';
import { ErrorOutline, } from '@material-ui/icons';
import { useDropzone } from 'react-dropzone';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import Image from 'material-ui-image'
import { GrowItem } from '../../../components';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(10, 45, 10, 45)
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
}));

export default function RegistrationAndLoginConfiguration(props) {
    const { handleChange } = props;
    const classes = useStyles();
    const strings = useLanguages(DOWNLOAD_MOBILE_PHONE_QR_CODE_CONFIGURATION);

    // const [filterValues, setFilterValues] = React.useState({
    //     startDate: null,
    //     endDate: null,
    //     account: '',
    //     commissionType: '',
    //     status: '',
    //     customerServiceType: ''
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

    // for dropzone
    const [imgSrc] = useState(null);
    const [files, setFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    const thumbs = files.map(file => (
        <Grid key={file.name}>
            <Image
                src={file.preview}
                animationDuration='3000'
                imageStyle={{ width: '100%', borderRadius: 3 }}
            />
        </Grid>
    ));

    return <FormLayoutSingleColumn>
        <Title pageTitle={strings.title} />

        <Paper className={classes.paper} elevation={1} style={{ marginTop: "20px" }}>
            <Grid container direction="column">
                <Grid container alignItems="center" style={{ marginTop: 40 }}>
                    <ErrorOutline color="primary" style={{ marginRight: 10 }} />
                    <Grid item><Typography variant="h6">{strings.downloadQRCode} </Typography></Grid>
                </Grid>

                <Grid container direction="row" alignItems="center">
                    <Grid item md={3} container alignItems="center" justify="flex-end" style={{ marginRight: 10 }}>
                        <Typography>{strings.QRCodeUpdate}:</Typography>
                    </Grid>
                    <Grid container md={8} alignItems="center">
                        <TextField {...getRootProps({ className: 'dropzone' })} value={thumbs !== '' ? files[0].name : null} id="levelIcons" variant="outlined" margin="dense" name="levelIcons" onChange={handleChange} />
                        <GrowItem />
                        <label htmlFor="levelIcons">
                            <Button variant="outlined" style={{ height: 30, }} component="span">
                                {strings.upload}
                            </Button>
                        </label>
                        <Button variant="contained" color="primary" style={{ height: 30 }}>{strings.preview}</Button>
                    </Grid>
                </Grid>

                <Grid container direction="row" style={{ marginTop: 10 }}>
                    <Grid item md={3} container alignItems="center" justify="flex-end" style={{ marginRight: 10 }}>
                    </Grid>

                    <Grid container md={8} alignItems="center" style={{ height: 340 }}>
                        {thumbs === '' ?
                            <Grid htmlFor="levelIcons" container {...getRootProps({ className: 'dropzone' })} alignItems='center' justify="center" style={{ width: "100%", height: "100%", backgroundColor: '#e8e8e8', border: '1px dashed #00bfa5', borderRadius: 6, backgroundImage: { imgSrc } }}>
                                <Grid>
                                    <input {...getInputProps()} />
                                    <LibraryAdd style={{ fontSize: 30, marginLeft: 13 }} color="primary" />
                                    <Typography>{strings.dragAndDropFileUpload}</Typography>
                                </Grid>
                            </Grid>
                            :
                            <Grid {...getRootProps()} style={{ width: "100%", height: "100%", border: '1px dashed #00bfa5', overflow: "hidden", borderRadius: 6 }}>
                                <input {...getInputProps()} />
                                {thumbs}
                            </Grid>
                        }
                    </Grid>
                </Grid>

                <Grid container direction="row" style={{ marginTop: 5 }}>
                    <Grid item md={3} container alignItems="center" justify="flex-end" style={{ marginRight: 10 }}>
                        <Typography>{strings.QRCodeAddress}:</Typography>
                    </Grid>

                    <Grid container md={8} alignItems="center">
                        <TextField variant="outlined" margin="dense" name="QRCodeAddress"
                            onChange={handleChange} placeholder={strings.pleaseEnter} />
                    </Grid>
                </Grid>
                <Grid container style={{ marginTop: 10 }}><Button variant="contained" color="primary">{strings.save}</Button></Grid>
            </Grid>
        </Paper>
    </FormLayoutSingleColumn>
}