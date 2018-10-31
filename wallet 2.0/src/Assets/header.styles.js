
const headerStyles = {
    mainDivStyle: {
        height: 70,
        // background: 'linear-gradient(to right,#2f3245 60%,#3d425c 40%)'
        // background: '#202325',
        // background: 'radial-gradient(circle at 49.41% 1.55%,#3d004c,transparent 100%),radial-gradient(circle at 47.95% 97.06%,#09318c,transparent 100%),radial-gradient(circle at 50% 50%,#04091a,#04091a 100%) no-repeat 50%',

        backgroundImage: 'linear-gradient(-90deg, #023B66, #241E4A)',

    },
    firstRowStyle: {
        paddingTop: 10
    },
    sentinelColumn: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonRefresh: {
        borderRadius: 50,
        border: 0,
        transition: '2000',
        color: '#ddd',
        outline: 'none',
        marginLeft:30
    },
    logoStyle: {
        width: 40,
        height: 40,
        marginLeft: -5,
        marginTop: 5,
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
        color: '#efb77c', // '#c3deef',
        whiteSpace: 'nowrap',
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        marginTop: '3%',
        marginLeft: -25,
    },
    basicWallet: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FAFAFA',
        marginLeft: -25,

    },
    ethBalance: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FAFAFA',
        marginTop: '5%'
    },
    tmBalance: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FAFAFA',
        marginTop: '1%'
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
        color:'#efb77c'
        // '#c3deef'
    },
    balanceHead:{
        textAlign:'right'
    },
    bal:{
        padding:'0 10px',
    },
    balType:{
        textAlign:'center'
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
    alignRight: {
        textAlign: 'right',
        // marginLeft: 15
    },
    alignRightSelect:{
        textAlign: 'right',
        // marginLeft: 15
    },
    accountIconColor: {
        color: '#ddd'
    },
    dropDownStyle: {
        color: 'white ',
        fontSize: 14,
        fontWeight: 600,
        ':before': {
            borderBottom: '1px solid #fff',
        }
    },
    'dropDownStyle:before': {
        color: 'red'
    },
    noDrop: {
        cursor: 'noDrop',
    }
}

module.exports = {
    headerStyles
}