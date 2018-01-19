import React, { Component } from 'react';
import { getVPNdetails } from '../Actions/AccountActions';
import star from 'material-ui/svg-icons/toggle/star';

class VPNComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vpnData: this.props.vpnData,
            status: this.props.status
        }
    }

    componentWillMount = () => {
        var that = this;
        getVPNdetails(function (status, data) {
            that.setState({ status: status, vpnData: data });
        })
    }

    render() {
      console.log(this.state, 'consoled')
        return (
            <idiv>
                {this.state.status == true ?
                    <div>
                        <p>IP:{this.state.vpnData.ip}</p>
                        <p>Location:{this.state.vpnData.location}</p>
                        <p>Speed:{this.state.vpnData.speed}</p>
                    </div>
                    :
                    <div>No VPN Connected</div>
                }
            </idiv>
        )
    }
}

export default VPNComponent;