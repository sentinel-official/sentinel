import React, { Component } from 'react';
import { getVPNdetails } from '../Actions/AccountActions';
import star from 'material-ui/svg-icons/toggle/star';

class VPNComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount = () => {
        var that = this;
        getVPNdetails(function (status, data) {
            that.setState({ status: status, vpnData: data });
        })
    }

    render() {
        return (
            <div>
                {this.props.status == true ?
                    <div>
                        <p>IP:{this.props.vpnData.ip}</p>
                        <p>Location:{this.props.vpnData.location}</p>
                        <p>Speed:{this.props.vpnData.speed}</p>
                    </div>
                    :
                    <div>No VPN Connected</div>
                }
            </div>
        )
    }
}

export default VPNComponent;