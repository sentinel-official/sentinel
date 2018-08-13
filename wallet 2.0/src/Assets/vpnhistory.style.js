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
        fontSize:'17px',
        fontWeight:'600',
        textAlign:'left',
        color: 'rgb(61, 66, 92)'
    },
    history:{
        maxHeight:'300px',
        width:'100%',
        overflow:'auto'
    },
    header:{
        fontSize:'21px',
        fontWeight:'600',
        color: 'black',
        textTransform:'uppercase',
        letterSpacing: '1.2px'
    },
    clipBoard: {
        height: 20,
        width: 20,
        cursor: 'pointer'
    },
    headingStyle: {
        fontWeight: 600,
        fontSize:'14px',
        color:'rgb(61,66,92)'
    },
    headingWithMarginStyle: {
        fontWeight: 600,
        marginLeft: 10,
        fontSize:'14px',
        color:'rgb(61,66,92)'
    },
    noSessionsStyle: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '20%',
        fontSize:'25px'
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
        color: '#707070',
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
        fontSize: '14px',
        color:'#919191'
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