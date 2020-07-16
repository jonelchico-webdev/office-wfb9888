import React, { useState, Fragment } from 'react';
import useLanguages from '../../../hooks/use-languages';
import { APP_PUSH, APP_PUSH_VIEW } from '../../../paths';
import { makeStyles } from '@material-ui/styles';
import { Query } from 'react-apollo';
import {
    Paper,
    Grid,
    Typography,
    Button,
    Divider,
    TextField,
    TableRow,
    TableCell
} from '@material-ui/core';
import { GrowItem, SimpleTable, AppDateRangePicker, Title } from '../../../components';
import { APP_PUSH_QUERY } from '../../../queries/announcement-management';
import {mockClient} from '../../../App'
import usePagination from '../../../hooks/use-pagination'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    paper: {
        padding: theme.spacing(2)
    },
    textfield: {
        backgroundColor: '#ffffff',
    },
}));

export default function AppPush(props) {
    const classes = useStyles();
    const strings = useLanguages(APP_PUSH);
    const [filterValues, setFilterValues] = useState({
        pushContent: '',
        startDate: null,
        endDate: null,
    });
    const { history } = props

    const [focusedInput1, setFocusedInput1] = useState(null);
    const [focusedInput2, setFocusedInput2] = useState(null);

    const pagination = usePagination()

    // For Pagination

	// const pageSplit = history.location.pathname.split("=", 3);
	// const pageValue = pageSplit == APP_PUSH  ? 1 : parseInt(pageSplit[1].charAt(0))
	// const page =  pageValue == 1 ? 0 : pageValue - 1
	// const rowsPerPageSplit = history.location.pathname.split("=", 3);
	// const rowsPerPage = rowsPerPageSplit  == APP_PUSH ? 15 : parseInt(rowsPerPageSplit[2] )
	// const rowsPerPagePosition = rowsPerPage == 15 ? 0 : rowsPerPage == 25 ? 1 : rowsPerPage == 35 ? 2 : 3 
  
    // end of Pagination

    function handleFilterChange(event) {
        event.persist();
        setFilterValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
    }

    function onDatesChange({ startDate, endDate}) {
        setFilterValues(oldValues => ({
			...oldValues,
			startDate,
			endDate
		}));
    }

    function onFocusChange1(f) {
        setFocusedInput1(f);
    }

    function onFocusChange2(f) {
        setFocusedInput2(f);
    }


    function onChangeClear() {
        setFilterValues(oldValues => ({
            ...oldValues,
            accountNumber: '',
            startDate: null,
            endDate: null,
        }));
    }

    return <Query query={APP_PUSH_QUERY} client={mockClient}>
        {({ loading, error, data }) => {
            if (loading) return <div />;
            const { appPush } = data;
            const count = appPush.length

            return <Paper elevation={1}>
                        <Title pageTitle={strings.appPush} />
                        <Grid container direction="row" justify="space-between" alignItems="center">
                            <Typography className={classes.paper} variant="h6">{strings.inbox}</Typography>
                        </Grid>
                        <Divider light={true} />
                        <Grid container className={classes.paper} alignItems="center" spacing={1}>
                            <Grid item>
                                <Typography>{strings.pushContent} : </Typography>
                            </Grid>
                            <Grid item>
                                <TextField
                                    style={{ width: 130 }}
                                    className={classes.textfield}
                                    variant="outlined"
                                    margin="dense"
                                    placeholder={strings.pleaseEnter}
                                    name="accountNumber"
                                    onChange={handleFilterChange}
                                    value={filterValues.accountNumber}
                                />
                            </Grid>
                            <Grid item>
                                <Typography>{strings.pushTime} :</Typography>
                            </Grid>
                            <Grid item>
                                <AppDateRangePicker
                                    focusedInput={focusedInput1}
                                    onFocusChange={onFocusChange1}
                                    onDatesChange={onDatesChange}
                                    focused={focusedInput1}
                                    startDate={filterValues.startDate}
                                    endDate={filterValues.endDate}
                                    stratDateId="startDate"
                                    endDateId="endDate"
                                    startDatePlaceholderText={strings.startDate}
                                    endDatePlaceholderText={strings.endDate}
                                    inputIconPosition="after"
                                    showDefaultInputIcon
                                    small
                                    isOutsideRange={() => false}
                                />
                            </Grid>
                            <Grid item>
                                <Typography>{strings.addTime} :</Typography>
                            </Grid>
                            <Grid item>
                                <AppDateRangePicker
                                    focusedInput={focusedInput2}
                                    onFocusChange={onFocusChange2}
                                    onDatesChange={onDatesChange}
                                    focused={focusedInput2}
                                    startDate={filterValues.startDate}
                                    endDate={filterValues.endDate}
                                    stratDateId="startDate"
                                    endDateId="endDate"
                                    startDatePlaceholderText={strings.startDate}
                                    endDatePlaceholderText={strings.endDate}
                                    inputIconPosition="after"
                                    showDefaultInputIcon
                                    small
                                    isOutsideRange={() => false}
                                />
                            </Grid>
                            <GrowItem />
                            <Grid item>
                                <Button color="primary" variant="text" onClick={onChangeClear} >{strings.clearAll}</Button>
                            </Grid>
                            <Grid item>
                                <Button color="primary" variant="contained">{strings.searchFor}</Button>
                            </Grid>
                        </Grid>

                        <Grid className={classes.paper} item style={{paddingTop:0}}>
                            <SimpleTable
                                tableProps={{size: "small"}}
                                hasPagination={false}
                                pagination={pagination}
                                pageInfo={false}
                                count={count}
                                columns={
                                    <TableRow>
                                        <TableCell>{strings.serialNumber}</TableCell>
                                        <TableCell>{strings.pushContent}</TableCell>
                                        <TableCell>{strings.pushTime}</TableCell>
                                        <TableCell>{strings.founder}</TableCell>
                                        <TableCell>{strings.creationTime}</TableCell>
                                        <TableCell>{strings.operating}</TableCell>
                                    </TableRow>
                                }
                                rows={
                                    appPush.length === 0 ? 
                                    <TableRow>
                                        <TableCell align="center" colSpan={14}>没有可用数据</TableCell>
                                    </TableRow>
                                    :
                                    appPush.map((o, index) => {
                                        return (
                                            <Fragment>
                                                <TableRow key={index}>
                                                    <TableCell>{o.serialNumber}</TableCell>
                                                    <TableCell>{o.pushContent}</TableCell>
                                                    <TableCell>{o.pushStartDate} {o.pushStartTime}</TableCell>
                                                    <TableCell>{strings.admin}</TableCell>
                                                    <TableCell>{o.creationTime}</TableCell>
                                                    <TableCell>
                                                        <Grid container spacing={1} direction="row" >
                                                            <Grid item>
                                                                <Button size="medium" variant="text" color="primary" onClick={() => history.push(`${APP_PUSH_VIEW}/${index}`)}>{strings.view}</Button>
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                </TableRow>
                                            </Fragment>
                                        )
                                    })
                                }
                            />

                        </Grid>
                    </Paper>
            }
        }
    </Query>
    
}