import React, { Component } from 'react'
import { validateEmail } from '../utils/FormValidater';
import { Baseurl } from '../utils/Baseurl';
import { toast } from 'react-toastify';
import axios from 'axios';
import Modal from 'react-modal';
import OtpInput from 'react-otp-input';
import Link from 'next/link'
import Router from 'next/router'
import firebase, { provider } from '../utils/Fire';

import { Container, Row, Col, Button, Form, Input, Label, FormGroup } from 'reactstrap'

Modal.setAppElement('#__next')
Modal.defaultStyles.overlay.backgroundColor = 'rgba(111, 111, 111, 0.75)';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        borderRadius: '8px',
        maxWidth: '548px',
        border: 'none',
    }
};

export default class Login extends Component {


    constructor(props) {
        super(props);
        this.state = {
            email: '', emailError: false,
            password: '', passwordError: false,
            authMessage: '',
            isLoading: false,
            LoadingIs: false,
            isModal: false,
            otp: '',
            check: false,
            alertError: false,
            messageAlert: '',
            alertSuccess: false,
            messageAlertSuccess: '',
            isGoogleLoading: false,
            isFbLoading: false,
            routeState: {},
            alertErrorModal: false,
            messageAlertModal: '',
            alertSuccessModal: false,
            messageAlertSuccessModal: '',
        }
    }


    componentDidMount() {
        let value = localStorage.getItem("uidp");
        if (value) {
            window.location.href="/";
        }

    }

    handleSetInterval = () => {
        setTimeout(
            () => this.setState({ alertError: false, messageAlert: '' }),
            8000
        );
    }

    handleCloseAlert = () => {
        this.setState({ alertError: false, messageAlert: '', alertSuccess: false, messageAlertSuccess: '', alertErrorModal: false, messageAlertModal: '', alertSuccessModal: false, messageAlertSuccessModal: '' })
    }

    handleSetIntervalSuccess = () => {
        setTimeout(
            () => this.setState({ alertSuccess: false, messageAlertSuccess: '' }),
            8000
        );
    }


    handleSetIntervalModal = () => {
        setTimeout(
            () => this.setState({ alertErrorModal: false, messageAlertModal: '' }),
            5000
        );
    }

    handleSetIntervalSuccessModal = () => {
        setTimeout(
            () => this.setState({ alertSuccessModal: false, messageAlertSuccessModal: '' }),
            5000
        );
    }

    closeModal = (e) => {
        e.preventDefault();
        toast.dismiss();
        this.setState({ isModal: false, isLoading: false, otp: '' });
    }

    handleSaveReviews = (routeName, docId, dec, ratings) => {

        let patientId = localStorage.getItem('uidp');
        let data = {
            patient_id: patientId,
            doc_id: docId,
            dec: dec,
            rating: ratings,
        }

        axios({
            method: 'post',
            url: Baseurl + 'api/review/save_review',
            headers: { 'content-type': 'application/json' },
            data: data,
        }).then((res => {
            // console.log("review-response----->", res);
            // this.props.history.push(`/${routeName}/${docId}`);
            localStorage.setItem("scheduleAppId", docId)
            Router.push({ pathname: '/scheduleAppointment', query: { id: tdocId } });
        })).catch((error) => {
            console.log("review-error------>", error);
        })

    };



    routeItBack = () => {
        if (this.state.routeState) {
            if (this.state.routeState.routename === 'schedule') {
                // this.props.history.push(`/${this.state.routeState.routename}/${this.state.routeState.uid}`);
                localStorage.setItem("scheduleAppId", this.state.routeState.uid)
                Router.push({ pathname: '/scheduleAppointment', query: { id: this.state.routeState.uid } });
            }
            else if (this.state.routeState.routename === 'searchdoc_profile') {
                this.handleSaveReviews(this.state.routeState.routename, this.state.routeState.uid, this.state.routeState.dec, this.state.routeState.rating)
            }
            else if (this.state.routeState.routename === 'confirm') {
                // console.log("im in");
                // this.props.history.push(`/confirm?date=${this.state.routeState.date}&time=${this.state.routeState.time}&docId=${this.state.routeState.docId}&id=${this.state.routeState.id}&status=${this.state.routeState.status}`);
                Router.push({ pathname: '/AppointmentConfirmation', query: { date: this.state.routeState.date, time: this.state.routeState.time, docId: this.state.routeState.docId, id: this.state.routeState.id, status: this.state.routeState.status } });
            }
            else {

                Router.push({ pathname: '/' });
            }

        }
        else {

            Router.push({ pathname: '/' });
        }
    };



