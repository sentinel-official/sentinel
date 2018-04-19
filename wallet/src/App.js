import React, { Component } from 'react';
import Home from './Components/Home';
import Create from './Components/Create';
import Dashboard from './Components/Dashboard';
import Authenticate from './Components/Authenticate';
import { checkKeystore } from './Actions/AccountActions';
const { ipcRenderer } = window.require('electron');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scene: null,
            lang: 'en'
        }
    }
    componentWillMount = () => {
        var that = this;
        checkKeystore(function (err) {
            if (err) that.setState({ scene: 'home' });
            else that.setState({ scene: 'authenticate' });
        })
    }

    componentDidMount = () => {
        let self = this;
        ipcRenderer.on('lang', (event, arg) => {
            self.setState({ lang: arg })
        })
    }

    setComponent = (name) => {
        this.setState({ scene: name })
    }

    render() {
        let scene = this.state.scene;
        switch (scene) {
            case 'create':
                return <Create set={this.setComponent} lang={this.state.lang} />
            case 'authenticate':
                return <Authenticate set={this.setComponent} lang={this.state.lang} />
            case 'dashboard':
                return <Dashboard set={this.setComponent} lang={this.state.lang} />
            case 'home':
                return <Home set={this.setComponent} lang={this.state.lang} />
            default:
                return null
        }
    }
}
export default App;