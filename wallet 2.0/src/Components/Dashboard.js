import React, { Component } from 'react';
import Header from './Header';
import { getAccount } from '../Actions/dashboard.action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scene: null,
            lang: 'en'
        }
    }

    componentWillMount = () => {
        this.props.getAccount();
    }
    render() {
        return (<div>
            <Header />
        </div>)
    }
}

function mapStateToProps(state) {
    return {
        walletAddress: state.getAccount
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        getAccount
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(Dashboard);