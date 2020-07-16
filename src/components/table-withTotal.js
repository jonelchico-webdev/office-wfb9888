import React, { useState, useEffect } from 'react';
import { Paper, Table, TableHead, TableBody, Grid, Button, Select, MenuItem, OutlinedInput, TableRow, TableCell } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../hooks/use-languages';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';

const useStyles = makeStyles(theme => ({
	thead: {
		'& tr': {
			'& th': {
				...theme.typography.subtitle2,
				color: theme.palette.text.primary
			}
		}
	},
	tbody: {
		'& tr': {
			'&:nth-child(even)': {
				backgroundColor: '#f5f7fa'
			},
			'&:hover': {
				backgroundColor: '#BDD6F9 !important',
				transition: 'all .3s,border 0s',
				transitionProperty: 'all, border',
				transitionDuration: '0.3s, 0s',
				transitionTimingFunction: 'ease, ease',
				transitionDelay: '0s, 0s'
			},
			'& td': {
				...theme.typography.body1,
				color: theme.palette.text.primary
			}
		}
	},
	pagination: {
		marginTop: theme.spacing(2),
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1)
	},
	button: {
		...theme.typography.body1,
		minWidth: 36
	},
	select: {
		...theme.typography.body1,
		maxHeight: "36px"
	},
	inputMarginDense: {
		paddingTop: 10.5,
		paddingBottom: 7.5
	},

}));

export default function TableWithTotal(props) {
	const strings = useLanguages('simepleTable')
	const { columns, rows, noBorder, hasPagination, tableProps, pageInfo, totalReceivingAmount, pagination, count, totalPerPage } = props;

	const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange, handleOnClickPrevious, handleOnClickNext, cursor: { before, after }, } = pagination;

	const classes = useStyles();

	const paginationArr = []

	// const emptyRows = rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);

	const totalPages = Math.ceil(count / rowsPerPage)

	for (let i = 1; i < totalPages + 1; i++) {
		paginationArr.push(parseInt(i))
	}
	let paginationComponent = null;


	const [startPage, setStartPage] = useState(null);
	const [endPage, setEndPage] = useState(null);
	const currentPage = page + 1

	useEffect(() => {
		if (totalPages <= 10) {
			setStartPage(1)
			setEndPage(totalPages)
		} else {
			if (currentPage <= 6) {
				setStartPage(1)
				setEndPage(10)
			} else if (currentPage + 4 >= totalPages) {
				setStartPage(totalPages - 9)
				setEndPage(totalPages)
			} else {
				setStartPage(currentPage - 5)
				setEndPage(currentPage + 4)
			}
		}
	}, [currentPage, rowsPerPage, totalPages])

	if (hasPagination && pageInfo && pagination) {
		paginationComponent = <Grid container className={classes.pagination} justify="space-between" alignItems="center" spacing={2}>
			<Grid item>
				{strings.showing} {page === 0 && count !== 0 ? 1 : count === 0 ? count : rowsPerPage * page + 1} {strings.to} {count < rowsPerPage ? null : ((page + 1) * rowsPerPage) > count ? count : ((page + 1) * rowsPerPage)} {count < rowsPerPage ? null : strings.of} {count} {count !== 0 ? strings.items : strings.item}
				{/* 显示1到10的57个条目 */}
			</Grid>

			<Grid item>
				<Grid container spacing={1} alignItems="center">
					<Grid item>
						{strings.show}
					</Grid>
					<Grid item>
						<Select margin="dense"
							variant="outlined"
							classes={{ root: classes.select }}
							name="rowsPerPage"
							value={rowsPerPage}
							onChange={handleRowsPerPageChange}
							input={<OutlinedInput notched={false} labelWidth={88} name="rowsPerPage" classes={{ inputMarginDense: classes.inputMarginDense }} />}
						>
							{[15, 25, 35, 100].map((o, index) => <MenuItem key={index} value={o}>{o}</MenuItem>)}
						</Select>
					</Grid>
					<Grid item style={{ marginRight: 20 }}>
						{strings.item}
					</Grid>
					<Grid item >
						<Grid container diection="row" spacing={1}>

							<Grid item>
								<Button size="small" classes={{ root: classes.button }} variant="contained"
									disabled={after ? false : !pageInfo.hasPreviousPage}
									// 
									onClick={handlePageChange(0)}
								><FirstPageIcon /></Button>
							</Grid>
							<Grid item>
								<Button size="small" classes={{ root: classes.button }} variant="contained"
									disabled={after ? false : !pageInfo.hasPreviousPage}
									// 
									onClick={handleOnClickPrevious(pageInfo.startCursor)}
								><KeyboardArrowLeft /></Button>
							</Grid>
							{
								paginationArr.slice(startPage - 1, endPage).map((o, index) => {
									return <Grid key={index} item>
										<Button size="small" classes={{ root: classes.button }} color={o === page + 1 ? "primary" : "textSecondary"} variant="contained" onClick={handlePageChange(o - 1)} >{o}</Button>
									</Grid>
								})
							}
							<Grid item>
								<Button size="small" classes={{ root: classes.button }} variant="contained"
									disabled={before ? false : !pageInfo.hasNextPage}
									// 
									onClick={handleOnClickNext(pageInfo.endCursor)}
								><KeyboardArrowRight /></Button>
							</Grid>
							<Grid item>
								<Button size="small" classes={{ root: classes.button }} variant="contained"
									disabled={before ? false : !pageInfo.hasNextPage}
									// 
									onClick={handlePageChange(paginationArr.pop() - 1)}
								><LastPageIcon /></Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	}
	return <Paper elevation={Boolean(noBorder) ? 0 : 1}>
		<Table {...tableProps}>
			<TableHead className={classes.thead}>
				{columns}
			</TableHead>
			<TableBody className={classes.tbody} >
				{rows}
				<TableRow>
					<TableCell align="right" colSpan={7}>小计 ： 当前页共 {totalPerPage} 条</TableCell>
					<TableCell colSpan={7}>{totalReceivingAmount}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell align="right" colSpan={7}>合计 ： 当前条件共 {totalPerPage} 条</TableCell>
					<TableCell colSpan={7}>{totalReceivingAmount}</TableCell>
				</TableRow>
			</TableBody>
		</Table>
		{paginationComponent}
	</Paper>

}
