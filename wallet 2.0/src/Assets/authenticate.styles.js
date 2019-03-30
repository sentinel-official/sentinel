const defaultPageStyle = {
    division: {
        backgroundColor: '#1e1e1e',//'#1e1e1e',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        paddingBottom: 150,
    },
    p: {
        fontSize: 40,
        color: 'white'
    },
    image: {
        width: 150,
        height: 150
    }
}

const homePageStyles = {
    m_l_p_5: {
        marginLeft: '5%',
        padding: '7%'
    },
    m_l_5: {
        marginLeft: '5%'
    },
    m_l_20: {
        marginLeft: -20
    },
    toolbar: {
        backgroundColor: '#2f3245',
        height: 70
    },
    toolbarImage: {
        width: 50,
        height: 50,
    },
    raisedButton: {
        marginLeft: '7%',
        backgroundColor: '#2f3245',
        color: 'white',
        height: '42px'
    },
    toolbarTitle: {
        color: 'white',
        marginLeft: 30,
        fontSize: 14,
        fontWeight: '600'
    },
    middleDiv: {
        backgroundImage: "url('../src/Images/BG.png')",
        backgroundSize: 'cover',
        height: 400
    },
    middleDivGrid: {
        padding: '7%',
        color: 'white'
    },
    middleDivText: {
        marginTop: 20,
        fontSize: '1.2rem'
    },
    yesButtonLabel: {
        color: 'white',
        paddingRight: 25,
        paddingLeft: 25,
        fontWeight: '600',
        fontSize: 16,
        height: 42
    },
    yesButton: {
        backgroundColor: '#2f3245',
        borderRadius: '10px',
        height: '42px',
        lineHeight: '42px'
    },
    bottomDivCol: {
        backgroundColor: '#2f3245',
        color: 'white',
        height: 210
    },
    moreAboutText: {
        marginBottom: 30,
        fontSize: 16,
        fontWeight: 'bold'
    },
    bottomDivListItem: {
        padding: '5px 5px 5px 16px',
        fontSize: 12
    },
    bottomDivBuilt: {
        color: '#2f3245',
        marginBottom: 30,
        marginTop: '10%',
        fontSize: 16
    },
    underLine: {
        height: 3,
        borderWidth: 0,
        color: '#3a3e53',
        backgroundColor: '#3a3e53',
        width: '50%'
    },
    copyRight: {
        fontWeight: 'lighter',
        fontSize: 14,
        color: 'rgba(47, 50, 69, 0.68)',
        marginTop: 25
    },
    wholeDiv: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    ethButtonStyle: {
        color: '#d6d1cb',
        fontWeight: '500',
        fontSize: '16px',
        fontFamily: 'Montserrat,Medium',
        outline: 'none',
        // border: '1px solid #6facc8',
        borderRadius: '5px',
        padding: '13px 32px',
        textTransform: 'uppercase',
        backgroundColor: '#2f3245'
    },
    tmButtonStyle: {
        color: '#2f3245',
        fontWeight: '500',
        fontSize: '16px',
        fontFamily: 'Montserrat,Medium',
        outline: 'none',
        // border: '1px solid #6facc8',
        borderRadius: '5px',
        padding: '13px 23px',
        textTransform: 'uppercase',
        backgroundColor: 'white'
    }
}

