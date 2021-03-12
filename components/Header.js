import React, { Component } from 'react';
import Link from 'next/link'
// import ErrorHandling from '../components/ErrorHandling';
// import NotFound from '../components/NotFound';
import Modal from 'react-modal';
import MaskedInput from "react-maskedinput";
import axios from 'axios';
import { Baseurl } from '../utils/Baseurl';
import { toast } from 'react-toastify';
//import store from '../store/Store';
import OtpInput from 'react-otp-input';
import Router from 'next/router'
import firebase from '../utils/Fire';
import defaultImage from '../images/images.jpeg';
import { connect } from 'react-redux';
import { SAVE_USER_IN_REDUX, HANDLE_AUTH } from "../actions/Action"
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Container,
    Input,
    Button,
} from 'reactstrap'

import UseWindowSize from '../hooks/UseWindowSize'

import ActiveLink from './ActiveLink'
// import Logo from '../public/content/svg/logo.svg'

import menu from '../data/menu.json'

import userMenu from '../data/user-menu.json'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',

    }
};



class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthLoading: true,
            isAuth: false,
            signingUp: false,
            googlePopup: false,
            dob: '',
            dobError: false,
            mobile: '',
            mobileError: false,
            user: {
                displayName: ''
            },
            userDetail: {},
            isModal: false,
            otp: '',
            collapsed: false,
            dropdownOpen: {},
            searchFocus: false,
            dropdownAnimate: false,
            parentName: false,
            alertError: false,
            messageAlert: '',
            alertSuccess: false,
            messageAlertSuccess: '',
            checkSignupAuth: false
        }
    }


    checkAuth = () => {
        firebase.auth().onAuthStateChanged((user) => {
            // console.log("user:", user);
            if (user && localStorage.getItem("signingUp") !== "true") {
                // console.log("user uid:", user.uid);
                // if (user.emailVerified) {
                // console.log("!!@#$#$#",user.uid)
                this.getUser(user.uid)
                    .then(res => {
                        //  console.log('header ------>', res);
                        const userDetail = res.data.user;
                        localStorage.setItem("hasIns", userDetail.hasInsurance);

                        if (userDetail.dob && userDetail.mobile) {
                            // console.log('111111 ', user);
                            this.setState({ isAuth: true, isAuthLoading: false, googlePopup: false, userDetail }, () => this.props.handleuserdata(userDetail));

                            // console.log('true hai');
                        } else {
                            // console.log('222222 ', user);
                            this.setState({ isAuth: true, isAuthLoading: false, googlePopup: true, user }, () => this.props.handleuserdata(userDetail));
                            // console.log('false hai');
                        }
                        // console.log("user details",userDetail)

                    })
                    .catch(err => {
                        console.log('getUser error: ');
                        // console.log('getUser: ', user);
                        let data = {
                            uid: user.uid,
                            email: user.email,
                            first_name: user.displayName ? user.displayName.split(' ')[0] : '',
                            last_name: user.displayName ? user.displayName.split(' ').pop() : '',
                            signUpType: 1
                        };
                        this.createUser(data)
                            .then(dbUser => {
                                console.log('dbUser created:');
                                const userDetail = dbUser.data.data;
                                this.setState({ isAuth: true, isAuthLoading: false, googlePopup: true, user });
                                this.props.handleuserdata(userDetail)
                            })
                            .catch(error => console.log('creating dbUser error: '));
                    })
                // } else {
                //     // firebaseApp.auth().signOut();
                //     // this.props.history.push('/access/login');
                //     // toast.warn('Please verify your email.', { position: toast.POSITION.TOP_CENTER });
                //     this.setState({ isAuth: false, isAuthLoading: false });
                // }
            }
            else {
                this.setState({ isAuth: false, isAuthLoading: false });
            }

        });
    }

    componentDidMount() {
        // window.location.reload();
        // console.log("header comdidmount")
        localStorage.setItem("signingUp", false)
        this.checkAuth();
        this.highlightDropdownParent();
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
            5000
        );
    }

    getUser(uid) {
        // console.log("header getUser", uid)
        return axios({
            method: 'get',
            url: Baseurl + `api/user/getuserdetails?userId=${uid}`,
            headers: { 'content-type': 'application/json' }
        })
    }


    createUser(data) {
        return axios({
            method: 'post',
            url: Baseurl + 'api/user/register',
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        })
    }


    handleOnChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        e.target.name === 'mobile' && this.setState({ mobileError: false });
        e.target.name === 'dob' && this.setState({ dobError: false });
    }

    // handleAuthState = (state) => {
    //     this.setState({ isAuth: state });
    // };

    signingUp = (state) => {
        this.setState({ signingUp: state })
    };

    validateForm() {
        const [month, date, year] = this.state.dob.split('/');
        const valid_date = new Date(`${year}-${month}-${date}`);

        this.state.mobile.length < 6 && this.setState({ mobileError: true });
        (String(valid_date) === 'Invalid Date' || this.state.dob.split('_').length > 1 || this.state.dob.length < 1) && this.setState({ dobError: true });
        return this.state.mobile.length > 5 && String(valid_date) !== 'Invalid Date' && this.state.dob.split('_').length < 2 && this.state.dob.length > 0;
    }


    /*------------------------------------updateMobileandDob---------------------------*/

    updateMobileandDob = () => {

        if (this.validateForm()) {
            axios({
                method: 'post',
                url: Baseurl + `api/phone_auth/send_verification_code?phone=${this.state.mobile}&email=${this.state.user.email}&type=googleLogin`,
                headers: { 'content-type': 'application/json' }
            }).then((res) => {
                console.log(res);
                this.setState({ googlePopup: false, isModal: true });
                // toast.success('A verification code has been sent to you via email or SMS. Please enter code here to verify your phone number.', { position: toast.POSITION.TOP_CENTER });
                this.setState({ alertSuccess: true, messageAlertSuccess: 'A verification code has been sent to you via email or SMS.' })
                this.handleSetIntervalSuccess();
            }).catch((error) => {
                console.log("error--->", error);
                this.setState({ isModal: false });
            })
        }
        else {
            console.log("invalid details-------:");
        }

    };


    reload = () => {
        console.log('Reloaded..');
        this.componentDidMount();
    };


    /*----------------------------------------------handleVerifyOtp-------------------------------*/

    handleVerifyOtp = () => {
        var code = this.state.otp;
        if (!code) {
            // toast.error('Enter your code.', { position: toast.POSITION.TOP_CENTER });
            this.setState({ alertError: true, messageAlert: "Enter your code." });
            this.handleSetInterval();
        }
        else {
            axios({
                method: 'post',
                url: Baseurl + `api/phone_auth/verify_code?phone=${this.state.mobile}&code=${code}&user_email=${this.state.user.email}`,
                headers: { "content-type": 'application/json' }
            }).then((res) => {
                console.log(res);
                setTimeout(() => {
                    this.handlesaveUserMobile();
                }, 3000)

            }).catch((err) => {
                console.log(err);
                // toast.error('You have entered an incorrect code. Please enter again or request new code.', { position: toast.POSITION.TOP_CENTER });
                this.setState({ alertError: true, messageAlert: "You have entered an incorrect code. Please enter again or request new code." });
                this.handleSetInterval();
            })
        }

    }

    /*------------------------------------handlesaveUserMobile-----------------------------*/


    handlesaveUserMobile = () => {
        let data = {
            mobile: this.state.mobile,
            dob: this.state.dob,
            first_name: this.state.user.displayName ? this.state.user.displayName.split(' ')[0] : '',
            last_name: this.state.user.displayName ? this.state.user.displayName.split(' ').pop() : '',
            profile_status: '0',
        };

        axios({
            method: 'post',
            url: Baseurl + `api/user/saveuserdetails?userId=${this.state.user.uid}`,
            headers: { 'content-type': 'application/json' },
            data: data
        }).then((res) => {
            // console.log("handle-save-userProfile-response----->", res);
            // toast.success('Successfully saved !', { position: toast.POSITION.TOP_CENTER });
            this.setState({ alertSuccess: true, messageAlertSuccess: 'Successfully saved !' })
            this.handleSetIntervalSuccess();
            this.componentDidMount();
            this.setState({ isAuth: true, isModal: false });
            Router.push("/setting")
        }).catch((error) => {
            console.log("handle-save-userProfile-error----->", error);
            this.setState({ isModal: false, googlePopup: true, alertError: true, messageAlert: "ou have entered an incorrect code. Please enter again or request new code." });
            // toast.error('Something went wrong during update!');
            this.handleSetInterval();
        })
    }




    /*-----------------------------------handleResentOtp------------------------------*/

    handleResentOtp = (e) => {
        e.preventDefault();
        this.setState({ otp: '' });

        axios({
            method: 'post',
            url: Baseurl + `api/phone_auth/send_verification_code?phone=${this.state.mobile}&email=${this.state.user.email}&type=googleLogin`,
            headers: { 'content-type': 'application/json' }
        }).then((res) => {
            console.log(res);
            // toast.success('A verification code has been sent to you via email or SMS. Please enter code here to verify your phone number.', { position: toast.POSITION.TOP_CENTER });
            this.setState({ alertSuccess: true, messageAlertSuccess: 'A verification code has been sent to you via email or SMS.' })
            this.handleSetIntervalSuccess();

        }).catch((error) => {
            console.log("error--->", error);
        })
    }


    closeverifyMobileModal = (e) => {
        e.preventDefault();
        toast.dismiss();
        this.setState({ isModal: false, googlePopup: true, otp: '' });
    }


    focus = () => {
        this.setState({ searchFocus: !this.state.searchFocus });
    }


    toggleDropdown = (name) => {
        this.setState({
            dropdownOpen: { ...this.state.dropdownOpen, [name]: !this.state.dropdownOpen[name] }
        })
    }


    handleLogout = () => {
        firebase.auth().signOut()
            .then((res) => {
                setTimeout(() => {

                    localStorage.removeItem('viewReviewAllId');
                    localStorage.removeItem("scheduleAppId");
                    localStorage.removeItem("viewProfileId");
                    localStorage.removeItem("homeQuerys");
                    localStorage.removeItem("settingId");
                    localStorage.removeItem('uidp');
                    // if (!window.location.hash) {
                    //     window.location.reload();
                    // }
                    console.log("handleLogout")
                    this.props.handleauth(false)
                    Router.push("/")
                }, 600);

            }).catch((err) => {
                console.log(err);
            })
    }

    onLinkClick = (parent) => {
        size.width < 991 && this.setState({ collapsed: !this.state.collapsed })
        this.setState({ ParentName: parent })

    }

    // highlight not only active dropdown item, but also its parent, i.e. dropdown toggle
    highlightDropdownParent = () => {
        menu.map(item => {
            item.dropdown && item.dropdown.map(dropdownLink => {
                dropdownLink.link && dropdownLink.link === Router.route && this.setState({ ParentName: item.title })
                dropdownLink.links && dropdownLink.links.map(link => link.link === Router.route && setParentName(item.title))
            }
            )
            item.megamenu && item.megamenu.map(megamenuColumn =>
                megamenuColumn.map(megamenuBlock =>
                    megamenuBlock.links.map(dropdownLink => {
                        if (dropdownLink.link === Router.route) {
                            dropdownLink.parent ? this.setState({ ParentName: dropdownLink.parent }) : this.setState({ ParentName: item.title })
                        }
                    })
                )
            )
            item.link === Router.route && this.setState({ ParentName: item.title })
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.isauth && !this.props.userdetail.first_name){
            this.checkAuth();
        }
        // setTimeout(() => {
        //     if (Router.route === "/" && !this.state.isAuth && localStorage.getItem('uidp')) {
        //         this.checkAuth();
        //     }
        // }, 100)
    }


    render() {
        const {
            collapsed,
            dropdownOpen,
            dropdownAnimate,
            searchFocus
        } = this.state;

        const { userdetail, isauth } = this.props;
// console.log(isauth,'reduser isAuth')

        const size = new UseWindowSize()

        return (
            <header>
                {/* <header className={`header ${this.props.headerclasses ? this.props.headerclasses : ''}`}
                // handleIsAuth={this.handleAuthState}
                //  isAuth={this.state.isAuth}
                {...this.props}></header> */}
                <>
                    <Modal
                        isOpen={this.state.googlePopup}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel="Modal"
                    >
                        <React.Fragment>
                            <h5 style={{ fontSize: 16, marginBottom: "1rem" }}>We need some details to continue.</h5>
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
                            <div className='col-sm-12'>
                                <div className="row">
                                    <div className='col-sm-12 ' >
                                        <span>Date of birth</span>
                                        <fieldset >
                                            <MaskedInput mask="11/11/1111"
                                                name="dob"
                                                placeholder="MM/DD/YYYY"
                                                onChange={(e) => this.handleOnChange(e)}
                                                style={{ marginTop: ".5rem", marginBottom: ".7rem", height: 45, width: '100%', border: this.state.dobError ? '1px solid #c64444' : '1px solid transparent', paddingLeft: 25, background: '#f5f5f5', outline: 'none' }}
                                            />
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-12'>
                                <div className="row">
                                    <div className='col-sm-12 ' >
                                        <span>Mobile</span>
                                        <Input
                                            type="text" name="mobile" placeholder="Mobile number" value={this.state.mobile}
                                            onChange={(e) => this.handleOnChange(e)}
                                            maxLength={10}
                                            className="border-0 shadow-0"
                                            onKeyPress={(e) => (e.charCode >= 48 && e.charCode <= 57) ? true : e.preventDefault()}
                                            style={{ marginTop: ".5rem", marginBottom: "1rem", height: "3rem", fontSize: "1rem", backgroundColor: "rgb(245, 245, 245)" }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-12'>
                                <div className="row">
                                    <div className='col-sm-12 text-center' >
                                        <Button color="primary" style={{ width: '7rem', letterSpacing: '0.1em' }}
                                            onClick={this.updateMobileandDob}
                                        >
                                            Ok
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>

                    </Modal>


                    <Modal
                        isOpen={this.state.isModal}
                        style={customStyles}
                        contentLabel="Modal">
                        <React.Fragment>

                            <div style={{ textAlign: 'center' }} className="otp_input">
                                <div className="singup_modal_closing">
                                    <h4 className="singup_modal_code">Enter verification code</h4>
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

                                <OtpInput
                                    onChange={otp => this.setState({ otp: otp })}
                                    onKeyPress={(e) => (e.charCode >= 48 && e.charCode <= 57) ? true : e.preventDefault()}
                                    numInputs={6}
                                    value={this.state.otp}
                                    isInputNum={false}
                                    shouldAutoFocus={true}
                                />
                                <button className="popUpButton" style={{ marginTop: 25, marginLeft: 0, width: "6rem" }} onClick={this.handleVerifyOtp}>Verify</button>
                                <button className="popUpButton" style={{ marginTop: 25, marginLeft: 10, width: "9rem" }} onClick={(e) => this.handleResentOtp(e)}>Resend Code</button>
                                <button className="popUpButton" style={{ marginTop: 25, marginLeft: 10, width: "13rem" }} onClick={(e) => this.closeverifyMobileModal(e)}>Change mobile number.</button>
                            </div>
                        </React.Fragment>
                        {/* <div style={{ textAlign: 'center' }}>
                            <h3>Enter verification code</h3>
                            <OtpInput
                                onChange={otp => this.setState({ otp: otp })}
                                onKeyPress={(e) => (e.charCode >= 48 && e.charCode <= 57) ? true : e.preventDefault()}
                                numInputs={6}
                                value={this.state.otp}
                                isInputNum={false}
                                shouldAutoFocus={true}
                                inputStyle={{
                                    width: '5rem',
                                    height: '5rem',
                                    margin: '0 1rem',
                                    fontSize: '2rem',
                                    borderRadius: '4px',
                                    border: '1px solid rgba(0,0,0,0.3)'
                                }}
                            />
                            <button className="popUpButton" style={{ marginTop: 25, marginLeft: 20 }} onClick={this.handleVerifyOtp}>Verify</button>
                            <button className="popUpButton" style={{ marginTop: 25, marginLeft: 20 }} onClick={(e) => this.handleResentOtp(e)}>Resend Code</button>
                            <button className="popUpButton" style={{ marginTop: 25, marginLeft: 20 }} onClick={(e) => this.closeverifyMobileModal(e)}>Change mobile number.</button>
                        </div> */}
                    </Modal>
                </>
                { this.state.isAuthLoading ?
                    // <Navbar
                    //     color={this.props.nav.color ? this.props.nav.color : "white"}
                    //     light={this.props.nav.light && true}
                    //     dark={this.props.nav.dark && true}
                    //     fixed={this.props.nav.fixed ? this.props.nav.fixed : "top"}
                    //     expand="lg"
                    //     className={`${this.props.nav.classes ? this.props.nav.classes : ""} shadow `}
                    // >
                    //     <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    //         <div className="spinner-border" role="status">
                    //             <span className="sr-only">Loading...</span>
                    //         </div>
                    //     </div>
                    // </Navbar>
                    null
                    :

                    <Navbar
                        color={this.props.nav.color ? this.props.nav.color : "white"}
                        light={this.props.nav.light && true}
                        dark={this.props.nav.dark && true}
                        fixed={this.props.nav.fixed ? this.props.nav.fixed : "top"}
                        expand="lg"
                        className={`${this.props.nav.classes ? this.props.nav.classes : ""} shadow `}
                    >
                        <Container fluid={true}>
                            <div className="d-flex align-items-center">
                                <Link href="/" passHref>
                                    <a className="py-1 navbar-brand">
                                        {/* <img src={Logo} alt="Directory logo" /> */}
                                        <img src={require('../public/content/svg/smartappt-logo.svg')} />
                                    </a>
                                </Link>
                            </div>
                            <NavbarToggler
                                onClick={() => this.setState({ collapsed: !collapsed })}
                                className="navbar-toggler-right"
                            >
                                <i className="fa fa-bars"></i>

                            </NavbarToggler>
                            {/* {console.log(this.state.isAuth,'isAuth',localStorage.getItem('uidp'))} */}
                            <Collapse isOpen={collapsed} navbar>
                                {this.state.isAuth || isauth ?
                                    <Nav navbar className="ml-auto">
                                        <NavItem
                                            key="Search Providers"
                                            className='mt-3 mt-lg-0 ml-lg-3 d-lg-none d-xl-inline-block'>
                                            <ActiveLink activeClassName="active" href="/" passHref ><NavLink >Search Providers</NavLink></ActiveLink>
                                        </NavItem>
                                        <NavItem
                                            key="View Appointment"
                                            className='mt-3 mt-lg-0 ml-lg-3 d-lg-none d-xl-inline-block'>
                                            <ActiveLink activeClassName="active" href="/viewAppointments" passHref><NavLink >View Appointment</NavLink></ActiveLink>
                                        </NavItem>
                                        <NavItem
                                            key="View Reviews"
                                            className='mt-3 mt-lg-0 ml-lg-3 d-lg-none d-xl-inline-block'>
                                            <ActiveLink activeClassName="active" href="/viewReviews" passHref><NavLink >View Reviews</NavLink></ActiveLink>
                                        </NavItem>
                                        {userMenu && userMenu.map(item =>
                                            <Dropdown
                                                nav
                                                inNavbar
                                                key={item.title}
                                                className={item.type === "avatar" ? "ml-lg-3" : ""}
                                                isOpen={dropdownOpen[item.title]}
                                                toggle={() => this.toggleDropdown(item.title)}
                                            >
                                                <DropdownToggle
                                                    nav
                                                    style={item.type === "avatar" && { padding: 0 }}
                                                    onClick={() => this.setState({ ...dropdownAnimate, [item.title]: !dropdownOpen[item.img] })}
                                                >
                                                    {item.type === "avatar" ? <div className="">

                                                        <img src={defaultImage} alt={item.title} className="avatar avatar-sm avatar-border-white mr-2" />
                                                         <span className="inline-d">{userdetail ? userdetail.first_name : ''}</span></div>
                                                        :
                                                        item.title
                                                    }
                                                </DropdownToggle>
                                                <DropdownMenu className={dropdownAnimate['Jack London'] === false ? 'hide' : ''} right>
                                                    <ActiveLink key="Invite" activeClassName="active" href="/invite" passHref>
                                                        <DropdownItem >
                                                            Invite
                                                            </DropdownItem>
                                                    </ActiveLink>

                                                    <ActiveLink key="Setting" activeClassName="active" href="/setting" passHref>
                                                        <DropdownItem >
                                                            Settings
                                                            </DropdownItem>
                                                    </ActiveLink>
                                                    <DropdownItem onClick={()=>this.handleLogout()}>
                                                        Sign out
                                                            </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        )}
                                    </Nav>
                                    :
                                    <Nav navbar className="ml-auto">
                                        <NavItem
                                            key="Search Providers"
                                            className='mt-3 mt-lg-0 ml-lg-3 d-lg-none d-xl-inline-block'>

                                            <Link href="/" passHref><NavLink>Search Providers</NavLink></Link>
                                        </NavItem>
                                        <NavItem
                                            key="For Provider"
                                            className='mt-3 mt-lg-0 ml-lg-3 d-lg-none d-xl-inline-block'>
                                            <Link href="//doctor.smartappointment.com" passHref><NavLink target="_blank">For Provider</NavLink></Link>
                                        </NavItem>
                                        <NavItem
                                            key="Sign in"
                                            className='mt-3 mt-lg-0 ml-lg-3 d-lg-none d-xl-inline-block'>
                                            <Link href="/login" passHref><NavLink>Sign in</NavLink></Link>
                                        </NavItem>
                                        <NavItem
                                            key="Sign up"
                                            className='mt-3 mt-lg-0 ml-lg-3 d-lg-none d-xl-inline-block'>
                                            <Link href="/signup" passHref><NavLink> Sign up</NavLink>
                                            </Link>
                                        </NavItem>

                                        {/* <a className="mt-3 mt-lg-0 ml-lg-3 d-lg-none d-xl-inline-block nav-item nav-link" href="/signup" >Sign up</a> */}
                                    </Nav>
                                }
                            </Collapse>
                        </Container>
                    </Navbar>
                }
            </header >
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
        handleuserdata: data => dispatch({ type: SAVE_USER_IN_REDUX, data }),
        handleauth: data => dispatch({ type: HANDLE_AUTH, data })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);