import React, { Component } from 'react';

class Swixer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <iframe src="https://swixer.sentinelgroup.io" style={{ width: '100%', height: '100%', border: 0 }}>
            </iframe>
        )
    }
}

export default Swixer;