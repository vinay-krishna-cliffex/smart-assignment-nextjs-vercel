import React, { Component } from 'react'
// import { validateEmail } from '../../utils/FormValidater';
import { Baseurl } from '../utils/Baseurl';
import { toast } from 'react-toastify';
import axios from 'axios';
import Link from 'next/link'
import Router from 'next/router'
import firebase, { provider } from '../utils/Fire';

import { Container, Row, Col, Button, Form, Input, Label, FormGroup } from 'reactstrap'

export default class PasswordScreen extends Component {


    constructor(props) {
        super(props);
        this.state = {
            // email: '', emailError: false,
            password: '', passwordError: false,
            authMessage: '',
            isLoading: false,
            LoadingIs: false,
            alertError: false,
            messageAlert: '',
            isGoogleLoading: false,
            isFbLoading: false,
            routeState: {},
        }
    }


    componentDidMount() {
        window.scrollTo(0, 0);
        this.setState({ routeState: Router.query }
            //     , () => {
            //     console.log("routeState is", Router.query)
            // }
        );
    }

    handleSetInterval = () => {
        setTimeout(
            () => this.setState({ alertError: false, messageAlert: '' }),
            8000
        );
    }

    handleRecoverAccount = () => {
        // Router.push({ pathname: '/RecoverAccount' });
        Router.push({ pathname: '/RecoverAccount', query: { yes: "rajat" } });
        // Router.push({ pathname: '/login' });
    }

