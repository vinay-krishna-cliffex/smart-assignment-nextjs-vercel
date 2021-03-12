import React, { Component } from 'react'
import { toast } from 'react-toastify';
import Link from 'next/link'
import { validateEmail } from '../utils/FormValidater';
// import { ToastMsg } from '../component/ToastMsg';
import firebase from '../utils/Fire';
import { Container, Row, Col, Button, Form, Input, Label, FormGroup } from 'reactstrap'
import Router from 'next/router'

export default class PasswordScreen extends Component {


    constructor(props) {
        super(props);
        this.state = {
            email: '', emailError: false,

            alertStatus: false,
            alertMessage: '',
            isLoading: false,
            LoadingIs: false,
            dangerStatus: false,
            alertError: false,
            messageAlert: '',
            alertSuccess: false,
            messageAlertSuccess: '',
            isGoogleLoading: false,
            isFbLoading: false,
            routeState: {},
        }
    }

    handleSetInterval = () => {
        setTimeout(
            () => this.setState({ alertError: false, messageAlert: '' }),
            8000
        );
    }

    handleCloseAlert = () => {
        this.setState({ alertError: false, messageAlert: '', alertSuccess: false, messageAlertSuccess: '' })
    }

    handleSetIntervalSuccess = () => {
        setTimeout(
            () => this.setState({ alertSuccess: false, messageAlertSuccess: '' }),
            8000
        );
    }

    handleOnChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        e.target.name === 'email' && this.setState({ emailError: false });

    }

    validateForm() {
        const { email } = this.state;
        !validateEmail(email) && this.setState({ emailError: true });

        return validateEmail(email) > 0;
    };


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


    /*------------------------------------------------------------handle-user-resetpassword-------------------------------------------------*/


    handleResetPassword = (e) => {
        e.preventDefault();
        const { email } = this.state;
        this.setState({ isLoading: true });

        if (this.validateForm()) {
            firebase.auth().sendPasswordResetEmail(email)
                .then((res) => {
                    // toast.success(<ToastMsg message="Password reset request sent to your email." />, { position: toast.POSITION.TOP_CENTER });
                    this.setState({ isLoading: false, alertSuccess: true, messageAlertSuccess: 'Password reset request sent to your email.' });
                    this.handleSetIntervalSuccess();
                    Router.push({ pathname: '/login' });
                }).catch((error) => {
                    console.log(error);
                    // toast.error(error.message, { position: toast.POSITION.TOP_CENTER });
                    this.setState({ isLoading: false, alertError: true, messageAlert: error.message });
                    this.handleSetInterval();
                })
        } else {
            console.log("in-validation-error");
            this.setState({ isLoading: false });
        }
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
                console.log("google-login-error----->", error);
            });
    }


    render() {
        return (
            <React.Fragment>
                <Container fluid className="px-3">
                    <Row className="min-vh-100">
                        <Col md="8" lg="6" xl="5" className="d-flex align-items-center">
                            <div className="w-100 py-5 px-md-5 px-xl-6 position-relative">
                                <div className="mb-5">
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
                                <Form className="form-validate" onSubmit={this.handleLogin}>
                                    <FormGroup className="mb-4">
                                        <div className="text-center">
                                            <h3 className="bold mb0">Recover your account</h3>
                                            <p className="">Did you remember your password? <Link href="/login"><a >log in.</a></Link></p>
                                        </div>
                                        <Input
                                            name="email"
                                            id="loginUsername"
                                            type="email"
                                            placeholder="Please enter your email address."
                                            autoComplete="off"
                                            required
                                            onChange={(e) => this.handleOnChange(e)}
                                            style={{ border: this.state.emailError ? '1px solid #c64444' : '' }}
                                        />
                                    </FormGroup>
                                    <Button
                                        style={{fontWeight: "500", fontSize: "1rem" }}
                                        size="lg"
                                        color="primary"
                                        block
                                        disabled={this.state.isLoading}
                                        onClick={this.handleResetPassword}
                                    >
                                        {this.state.isLoading && <span className="spinner-border text-light mr8" role="status" />}
                                        RECOVER ACCOUNT
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

{/* <React.Fragment>
                
                <h3 className="bold mb0">Recover your account</h3>
                <p className="">Did you remember your password? <Link to="/access/login">Log in.</Link></p>
                <form className="text-left" onSubmit={this.handleLogin}>
                    <input type="text" name="email" placeholder="Please enter your email address." onChange={(e) => this.handleOnChange(e)} style={{ border: this.state.emailError ? '1px solid #c64444' : '' }} />
                
                    <button type='submit' disabled={this.state.isLoading} onClick={this.handleResetPassword}>
                        {this.state.isLoading && <span className="spinner-border text-light mr8" role="status" />}
                        RECOVER ACCOUNT
                    </button>
                </form>
                </React.Fragment> */}