const vpnhistoryStyles={
    contianer:{
            width:'100%',
            height:'100%'
    },
    screen:{
        padding:'1%',
        margin:'1%',
    },
    IconButton:{
        border: 'none',
        cursor: 'pointer',
        overflow:'visible',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        width: '48px',
        height: '48px',
        float:'right',
        marginRight:'30px'
    },
    text1:{
        fontSize:'16px',
        fontWeight:'600',
        textAlign:'left'
    },
    history:{
        maxHeight:'300px',
        width:'100%',
        overflow:'auto'
    },
    header:{
        fontSize:'24px',
        fontWeight:'600',
    },
    clipBoard: {
        height: 20,
        width: 20,
        cursor: 'pointer'
    },
    headingStyle: {
        fontWeight: 600,
        fontSize:'12px'
    },
    headingWithMarginStyle: {
        fontWeight: 600,
        marginLeft: 10,
        fontSize:'12px'
    },
    noSessionsStyle: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '20%'
    },
    button:{
          label:{
            textTransform: 'none',
            fontWeight:400,
          },
        }
}

const styles = {
    label: {
        textTransform: 'none',
        fontWeight: '400',
    },
    but1_root: {
        borderRadius: 0,
        backgroundColor: '#18cfd8',
        width: '120px',
        height: '33px',
        marginLeft: '-11px',
        float: 'left',
        outline:'none !important',
        color:'white',
        '&:hover': {
            backgroundColor: '#9eedeb ',
        }
    },
    but2_root: {
        outline:'none !important',
        borderRadius: 0,
        backgroundColor: 'white',
        width: '166px',
        height: '33px',
        marginLeft: '23px'
    },
    button_refresh: {
        background: 'white !important',
        borderRadius: 50,
        border: 0,
        transition: '2000',
        float: 'right',
        color: 'black',
        outline: 'none !important',
    }, 
    refresh_icon:{
        fontSize:'31px !important',
    },
    button_send: {
        background: '#18cfd8',
        borderRadius: 0,
        height: '36px',
        width: '36px',
        transition: '2000',
        color: 'white !important',
        outline: 'none !important',
        cursor:'pointer',
        '&:hover': {
            backgroundColor: '#9eedeb',
        },
        '&:disabled':{
                cursor:'not-allowed',
                backgroundColor:'rgba(24, 207, 216,.2)'

        }
    }, 
    snack: {
        marginBottom: '1%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    done: {
        float: 'right',
        marginTop: '-7%',
        marginRight: '1%',
        color: 'green'
    },
    cardtext: {
        paddingLeft: '0px !important',
        fontSize: '13px',
    },
    textField: {
        width: '90%',
        height:'36px',
        backgroundColor: '#F9F9F9',
        paddingLeft:'2%',
        paddingRight:'2%',
        marignTop:'6px'
      },
};
module.exports={
    vpnhistoryStyles,styles
}