import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Flag from 'react-world-flags';
import SimpleDialogDemo from "./customDialog";


let Country = window.require('countrynames');

let counter = 0;
function createData(obj) {
    counter += 1;
    obj.id = counter;
    obj.city = obj.location.city;
    obj.bandwidth = obj.net_speed.download;
    obj.rating = parseFloat(obj.rating).toFixed(2);
    return obj;
}

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const columnData = [
    // { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
    { id: 'flag', numeric: false, disablePadding: false, label: 'Flag' },
    { id: 'city', numeric: false, disablePadding: false, label: 'Location' },
    { id: 'bandwidth', numeric: true, disablePadding: false, label: 'Bandwidth (mbps)' },
    { id: 'latency', numeric: true, disablePadding: false, label: 'Latency (ms)' },
    { id: 'enc_method', numeric: false, disablePadding: false, label: 'Algorithm' },
    { id: 'version', numeric: false, disablePadding: false, label: 'Version' },
    { id: 'rating', numeric: true, disablePadding: false, label: 'Rating' },
    { id: 'price_per_GB', numeric: true, disablePadding: false, label: 'Price (SENTs/GB)' },
];


class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { order, orderBy, classes } = this.props;

        return (
            <TableHead>
                <TableRow>
                    {columnData.map(column => {
                        return (
                            <TableCell
                                key={column.id}
                                numeric={column.numeric}
                                sortDirection={orderBy === column.id ? order : false}
                                padding={"dense"}
                                className={classes.head}
                            >
                                <TableSortLabel
                                    active={orderBy === column.id}
                                    direction={order}
                                    onClick={this.createSortHandler(column.id)}
                                >
                                    {column.label}
                                </TableSortLabel>
                            </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    // numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    // onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    // rowCount: PropTypes.number.isRequired,
};

const alignStyle = theme => ({
    center: {
        textAlign: 'center',
        marginLeft: 25
    },
    head: {
        padding: 15
    }
});

EnhancedTableHead = withStyles(alignStyle)(EnhancedTableHead);


const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
});

let EnhancedTableToolbar = props => {
    const { numSelected, classes } = props;

    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subheading">
                        {numSelected} selected
                    </Typography>
                ) : (
                        <Typography variant="title" id="tableTitle">
                            OpenVPN List
                    </Typography>
                    )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="Delete">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : ''}
            </div>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        height: 365,
        overflowY: 'auto',
    },
    table: {
        // minWidth: 1020,
    },
    tableWrapper: {
        overflowY: 'auto',
    },
    head: {
        padding: 15
    }
});

class EnhancedTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openDialog: false,
            order: 'asc',
            orderBy: 'price_per_GB',
            selected: [],
            city: '',
            country: '',
            speed: 0,
            price: 0,
            latency: 0,
            page: 0,
            rowsPerPage: 5,
            data: {}
        };
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };


    showConnectDialog = async (event, city, country, speed, latency, price_per_GB, vpn_addr) => {

        // let data = [].push()
        await this.setState({
            openDialog: !this.state.openDialog,
            data: {
                'city': city, 'country': country, 'speed': speed,
                'latency': latency, 'price_per_GB': price_per_GB, 'vpn_addr': vpn_addr
            }
        });
    };

    changeDialog = (value) => {
        this.setState({ openDialog: value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { classes } = this.props;
        counter = 0;
        let data = this.props.data.map(obj => {
            return createData(obj);
        });
        const { order, orderBy, } = this.state;

        return (
            <Paper className={classes.root}>
                {/*<EnhancedTableToolbar numSelected={selected.length} />*/}
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            // numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            // onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {
                                data
                                    .sort(getSorting(order, orderBy))
                                    .map(n => {
                                        // const isSelected = this.isSelected(n.id);
                                        return (
                                            <TableRow
                                                hover
                                                onClick={event => this.showConnectDialog(event, n.location.city, n.location.country,
                                                    n.net_speed.download, n.latency, n.price_per_GB, n.account_addr
                                                )}
                                                role="button"
                                                // aria-checked={isSelected}
                                                // tabIndex={-1}
                                                key={n.id}
                                            // selected={isSelected}
                                            >
                                                <TableCell padding="dense" className={classes.head}>
                                                    <Flag code={Country.getCode(n.location.country)} height="16" />
                                                </TableCell>
                                                <TableCell padding="dense" className={classes.head}>
                                                    {`${n.location.city}, `} {n.location.country}
                                                </TableCell>
                                                <TableCell numeric padding="dense" className={classes.head}>
                                                    {(n.net_speed.download / (1024 * 1024)).toFixed(2)}
                                                </TableCell>
                                                <TableCell numeric padding="dense" className={classes.head}>
                                                    {n.latency ? n.latency : 'None'}
                                                    {n.latency ? (n.latency === 'Loading...' ? null : '') : null}
                                                </TableCell>
                                                <TableCell padding="dense" className={classes.head}>
                                                    {n.enc_method ? n.enc_method : 'None'}
                                                </TableCell>
                                                <TableCell padding="dense" className={classes.head}>
                                                    {n.version ? n.version : 'None'}
                                                </TableCell>
                                                <TableCell numeric padding="dense" className={classes.head}>
                                                    {n.rating ? n.rating : 'None'}
                                                </TableCell>
                                                <TableCell numeric padding="dense" className={classes.head}>
                                                    {n.price_per_GB ? n.price_per_GB : 100}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                        </TableBody>
                    </Table>
                    <div style={{ width: 280 }} >
                        <SimpleDialogDemo data={this.state.data} open={this.state.openDialog} onUpdate={this.changeDialog} />
                    </div>
                </div>
            </Paper>
        );
    }
}

EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);