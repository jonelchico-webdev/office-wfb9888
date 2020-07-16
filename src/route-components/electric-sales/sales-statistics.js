import React, { useState } from 'react';
import { Paper, TableCell, TableRow, Grid, Button, Typography, Divider, TextField, OutlinedInput, Select, Menu, MenuItem, ListItemText} from '@material-ui/core';
import { SimpleTable } from '../../components/';
import { GrowItem } from '../../components';
import Title from '../../components/title';
import { makeStyles, withStyles } from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import { FIRST_PAYMENT_VERIFICATION, SALES_STATISTICS } from '../../paths';
import { ELECTRIC_SALES_QUERY } from '../../queries/electric-sales';
import { AppDateRangePicker } from '../../components/date-picker';
import { Query } from 'react-apollo';
import { MoreVert, Clear} from '@material-ui/icons'
import {mockClient} from '../../App'
import usePagination from '../../hooks/use-pagination'

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

/* Styled Menu */
const StyledMenu = withStyles({
	paper: {
		border: '1px solid #d3d4d5',
	},
})(props => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
		vertical: 'bottom',
		horizontal: 'center',
		}}
		transformOrigin={{
		vertical: 'top',
		horizontal: 'center',
		}}
		{...props}
	/>
));

const StyledMenuItem = withStyles(theme => ({
	root: {
		'&:focus': {
		backgroundColor: theme.palette.primary.main,
		'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
			color: theme.palette.common.white,
		},
		},
	},
}))(MenuItem);
/* End */ 

