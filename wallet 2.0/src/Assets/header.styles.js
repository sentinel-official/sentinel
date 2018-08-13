const headerStyles = {
    mainDivStyle: {
        height: 70,
        background: 'linear-gradient(to right,#2f3245 78%,#3d425c 22%)'
    },
    firstRowStyle: {
        paddingTop: 10
    },
    sentinelColumn: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoStyle: {
        width: 50,
        height: 50,
        marginLeft: 10
    },
    clipBoard: {
        height: 18,
        width: 15,
        color: '#5ca1e8',
        cursor: 'pointer',
        marginTop: '5%',
        marginLeft: -12
    },
    clipBoardDialog: {
        height: 14,
        width: 14,
        cursor: 'pointer',
        marginLeft: 5
    },
    walletAddress: {
        fontSize: 12,
        fontWeight: '600',
        color: '#c3deef',
        whiteSpace: 'nowrap',
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        marginTop: '3%'
    },
    basicWallet: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FAFAFA'
    },
    ethBalance: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FAFAFA',
        marginTop: '3%'
    },
    sentBalance: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FAFAFA'
    },
    toggleLabelisTest: {
        color: '#FAFAFA',
        textTransform: 'none',
        fontWeight: 600,
        fontSize: 14
    },
    buttonHeightStyle: {
        height: '18px',
        lineHeight: '18px'
    },
    balanceText: {
        color: '#c3deef'
    },
    columnStyle: {
        fontSize: 12,
        fontWeight: '600'
    },
    toggleStyle: {
        marginTop: -22,
        marginLeft: -5
    },
    thumbTrackStyle: {
        backgroundColor: '#4b4e5d'
    },
    alignRight:{
        textAlign:'right'
    },
    accountIconColor:{
        color:'#ddd'
    }
}

module.exports = {
    headerStyles
}