const accountStyles = {
    cardStyle: {
        width: '70%',
        minHeight: 245,
        fontFamily: 'Montserrat',
        textAlign: 'center',

    },
    formVpnStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 430 // changed from 474
    },
    formStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 380 // changed from 474
    },

    sendFormStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
       marginTop:70, // changed from 474
    },
    titleStyle: {
        color: '#3f3f94',
        fontWeight: 500,
        fontSize: 20,
        textAlign: 'center'
    },
    addressStyle: {
        // width: '94%',
        // textOverflow: 'ellipsis',
        // overflow: 'hidden',
        // whiteSpace: 'nowrap'
        color: '#272727',
        fontWeight:'bold',
    },
    clipBoard: {
        height: 18,
        width: 18,
        color: '#5ca1e8',
        cursor: 'pointer',
        // marginTop: '-10%'
        marginBottom:3,
        marginLeft:3,
    },
    balanceStyle: {
        // padding: 15,
        fontWeight: 'bold',
        fontSize: 20,
        color: '#5ca1e8'
    },
    notInNetStyle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#5ca1e8'
    },
    notInNetStyle1: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#5ca1e8',
        borderRight: '1px solid #cec8c8'
    },
    tsentRow:{
        textAlign:'center'
    },
    tsentValue:{
        textAlign:'center'
    },
    tsentValue1:{
        textAlign:'center',
        borderRight: '1px solid #cec8c8'

    },
    qrCodeStyle: {
        width: 250,
        marginBottom:10
    },

    vpnQrCodeStyle: {
        width: 250,
        marginBottom:10
    },
    normalQrStyle:{
        marginBottom:1,
    },
    outlineNone: {
        outline: 'none'
    },
    lastDiv: {
        marginTop: 8
    }
}

module.exports = {
    accountStyles
}