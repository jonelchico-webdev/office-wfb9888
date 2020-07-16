import React, { useState, Fragment } from 'react';
import useLanguages from '../../hooks/use-languages';
import {
    Paper,
    Grid,
    Typography,
    Button,
    Divider,
    TableRow,
    TableCell
} from '@material-ui/core';
import { ContinueCancelModal, SimpleTable, Title } from '../../components';
import { makeStyles } from '@material-ui/styles';
import { HOME_CAROUSEL_MANAGEMENT } from '../../paths';
import { Query } from 'react-apollo';
import { HOME_CAROUSEL_MANAGEMENT_QUERY } from '../../queries/announcement-management';
import {mockClient} from '../../App'
import usePagination from '../../hooks/use-pagination'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    paper: {
        padding: theme.spacing(2)
    },

}));

export default function HomeCarouselManagement(props) {
    const classes = useStyles();
    const strings = useLanguages(HOME_CAROUSEL_MANAGEMENT);
    const [modalOpen, setModalOpen] = useState(false);
    const { history } = props

    const pagination = usePagination()

    // For Pagination

	const pageSplit = history.location.pathname.split("=", 3);
	const pageValue = pageSplit == HOME_CAROUSEL_MANAGEMENT  ? 1 : parseInt(pageSplit[1].charAt(0))
	const page =  pageValue == 1 ? 0 : pageValue - 1
	const rowsPerPageSplit = history.location.pathname.split("=", 3);
	const rowsPerPage = rowsPerPageSplit  == HOME_CAROUSEL_MANAGEMENT ? 15 : parseInt(rowsPerPageSplit[2] )
	const rowsPerPagePosition = rowsPerPage == 15 ? 0 : rowsPerPage == 25 ? 1 : rowsPerPage == 35 ? 2 : 3 
  
    // end of Pagination

    function handleDeleteItem() {
		setModalOpen(true);
    }
    

    return <Query query={HOME_CAROUSEL_MANAGEMENT_QUERY} client={mockClient}>
        {({ loading, data }) => {
            if (loading) return <div />;
            const { homeCarouselManagement } = data;
            const count = homeCarouselManagement.length

            return <Paper elevation={1}>

                <Title pageTitle={strings.homeCarouselManagement} />
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Typography className={classes.paper} variant="h6">{strings.homeCarouselManagement}</Typography>
                </Grid>
                <Divider light={true} />
                <Grid container className={classes.paper} alignItems="center" spacing={1}>
                    <Grid item>
                        <Button color="primary" variant="contained" >{strings.pcEnd}</Button>
                    </Grid>
                    <Grid item>
                        <Button color="primary" variant="contained" >{strings.mobileTerminal}</Button>
                    </Grid>
                    <Grid item>
                        <Button color="secondary" variant="contained" >{strings.new}</Button>
                    </Grid>
                </Grid>

                <Grid className={classes.paper} item style={{ paddingTop: 0 }}>
                    <SimpleTable
                        tableProps={{size: "small"}}
                        hasPagination={true}
                        pagination={pagination}
                        pageInfo={false}
                        count={count}
                        columns={
                            <TableRow>
                                <TableCell>{strings.serialNumber}</TableCell>
                                <TableCell>{strings.name}</TableCell>
                                <TableCell>{strings.displayForm}</TableCell>
                                <TableCell>{strings.link}</TableCell>
                                <TableCell align="right">{strings.sortWeight}</TableCell>
                                <TableCell>{strings.addPerson}</TableCell>
                                <TableCell>{strings.modifier}</TableCell>
                                <TableCell>{strings.lastModified}</TableCell>
                                <TableCell>{strings.operating}</TableCell>
                            </TableRow>
                        }
                        rows={
                            homeCarouselManagement.length == 0 ? 
                            <TableRow>
                                <TableCell align="center" colSpan={9}>没有可用数据</TableCell>
                            </TableRow>
                            : 
                            homeCarouselManagement.map((o, index) => {
                                return (
                                    <Fragment>
                                        <TableRow key={index}>
                                            <TableCell>{o.serialNumber}</TableCell>
                                            <TableCell>{o.name}</TableCell>
                                            <TableCell>{o.displayForm}</TableCell>
                                            <TableCell>{o.link}</TableCell>
                                            <TableCell align="right">{o.sortWeight}</TableCell>
                                            <TableCell>{o.addAPerson}</TableCell>
                                            <TableCell>{o.modifier}</TableCell>
                                            <TableCell>{o.lastModified}</TableCell>
                                            <TableCell>
                                                <Grid container spacing={1} direction="row" >
                                                    <Grid item>
                                                        <Button size="small" variant="contained" color="primary">{strings.modify}</Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button size="small" onClick={handleDeleteItem} >{strings.delete}</Button>
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
                <ContinueCancelModal open={modalOpen} setOpen={setModalOpen} title={strings.deleteModalTitle}/>
            </Paper>
        }
        }
    </Query>
}