    /*-------------------------------------------------google-login--------------------------------------------*/

    // handleFacebookLogin = () => {
    //     this.setState({ isFbLoading: true });
    //     var facebook_provider = new firebase.auth.FacebookAuthProvider();

    //     firebaseApp.auth().signInWithPopup(facebook_provider)
    //         .then((result) => {

    //             // var token = result.credential.accessToken;
    //             console.log("facebook-result-in-authWrapper----->", result);
    //             localStorage.setItem('uidp', result.user.uid);
    //             this.routeItBack();


    //             // var user = result.user;
    //             // this.setState({ isFbLoading: false });



    //         }).catch((error) => {
    //             this.setState({ isFbLoading: false });
    //             toast.error(error.message, { position: toast.POSITION.TOP_CENTER });
    //             console.log("facebook-login-error--------->", error);
    //         });
    // }

    /*------------------------------------------------------------handle-input-onchange-------------------------------------------------*/

    handleOnChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        // e.target.name === 'password' && this.setState({ password Error: false, tooLong: false });
        e.target.name === 'email' && this.setState({ emailError: false });

    }

    /*-------------------------------------------------google-login--------------------------------------------*/

    handleGoogleLogin = () => {

        this.setState({ LoadingIs: true });

        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                localStorage.setItem('uidp', result.user.uid);
                this.routeItBack()
            })
            .catch((error) => {
                this.setState({ LoadingIs: false, alertError: true, messageAlert: error.message });
                // toast.error(error.message, { position: toast.POSITION.TOP_CENTER });
                this.handleSetInterval();
                console.log("google-login-error----->", error);
            });
    }

    /*------------------------------------------------------------handle-validateForm-------------------------------------------------*/

    validateForm() {
        const { password, email } = this.state;
        !validateEmail(email) && this.setState({ emailError: true, alertError: true, messageAlert: 'Please enter valid email.' }, () => {
            // toast.error('Please enter valid email.', { position: toast.POSITION.TOP_CENTER });
            this.handleSetInterval();
        });
        // password.length < 6 && this.setState({ passwordError: true });
        // password.length > 36 && this.setState({ tooLong: true });

        return validateEmail(email) > 0;
        // && password.length > 5 && password.length < 37;
    };

    handleNextButton = (e) => {
        e.preventDefault();
        const { email } = this.state;
        this.setState({ isLoading: true });
        // console.log('handleNextButton start');
        if (this.validateForm()) {
            axios({
                method: 'get',
                url: Baseurl + `api/user/check_email?email=${email}`,
                headers: { 'content-type': 'application/json' }
            }).then((res) => {
                // console.log('email-response---->', res);

                this.setState({ authMessage: '', userMobile: res.data.user.mobile });

                if (res.data.user.signUpType === 1) {
                    // console.log("signUpType")
                    // toast.error('You have already created an account using Google. Please log in with your Google credentials.', { position: toast.POSITION.TOP_CENTER });
                    this.setState({ isLoading: false, alertError: true, messageAlert: 'You have already created an account using Google. Please log in with your Google credentials.' })
                    this.handleSetInterval();

                }
                else {
                    if (res.data.user.isPhone_verified) {
                        // console.log("isPhone_verified")
                        // console.log("email is", email)
                        Router.push({ pathname: '/PasswordScreen', query: { userEmail: email } });
                    }
                    else {
                        console.log("handleSendVerificationCode")
                        this.handleSendVerificationCode(res.data.user.mobile)
                    }
                }

            }).catch((error) => {
                console.log("email-error----->", error.response);
                // toast.error(`The email address you entered is not associated with a SmartAppointment account. Please try again or sign up for an account.`, { position: toast.POSITION.TOP_CENTER });
                this.setState({ isLoading: false, alertError: true, messageAlert: `The email address you entered is not associated with a SmartAppointment account. Please try again or sign up for an account.` })
                this.handleSetInterval();

            })

        }
        else {
            this.setState({ isLoading: false });
        }
    }




    /*---------------------------handle-send-verification code---------------------------*/

    handleSendVerificationCode = (mobile) => {
        const { email } = this.state;
        axios({
            method: 'post',
            url: Baseurl + `api/phone_auth/send_verification_code?phone=${mobile}&email=${email}&type=emailLogin`,
            headers: { 'content-type': 'application/json' }
        }).then((res) => {
            // console.log("mobile", mobile, Baseurl);
            this.setState({ isModal: true, isLoading: false, alertSuccessModal: true, messageAlertSuccessModal: 'A verification code has been sent to you via email or SMS.' });
            // toast.success('A verification code has been sent to you via email or SMS. Please enter code here to verify your phone number.', { position: toast.POSITION.TOP_CENTER });
            this.handleSetIntervalSuccess();
        }).catch((error) => {
            console.log("error--->", error.response);
            this.setState({ isModal: false, isLoading: false, is_signupDisabled: false });
        })
    }




    /*---------------------------------handle-verify otp----------------------------*/

    handleVerifyOtp = () => {
        const { email, otp } = this.state;
        if (!otp) {
            // toast.error('Enter your code.', { position: toast.POSITION.TOP_CENTER });
            this.setState({ isLoading: false, alertErrorModal: true, messageAlertModal: 'Enter your code.' })
            this.handleSetIntervalModal();

        }
        else {
            axios({
                method: 'post',
                url: Baseurl + `api/phone_auth/verify_code?phone=${this.state.userMobile}&code=${otp}&user_email=${email}`,
                headers: { "content-type": 'application/json' }
            }).then((res) => {
                // console.log(res);
                this.setState({ isModal: false });
                Router.push('/PasswordScreen')

            }).catch((err) => {
                console.log(err);
                // toast.error('You have entered an incorrect code. Please enter again or request new code.', { position: toast.POSITION.TOP_CENTER });
                this.setState({ isLoading: false, is_signupDisabled: false, alertErrorModal: true, messageAlertModal: 'You have entered an incorrect code. Please enter again or request new code.' })
                this.handleSetIntervalModal();

            })
        }

    }




    /*------------------------------handle-resend-otp-------------------------------*/

    handleResentOtp = (e) => {
        e.preventDefault();
        const { email } = this.state;
        this.setState({ otp: '' });

        axios({
            method: 'post',
            url: Baseurl + `api/phone_auth/send_verification_code?phone=${this.state.userMobile}&email=${email}&type=emailLogin`,
            headers: { 'content-type': 'application/json' }
        }).then((res) => {
            // console.log(res);
            // toast.success('A verification code has been sent to you via email or SMS. Please enter code here to verify your phone number.', { position: toast.POSITION.TOP_CENTER });
            this.setState({ alertSuccessModal: true, messageAlertSuccessModal: 'A verification code has been sent to you via email or SMS.' })
            this.handleSetIntervalSuccess();
        }).catch((error) => {
            console.log("error--->", error);
            this.setState({ isLoading: false, is_signupDisabled: false });
        })
    }



    render() {
        return (
            <React.Fragment>
                {/* <Modal
                    isOpen={this.state.isModal}
                 

                    contentLabel="Modal">

                    <div style={{ textAlign: 'center' }} className="otp_input">
                        <div className="singup_modal_closing">
                            <h4 className="singup_modal_code">Enter verification code</h4>
                            <svg className="svg-icon w-3rem h-3rem singup_modal_close" onClick={(e) => this.closeModal(e)}>
                                <use xlinkHref="/content/svg/orion-svg-sprite.svg#close-1" />
                            </svg>
                        </div>

                        <OtpInput
                            onChange={otp => this.setState({ otp: otp })}
                            onKeyPress={(e) => (e.charCode >= 48 && e.charCode <= 57) ? true : e.preventDefault()}
                            numInputs={6}
                            value={this.state.otp}
                            isInputNum={false}
                            shouldAutoFocus={true}
                        />
                        <button className="popUpButton" style={{ marginTop: 25 }} onClick={this.handleVerifyOtp}>VERIFY</button>
                        <button className="popUpButton" style={{ marginTop: 25 }} onClick={(e) => this.handleResentOtp(e)}>Resend Code</button>
                    </div>

                </Modal> */}
                <Modal
                    isOpen={this.state.isModal}
                    // isOpen={true}
                    style={customStyles}
                    contentLabel="Modal">
                    <div style={{ textAlign: 'center' }} className="otp_input">


                        {this.state.alertErrorModal ?
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {this.state.messageAlertModal}
                            </div>
                            : ''
                        }

                        {this.state.alertSuccessModal ?
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                {this.state.messageAlertSuccessModal}
                            </div>
                            : ''
                        }
                        <div className="singup_modal_closing">
                            <h4 className="singup_modal_code">Enter verification code</h4>
                            <svg className="svg-icon w-3rem h-3rem singup_modal_close" onClick={(e) => this.closeModal(e)}>
                                <use xlinkHref="/content/svg/orion-svg-sprite.svg#close-1" />
                            </svg>
                        </div>

                        <OtpInput
                            onChange={otp => this.setState({ otp: otp })}
                            onKeyPress={(e) => (e.charCode >= 48 && e.charCode <= 57) ? true : e.preventDefault()}
                            numInputs={6}
                            value={this.state.otp}
                            isInputNum={false}
                            shouldAutoFocus={true}
                        />
                        <button className="popUpButton" style={{ marginTop: 25 }} onClick={this.handleVerifyOtp}>Verify</button>
                        <button className="popUpButton" style={{ marginTop: 25, marginLeft: 20 }} onClick={(e) => this.handleResentOtp(e)}>Resend Code</button>
                    </div>
                </Modal>
                <Container fluid className="px-3">

                    <Row className="min-vh-100">
                        <Col md="8" lg="6" xl="5" className="d-flex align-items-center">

                            <div className="w-100 py-5 px-md-5 px-xl-6 position-relative">

                                <div className="mb-3">
                                    {/* <img src={require('../public/content/svg/smartappt-logo.svg')} alt="logo" className="img-fluid mb-3" /> */}
                                    <div className="text-center">
                                        <h1 style={{ marginTop: '1rem' }}>For Patients Log In</h1>
                                        <h4 style={{ fontWeight: '400' }}>Log in to schedule appointments.</h4>
                                    </div>

                                    {this.state.alertError ?
                                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                            {this.state.messageAlert}
                                            <button type="button" className="close" data-dismiss="alert" onClick={this.handleCloseAlert} aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        : ''
                                    }

                                    {this.state.alertSuccess ?
                                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                                            {this.state.messageAlertSuccess}
                                            <button type="button" className="close" data-dismiss="alert" onClick={this.handleCloseAlert} aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        : ''
                                    }
                                </div>
                                <Form className="form-validate" onSubmit={this.handleNextButton}>
                                    <FormGroup>
                                        <div className="text-center">
                                            <Label for="loginUsername" className="form-label" style={{ textTransform: "none", fontWeight: "550", fontSize: "1rem" }}>
                                                Log in with email
                                            </Label>
                                        </div>

                                        <Input
                                            name="email"
                                            id="loginUsername"
                                            type="email"
                                            placeholder="Please enter your email address."
                                            autoComplete="on"
                                            required
                                            onChange={(e) => this.handleOnChange(e)}
                                            style={{ border: this.state.emailError ? '1px solid #c64444' : '' }}
                                        />
                                    </FormGroup>
                                    <Button
                                        style={{ textTransform: "none", fontWeight: "500", fontSize: "1rem" }}
                                        size="lg"
                                        color="primary"
                                        block
                                        disabled={this.state.isLoading}
                                        onClick={this.handleNextButton}
                                    >
                                        {this.state.isLoading && <span className="spinner-border text-light mr8" role="status" />}
                                        Next
                            </Button>
                                    <hr
                                        data-content="OR"
                                        className="my-3 hr-text letter-spacing-2"
                                    />
                                    <Button
                                        style={{ fontWeight: "510" }}
                                        color="outline-muted"
                                        block
                                        className="btn-social mb-3"
                                        disabled={this.state.LoadingIs}
                                        onClick={this.handleGoogleLogin}
                                    >
                                        {this.state.LoadingIs && <span className="spinner-border text-dark mr8" role="status" />}
                                        <i className="fa-2x fa-google fab btn-social-icon" />
                                Continue with Google
                                    </Button>
                                    <hr className="my-4" />
                                    <p className="text-center">
                                        <small className="text-muted text-center">

                                            <Link href="/signup">
                                                <a>Create account</a>
                                            </Link>
                                        </small>
                                    </p>
                                </Form>
                                {/* <Link href="/">
                                    <a className="close-absolute mr-md-5 mr-xl-6 pt-5">
                                        <svg className="svg-icon w-3rem h-3rem">
                                            <use xlinkHref="/content/svg/orion-svg-sprite.svg#close-1" />
                                        </svg>
                                    </a>
                                </Link> */}
                            </div>
                        </Col>
                        <Col md="4" lg="6" xl="7" className="d-none d-md-block">
                            <div
                                // style={{ backgroundImage: "url(/content/img/photo/photo-1497436072909-60f360e1d4b1.jpg)" }}
                                // style={{ backgroundImage: "url('../images/doctor-login.jpg')" }}

                                className="bg-cover h-100 mr-n3"
                            >
                                <img src={require("../images/doctor-login.jpg")} className="img_fld" />
                            </div>
                        </Col>
                    </Row>
                </Container >
            </React.Fragment>
        )
    }
}