export default function FirstPaymentVerification(props) {
    const classes = useStyles();
    const strings = useLanguages(FIRST_PAYMENT_VERIFICATION);

    const pagination = usePagination()

    /* PAGINATION */
    const {history} = props

    const pageSplit = history.location.pathname.split("=", 3);

	const pageValue = pageSplit === SALES_STATISTICS  ? 1 : parseInt(pageSplit[1].charAt(0))

	const page =  pageValue === 1 ? 0 : pageValue - 1

	const rowsPerPageSplit = history.location.pathname.split("=", 3);
	
	const rowsPerPage = rowsPerPageSplit  === SALES_STATISTICS ? 15 : parseInt(rowsPerPageSplit[2] )

	// const rowsPerPagePosition = rowsPerPage === 15 ? 0 : rowsPerPage === 25 ? 1 : rowsPerPage === 35 ? 2 : 3 
    /* END */

    /* App Calendar */
    const [setOpenNewUserDialog] = React.useState(false);

    const [filterValues, setFilterValues] = React.useState({
		startDate: null,
        endDate: null
    });

    const [focusedInput, setFocusedInput] = useState(null);
	function onDatesChange({ startDate, endDate }) {
		setFilterValues(oldValues => ({
			...oldValues,
			startDate,
			endDate
		}));
	}
	function onFocusChange(f) {
		setFocusedInput(f);
    }
    
    function handleClickOpen() {
        setOpenNewUserDialog(true);
    }

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
        setTableId(event.currentTarget.id)    
    }

    function handleClose() {
        setAnchorEl(null);
        setOpenTab(null)
        setOpen(true)
    }
    /* END */

    /* Styled Menu */
    const [anchorEl, setAnchorEl] = React.useState(null);
	const [tableId, setTableId] = React.useState(null);
 
	const [open, setOpen] = React.useState(true);
	const [openTab, setOpenTab] = React.useState(null);
    /* END */


    return <Query query={ELECTRIC_SALES_QUERY} client={mockClient}>
        {({ loading, data }) => {
             if (loading) return <div/>;
             const {firstPaymentVerification} = data;
             const count = firstPaymentVerification.length
             console.log(firstPaymentVerification)

             return <Grid>
            <Title pageTitle={strings.salesStatistics} />
            
            <Paper className={classes.root} style={{ marginTop: "20px" }}>
            <Grid container>
                <Typography variant='h6'>{strings.salesStatistics}</Typography>
            </Grid>

            <Divider light={true} style={{ marginTop: "2em", marginBottom: "1em" }}/>
            <Grid container alignItems="center" spacing={1}>
                <Grid item container alignItems="center" style={{ marginBottom: "10px" }}>

                    <Grid item >
                        <Typography color="textSecondary">{strings.date}:</Typography>
                    </Grid>
                    <Grid item style={{ marginLeft: 10 }}>
                        <AppDateRangePicker
                            focusedInput={focusedInput}
                            onFocusChange={onFocusChange}
                            onDatesChange={onDatesChange}
                            startDate={filterValues.startDate}
                            endDate={filterValues.endDate}
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

                    <Grid item style={{ marginLeft: 10 }}>
                        <Typography color="textSecondary">abc:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField type="number" variant="outlined" margin="dense" style={{ width: 100, marginLeft: 10, marginRight: 10 }}/>
                    </Grid>

                    <Grid item style={{ marginLeft: 10 }}>
                        <Typography color="textSecondary">abc:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField type="text" variant="outlined" margin="dense" style={{ width: 100, marginLeft: 10 }}/>
                    </Grid>

                    <Grid item style={{ marginLeft: 10, marginRight: 10 }}>
                        <Typography color="textSecondary">{strings.status}:</Typography>
                    </Grid>
                    <Grid item>
                    <Select
                        margin="dense"
                        className={classes.textfield}
                        name="selectStatus"
                        value={strings.operating}
                        input={<OutlinedInput notched={false} name="selectStatus" style={{ width: 100 }}/>}
                    >
                        <MenuItem value={strings.operating}>{strings.operating}</MenuItem>
                        <MenuItem value={strings.status}>{strings.serialNumber}</MenuItem>
                        <MenuItem value={strings.operating}>{strings.operating}</MenuItem>
                    </Select>
                    </Grid>

                    <Grid item style={{ marginLeft: 10, marginRight: 10 }}>
                        <Typography color="textSecondary">{strings.to}:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField type="text" variant="outlined" margin="dense" style={{ width: 70, marginLeft: 10, marginRight: 10 }}/>
                    </Grid>                

                    <GrowItem/>

                    <Grid item>
                        <Button color="primary" className={classes.button}>{strings.to}</Button>
                        <Button color="primary" className={classes.button}>{strings.to}</Button>
                        <Button style={{ width: 100 }} color="primary" variant="contained">{strings.searchFor}</Button>
                    </Grid>

                </Grid>
            </Grid>
            <Grid item>	
            <SimpleTable
                tableProps={{size: "small"}}
                hasPagination={false}
                pagination={pagination}
                pageInfo={false}
                count={count}
                columns={
                    <TableRow>
                        <TableCell>{strings.orderNumber}</TableCell>
                        <TableCell>{strings.memberAccount}</TableCell>
                        <TableCell>{strings.hierarchy}</TableCell>
                        <TableCell>{strings.VIPRating}</TableCell>
                        <TableCell>{strings.withdrawalApplicationTime}</TableCell>
                        <TableCell>{strings.numberOfWithdrawals}</TableCell>
                        <TableCell>{strings.applicationForWithdrawalAmount}</TableCell>
                        <TableCell>{strings.accountBalance}</TableCell>
                        <TableCell>{strings.handlingFee}</TableCell>
                        <TableCell>{strings.administrativeFee}</TableCell>
                        <TableCell>{strings.discountDeduction}</TableCell>
                        <TableCell>{strings.amountOfWithdrawal}</TableCell>
                        <TableCell>{strings.operator}</TableCell>
                        <TableCell>{strings.operatingTime}</TableCell>
                        <TableCell>{strings.operating}</TableCell>
                    </TableRow>
                }
                rows={
                    firstPaymentVerification.length === 0 ? 
                    <TableRow>
                        <TableCell align="center" colSpan={15}>没有可用数据</TableCell>
                    </TableRow>
                    :
                    firstPaymentVerification.slice(page * rowsPerPage , page * rowsPerPage +  rowsPerPage).map((o, index) => {
                        return <TableRow>
                            <TableCell>{o.orderNumber}</TableCell>
                            <TableCell>{o.memberAccount}</TableCell>
                            <TableCell>{o.hierarchy}</TableCell>
                            <TableCell>{o.VIPRating}</TableCell>
                            <TableCell>{o.withdrawalApplicationTime}</TableCell>
                            <TableCell>{o.numberOfWithdrawals}</TableCell>
                            <TableCell>&yen;{o.applicationForWithdrawalAmount}</TableCell>
                            <TableCell>&yen;{o.accountBalance}</TableCell>
                            <TableCell>&yen;{o.handlingFee}</TableCell>
                            <TableCell>&yen;{o.administrativeFee}</TableCell>
                            <TableCell>&yen;{o.discountDeduction}</TableCell>
                            <TableCell>&yen;{o.amountOfWithdrawal}</TableCell>
                            <TableCell>{o.operator}</TableCell>
                            <TableCell>{o.operatingTime}</TableCell>
                            <TableCell>
                                <Grid item>
                                {															 
                                    open ? 
                                        <Button
                                            id={index}
                                            aria-controls={index}
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <MoreVert />
                                        </Button>
                                    : openTab === index ?
                                    <Clear onClick={handleClose} /> : null
                                }
                                    <StyledMenu
                                        tableId={tableId}
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl && tableId === index)}
                                        onClose={handleClose}
                                    >
                                        <StyledMenuItem	onClick={handleClose}>
                                            <ListItemText primary={strings.dialNumber} />
                                        </StyledMenuItem>
                                        <StyledMenuItem onClick={handleClose}>
                                            <ListItemText primary={strings.discountDeduction} />
                                        </StyledMenuItem>
                                        <StyledMenuItem id={index} onClick={handleClickOpen} >
                                            {strings.operator}
                                        </StyledMenuItem>
                                    </StyledMenu>
                                                                                        
                                </Grid>			
                            </TableCell>
                        </TableRow> 
                    })
                }                   
            />
            </Grid>
            </Paper>
        </Grid>

        }}
    </Query>
}