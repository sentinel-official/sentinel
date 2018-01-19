import React, { Component } from 'react';
import Home from './Components/Home';
import Create from './Components/Create';
import Dashboard from './Components/Dashboard';
import {checkKeystore} from './Actions/AccountActions';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scene: null
        }
    }
    componentWillMount=()=>{
        var that = this;
        checkKeystore(function (err) {
            if (err) that.setState({scene:'home'});
            else that.setState({scene:'dashboard'});
        })   
    }

    setComponent=(name)=>{
        this.setState({scene:name})
    }

    render() {
        let scene = this.state.scene;
        switch (scene) {
            case 'create':
                return <Create set={this.setComponent} />
            case 'dashboard':
                return <Dashboard set={this.setComponent} />
            case 'home':
                return <Home set={this.setComponent} />
            default:
                return <Home set={this.setComponent} />
        }
    }
}
export default App;