import React, { Component } from 'react';
import style from 'material-ui/svg-icons/image/style';
import CopyToClipboard from 'react-copy-to-clipboard';
var shell = window.require('electron').shell;

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{
                from_addr: '0xd5adb4110eb07e49ef8c38881a3ffda229ca2648',
                to_addr: '0xa774becc16cacdc6d687934eb37e43a532a6ddc54',
                amount: '100',
                unit: 'SENT',
                tx_hash: '0x1b04f90342850bf7926d1fc659e1dd61294edc395e16642182b56bb34dca635d',
                status: 'Success',
                date: '01-01-2018 10:00 PM'
            },
            {
                from_addr: '0xa774becc16cacdc6d687934eb37e43a532a6ddc5',
                to_addr: '0xd5adb4110eb07e49ef8c38881a3ffda229ca2648',
                amount: '100',
                unit: 'ETH',
                tx_hash: '0x8d5a00917bd3359c14ef9d01aecf492fbc2acaaf9150303cffd337f30f443569 ',
                status: 'Success',
                date: '01-01-2017 10:00 PM'
            }
            ],
            account_addr: '0xd5adb4110eb07e49ef8c38881a3ffda229ca2648'
        }
    }
    openInExternalBrowser(url) {
        shell.openExternal(url);
    };

    render() {
        let output;
        let that = this;
        let data = this.state.data;
        output = data.map((history) => {
            return (
                <div
                    style={styles.wholeDiv}>
                    {
                        history.from_addr == that.state.account_addr
                            ?
                            <div>
                                <div>
                                    <span style={{ color: 'red' }}>OUT </span>
                                    <span>{history.date}</span>
                                </div>
                                <div>
                                    <span style={{ fontWeight: 'bold' }}>To : </span><a onClick={
                                        () => {
                                            this.openInExternalBrowser(`https://etherscan.io/address/${history.to_addr}`)
                                        }}>{history.to_addr}</a>
                                    <CopyToClipboard text={history.to_addrs}>
                                        <img src={'../src/Images/download.jpeg'}
                                            style={styles.clipBoard} />
                                    </CopyToClipboard>
                                </div>
                            </div>
                            :
                            <div>
                                <div>
                                    <span style={{ fontWeight: 'bold' }}>IN </span>
                                    <span>{history.date}</span>
                                </div>
                                <div>
                                    <span>From: </span>
                                    <a onClick={
                                        () => {
                                            this.openInExternalBrowser(`https://etherscan.io/address/${history.from_addr}`)
                                        }}>{history.from_addr}</a>
                                    <CopyToClipboard text={history.from_addr}>
                                        <img src={'../src/Images/download.jpeg'}
                                            style={styles.clipBoard} />
                                    </CopyToClipboard>
                                </div>
                            </div>
                    }
                    <pre style={{ marginTop: 0, fontFamily: 'Poppins' }}>
                        <span style={{ fontWeight: 'bold' }}>Amount : </span><span>{history.amount} </span>
                        <span>{history.unit}s</span>  |
                    <span style={{ fontWeight: 'bold' }}> Status : </span><span>{history.status}</span>  |
                    <span style={{ fontWeight: 'bold' }}> Tx : </span>
                        <a onClick={
                            () => {
                                this.openInExternalBrowser(`https://etherscan.io/tx/${history.tx_hash}`)
                            }}>{history.tx_hash}</a></pre>
                </div>
            )
        })
        return (
            <div style={{ margin: '5%' }}>
                {output}
            </div>
        )
    }
}

const styles = {
    wholeDiv: {
        fontSize: 14,
        marginBottom: '5%',
        fontWeight: '400',
        color: 'rgba(0, 0, 0, 0.66)'
    },
    clipBoard: {
        height: 20,
        width: 20,
        cursor: 'pointer'
    },
}

export default History;