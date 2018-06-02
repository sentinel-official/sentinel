import React from 'react';
import {
    Step,
    Stepper,
    StepLabel,
    RaisedButton,
    FlatButton,
    TextField,
    RadioButtonGroup,
    RadioButton,
    Slider
} from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import ArrowForwardIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right'

class MixerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: false,
            stepIndex: 0,
            minValue: 0,
            maxValue: 0
        };
    }

    handleNext = () => {
        const { stepIndex } = this.state;
        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 2,
        });
    };

    handleMinSlider = (event, value) => {
        this.setState({ minValue: value })
    }

    handleMaxSlider = (event, value) => {
        this.setState({ maxValue: value })
    }

    handlePrev = () => {
        const { stepIndex } = this.state;
        if (stepIndex > 0) {
            this.setState({ stepIndex: stepIndex - 1 });
        }
    };

    getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return (<div>
                    <span style={styles.formHeading}>Amount</span>
                    <TextField
                        type="number"
                        underlineShow={false} fullWidth={true}
                        inputStyle={styles.textInputStyle}
                        style={styles.textStyle}
                        underlineShow={false} fullWidth={true}
                    />
                    <Row style={{ marginTop: 12, marginBottom: 20 }}>
                        <Col xs={3}>
                            <span style={styles.formHeading}>Select Token to Mix</span>
                            <RadioButtonGroup name="selectToken" defaultSelected="SENT" style={{ marginTop: 12 }}>
                                <RadioButton
                                    value="SENT"
                                    label="SENT"
                                />
                                <RadioButton
                                    value="ETH"
                                    label="ETH"
                                />
                            </RadioButtonGroup>
                        </Col>
                        <Col xsOffset={1} xs={3}>
                            <span style={styles.formHeading}>Minimum Time Delay</span>
                            <Slider
                                min={0}
                                max={48}
                                step={1}
                                value={this.state.minValue}
                                onChange={this.handleMinSlider}
                                sliderStyle={{ marginBottom: 0, marginTop: 12, height: 'auto' }}
                            />
                            <span style={{ fontSize: 16, fontWeight: 600, color: '#253245', letterSpacing: 2, marginTop: 27, position: 'absolute' }}>
                                {this.state.minValue} hrs</span>
                        </Col>
                        <Col xsOffset={1} xs={3}>
                            <span style={styles.formHeading}>Maximum Time Delay</span>
                            <Slider
                                min={this.state.minValue}
                                max={54}
                                step={1}
                                value={this.state.maxValue > this.state.minValue ? this.state.maxValue : this.state.minValue}
                                onChange={this.handleMaxSlider}
                                sliderStyle={{ marginBottom: 0, marginTop: 12, height: 'auto' }}
                            />
                            <span style={{ fontSize: 16, fontWeight: 600, color: '#253245', letterSpacing: 2, marginTop: 27, position: 'absolute' }}>
                                {this.state.maxValue > this.state.minValue ? this.state.maxValue : this.state.minValue} hrs</span>
                        </Col>
                    </Row>
                    <span style={styles.formHeading}>Destination Address</span>
                    <TextField
                        hintText="Example: 0x0E5090ef14B5195cE5a4E28403ad25bA08D0Ad45"
                        hintStyle={{ bottom: 8, paddingLeft: 10, letterSpacing: 2, fontSize: 14 }}
                        style={{ height: 42, marginTop: 15 }}
                        underlineShow={false} fullWidth={true}
                        inputStyle={styles.textInputStyle}
                    />
                </div>)
            case 1:
                return '';
            case 2:
                return (<div>
                    <TextField
                        type="password"
                        hintText="Enter Keystore Password to Confirm"
                        hintStyle={{ bottom: 8, paddingLeft: 10, letterSpacing: 2, fontSize: 14 }}
                        //   onChange={(event, password) => this.setState({ password })}
                        //   value={this.state.password}
                        underlineShow={false} fullWidth={true}
                        inputStyle={styles.textInputStyle}
                        style={{ height: 42 }}
                    />
                </div>)
            default:
                return 'Wrong Page';
        }
    }

    render() {
        const { finished, stepIndex } = this.state;
        const contentStyle = { margin: '0 16px' };

        return (
            <div style={{ width: '100%', maxWidth: 950, margin: 'auto' }}>
                <Stepper activeStep={stepIndex} connector={<ArrowForwardIcon />} style={{ width: '60%' }}>
                    <Step>
                        <StepLabel>Enter Details to Mix</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>List of Pools</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Confirmation</StepLabel>
                    </Step>
                </Stepper>
                <div style={contentStyle}>
                    {finished ? (
                        <p>
                            <a
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.setState({ stepIndex: 0, finished: false });
                                }}
                            >
                                Click here
              </a> to reset the example.
            </p>
                    ) : (
                            <div style={stepIndex === 2 ? { display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400, flexDirection: 'column' } : {}}>
                                <p style={stepIndex === 2 ? { width: '80%' } : { width: '100%' }}>{this.getStepContent(stepIndex)}</p>
                                <div style={{ marginTop: 12, flexDirection: 'row' }}>
                                    <FlatButton
                                        label="Back"
                                        disabled={stepIndex === 0}
                                        onClick={this.handlePrev}
                                        style={{
                                            marginRight: 12, border: '1px solid #00bcd4',
                                            borderRadius: 5, display: stepIndex === 0 ? 'none' : 'inline'
                                        }}
                                    />
                                    <RaisedButton
                                        label={stepIndex === 2 ? 'Confirm' : 'Next'}
                                        primary={true}
                                        onClick={this.handleNext}
                                        style={{
                                            border: '1px solid #00bcd4',
                                            borderRadius: 5,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                </div>
            </div>
        );
    }
}

const styles = {
    formHeading: {
        fontSize: 16,
        fontWeight: 600,
        color: '#253245',
        letterSpacing: 2
    },
    textInputStyle: {
        padding: 10,
        fontWeight: 'bold',
        color: '#2f3245',
        border: '1px solid #00bcd4',
        borderRadius: '8px'
    },
    textStyle: {
        height: 42,
        marginTop: 12,
        marginBottom: 20
    },
}

export default MixerComponent;