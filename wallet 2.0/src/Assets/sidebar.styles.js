const sidebarStyles = {


    totalDiv: {
        background: '#f3f3f3',
        width: 65,
    },
    activeDivStyle: {
        padding: '16px 10px 7px 48px', //'16px 10px 7px 20px',
        textAlign: 'left', //changed center to left
        cursor: 'pointer',
        fontWeight: 'bold',
        fontFamily: 'Montserrat'
    },

    currentDivStyle: {
        padding: '16px 10px 7px 48px',//'12px 20px 4px 20px',
        textAlign: 'left',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontFamily: 'Montserrat',
        backgroundColor: 'rgba(48, 50, 70, 0.16)'
    },
    disabledDivStyle: {
        padding: '16px 10px 7px 48px',
        textAlign: 'left',
        fontFamily: 'Montserrat',
        cursor: 'pointer' // changed from not-allowed
    },


    IconActiveDivStyle: {
        padding: '16px 10px 7px 20px', //'16px 10px 7px 20px',
        textAlign: 'left', //changed center to left
        cursor: 'pointer',
        fontWeight: 'bold',
        fontFamily: 'Montserrat'
    },

    IconCurrentDivStyle: {
        padding: '16px 10px 7px 20px',//'12px 20px 4px 20px',
        textAlign: 'left',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontFamily: 'Montserrat',
        backgroundColor: 'rgba(48, 50, 70, 0.16)'
    },
    IconDisabledDivStyle: {
        padding: '16px 10px 7px 20px',
        textAlign: 'left',
        fontFamily: 'Montserrat',
        cursor: 'pointer' // changed from not-allowed
    },

    activeLabelStyle: {
        fontWeight: 'bold',// 'bold',
        fontSize: 16,
        color: '#0c2940',
        cursor: 'pointer',
       
      
    },
    normalLabelStyle: {
        // padding: '16px 10px 7px 30px',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0c2940', // changed from '#3D425C',
        cursor: 'pointer',
      

    },
    disabledLabelStyle: {
        // padding: '16px 10px 7px 25px',
        fontSize: 16,
        color: '#CECECE',
        cursor: 'pointer', // changed from not-allowed
     

    },
    collapseType:{
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
        fontSize:16,

    },
    drawerHeading: {
        fontSize: 18,
        letterSpacing:'2.2px',
    fontWeight: 600,
    paddingLeft: 55,
    position:'absolute',
    bottom:0,
    textAlign:'center',
    color: '#7ca5c9da',
    marginBottom:10
    },
    m_0: { margin: 0 },
    outlineNone: {
        outline: 'none'
    },
    heightFull: {
        height: '100%'
    },
    giveSpace:{
        marginBottom:12
    },
    backArrowStyle:{
        // marginTop:25,
    },
   
}

module.exports = {
    sidebarStyles
}