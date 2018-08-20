import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EnhancedTable from "./customTable";
let Country = window.require('countrynames');

class VpnListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedList: []
        }
    }

    componentWillReceiveProps(nextProps) {

            let list = nextProps.availableVpns;
            list = list.filter(function (item) {
                return (item.location.city.toLowerCase().search(
                    nextProps.query.toLowerCase()
                ) !== -1) || (item.location.country.toLowerCase().search(
                    nextProps.query.toLowerCase()
                ) !== -1);
            });
            this.setState({ updatedList: list });
    }

    componentDidMount() {
        this.setState({ updatedList: this.props.availableVpns });

    }


    render() {
        console.log('dvpn query', this.props.query);
        let language = this.props.lang;
        let vpnsList = this.state.updatedList;

        return (
            <div>
                {
                    vpnsList.length !== 0 ?
                        <EnhancedTable data={this.props.availableVpns} />
                        :
                        <div>No dVPN nodes found</div>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        availableVpns: state.getVpnList
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(VpnListView);