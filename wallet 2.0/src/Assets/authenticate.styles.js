const defaultPageStyle = {
    division: {
        backgroundColor: '#1e1e1e',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
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
        backgroundColor: 'rgb(83, 45, 145)'
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
        marginLeft: '3%'
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
        lineHeight: '30px'
    },
    createDiv: {
        marginLeft: '7%',
        marginRight: '7%'
    },
    headingCreate: {
        color: '#2f3245',
        fontSize: 14,
        marginBottom: 0,
        marginTop: '2%'
    },
    textBoxPaper: {
        height: 35,
        width: '100%',
        backgroundColor: 'rgba(229, 229, 229, 0.66)',
        marginTop: '3%'
    },
    keyTextBoxPaper: {
        height: 35,
        width: '80%',
        marginTop: '3%'
    },
    textFieldCreateHint: {
        fontSize: 12,
        color: '#2f3245'
    },
    textFieldCreate: {
        width: '85%',
        paddingLeft: '5%',
        height: 40,
        lineHeight: '18px'
    },
    buttonLabel: {
        color: 'white',
        textTransform: 'none'
    },
    buttonRaisedKeystore: {
        backgroundColor: 'rgba(128, 128, 128, 0.66)',
        height: '30px',
        lineHeight: '30px',
        cursor: 'not-allowed'
    },
    buttonCreate: {
        backgroundColor: 'rgba(83, 45, 145, 0.71)',
        height: '30px',
        lineHeight: '30px'
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
        wordBreak: 'break-all',
        marginTop: 0
    },
    clipBoard: {
        height: 20,
        width: 20,
        cursor: 'pointer',
        marginLeft: 2
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
        backgroundColor: '#4d9bb9',
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
    w_600:{width: 600},
    f_s_16: { fontSize: 16 },
    f_s_14: { fontSize: 14 },
    textFieldCreate: {
        width: '85%',
        paddingLeft: '5%',
        height: 40,
        lineHeight: '18px'
    },
    closeButton: {
        border: '1px solid #00bcd4',
        borderRadius: 5
    },
    submitButton: {
        border: '1px solid #00bcd4',
        borderRadius: 5,
        margin: '0px 20px 0px 10px'
    },
    snackBarStyle: {
        marginBottom: '1%'
    }
}

module.exports = {
    defaultPageStyle,
    homePageStyles,
    createPagestyles,
    authenticateStyles
}