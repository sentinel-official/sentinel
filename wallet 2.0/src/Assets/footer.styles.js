const footerStyles = {
    mainDivStyle: {
        backgroundColor: '#0c2940', //changing footer backgound #54609a
        // background: 'linear-gradient(to right, rgb(47, 50, 69))',
        // backgorund:'#04091a',

        // background:'radial-gradient(circle at 49.41% 1.55%, rgb(61, 0, 76), transparent 100%), radial-gradient(circle at 47.95% 97.06%, rgb(9, 49, 140), transparent 100%), radial-gradient(circle at 50% 50%, rgb(126, 145, 213), rgb(4, 9, 26) 100%) 50% center no-repeat',
       
        backgroundImage: 'linear-gradient(-90deg, #023B66, #241E4A)',
        height: '100vh',
        paddingTop: 10,
        paddingRight: 25,
        paddingLeft: 10,
        bottom: 0
    },
    testLabelStyle: {
        color: '#FAFAFA',
        textTransform: 'none',
        fontSize: 14
    },
    firstColumn: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 55,
        marginTop: 3,
        padding: 0,
    },
    headingStyle: {
        color: '#FAFAFA',
        textTransform: 'none',
        fontSize: 12,
        marginBottom: 0,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    valueStyle: {
        color: '#efb77c',
        textTransform: 'none',
        fontSize: 14,
        marginBottom: 0,
        textAlign: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    textCenter: {
        textAlign: 'left'
    },
    vpnConnected:{
        padding:0,
        textAlign:'center',
    },
    disconnectStyle: {
        color: '#fff',
        background:'#e74d4d',
        // marginLeft: 30,
        marginTop: 3,
        marginLeft:31,
        fontSize:14,
       
      
        // minHeight: 30
    },
    // disconnectText:{
    //     marginRight:5
    // },
    crossMark:{
        width:20,
        marginLeft: 5,
    },
    greenDot: {
        width: 10,
        borderRadius: 50,
        background: 'green',
        display: 'inline-block',
        height: 10,
        marginRight: 5,
        animationName: 'blink',
        animationDuration: '2s',
        animationIterationCount: 'infinite',
        animationFillMode: 'both',
        position:'relative',
        top:21,
        marginLeft:20,

    },
    name:{
        marginLeft:-15,
    },

    activateTestNet:{
        marginLeft:5,
        color:'white'
    },
    activated:{
        display:'block',
        marginLeft:35,
        color: '#efb77c'
    },

    redDot: {
        width: 10,
        borderRadius: 50,
        background: '#ea4e4e',
        display: 'inline-block',
        height: 10,
        marginRight: 5,
        animationName: 'blink',
        animationDuration: '2s',
        animationIterationCount: 'infinite',
        animationFillMode: 'both',


    }

}

module.exports = {
    footerStyles
}