    handleCloseAlert = () => {
        this.setState({ alertError: false, messageAlert: '', alertSuccess: false, messageAlertSuccess: '' })
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
            this.props.history.push(`/${routeName}/${docId}`);
        })).catch((error) => {
            console.log("review-error------>", error);
        })

    };



    routeItBack = () => {
        if (this.state.routeState) {
            if (this.state.routeState.routename === 'schedule') {
                // this.props.history.push(`/${this.state.routeState.routename}/${this.state.routeState.uid}`);
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

    /*-------------------------------------------------google-login--------------------------------------------*/

    handleGoogleLogin = () => {

        this.setState({ LoadingIs: true });

        firebase.auth().signInWithPopup(provider)
            .then((result) => {

                // var token = result.credential.accessToken;
                localStorage.setItem('uidp', result.user.uid);
                this.routeItBack()
                // const user = result.user;
                // this.setState({ LoadingIs: false });
                //


            })
            .catch((error) => {
                this.setState({ LoadingIs: false, alertError: true, messageAlert: error.message });
                // toast.error(error.message, { position: toast.POSITION.TOP_CENTER });
                this.handleSetInterval();
                console.log("google-login-error----->", error);
            });
    }


    /*------------------------------------------------------------handle-input-onchange-------------------------------------------------*/

    handleOnChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        e.target.name === 'password' && this.setState({ passwordError: false, tooLong: false });
        // e.target.name === 'email' && this.setState({ emailError: false });

    }

    /*------------------------------------------------------------handle-validateForm-------------------------------------------------*/

    validateForm() {
        const { password, email } = this.state;
        // !validateEmail(email) && this.setState({ emailError: true });
        password.length < 6 && this.setState({ passwordError: true, alertError: true, messageAlert: `Please enter valid password.` }, () => {
            // toast.error(`Please enter valid password.`, { position: toast.POSITION.TOP_CENTER });
            this.handleSetInterval();
        });
        password.length > 36 && this.setState({ tooLong: true });

        return password.length > 5 && password.length < 37;
    };



    /*----------------------------------------------------handle-save-review-------------------------------*/

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
            this.props.history.push(`/${routeName}/${docId}`);
        })).catch((error) => {
            console.log("review-error------>", error);
        })

    }



    /*------------------------------------------------------------handle-user-login-------------------------------------------------*/

    handleLogin = (e) => {
        e.preventDefault();
        const { password } = this.state;

        this.setState({ isLoading: true });
        if (this.validateForm()) {
            firebase.auth().signInWithEmailAndPassword(this.state.routeState.userEmail, password)
                .then((res) => {
                    // console.log("signin-response------>", res);

                    this.setState({ isLoading: false });
                    localStorage.setItem('uidp', res.user.uid);
                    // this.props.handleIsAuth(true);
                    // console.log("password screen signin-response------>");
                    Router.push('/')

                }).catch((error) => {
                    console.log("signin-error------>", error);
                    this.setState({ isLoading: false, emailError: true });

                    if (error.code === 'auth/user-not-found') {
                        // toast.error(`There is no user record corresponding to this identifier. The user may have been deleted.`, { position: toast.POSITION.TOP_CENTER });
                        this.setState({ alertError: true, messageAlert: `There is no user record corresponding to this identifier. The user may have been deleted.` });
                        this.handleSetInterval();
                        console.log(`There is no user record corresponding to this identifier. The user may have been deleted.`)
                    }
                    else if (error.code === 'auth/wrong-password') {
                        // toast.error(`Your password is incorrect. Please try again or reset your password.`, { position: toast.POSITION.TOP_CENTER });
                        this.setState({ alertError: true, messageAlert: 'Your password is incorrect. Please try again or reset your password.' });
                        this.handleSetInterval();
                        console.log(`Your password is incorrect. Please try again or reset your password.`)
                    }
                    else {
                        // toast.error(error.message, { position: toast.POSITION.TOP_CENTER });
                        this.setState({ alertError: true, messageAlert: error.message });
                        this.handleSetInterval();
                        console.log(error.message)
                    }
                })
        } else {
            console.log("in-validation-error");
            this.setState({ isLoading: false });
        }
    }


    render() {
        return (
            <React.Fragment>
                <Container fluid className="px-3">
                    <Row className="min-vh-100">
                        <Col md="8" lg="6" xl="5" className="d-flex align-items-center">
                            <div className="w-100 py-5 px-md-5 px-xl-6 position-relative">
                                <div className="mb-3">
                                    {/* <img
                                src="/content/svg/logo-square.svg"
                                alt="..."
                                style={{ maxWidth: "4rem" }}
                                className="img-fluid mb-3"
                            /> */}
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

                                </div>
                                <Form className="form-validate" onSubmit={this.handleLogin} >
                                    <FormGroup >
                                        <div className="text-center">
                                            <Label for="loginUsername" className="form-label" style={{ letterSpacing: "1px", textTransform: "none", fontWeight: "550", fontSize: "1rem" }}>
                                                Log in with email
                                            </Label>
                                        </div>
                                        <Input
                                            name="password"
                                            id="loginPassword"
                                            type="password"
                                            placeholder="Enter your password"
                                            autoComplete="off"
                                            required
                                            onChange={(e) => this.handleOnChange(e)}
                                            style={{ border: this.state.passwordError ? '1px solid #c64444' : '' }}
                                        />
                                    </FormGroup>
                                    <Button
                                        style={{ textTransform: "none", fontWeight: "500", fontSize: "1rem" }}
                                        size="lg"
                                        color="primary"
                                        block
                                        disabled={this.state.isLoading}
                                        onClick={this.handleLogin}
                                    >
                                        {this.state.isLoading && <span className="spinner-border text-light mr8" role="status" />}
                                    Log In
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
                                            Forgot your username or password?&nbsp;
                                        {/* <Button
                                    
                                        color="primary"
                                        block
                                        // disabled={this.state.isLoading}
                                        onClick={this.handleRecoverAccount}
                                    >
                                        {this.state.isLoading && <span className="spinner-border text-light mr8" role="status" />}
                                        Recover account
                            </Button> */}
                                            {/* <p style={{cursor:"pointer" , color:'blue'}} onClick={this.handleRecoverAccount}>Recover account</p> */}

                                            <Link href="/RecoverAccount">
                                                <a>Recover account</a>
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
