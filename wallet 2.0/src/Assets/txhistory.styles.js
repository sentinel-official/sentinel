const historyStyles = {
    margin: {
        marginLeft: 10,
        marginRight: 10,
    },
    historyContainer: {
        overflowY: 'auto',
        height: 450,
        flexDirection: 'column',
        paddingLeft: '45px',
        display: 'flex'
    },
    tmHistoryCont: {
        overflowY: 'auto',
        height: 425,
        flexDirection: 'column',
        paddingLeft: '45px',
        display: 'flex'
    },
    
    noTxYet: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '20%',
        fontSize:'25px',
        color: '#c3c3c3'
    }, 
    
    wholeDiv: {
        margin: 10
    },
    secondDiv: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    flex: {
        display: 'flex'
    },
    outlineNone: { outline: 'none' },
    data: {
        marginTop: 20, // changed 20 -> 10
        marginBottom: 10,
    },
    outStyle: {
        color: 'red',
        fontFamily: 'Montserrat, Medium',
        fontSize: 15,
        marginRight: 10,
        fontWeight: '700'
    },
    inStyle: {
        color: 'green',
        fontFamily: 'Montserrat, Medium',
        fontSize: 15,
        marginRight: 10,
        fontWeight: '700'
    },
    recepientStyle: {
        color: '#318EDE',
        fontFamily: 'Montserrat, Regular',
        fontWeight: 'normal',
        fontSize: 13
    }
}

module.exports = {
    historyStyles
}