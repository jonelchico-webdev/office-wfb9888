import React, { useState, useEffect, useContext } from 'react';
import {
	Paper,
	Table, 
	TableHead, 
	TableBody,
	TableCell,
	TableRow,
	Grid, 
	Button,
	Select,
	MenuItem,
	OutlinedInput
} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import useLanguages from '../hooks/use-languages';
import {LanguageContext} from '../language-context';
import clsx from 'clsx';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';

const useStyles = makeStyles(theme => ({
	thead: {
		'& tr': {
			'& th': {
				...theme.typography.subtitle2,
				color: theme.palette.text.primary,
				fontSize: '0.8rem',	
				border: "1px solid #e0e0e0"	,				
				textAlign: "center !important"	
			},
			paddingTop: 24,
			paddingBottom: 24,
		}
	},
	enLang: {
		'& tr': {
			'& th': {
				whiteSpace: 'nowrap',
				border: "1px solid #e0e0e0",			
				textAlign: "center !important"	
			},
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
				color: theme.palette.text.primary,
				border: "1px solid #e0e0e0",
				textAlign: "center !important"

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

function TablePaginationActions(props) {
	const classes = useStyles();
	const string = useLanguages('simepleTable')
	const { count, page, rowsPerPage, onChangePage, history, rowsPerPagePosition, url} = props;	

	const paginationArr = []	 
	
	console.log(page)

	for(var i = 1; i <( count / rowsPerPage) + 1 ; i++) {
		paginationArr.push(i)
	}

	const rowsPerPageArr = [15,25,35, 100]
	const [newRowsPerPage, setRowsPerPage] = React.useState(rowsPerPagePosition)
	
	function handleBackButtonClick(event) {
	  onChangePage(event, page - 1);
	}
  
	function handleNextButtonClick(event) {
	  onChangePage(event, page + 1);
	}
	// const newPage = page
	const addPage = paginationArr[page + 1] 
	const minusPage = paginationArr[page - 1]


	function historyPush (newRow){ 
		history.push(`${url}/page=${1}&rows=${rowsPerPageArr[newRow]}`)
	}

	function changeRowsPerPage(event) {
		setRowsPerPage(event.currentTarget.id) 
		historyPush(event.currentTarget.id) 
	} 

	console.log(paginationArr, "simpleeee")
	return (
		<Grid container className={classes.pagination} justify="space-between" alignItems="center">
			<Grid item>
				{string.showing} {page == 0 ? 1 : rowsPerPageArr[newRowsPerPage] * page + 1} {string.to} { count < rowsPerPageArr[newRowsPerPage] ? null : ((page == 0 ? 1 : page + 1) * rowsPerPageArr[newRowsPerPage]) } {count < rowsPerPageArr[newRowsPerPage] ? null : string.of} {count} {string.items}
			</Grid>
			<Grid item>
				<Grid container spacing={1}>
					<Grid item>
						<Select margin="dense"
							name="rowsPerPage"
							value={rowsPerPageArr[newRowsPerPage]}					
							onChange={changeRowsPerPage}
							
							input={<OutlinedInput notched={false} labelWidth={88} name="rowsPerPage" classes={{inputMarginDense: classes.inputMarginDense}}/>}
						>
							{
								rowsPerPageArr.map((o, index) => 
									<MenuItem 
										key={index}
										id={index}
										value={o}
										// onClick={changeRowsPerPage}
									>
										{o}
									</MenuItem>)
							}
						</Select>
					</Grid>

					<Grid item>
						<Button
							classes={{root: classes.button}}
							variant="contained"
							onClick={
								// () => console.log(testPage)
								() => history.push(`${url}/page=1&rows=${rowsPerPageArr[newRowsPerPage]}`)
							}
							disabled={page === 0}
						>
							<FirstPageIcon/>
						</Button>
					</Grid>
					<Grid item>
						<Button
							classes={{root: classes.button}}
							variant="contained"
							onClick={
								// () => console.log(testPage)
								() => history.push(`${url}/page=${minusPage}&rows=${rowsPerPageArr[newRowsPerPage]}`)
							}
							disabled={page === 0}
						>
							<KeyboardArrowLeft/>
						</Button>
					</Grid>
					{
						paginationArr.map((o, index) =>

							<Grid key={index} item>
								<Button
									onClick={
										() => history.push(`${url}/page=${o}&rows=${rowsPerPageArr[newRowsPerPage]}`)
									}
									disabled={page == index}
									classes={{root: classes.button}}
									variant="contained"
								>
									{o}
								</Button>
							</Grid> 							
						)
					}
					<Grid item>
						<Button
							classes={{root: classes.button}}
							variant="contained" 
							onClick={
								// () => console.log(testPage)
								() => history.push(`${url}/page=${addPage }&rows=${rowsPerPageArr[newRowsPerPage]}`)
							}
		  					disabled={page >= Math.ceil(count / rowsPerPageArr[newRowsPerPage]) - 1 || paginationArr.length == 1}
							  aria-label="next page"
						>
							<KeyboardArrowRight/>
						</Button>
					</Grid>
					<Grid item>
						<Button
							classes={{root: classes.button}}
							variant="contained" 
							onClick={
								// () => console.log(testPage)
								() => history.push(`${url}/page=${paginationArr.pop()}&rows=${rowsPerPageArr[newRowsPerPage]}`)
							}
		  					disabled={page >= Math.ceil(count / rowsPerPageArr[newRowsPerPage]) - 1 || paginationArr.length == 1}
							  aria-label="next page"	
						>
							<LastPageIcon/>
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
  }

export default function  SimpeTable(props) {
	const {language} = useContext(LanguageContext);
	const [lang, setLang] = useState(null)

	useEffect(() => {
		setLang(language === "zh-TW" || language === "zh" ? true : false)
	}, [language])
	const { 
		columns,
		rows,
		noBorder,
		hasPagination,
		tableProps,
		page,
		rowsPerPage,
		rowsPerPagePosition,
		count,
		history,
		refresher,
		url,
		cols
	} = props;
	const classes = useStyles();
	

	// console.log('simpletable'+rowsPerPage)
	const emptyRows = rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);
	
	return <Paper elevation={Boolean(noBorder) ? 0 : 1}>
	<Table  {...tableProps}>
		<TableHead className={clsx(classes.thead, {
				[classes.enLang] : lang
			})}> 
			{columns}
		</TableHead>
		<TableBody className={classes.tbody} page={page} rowsPerPage={rowsPerPage} >
			{rows}
			{/* {emptyRows > 0 && (
              <TableRow style={{ height: 2 * emptyRows }}>
                <TableCell colSpan={cols} />
              </TableRow>
            )} */}
		</TableBody>	
	</Table>
	{hasPagination && 
		<TablePaginationActions
			url={url}
			count={count}
			rowsPerPage={rowsPerPage}
			rowsPerPagePosition={rowsPerPagePosition}
			page={page}
			url={url}
			SelectProps={{
				inputProps: { 'aria-label': 'rows per page' },
				native: true,
			}}
			history={history}
			onClickRefresh={refresher}
		/>
		
	}
	</Paper>
}
