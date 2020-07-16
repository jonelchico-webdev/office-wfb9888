 
import React, {useState} from 'react';
import {Paper,TableCell, TableRow, Grid, Button, Typography,
    Divider, FormControl, Select, ListItemText,
	Input, MenuItem
} from '@material-ui/core';
import {SimpleTable, DeleteMutateModal, Title, Loading} from '../../../components';
import {makeStyles} from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import {COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT, COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT_ADD, COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT_UPDATE} from '../../../paths';
 
import usePagination from '../../../hooks/use-pagination'; 
import useBankQuery from '../../../queries-graphql/financial-management/bank-query'
import gql from 'graphql-tag'

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2)
    },
}));

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: 200,
			width: 250,
		},
	},
};


// function useData(){
// 	const {data, loading} = useDepositAccountsCursor({depositType: "company"});
// 	if(loading) { 
// 		return null;
// 	}
// 	var dataCursor =  data.deposities.edges;
// 	return dataCursor;
// }

export default function CompanyDepositAccountManagement(props) {

    const classes = useStyles();
    const strings = useLanguages(COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT);
    const {history} = props;
    const [modalOpen, setModalOpen] = useState(false);
    const [mutate, setMutate] = useState(false)
    const [id, setID] = useState({id: ''});
	// const dataCursor = useData()
	 
    function handleDeleteItem(bankID) {
        setModalOpen(true);
        setID({
			id: bankID
		});
    }

    // mutate delete

    const DELETE_BANK_MUTATE = gql` 
		mutation(
			$id: ID,
			$deletedFlag: Boolean
			){
			bank(input:{
				id: $id
				deletedFlag: $deletedFlag
			}) {
				clientMutationId
				errors{
					field
					messages
				}
				bank{
					pk
					id
					bankName
					businessCode
				}
			}
		}
    `


	function mutateRefresh() {
		setMutate(!mutate)
    }
    
    //end mutate delete
        

    const pagination = usePagination();
    const { rowsPerPage, cursor: {before, after} } = pagination;
	

	const {data, loading} = useBankQuery({depositType: "company", deletedFlag: false, mutation: mutate, rowsPerPage, before, after});
    if(loading) { 
        return <Loading />
	} 
    
	const count = data.banks.totalCount
    const depositAccountsPageInfo = data.banks.pageInfo;  
    return <Paper elevation={1} className={classes.paper}>
        <Title pageTitle={strings.companyDepositAccountManagement} />
        <Grid container spacing={2} direction="column">
            <Grid item><Typography variant="h6">{strings.companyDepositAccountManagement}</Typography></Grid>
            <Grid item style={{
                paddingTop: 0,
                paddingBottom: 0
            }}><Divider light={true}/></Grid>
            <Grid item container alignItems="center" spacing={1}>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={() => {
                        history.push(COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT_ADD);
                    }}>{strings.addDepositAccount}</Button>
                </Grid>
            </Grid>
            <Grid item style={{paddingTop: 0}}>
                <SimpleTable
                    tableProps={{size: "small"}}
                    pageInfo={depositAccountsPageInfo}
                    noBorder={true}
					hasPagination={true}
                    count={count} 
					pagination={pagination}
                    // cols={11}
                    columns={
                        <TableRow>
                            <TableCell>{strings.id}</TableCell>
                            <TableCell>{strings.bankName}</TableCell>
                            <TableCell>{strings.accountHolder}</TableCell>
                            <TableCell>{strings.bankAccount}</TableCell>
                            <TableCell>{strings.accountOpeningBranch}</TableCell>
                            <TableCell align="right">{strings.cumulativeAmount}</TableCell>
                            <TableCell align="right">{strings.amountDayDeposit}</TableCell>
                            <TableCell align="right">{strings.automaticDeactivationAmount}</TableCell>
                            <TableCell>{strings.status}</TableCell>
                            <TableCell>{strings.membershipLevel}</TableCell>
                            <TableCell>{strings.actions}</TableCell>
                        </TableRow>
                    }
                    rows={
                        data.banks.edges.length === 0 ? 
						<TableRow>
							<TableCell align="center" colSpan={11}>没有可用数据</TableCell>
						</TableRow>
						:
                        data.banks.edges.map((o, index) => <TableRow key={index}>
                            <TableCell>{o.node.pk ? o.node.pk : "-"}</TableCell>
                            <TableCell>{o.node.bankName ? o.node.bankName : "-"}</TableCell>
                            <TableCell>{o.node.beneficiary ? o.node.beneficiary : "-"}</TableCell>
                            <TableCell>{o.node.bankAccount ? o.node.bankAccount : "-"}</TableCell>
                            <TableCell>{o.node.bankBranch ? o.node.bankBranch : "-"}</TableCell>
                            <TableCell align="right">{o.node.totalAmount ? o.node.totalAmount.toLocaleString('en', {maximumFractionDigits:2}) : '-'}</TableCell>
                            <TableCell align="right">{o.node.todayAmount ? o.node.todayAmount.toLocaleString('en', {maximumFractionDigits:2}) : '-'}</TableCell>
                            <TableCell align="right">{o.node.bankRule.edges.length >= 1 ?
                                o.node.bankRule.edges.map((bankData) => bankData.node.perDayMaxDepositAmount.toLocaleString('en', {maximumFractionDigits:2}) )
                                :
                                '-'
                            }</TableCell>
                            <TableCell>{o.node.status ? o.node.status : "-"}</TableCell>
                            <TableCell>
								<div className={classes.root}>
									<FormControl className={classes.formControl}>
										<Select
											multiple
											displayEmpty
											value={[]}
											input={<Input id="select-multiple-placeholder" />}
                                            // renderValue={selected => { return <em>Available Membership Levels</em> }}
                                            renderValue={selected => 
												o.node.bankRule.edges.length > 0 ?
													o.node.bankRule.edges.map((bankData) =>
														bankData.node.depositLevels.edges.length > 0 ?
															bankData.node.depositLevels.edges.map((o) => {
															return o.node.name + ", "
															})
															:
															"-"
													)
												:
												"-"
											}
                                            MenuProps={MenuProps}
                                            style={{ width: 150 }}
										>
											<MenuItem disabled value="">
												Available Membership Levels
											</MenuItem>
											{
                                                // o.node.bankRule != null ?
                                                //     o.node.bankRule.edges[0] ? 
                                                //         o.node.bankRule.edges[0].node.depositLevels ? 
                                                //             o.node.bankRule.edges[0].node.depositLevels.edges.map((levels) => {
                                                //                 return <MenuItem key={levels.node.name} value={levels.node.name}>
                                                //                     <ListItemText primary={levels.node.name} />
                                                //                 </MenuItem>
                                                //             })
                                                //         : null
                                                //     : null
                                                // : null

                                                o.node.bankRule ?
													o.node.bankRule.edges.map((bankData) =>
														bankData.node.depositLevels ?
															bankData.node.depositLevels.edges.map((o) => {
															return <MenuItem key={o.node.name} value={o.node.name}>
																<ListItemText primary={o.node.name} />
															</MenuItem>
															})
															:
															"-"
													)
												:
												null
                                            }
                                            
										</Select>
									</FormControl>
								</div>
							</TableCell>
                            <TableCell>
                                <Grid container spacing={1} direction="row" style={{width: 160}}>
                                    <Grid item><Button size="small" variant="contained" color="primary" onClick={() => history.push(`${COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT_UPDATE}/${o.node.id}`)}>{strings.update}</Button></Grid>
                                    <Grid item><Button size="small" onClick={() => handleDeleteItem(o.node.id)} >{strings.delete}</Button></Grid>
                                </Grid>
                            </TableCell>
                        </TableRow>)
                      }
                />
            </Grid>
        </Grid>
        {/* <ContinueCancelModal open={modalOpen} setOpen={setModalOpen}  title={strings.deleteModalTitle}/> */}
        <DeleteMutateModal mutate={mutate} setMutate={setMutate} idMutate={id} mutateQuery={DELETE_BANK_MUTATE} open={modalOpen} setOpen={setModalOpen} title={strings.deleteModalTitle}/>
    </Paper>
}

