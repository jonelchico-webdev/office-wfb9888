import React from 'react';
import { Paper, TableCell, TableRow, Grid, Button, Typography, Divider } from '@material-ui/core';
import { SimpleTable } from '../../../components/';
import { GrowItem } from '../../../components';
import Title from '../../../components/title';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import {
    PARAMETER_CONFIGURATION
} from '../../../paths';
import usePagination from '../../../hooks/use-pagination';

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
}));

export default function MobilePhoneBarConfiguration(props) {
    const classes = useStyles();
    const strings = useLanguages(PARAMETER_CONFIGURATION);
    const pagination = usePagination()
    const count = 0
    
    return <Grid>
        <Title pageTitle={strings.mobilePhoneConfig} />

        <Paper className={classes.root} style={{ marginTop: "20px" }}>

            <Grid container>
                <Typography variant='h6'>{strings.mobilePhoneConfig}</Typography>
            </Grid>

            <Divider light={true} style={{ marginTop: "2em", marginBottom: "1em" }} />

            <Grid container alignItems="center" spacing={1}>
                <GrowItem />

                <Grid item>
                    <Button style={{ width: 100 }} color="secondary" variant="contained">{strings.new}</Button>
                </Grid>
            </Grid>

            <Grid item style={{ marginTop: '1rem' }}>

                <SimpleTable
                    hasPagination={false}
                    pagination={pagination}
                    pageInfo={false}
                    count={count}
                    columns={
                        <TableRow>
                            <TableCell>{strings.serialNumber}</TableCell>
                            <TableCell>{strings.frontDisplayName}</TableCell>
                            <TableCell>{strings.displayIcon}</TableCell>
                            <TableCell>{strings.featureOrPage}</TableCell>
                            <TableCell>{strings.sortWeight}</TableCell>
                            <TableCell>{strings.founder}</TableCell>
                            <TableCell>{strings.modifier}</TableCell>
                            <TableCell>{strings.lastModified}</TableCell>
                            <TableCell colSpan={2} >{strings.operating}</TableCell>
                        </TableRow>
                    }
                    rows={
                        <TableRow>
                            <TableCell>{strings.basicSetting}</TableCell>
                            <TableCell>{strings.basicSetting}</TableCell>
                            <TableCell>{strings.basicSetting} <Button color="primary" >{strings.preview}</Button></TableCell>
                            <TableCell>{strings.basicSetting}</TableCell>
                            <TableCell>{strings.basicSetting}</TableCell>
                            <TableCell>{strings.basicSetting}</TableCell>
                            <TableCell>{strings.basicSetting}</TableCell>
                            <TableCell>{strings.basicSetting}</TableCell>
                            <TableCell style={{ paddingLeft: 0, paddingRight: 0 }}> <Button color="primary" className={classes.button}>{strings.modify}</Button>   </TableCell>
                            <TableCell style={{ paddingLeft: 0, paddingRight: 0 }}> <Button color="primary" className={classes.button}>{strings.delete}</Button>  </TableCell>
                        </TableRow>
                    }
                />

            </Grid>

        </Paper>
    </Grid>
}