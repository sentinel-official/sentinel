const sessionStyles = {
    outlineNone: {
        outline: 'none'
    },
    firstDiv: {
        padding: '2%'
    },
    buttonRefresh: {
        borderRadius: 50,
        border: 0,
        transition: '2000',
        float: 'right',
        color: '#707070',
        outline: 'none',
        margin: '-40px 20px 0px 0px'
    },
    noSessionsStyle: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '17%',
        fontSize: '25px',
        color: '#c3c3c3'
    },
    noTransactionsStyle: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '20%',
        fontSize: '25px',
        color: '#c3c3c3'
    },
    cardtext: {
        paddingLeft: '0px !important',
        fontSize: '14px',
        color: '#919191'
    },
    headingStyle: {
        fontWeight: 600,
        fontSize: '14px',
        color: 'rgb(61,66,92)'
    },
    textStyle:{
        color:'grey'
    },
    header: {
        fontSize: '18px',
        fontWeight: '600',
        color: 'black',
        textTransform: 'uppercase',
        letterSpacing: '1.2px'
    },
    headingWithMarginStyle: {
        fontWeight: 600,
        marginLeft: 10,
        fontSize: '14px',
        color: 'rgb(61,66,92)'
    },
    clipBoard: {
        height: 20,
        width: 20,
        cursor: 'pointer',
        paddingLeft:3,
        color:'#5ca1e8',
    },
    history: {
        maxHeight: '425px',
        width: '100%',
        overflow: 'auto'
    },
    cardStyle:{
        boxShadow: ' 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)' 
    }

    
}

module.exports = {
    sessionStyles
}