const createPagestyles = {
    f_12: {
        fontSize: 12
    },
    m_b_1: {
        marginBottom: '1%'
    },
    hr_color: {
        backgroundColor: 'rgb(83, 45, 145)',
        marginTop: 0 // changed to decrease the distance between the userId and hr  
    },
    c_t_t: {
        color: 'white',
        textTransform: 'none'
    },
    m_2: {
        margin: '2%'
    },
    p_3: {
        padding: '3%'
    },
    f_m_l_3: {
        fontSize: 12,
        // marginLeft: '3%'
        textAlign: 'center',
    },
    m_t_5: {
        marginTop: '2%'
    },
    toolbarTitle: {
        color: 'white',
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '600'
    },
    yesButtonLabel: {
        textTransform: 'none',
        color: 'white',
        paddingRight: 25,
        paddingLeft: 25,
        fontWeight: '600'
    },
    yesButton: {
        backgroundColor: '#2f3245',
        height: '30px',
        lineHeight: '30px'
    },
    disabledButton: {
        backgroundColor: '#bdbdbd',
        height: '30px',
        lineHeight: '30px',
        borderRadius: 4,

    },
    createDiv: {
        marginLeft: '7%',
        marginRight: '7%'
    },
    headingCreate: {
        color: '#2f3245',
        fontSize: 14,
        marginBottom: 0,
        marginTop: '2%',
        fontWeight: 'bold',
    },
    textBoxPaper: {
        // height: 35,
        width: '100%',
        // backgroundColor: 'rgba(229, 229, 229, 0.66)',
        marginTop: '3%',
        background: '#F5F5F5',
        boxShadow: 'none',

    },
    keyTextBoxPaper: {
        // height: 35,
        width: '80%',
        marginTop: '3%',
        background: '#F5F5F5',
        // backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    textFieldCreateHint: {
        fontSize: 12,
        color: '#606162' //'#2f3245'
    },
    textFieldCreate: {
        width: '100%',
        paddingLeft: '2%', // changed to align with enter text
        height: 45,
        lineHeight: '18px'
    },
    buttonLabel: {
        color: 'white',
        textTransform: 'none',
        // background: '#31708f', 
        // color: '#fff',
        // borderRadius: 4,
    },
    buttonRaisedKeystore: {
        backgroundColor: 'rgba(128, 128, 128, 0.66)',
        height: '30px',
        lineHeight: '30px',
        cursor: 'not-allowed'
    },
    buttonCreate: {
        // backgroundColor: 'rgba(83, 45, 145, 0.71)',

        height: '30px',
        lineHeight: '30px',
        backgroundColor: '#31b0d5',
        color: '#fff',
        borderRadius: 4,
    },

    createStyle: {
        marginTop: '5%',
        marginBottom: '3%'
    },
    bluePaper: {
        backgroundColor: 'rgba(181, 216, 232, 0.32)',
        marginTop: '2%'
    },
    copyHeading: {
        color: 'rgb(240, 94, 9)',
        fontSize: 12,
        fontWeight: 800
    },
    detailsDiv: {
        color: 'rgba(0, 0, 0, 0.66)',
        fontSize: 12,
        marginBottom: '2%',
        marginTop: '2%'
    },
    detailHeadBold: {
        marginTop: '2%',
        fontWeight: 'bold'
    },
    detailVal: {
        fontSize: '12px',
        wordBreak: 'keep-all',
        marginTop: 0
    },
    clipBoard: {
        height: 20,
        width: 20,
        cursor: 'pointer',
        marginLeft: 2,
        color: '#5ca1e8',
    },
    checkboxLabel: {
        color: 'rgb(240, 94, 9)',
        fontSize: 13,
        fontWeight: 800
    },
    refresh: {
        display: 'inline-block',
        position: 'relative',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    questionMark: {
        marginLeft: 3,
        fontSize: 12,
        borderRadius: '50%',
        backgroundColor: '#ddd', // '#4d9bb9',
        paddingLeft: 5,
        paddingRight: 5,
        color: 'white'
    },
    toolbarStyle: {
        backgroundColor: '#2f3245',
        height: 70
    },
    toolbarImage: {
        height: 50,
        width: 50
    },
    MLR5: {
        marginLeft: '5%',
        marginRight: '5%'
    }
}

const authenticateStyles = {
    w_600: {
        width: 600,
        // background:'rgba(255, 255, 255, 0.18)'
        //  padding: '0 24px 10px 24px'
    },
    f_s_16: { fontSize: 16, color: '#fff' },
    f_s_14: { fontSize: 14, color: '#efb77c', borderBottom: '2.5px solid green !important' },
    textFieldCreate: {
        width: '100%',
        // paddingLeft: '5%',
        color: '#f0ad4e',
        height: 40,
        lineHeight: '18px',

        borderBottom: '2.5px solid red !important'

    },
    backgroundStyle: {
        background: 'radial-gradient(circle at 49.41% 1.55%,#3d004c,transparent 100%),radial-gradient(circle at 47.95% 97.06%,#09318c,transparent 100%),radial-gradient(circle at 50% 50%,#04091a,#04091a 100%) no-repeat 50%',
    },
    dialogueStyle: {
        backgroundColor: '#ffffff30'
    },

    closeButton: {
        // border: '1px solid #00bcd4',
        borderRadius: 4
    },
    submitButton: {
        // border: '1px solid #00bcd4',
        borderRadius: 4,
        margin: '0px 20px 0px 10px',
        background: '#31708f', //'#0e5298',
        color: '#fff',
    },
    snackBarStyle: {
        marginBottom: '1%'
    },
    buttonsGroup: {
        marginTop: 0,
        marginBottom: 30,
    },
}

module.exports = {
    defaultPageStyle,
    homePageStyles,
    createPagestyles,
    authenticateStyles
}