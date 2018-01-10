import React, { Component } from 'react';
import { Toolbar, ToolbarGroup, FlatButton } from 'material-ui';

export default class Footer extends Component {
    render() {
        return (
            <div>
                <Toolbar style={{ backgroundColor: 'rgb(83, 45, 145)', bottom: 0, position: 'absolute' }}>
                    <h4 style={{ textAlign: 'center', color: 'white' }}>Sentinel@2018</h4>
                    {/* <ToolbarGroup>
                        <FlatButton label="About" labelStyle={{ color: 'white', textTransform: 'none' }} />
                        <FlatButton label="Services" labelStyle={{ color: 'white', textTransform: 'none' }} />
                        <FlatButton label="White Paper" labelStyle={{ color: 'white', textTransform: 'none' }} />
                        <FlatButton label="Privacy Policies" labelStyle={{ color: 'white', textTransform: 'none' }} />
                        <FlatButton label="FAQs" labelStyle={{ color: 'white', textTransform: 'none' }} />
                    </ToolbarGroup> */}
                </Toolbar>
            </div>
        )
    }
}