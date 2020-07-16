import React, { useState } from 'react';
import {
	Paper, TableCell, TableRow, Grid, Button,
	Divider
} from '@material-ui/core';
import { SimpleTable, Loading, DeleteMutateModal } from '../../components';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import { WALLET_MANAGEMENT } from '../../paths';
import Title from '../../components/title';
import {NewWalletModal} from '../../components';
import useWalletManagementGql from '../../queries-graphql/financial-management/wallet-management-gql'
import usePagination from '../../hooks/use-pagination'; 
import gql from 'graphql-tag'

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
    }
}));

export default function WalletManagement(props) {
	const classes = useStyles();
	const strings = useLanguages(WALLET_MANAGEMENT);
    const pagination = usePagination();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenDelete, setModalOpenDelete] = useState(false);
    const [methodEdit, setMethodEdit] = useState(false);
    const [walletData, setWalletData] = useState([])
    const [mutate, setMutate] = React.useState(false)
    const [deleteID, setDeleteID] = React.useState({id: null})
    
    function addWalletHandle() {
		setModalOpen(true);
        setMethodEdit(false);
    }

    function editWalletHandle(data) {
        setModalOpen(true);
        setMethodEdit(true);
        setWalletData(data)
    }

    function deleteWalletHandle(id) {
        setModalOpenDelete(true);
        setDeleteID({id: id})
    }

    const DELETE_WALLET = gql`
		mutation Wallet($id: ID, $deletedFlag: Boolean){
			gameWallet(input: {
				id: $id
				deletedFlag: $deletedFlag
			}){
				errors{
					field
				}
			}
	  }
    `
    
	const { rowsPerPage, cursor: { before, after } } = pagination;
    const { data, loading } = useWalletManagementGql({mutation: mutate, rowsPerPage, before, after});

	if (loading) {
		return <Loading />;
    }
    
	const walletPageInfo = data.gameWallets.pageInfo;   
    const count = data.gameWallets.totalCount; 
    console.log(data)

	return <Paper elevation={1}>
		<Title pageTitle={strings.pageTitle} />
        <Grid container className={classes.paper}>
            <Button color="primary" variant="contained" onClick={addWalletHandle}>{strings.addWallet}</Button>
        </Grid>
        <Divider light={true}/>
        <Grid item className={classes.paper}>
            <SimpleTable
                tableProps={{ size: "small" }}
                hasPagination={true}
                pagination={pagination}
                pageInfo={walletPageInfo}
                count={count}
                noBorder={true}
                cols={14}
                columns={
                    <TableRow>
                        <TableCell align="center">{strings.serialNumber}</TableCell>
                        <TableCell align="center">{strings.walletName}</TableCell>
                        <TableCell align="center">{strings.walletType}</TableCell>
                        <TableCell align="center">{strings.whetherToDisplay}</TableCell>
                        <TableCell align="center">{strings.sortWeight}</TableCell>
                        <TableCell align="center">{strings.classification}</TableCell>
                        {/* <TableCell>{strings.imageFile}</TableCell> */}
                        <TableCell align="center">{strings.whetherToMaintain}</TableCell>
                        <TableCell align="center">{strings.setting}</TableCell>
                        <TableCell >{strings.walletID}</TableCell>
                    </TableRow>
                }
                rows={
                    data.gameWallets.edges.length === 0 ? 
                    <TableRow>
                        <TableCell align="center" colSpan={9}>没有可用数据</TableCell>
                    </TableRow>
                    :
                    data.gameWallets.edges.map((item, idx) => <TableRow key={idx}>
                        <TableCell>{item.node.pk ? item.node.pk : null}</TableCell>
                        <TableCell>{item.node.name ? item.node.name : ''}</TableCell>
                        <TableCell align="center">{item.node.type ? item.node.type.toLowerCase() : ''}</TableCell>
                        <TableCell  align="center">{item.node.enabled ? item.node.enabled ? strings.yes : strings.no : null}</TableCell>
                        <TableCell align="center">{item.node.weight ? item.node.weight : ''}</TableCell>
                        <TableCell align="center">{item.node.category ? item.node.category : ''}</TableCell>
                        {/* <TableCell>{
                                    item.node.picUrlPc != '' ? 
                                    <Avatar alt="Profile Picture" src="/profile.jpeg" className={classes.avatar}/> 
                                    : 
                                    <Avatar style={{backgroundColor: '#80cbc4'}} onClick={() => editWalletHandle(item.node)}>
											<AddAPhoto/>
                                    </Avatar>
                                }
                        </TableCell> */}
                        <TableCell align="center">{item.node.maintance? strings.yes : strings.no }</TableCell>
                        <TableCell>
                            <Grid container spacing={1} direction="row" justify="center">
                                <Grid item><Button size="small" variant="contained" color="primary" onClick={() => editWalletHandle(item.node)}>{strings.modify}</Button></Grid>
                                <Grid item><Button size="small" variant="contained" color="secondary" onClick={() => deleteWalletHandle(item.node.id)}>{strings.delete}</Button></Grid>
                            </Grid>
                        </TableCell>
                        <TableCell>{item.node.id}</TableCell>
                    </TableRow>
                )}
            />
        </Grid>
        <DeleteMutateModal mutate={mutate} setMutate={setMutate} idMutate={deleteID} mutateQuery={DELETE_WALLET} open={modalOpenDelete} setOpen={setModalOpenDelete} title="您确定要删除此钱包吗"/>
        <NewWalletModal open={modalOpen} setOpen={setModalOpen} mutate={mutate} setMutate={setMutate}
            addWallet={strings.addWallet} walletName={strings.walletName} 
            walletType={strings.walletType} whetherToMaintain={strings.whetherToMaintain} 
            whetherToDisplay={strings.whetherToDisplay} classification={strings.classification} 
            imageFile={strings.imageFile} sortWeight={strings.sortWeight} no={strings.no}
            yes={strings.yes} upload={strings.upload} eletronicWallet={strings.eletronicWallet}
            remove={strings.delete} confirm={strings.confirm} methodEdit={methodEdit} modifyWallet={strings.modifyWallet} walletData={walletData}/>
	</Paper>
}