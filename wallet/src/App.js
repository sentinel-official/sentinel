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
        document.getElementById('home').style.display = 'none';
        var that = this;
        checkKeystore(function (err) {
            setTimeout(function () {
                if (err) that.setState({ scene: 'home' });
                else that.setState({ scene: 'authenticate' });
            }, 3000);
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
                return <div style={{ backgroundColor: '#1e1e1e', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <img src='../src/Images/logo.jpeg' style={{ width: 150, height: 150 }} />
                    <p style={{ fontSize: 40, color: 'white' }}>Sentinel Security Group</p>
                    <img src='../src/Images/loading_home.gif' style={{}} />
                </div>
        }
    }
}
export default App;