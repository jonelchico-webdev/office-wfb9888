import React from 'react';
import { ButtonGroup, Paper, TableCell, TableRow, Grid, Button, Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { SimpleTable } from '../../../components';
import useLanguages from '../../../hooks/use-languages';
import Title from '../../../components/title';
import { VIP_WELFARE_CONFIGURATION, CONSUMPTION_BACKWATER, BASIC_GIFT_SETTING, WINNING_PRIZE, TRANSFER_GOLD } from '../../../paths';
import { AddCircle, CreateOutlined, RemoveCircle } from '@material-ui/icons/';
import usePagination from '../../../hooks/use-pagination'

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
}));

export default function ConsumptionBackwater(props) {
    const classes = useStyles();
    const strings = useLanguages(VIP_WELFARE_CONFIGURATION);
    const { history } = props;

    const [editButton, setEdit] = React.useState(true)

    const [editColor, setColor] = React.useState({
        color: "inherit"
    })
    const pagination = usePagination()

    const [rows, setRows] = React.useState([1])

    function addRow() {
        setRows([...rows, 2])
    }

    function remRow(idx) {
        const currentRows = [...rows]
        currentRows.splice(idx, 1)
        setRows(currentRows)
    }

    function editClick() {
        if (editButton == true && editColor.color == "inherit") {
            setEdit(false)
            setColor({ color: "primary" })
        } else {
            setEdit(true)
            setColor({ color: "inherit" })
        }
    }

    return <Grid>
        <Title pageTitle={strings.vipWelfareConfiguration} />
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <ButtonGroup fullWidth aria-label="full width outlined button group">
                    <Button style={{ backgroundColor: "white" }} onClick={() => { history.push(VIP_WELFARE_CONFIGURATION) }}>{strings.giftOpeningClosingSettings}</Button>
                    <Button style={{ backgroundColor: "white" }} onClick={() => { history.push(BASIC_GIFT_SETTING) }}>{strings.basicGiftSetting}</Button>
                    <Button style={{ backgroundColor: "white" }} onClick={() => { history.push(CONSUMPTION_BACKWATER) }}>{strings.consumptionBackwater}</Button>
                    <Button style={{ backgroundColor: "white", color: "blue", borderColor: "blue", marginRight: '0.1rem' }} onClick={() => { history.push(WINNING_PRIZE) }}>{strings.winningPrize}</Button>
                    <Button style={{ backgroundColor: "white" }} onClick={() => { history.push(TRANSFER_GOLD) }}>{strings.transferGold}</Button>
                </ButtonGroup>
            </Grid>
        </Grid>
        <Paper className={classes.root} style={{ marginTop: "20px" }}>
            <Grid container justify="space-between">
                <Grid item style={{ marginBottom: "10px" }}>
                    <Grid alignItems="center" container>
                        <Typography>{strings.giftGoldAuditingMultiple}:</Typography>
                        <TextField type="number" variant="outlined" margin="dense" style={{ width: 70, marginLeft: 5 }} />
                        <Button onClick={editClick}><CreateOutlined color={editColor.color} /></Button>
                    </Grid>
                </Grid>
                <Grid item style={{ marginBottom: "10px" }}>
                    <Button variant="contained" color="primary" >{strings.save}</Button>
                </Grid>
            </Grid>
            <Grid item>
                <SimpleTable
                    hasPagination={false}
                    pagination={pagination}
                    pageInfo={false}
                    columns={
                        <TableRow>
                            <TableCell>{strings.grade}</TableCell>
                            <TableCell>{strings.rankName}</TableCell>
                            <TableCell>{strings.consumerGift}</TableCell>
                        </TableRow>
                    }

                    rows={<TableRow key="asdasdad">
                        <TableCell style={{ width: '20%' }}>{0}</TableCell>
                        <TableCell style={{ width: '20%' }}>VIP0</TableCell>
                        <TableCell style={{ width: '60%' }}>
                            {rows.map((o, index) => {
                                return (
                                    <Grid container>
                                        <Grid item md={6}>
                                            <Grid item>
                                                <Typography>
                                                    {strings.effectiveBet} &gt;=
                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    variant="outlined"
                                                    margin="dense"
                                                    name="accountNumber"
                                                    style={{ backgroundColor: "white" }}
                                                    disabled={editButton}
                                                    value={o.name}
                                                >
                                                </TextField>
                                            </Grid>
                                        </Grid>

                                        <Grid item md={6}>
                                            <Grid item>
                                                <Typography>
                                                    {strings.canGetWater}
                                                </Typography>
                                            </Grid>
                                            <Grid container alignItems="center" >
                                                <Typography style={{ fontSize: "16px", marginRight: "0.5rem", }}> &#xa5; </Typography>
                                                <Grid style={{ width: "20%" }}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="dense"
                                                        name="accountNumber"
                                                        style={{ backgroundColor: "white" }}
                                                        disabled={editButton}
                                                        value={o.name}
                                                    >
                                                    </TextField>
                                                </Grid>
                                                <Typography style={{ marginLeft: "1rem" }}>{strings.either}</Typography>
                                                <Grid style={{ width: "20%", marginLeft: "1rem" }}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="dense"
                                                        name="accountNumber"
                                                        style={{ backgroundColor: "white" }}
                                                        disabled={editButton}
                                                        value={o.name}
                                                    >
                                                    </TextField>
                                                </Grid>

                                                <Typography style={{ marginLeft: "0.5rem" }} >%</Typography>
                                                <Typography style={{ marginLeft: "0.5rem" }} >
                                                    {
                                                        index == 0 ?
                                                            <Button onClick={addRow}>
                                                                <AddCircle />
                                                            </Button>
                                                            :
                                                            <Button onClick={() => remRow(index)}>
                                                                <Typography style={{ color: 'red' }}><RemoveCircle /></Typography>
                                                            </Button>

                                                    }
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                )
                            })}

                        </TableCell>
                    </TableRow>
                    }
                />
            </Grid>
        </Paper>
    </Grid>
}