import React, { Component } from 'react'
import Router from 'next/router'
import MaskedInput from "react-maskedinput";
import firebase, { provider } from '../utils/Fire';
import { validateEmail, validateName } from '../utils/FormValidater';
import { Baseurl } from '../utils/Baseurl';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import OtpInput from 'react-otp-input';
import axios from 'axios';
// import { ToastMsg } from '../components/ToastMsg';
import Link from 'next/link'

import { Container, Row, Col, Button, Form, Input, Label, FormGroup, CustomInput } from 'reactstrap'
import { connect } from 'react-redux';

export async function getStaticProps() {
    return {
        props: {
            title: "Sign up",
            hideHeader: true,
            hideFooter: true,
            noPaddingTop: true
        },
    }
}

Modal.setAppElement('#__next')
Modal.defaultStyles.overlay.backgroundColor = 'rgb(0 0 0 / 50%)';

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


class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            first_name: '', firstError: false,
            last_name: '', lastError: false,
            email: '', emailError: false,
            password: '', passwordError: false,
            gender: 'male', genderError: false,
            dob: '', dobError: false,
            tooLong: false,
            accept_terms: false,
            accept_authorization: false,
            cell: "",
            isLoading: false,
            LoadingIs: false,
            is_signupDisabled: false,
            isModal: false,
            otp: '',
            alertError: false,
            messageAlert: '',
            alertSuccess: false,
            messageAlertSuccess: '',
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


    handleAddContryCodeInCellNumber = () => {
        this.state.cell.slice(0, 1) !== '+' && this.setState({ cell: '+1' })
    }


    /*------------------------------------------------handle-checked buttons of switch and radio----------------------------------------*/

    handleRadioChecked = (gen) => {
        this.setState({ gender: gen });
    }



    handletermSwitch = () => {
        this.setState({ accept_terms: !this.state.accept_terms });
    }

    handleHippaAuthenticationSwitch = () => {
        this.setState({ accept_authorization: !this.state.accept_authorization });
    }

    handleCloseAlert = () => {
        this.setState({ alertError: false, messageAlert: '', alertSuccess: false, messageAlertSuccess: '', alertErrorModal: false, messageAlertModal: '', alertSuccessModal: false, messageAlertSuccessModal: '' })
    }

    handleSetInterval = () => {
        setTimeout(
            () => this.setState({ alertError: false, messageAlert: '' }),
            8000
        );
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
                console.log("google-login-error----->");
            });
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
            console.log("review-error------>");
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

    /*------------------------------------------------------------handle-input-onchange-------------------------------------------------*/

    handleOnChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        e.target.name === 'first_name' && this.setState({ firstError: false });
        e.target.name === 'last_name' && this.setState({ lastError: false });
        e.target.name === 'password' && this.setState({ passwordError: false, tooLong: false });
        e.target.name === 'email' && this.setState({ emailError: false });
        e.target.name === 'dob' && this.setState({ dobError: false });
        e.target.name === 'cell' && this.setState({ cellError: false });

        if (e.target.name === 'first_name') {
            return e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
        }

    }


    /*------------------------------------------------------------handle-validateForm-------------------------------------------------*/

    validateForm() {
        const { first_name, last_name, password, email, dob, cell } = this.state;
        const [month, date, year] = dob.split('/');
        const valid_date = new Date(`${year}-${month}-${date}`);
        !validateName(first_name) && this.setState({ firstError: true });
        !validateName(last_name) && this.setState({ lastError: true });
        !validateEmail(email) && this.setState({ emailError: true });
        password.length < 8 && this.setState({ passwordError: true });
        password.length > 36 && this.setState({ tooLong: true });
        (String(valid_date) === 'Invalid Date' || dob.split('_').length > 1 || dob.length < 1) && this.setState({ dobError: true });
        cell.length < 10 && this.setState({ cellError: true });

        return validateName(first_name) && validateName(last_name) && validateEmail(email) > 0 && password.length > 7 && password.length < 37 && String(valid_date) !== 'Invalid Date' && dob.split('_').length < 2 && dob.length > 0 && cell.length > 9;
    };





    /*------------------------------------------------------------handle-signup-with-firebase------------------------------------------*/

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ isLoading: true, is_signupDisabled: true });
        const { first_name, last_name, email, password, dob, cell } = this.state;

        // console.log("handleSubmit", first_name, last_name, email, password, dob, cell)

        if (!this.validateForm()) {
            this.setState({ isLoading: false, is_signupDisabled: false });
            if (!validateEmail(email) || email === '') {
                this.setState({ alertError: true, messageAlert: 'Please enter a valid email address.' });
                this.handleSetInterval();
            }
            else if (password.length < 8 || password === '') {
                this.setState({ alertError: true, messageAlert: 'Password must be at least 8 characters.' });
                this.handleSetInterval();
            }
            else if (first_name === '') {
                this.setState({ alertError: true, messageAlert: 'Please enter first name.' });
                this.handleSetInterval();
            }
            else if (last_name === '') {
                this.setState({ alertError: true, messageAlert: 'Please enter last name.' });
                this.handleSetInterval();
            }
            else if (cell.length < 10 || cell === '') {
                this.setState({ alertError: true, messageAlert: 'Please enter a valid 10-digit phone number.' });
                this.handleSetInterval();
            }
            else if (dob === '') {
                this.setState({ alertError: true, messageAlert: 'Please enter date of birth.' });
                this.handleSetInterval();
            }
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((user) => {
                    localStorage.setItem("signingUp", true)
                    // this.props.signingUp(true);
                    this.handleSignupApi(user.user.uid);
                })
                .catch((error) => {
                    // console.log("Signup-with-firebase-error--------->", error);
                    this.setState({ isLoading: false, is_signupDisabled: false, isModal: false });
                    if (error.code === 'auth/email-already-in-use') {
                        this.setState({ emailError: true, alertError: true, messageAlert: 'This email already exists. Please try to sign up with another email.' });
                        this.handleSetInterval();
                    }
                    else {
                        this.setState({ alertError: true, messageAlert: error.message });
                        this.handleSetInterval();
                    }
                });
        }
    }


    capitalize_Words = (str) => {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    }



    /*------------------------------------------------------------handle-signupapi-realdatabase-------------------------------------------*/

    handleSignupApi = (userId) => {
        const { email, first_name, last_name, dob, gender, cell } = this.state;
        // console.log("handleSignupApi", first_name, last_name, email, dob, cell)

        let data = {
            uid: userId,
            email: email,
            first_name: this.capitalize_Words(first_name),
            last_name: this.capitalize_Words(last_name),
            dob: dob,
            gender: gender,
            mobile: cell,
            isPhone_verified: false,
            signUpType: 0
        };
        axios({
            method: 'post',
            url: Baseurl + 'api/user/register',
            headers: {
                "Content-Type": "application/json",
            },
            data
        }).then((response) => {
            if (response) {
                this.setState({ is_signupDisabled: false }, () => {
                    localStorage.setItem("signingUp", false)
                });

                // this.props.signingUp(false);
                // console.log("firebase 00000000000")
                // firebase.auth().signOut();
                // console.log("firebase 111111111")
                this.handleSendVerificationCode()
            }

        }).catch((error) => {
            console.log("signup-error----->", error.response);
            this.setState({ isLoading: false, is_signupDisabled: false, isModal: false, alertError: true, messageAlert: 'Something went wrong!' });
            this.handleSetInterval();
        })

    };



    /*---------------------------handle-send-verification code---------------------------*/


    handleSendVerificationCode = () => {
        axios({
            method: 'post',
            url: Baseurl + `api/phone_auth/send_verification_code?phone=${this.state.cell}&email=${this.state.email}&type=emailLogin`,
            headers: { 'content-type': 'application/json' }
        }).then((res) => {
            // console.log("/////////////////////",res)
            if (res) {
                this.setState({ isModal: true, isLoading: false, is_signupDisabled: false, alertSuccessModal: true, messageAlertSuccessModal: 'A verification code has been sent to you via email or SMS.' }, () => {
                    console.log("handleSendVerificationCode", this.state.isModal);
                    this.handleSetIntervalSuccessModal();
                });
            }

        }).catch((error) => {
            console.log("error--->", error.response);
            this.setState({ isModal: false, isLoading: false, is_signupDisabled: false });
        })
    }

    /*---------------------------------handle-verify otp----------------------------*/

    handleVerifyOtp = () => {
        var code = this.state.otp;
        if (!code) {
            // toast.error('Enter your code.', { position: toast.POSITION.TOP_CENTER });
            this.setState({ isLoading: false, is_signupDisabled: false, alertErrorModal: true, messageAlertModal: 'Enter your code.' });
            this.handleSetIntervalModal();

        }
        else {
            axios({
                method: 'post',
                url: Baseurl + `api/phone_auth/verify_code?phone=${this.state.cell}&code=${code}&user_email=${this.state.email}`,
                headers: { "content-type": 'application/json' }
            }).then((res) => {
                console.log("handleVerifyOtp");
                this.setState({ isModal: false });
                this.handleLogin();
            }).catch((err) => {
                console.log(err);
                this.setState({ isLoading: false, is_signupDisabled: false, alertErrorModal: true, messageAlertModal: 'You have entered an incorrect code. Please enter again or request new code.' });
                this.handleSetIntervalModal();
            })
        }

    }


    /*------------------------handle-Login-method-direct login after signup successfully-----------------------*/

    handleLogin = () => {
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((res) => {
                // console.log("handleLogin");
                // localStorage.setItem('uidp', res.user.uid);

                // Router.push('/');
                localStorage.setItem('uidp', res.user.uid);
                // this.props.handleIsAuth(true);
                console.log("handleLogin screen signin-response------>");
               this.props.handleauth(true)
                // Router.push('/')
                Router.push(`/`)
            }).catch((error) => {
                console.log("signin-error------>");
            })
    }


    /*---------------------------closeModal---------------------*/

    closeModal = (e) => {
        e.preventDefault();
        toast.dismiss();
        this.setState({ isModal: false, isLoading: false, is_signupDisabled: false, otp: '' });
    }


    handleResentOtp = (e) => {
        e.preventDefault();
        this.setState({ otp: '' });

        axios({
            method: 'post',
            url: Baseurl + `api/phone_auth/send_verification_code?phone=${this.state.cell}&email=${this.state.email}&type=emailLogin`,
            headers: { 'content-type': 'application/json' }
        }).then((res) => {
            // console.log(res);
            // toast.success('A verification code has been sent to you via email or SMS. Please enter code here to verify your phone number.', { position: toast.POSITION.TOP_CENTER });
            this.setState({ alertSuccessModal: true, messageAlertSuccessModal: 'A verification code has been sent to you via email or SMS.' });
            this.handleSetIntervalSuccessModal();
        }).catch((error) => {
            console.log("error--->");
            this.setState({ isLoading: false, is_signupDisabled: false });
        })
    }

    render() {
        return (
            <React.Fragment>
                <Modal
                    isOpen={this.state.isModal}
                    // isOpen={true}
                    style={customStyles}
                    onRequestClose={(e) => this.closeModal(e)}
                    contentLabel="Modal">
                    <div style={{ textAlign: 'center' }} className="otp_input">


                        {this.state.alertErrorModal ?
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {this.state.messageAlertModal}
                                {/* <button type="button" className="close" data-dismiss="alert" onClick={this.handleCloseAlert} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button> */}
                            </div>
                            : ''
                        }

                        {this.state.alertSuccessModal ?
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                {this.state.messageAlertSuccessModal}
                                {/* <button type="button" className="close" data-dismiss="alert" onClick={this.handleCloseAlert} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button> */}
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
                                        <h1 style={{ marginTop: '1rem' }}>For Patients Sign Up</h1>
                                        <h4 style={{ fontWeight: '400' }}>Sign up to schedule appointments.</h4>
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
                                <Form className="form-validate" onSubmit={this.handleSubmit}>
                                    <div className="d-flex brk-box">
                                        <FormGroup>
                                            <Label for="loginUsername" className="form-label">
                                                Email Address
                                </Label>
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
                                        <FormGroup className="ml-3">
                                            <Label
                                                for="loginPassword"
                                                className="form-label"
                                            // for="logincell" className="form-label"
                                            >
                                                {/* Cell Number */}
                                                Password
                                </Label>
                                            <Input
                                                name="password"
                                                id="loginPassword"
                                                type="password"
                                                placeholder="Password"
                                                autoComplete="off"
                                                required
                                                onChange={(e) => this.handleOnChange(e)}
                                                style={{ border: this.state.passwordError ? '1px solid #c64444' : '' }}

                                            // name="cell"
                                            // id="logincell"
                                            // type="text"
                                            // placeholder="Cell Number"
                                            // autoComplete="off"
                                            // required
                                            // value={this.state.cell}
                                            // maxLength={10}
                                            // onKeyPress={(e) => (e.charCode >= 48 && e.charCode <= 57) ? true : e.preventDefault()}
                                            // onChange={(e) => this.handleOnChange(e)}
                                            // style={{ border: this.state.emailError ? '1px solid #c64444' : '' }}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="d-flex brk-box">

                                        <FormGroup>
                                            <Label for="loginfname" className="form-label">
                                                First Name
                                    </Label>
                                            <Input
                                                name="first_name"
                                                id="loginfname"
                                                type="text"
                                                placeholder="First Name"
                                                autoComplete="on"
                                                required
                                                onChange={(e) => this.handleOnChange(e)}
                                                style={{ border: this.state.firstError ? '1px solid #c64444' : '', textTransform: 'capitalize' }}
                                            />
                                        </FormGroup>

                                        <FormGroup className="ml-3">
                                            <Label for="loginlname" className="form-label">
                                                Last Name
                                    </Label>
                                            <Input
                                                name="last_name"
                                                id="loginlname"
                                                type="text"
                                                placeholder="Last Name"
                                                autoComplete="on"
                                                required
                                                onChange={(e) => this.handleOnChange(e)}
                                                style={{ border: this.state.lastError ? '1px solid #c64444' : '', textTransform: 'capitalize' }}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="d-flex brk-box">
                                        <FormGroup className="mb-4">
                                            <Label
                                                for="logincell" className="form-label"
                                    
                                            >
                                            
                                                Cell Number
                                    </Label>
                                            <Input
                                                name="cell"
                                                id="logincell"
                                                type="text"
                                                placeholder="Cell Number"
                                                autoComplete="on"
                                                required
                                                value={this.state.cell}
                                                maxLength={10}
                                                onKeyPress={(e) => (e.charCode >= 48 && e.charCode <= 57) ? true : e.preventDefault()}
                                                onChange={(e) => this.handleOnChange(e)}
                                                style={{ border: this.state.emailError ? '1px solid #c64444' : '' }}

                                            />
                                        </FormGroup>
                                        <FormGroup className="ml-3">
                                            <Label for="loginldob" className="form-label">
                                                DATE OF BIRTH
                                    </Label>
                                           
                                            <MaskedInput mask="11/11/1111"
                                                name="dob"
                                                placeholder="MM/DD/YYYY"
                                                onChange={(e) => this.handleOnChange(e)}
                                                style={{ height: 45, width: '100%', color: "#495057", border: this.state.dobError ? '1px solid #c64444' : '1px solid #ced4da', height: "calc(1.6em + 0.75rem + 2px)", paddingLeft: 25, background: '#fff', outline: 'none', borderRadius: ".4rem" }}
                                            />
                                        </FormGroup>
                                    </div>
                                    <FormGroup className="d-flex">
                                        <CustomInput className={`radio-option`} checked={this.state.gender === 'male' ? 'checked' : ''} onClick={() => this.handleRadioChecked("male")}
                                            type="radio" id="radio1" name="radio" label="Male" />
                                        <CustomInput className={`radio-option`} checked={this.state.gender === 'female' ? 'checked' : ''} onClick={() => this.handleRadioChecked("female")}
                                            type="radio" id="radio2" name="radio" label="Female" className="ml-3" />
                                    </FormGroup>

                                    <Button
                                        style={{ fontWeight: "500", fontSize: "1rem" }}
                                        size="lg"
                                        type='submit'
                                        color="primary"
                                        block
                                        disabled={this.state.isLoading}
                                        onClick={this.handleSubmit}
                                    >
                                        {this.state.isLoading && <span className="spinner-border text-light mr8" role="status" />}
                                        Sign up
                            </Button>
                                  
                                    <div className="text-sm text-muted mt-4">Already have one?<Link href="/login"><a> Log in here </a></Link> </div>
                                    <hr
                                        data-content="OR"
                                        className="my-3 hr-text letter-spacing-2"
                                    />
                                  
                                    <Button
                                        style={{  fontWeight: "510" }}
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
                                    <p className="text-sm text-muted">By signing up, you agree to our <Link href="#"><a >Terms Of Use</a></Link> and <Link href="MedSched_Privacy_Policy.pdf" passHref><a >Privacy Policy</a></Link>.</p>
                                </Form>
                            
                            </div>
                        </Col>
                        <Col md="4" lg="6" xl="7" className="d-none d-md-block">
                       
                            <div
                                style={{ backgroundImage: "url(/content/img/photo/signup.jpeg)" }}
                                className="bg-cover h-100 mr-n3"
                            >
                                <img src={require("../images/doctor-signup.jpg")} className="img_fld" />
                            </div>

                        </Col>
                    </Row>
                </Container >
            </React.Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        userdetail: state.userDetails,
        isauth: state.isAuth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleuserdata: data => dispatch({ type: 'GETUSER_DETAILS_REQUEST', data }),
        handleauth: data => dispatch({ type: 'HANDLE_AUTH', data })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Signup)

