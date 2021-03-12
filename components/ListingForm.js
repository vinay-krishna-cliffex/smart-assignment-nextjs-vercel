import React from 'react';
import { connect } from 'react-redux';
import { GETUSER_DETAILS_REQUEST, DOC_PROFILE_REQUEST } from '../actions/Action';
import { Baseurl } from '../utils/Baseurl';
// import { toast } from 'react-toastify';
import axios from 'axios';
// import UpdatePasswordErrorToast from '../components/UpdatePasswordErrorToast';
import firebase from '../utils/Fire';
import Router from 'next/router'
import MaskedInput from "react-maskedinput";
// import InsuranceErrorToast from "../components/InsuranceErrorToast";
// import { ToastMsg } from "../components/ToastMsg";

import { Row, Col, Form, Button } from 'reactstrap'
import Modal from 'react-modal';

import Select from 'react-select'

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


const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        borderStyle: 'transparent',
    }),
    indicatorSeparator: (provided, state) => ({
        display: 'none'
    }),
    menu: (provided, state) => ({
        ...provided,
        color: 'red',
        border: '0 solid #fff',
        boxShadow: '0 0 1.2rem rgba(0, 0, 0, .15)',
        fontSize: '13px'

    }),
    placeholder: (provided, state) => ({
        ...provided,
        fontSize: '11px'

    })
}

class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            zip: '',
            mobile: '',
            mobileError: false,
            dob: '',
            btnDisabled: true,
            options: [
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
            ],
            selectedOption: { value: 'Male', label: 'Male' },
            new_password: '', newPasswordError: false,
            confirm_password: '', confirmPasswordError: false,
            isLoading: false,
            payer_name: "",
            mamber_id: "",
            dob: "",
            userFirstname: "",
            userLastname: "",

            payerNameList: [],
            insuranceId: "",
            vStatus: "",
            disabledForm: false,
            routeState: {},
            doc_npi: "",
            doc_first_name: "",
            doc_last_name: "",
            isLoading: false,
            userInsurancePayerCode: "",
            patient_obj_id: "",
            doctor_obj_id: "",
            isMedicaid: 0,
            Medicaid: "",
            alertError: false,
            messageAlert: '',
            alertSuccess: false,
            messageAlertSuccess: '',
            isModal: false,
            scroolId: '',
            updatePasswordErrorModal: false,
            alertErrorPassword: false,
            messageAlertPassword: '',
            alertSuccessPassword: false,
            messageAlertSuccessPassword: '',
            alertErrorInsurance: false,
            messageAlertInsurance: '',
            alertSuccessInsurance: false,
            messageAlertSuccessInsurance: '',
            hasInsurance: '',
            insuranceModal: false,
            fillInsurance: "no",
            payerNameListSelect: [],
            insuranceVerifiedRedirect:false,
            genders:''
        }
    }


    componentDidMount() {
        window.scrollTo(0, 0);
        let id = localStorage.getItem('uidp');
        this.props.handleGetUserDetails(id);
        if (localStorage.getItem('settingId')) {
            var values = JSON.parse(localStorage.getItem('settingId'));
        }

        // console.log('setting')
        if (values) {
            this.setState({ routeState: values, scroolId: values.scroll_id ? values.scroll_id : '', hasInsurance: localStorage.getItem("hasIns"), fillInsurance: values.fillInsurance ? values.fillInsurance : 'no' });
        } else {
            this.setState({ routeState: Router.query, scroolId: window.location.search.split('=').length > 3 ? window.location.search.split('=')[3] : '', hasInsurance: localStorage.getItem("hasIns") });
        }

        this.handleGetPayer()
            .then((res) => {
                // console.log('insurance comdidmount', res.data)
                const arr = [];
                // console.log('res.data', res.data)
                res.data.map((obj) => {
                    arr.push({ value: obj.payerName, label: obj.payerName })
                })
                this.setState({ payerNameListSelect: arr, payerNameList: res.data });
                // console.log("listing form 00000", id)
                this.props.handleGetUserDetails(id);
            })
            .catch((error) => {
                console.log("error-------->");
            });

        if (Router.query.doctor_id) {
            // console.log("listing form", Router.query, Router.query.doctor_id)
            this.props.handleGetDocDetails(Router.query.doctor_id);
        }
        // this.handleGetPayersFromPverify();
    }

    componentWillUnmount() {
        localStorage.removeItem('settingId');
    }

    handleGoToSearch = () => {
        // this.props.history.push('/searchdoc?name=&zip=&insurance_provider=');

        let data = { name: '', practice_name: '', insurance_provider: 'cash pay', zip: '', consultAt: "" }
        localStorage.setItem("homeQuerys", JSON.stringify(data));
        let insuranceData = 'cash-pay'
        Router.router.push(`/doctors?${insuranceData}`);
    }


    handleLogout = () => {
        firebase.auth().signOut()
            .then((res) => {
                setTimeout(() => {
                    localStorage.removeItem('uidp');
                    this.setState({ updatePasswordErrorModal: false });
                    Router.push('/login');
                }, 500);

            }).catch((err) => {
                console.log(err);
                this.setState({ updatePasswordErrorModal: false });
            })
    }

    handleSetInterval = () => {
        setTimeout(
            () => this.setState({ alertError: false, messageAlert: '' }),
            5000
        );
    }

    handleSetIntervalSuccess = () => {
        setTimeout(
            () => this.setState({ alertSuccess: false, messageAlertSuccess: '' }),
            5000
        );
    }


    handleSetIntervalInsurance = () => {
        setTimeout(
            () => this.setState({ alertErrorInsurance: false, messageAlertInsurance: '' }),
            5000
        );
    }

    handleSetIntervalSuccessInsurance = () => {
        setTimeout(
            () => this.setState({ alertSuccessInsurance: false, messageAlertSuccessInsurance: '' }),
            10000
        );
    }


    handleSetIntervalPassword = () => {
        setTimeout(
            () => this.setState({ alertErrorPassword: false, messageAlertPassword: '' }),
            5000
        );
    }

    handleSetIntervalSuccessPassword = () => {
        setTimeout(
            () => this.setState({ alertSuccessPassword: false, messageAlertSuccessPassword: '' }),
            5000
        );
    }

    handleCloseAlert = () => {
        this.setState({
            alertError: false,
            messageAlert: '',
            alertSuccess: false,
            messageAlertSuccess: '',
            alertErrorPassword: false,
            messageAlertPassword: '',
            alertSuccessPassword: false,
            messageAlertSuccessPassword: '',
            alertErrorInsurance: false,
            messageAlertInsurance: '',
            alertSuccessInsurance: false,
            messageAlertSuccessInsurance: '',
        })
    }

    closeModal = () => {
        this.setState({ isModal: false, updatePasswordErrorModal: false, insuranceModal: false, isLoading: false, disabledForm: false });
    }

    handleCheckDetails = () => {
        // console.log(this.props);
        this.setState({ isModal: false });
        Router.push({ pathname: '/settings', query: { routename: 'schedule', doctor_id: window.location.search.substring(4), scroolId: "yes" } });
    };

    /*---------------------------------componentWillReceiveProps--------------------------------*/

    UNSAFE_componentWillReceiveProps(props) {
        if (props.userDetails) {
            this.setState({
                email: props.userDetails.email,
                first_name: props.userDetails.first_name ? props.userDetails.first_name : '',
                last_name: props.userDetails.last_name ? props.userDetails.last_name : '',
                mobile: props.userDetails.mobile ? props.userDetails.mobile.substring(props.userDetails.mobile.length - 10, props.userDetails.mobile.length) : '',
                zip: props.userDetails.zip ? props.userDetails.zip : '',
                selectedOption: props.userDetails.gender ? { value: props.userDetails.gender, label: props.userDetails.gender } : { value: 'Male', label: 'Male' },
                dob: props.userDetails.dob,
                btnDisabled: true
            })
        }
        if (props.userDetails) {
            this.setState({
                dob: props.userDetails.dob,
                patient_obj_id: props.userDetails._id,
                insuranceId: props.userDetails.insurance_id,
                userFirstname: props.userDetails.first_name,
                userLastname: props.userDetails.last_name,
                userInsurancePayerCode: props.userDetails.payerCode,
                doc_npi: props.docDetails.npi_number ? props.docDetails.npi_number : "",
                doc_first_name: props.docDetails.first_name
                    ? props.docDetails.first_name
                    : "",
                doc_last_name: props.docDetails.last_name
                    ? props.docDetails.last_name
                    : "",
                doctor_obj_id: Router.query ? props.docDetails._id : "",
            });
        }

        if (props.userDetails.insurance_id) {
            const { state } = Router;
            let payer_nameFilter = this.state.payerNameList.filter(
                (v) => v.payerCode === props.userDetails.payerCode
            );

            if (props.userDetails.isMedicaid == 1) {
                this.setState({ Medicaid: " (Medicaid)" });
            }
            this.setState({
                vStatus: state && state.routename === "schedule" ? "" : "Active",
                disabledForm: !(state && state.routename === "schedule"),
                payer_name:
                    payer_nameFilter.length > 0 ? payer_nameFilter[0].payerName : "",
                mamber_id: props.userDetails.insurance_id,
            });
        } else {
            console.log("don't have any insurance !");
        }
    }

    // handleAddContryCodeInMobileNumber = () => {
    //     this.state.mobile.slice(0, 1) !== '+' && this.setState({ mobile: '+1' })
    // }

    //   ---------------------------------------------------------------------FOR PROFILE SETTING-------------------------------------------------------------------------------------

    handleGetPayer() {
        return axios({
            method: "get",
            url: Baseurl + "api/user/get_payers",
            headers: { "content-type": "application/json" },
        });
    }

    /*---------------------------------handle-onChange--------------------------------*/

    handleOnChangeSelect = (selectedOption) => {
        this.setState({ btnDisabled: false, selectedOption , genders:selectedOption.value });
    }

    handleOnChange = (e) => {
        // let pattern = /^\d{0,10}(?:\.\d{0,2})?$/;


        this.setState({ btnDisabled: false })

        if (e.target.name === 'zip') {
            if (this.state.zip.length >= 5) {
                if (e.target.value.length < this.state.zip.length) {
                    this.setState({ [e.target.name]: e.target.value })
                }
            } else {
                this.setState({ [e.target.name]: e.target.value })
            }
        } else {
            this.setState({ [e.target.name]: e.target.value });
        }
        e.target.name === 'mobile' && this.setState({ mobileError: false });


    }

    handlePlayerNameOnchange = (selectedOption) => {
        // console.log("handlePlayerNameOnchange",selectedOption.value)
        this.setState({ btnDisabled: false, payer_name: selectedOption.value });
    }


    validateFormProfile() {
        this.state.mobile.length < 6 && this.setState({ mobileError: true });
        return this.state.mobile.length > 5;
    }


    /*---------------------------------handle-save user profile--------------------------------*/

    handleSaveProfile = () => {
        let userId = localStorage.getItem('uidp');

        this.setState({ btnDisabled: true });
        let data = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            mobile: this.state.mobile,
            dob: this.state.dob,
            zip: this.state.zip,
            gender: this.state.genders,
            profile_status: (
                this.state.first_name.length > 0 &&
                this.state.last_name.length > 0 &&
                this.state.mobile.length > 0 &&
                this.state.dob.length > 0 &&
                this.state.zip.length > 0 &&
                this.state.genders
            ) ? "1" : "0"
        }

        console.log("this.state.genders",this.state.genders)

        if (this.state.first_name === '') {
            // toast.error('Please enter first name.');
            this.setState({ btnDisabled: false, alertError: true, messageAlert: 'Please enter first name.' });
            this.handleSetInterval();
        }
        else if (this.state.last_name === '') {
            // toast.error('Please enter last name.');
            this.setState({ btnDisabled: false, alertError: true, messageAlert: 'Please enter last name.' });
            this.handleSetInterval();
        }
        else if (this.state.mobile === '' || this.state.mobile.length < 10) {
            // toast.error('Please enter a valid 10-digit phone number.');
            this.setState({ btnDisabled: false, alertError: true, messageAlert: 'Please enter a valid 10-digit phone number.' });
            this.handleSetInterval();
        }
        else if (this.state.zip === '') {
            // toast.error('Please enter your zip code.');
            this.setState({ btnDisabled: false, alertError: true, messageAlert: 'Please enter your zip code.' });
            this.handleSetInterval();
        }
        else if (this.validateFormProfile()) {
            axios({
                method: 'post',
                url: Baseurl + `api/user/saveuserdetails?userId=${userId}`,
                headers: { 'content-type': 'application/json' },
                data: data
            }).then((res) => {
                // console.log("handle-save-userProfile-response----->", res);
                this.setState({ btnDisabled: false, alertSuccess: true, messageAlertSuccess: 'Your profile successfully updated.' });
                this.props.handleGetUserDetails(userId);
                this.handleSetIntervalSuccess();


            }).catch((error) => {
                this.setState({ btnDisabled: false, alertError: true, messageAlert: 'Something went wrong during to update your profile !' });
                this.handleSetInterval();
            })
        }
        else {
            console.log("in-validation-error");
            this.setState({ btnDisabled: false });
        }

    }
    //   ---------------------------------------------------------------------FOR PASSWORD SETTING-------------------------------------------------------------------------------------

    handleOnChangePassword = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        e.target.name === 'new_password' && this.setState({ newPasswordError: false, tooLong: false });
        e.target.name === 'confirm_password' && this.setState({ confirmPasswordError: false });

    }


    /*---------------------------------------handle-validateForm-------------------------------------------*/

    validateForm() {
        const { new_password, confirm_password } = this.state;

        new_password.length < 8 && this.setState({ newPasswordError: true });
        new_password.length > 36 && this.setState({ tooLong: true });

        confirm_password.length < 8 && this.setState({ confirmPasswordError: true });
        confirm_password.length > 36 && this.setState({ tooLong: true });

        new_password !== confirm_password && this.setState({ confirmPasswordError: true, newPasswordError: true, alertErrorPassword: true, messageAlertPassword: 'Your password didn’t match' }, () => {
            // toast.error('Your password didn’t match', { position: toast.POSITION.TOP_CENTER });
            this.handleSetIntervalPassword();
        });


        return new_password.length > 7 && new_password.length < 37 && new_password === confirm_password;
    };


    /*---------------------------------------handle-change-password-------------------------------------------*/


    handleChangePassword = (e) => {
        e.preventDefault();
        const { confirm_password } = this.state;
        this.setState({ isLoading: true });
        if (this.validateForm()) {
            var user = firebase.auth().currentUser;

            user.updatePassword(confirm_password).then((res) => {
                // toast.success(<ToastMsg message="Your password succesfully updated." />, { position: toast.POSITION.TOP_CENTER });
                this.setState({ new_password: '', confirm_password: '', isLoading: false, alertSuccessPassword: true, messageAlertSuccessPassword: 'Your password succesfully updated.' });
                this.handleSetIntervalSuccessPassword();
            }).catch((error) => {
                this.setState({ isLoading: false });
                console.log("update password-error");
                if (error.code === "auth/requires-recent-login") {
                    // toast.error(<UpdatePasswordErrorToast message="For your account security purposes you need to validate your existing account. Please  sign in with original sign in information." />, { position: toast.POSITION.TOP_CENTER });
                    this.setState({ updatePasswordErrorModal: true });
                }
                else {
                    // toast.error(error.message, { position: toast.POSITION.TOP_CENTER });
                    this.setState({ alertErrorPassword: true, messageAlertPassword: error.message });
                    this.handleSetIntervalPassword();
                }
            });
        } else {
            console.log("in-validation-error");
            this.setState({ isLoading: false });
        }
    }

    //   ---------------------------------------------------------------------FOR INSURANCE SETTING-------------------------------------------------------------------------------------
    handleOnchange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };
    // handleOnchangeInsurance = (e) => {
    //     this.setState({ [e.target.name]: e.target.value });
    // };

    redirectToSchedule = () => {
        localStorage.setItem("scheduleAppId", this.state.routeState.doctor_id)
        Router.push(`/scheduleAppointment?${this.state.routeState.doctor_id}`);
    }

    /*------------------------------handle-verify-insurance-api--------------------------------*/

    handleVerifyInsurance = () => {
        // console.log("handleVerifyInsurance")
        this.setState({ isLoading: true, disabledForm: true });
        let date = new Date();
        let yy = date.getFullYear();
        let mm =
            date.getMonth() + 1 > 9
                ? date.getMonth() + 1
                : "0" + (date.getMonth() + 1);
        let dd = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        let fullCurrentDate = `${mm}/${dd}/${yy}`;

        // console.log('777777777777777',this.state.payerNameListSelect.filter(  (value) =>   value.label === this.state.payer_name ))

        let payerCodefilter = this.state.payerNameList.filter(
            (value) =>

                value.payerName === this.state.payer_name
        );
        // console.log('payerCodefilterp', payerCodefilter);

        let data = {
            d_firstname: this.state.doc_first_name
                ? this.state.doc_first_name
                : "nycmc",
            d_lastname: this.state.doc_last_name ? this.state.doc_last_name : "nycmc",
            npi: this.state.doc_npi ? this.state.doc_npi : "1548424039",

            payerName: this.state.payer_name,
            dob: this.state.dob,
            memberID: this.state.mamber_id,
            p_firstname: this.state.userFirstname,
            p_lastname: this.state.userLastname,
            doS_StartDate: fullCurrentDate,
            doS_EndDate: fullCurrentDate,
            user_obj_id: this.state.patient_obj_id,
            doctor_obj_id: this.state.doctor_obj_id ? this.state.doctor_obj_id : "",
        };

        if (this.state.hasInsurance !== "1" || this.state.fillInsurance === "yes") {

            if (this.state.payer_name === "") {
                // toast.error("Please choose your insurance carrier form insurance list.");
                // console.log("tttttttttttttttttttttt", this.state.payer_name)
                this.setState({ isLoading: false, disabledForm: false, alertErrorInsurance: true, messageAlertInsurance: 'Please choose your insurance carrier form insurance list.' });
                this.handleSetIntervalInsurance();
            } else if (this.state.mamber_id === "") {
                // toast.error("Please enter your valid member id.");
                this.setState({ isLoading: false, disabledForm: false, alertErrorInsurance: true, messageAlertInsurance: 'Please enter your valid member id.' });
                this.handleSetIntervalInsurance();
            } else if (this.state.dob === "") {
                // toast.error("Enter your Date of Birth.");
                this.setState({ isLoading: false, disabledForm: false, alertErrorInsurance: true, messageAlertInsurance: 'Enter your Date of Birth.' });
                this.handleSetIntervalInsurance();
            } else if (payerCodefilter.length === 0) {
                // toast.error("Please pick an insurance carrier from the list.");
                this.setState({ isLoading: false, disabledForm: false, alertErrorInsurance: true, messageAlertInsurance: 'Please pick an insurance carrier from the list.' });
                this.handleSetIntervalInsurance();
            } else {
                axios({
                    method: "post",
                    url: Baseurl + "api/user/verify_insurance",
                    headers: { "content-type": "application/json" },
                    data,
                })
                    .then((res) => {
                        // console.log("verify-insurance-response------>", res.data.data);
                        let filterData = res.data.data.filter(
                            (value) => value.status === "Active"
                        );

                        if (res.data.isMedicaidInsurance) {
                            this.setState({ isMedicaid: res.data.isMedicaidInsurance });
                        }
                        // console.log(filterData);
                        if (filterData.length === 0) {
                            this.setState({ isLoading: false, disabledForm: false, isModal: true });
                        } else {
                            this.handleSaveInsurance(
                                filterData[0].elgRequestID,
                                filterData[0].extensionProperties.payerCode
                            );
                        }
                    })
                    .catch((error) => {
                        console.log("verify-insurance-error-------->");
                        // toast.error(error.response.data.errorMessage, {
                        //     position: toast.POSITION.TOP_CENTER,
                        // });
                        this.setState({ isLoading: false, disabledForm: false, alertErrorInsurance: true, messageAlertInsurance: error.response.data.errorMessage });
                        this.handleSetIntervalInsurance();
                    });
            }
        } else {
            this.setState({ insuranceModal: true })
        }
    };

    /*------------------------------handle-Save user-Insurance--------------------------------*/

    handleSaveInsurance = (RequestID, payerCode) => {
        let id = localStorage.getItem("uidp");
        // let payer_Code = this.state.payerNameList.filter(value => value.payerName === this.state.payer_name);

        let data = {
            uid: id,
            isMedicaid: this.state.isMedicaid,
            insuranceId: this.state.mamber_id,
            dob: this.state.dob,
            payerCode: payerCode,
        };

        axios({
            method: "post",
            url: Baseurl + "api/user/saveuser_insurance",
            headers: { "Content-Type": "application/json" },
            data,
        })
            .then((res) => {
                // console.log("get-save-insurance-response------->", res);
                // this.setState({ isLoading: false, disabledForm: false, alertSuccessInsurance: true, messageAlertSuccessInsurance: 'Your insurance verified successfully.' });
                // this.handleSetIntervalSuccessInsurance();
                console.log("handleSaveInsurance", this.state.routeState)
                if (this.state.routeState) {
                    if (this.state.routeState.routename === "schedule") {
                        this.setState({ insuranceVerifiedRedirect: true });

                        // localStorage.setItem("scheduleAppId", this.state.routeState.doctor_id)
                        // Router.push(`/scheduleAppointment?${this.state.routeState.doctor_id}`);

                    }
                } else {
                    this.props.handleGetUserDetails(id);
                    // window.location.reload();
                }
                // window.location.reload();
                this.componentDidMount();
            })
            .catch((err) => {
                console.log("get-save-insurance-error------->");
                // toast.error("Something went wrong during save your insurance.");
                this.setState({ isLoading: false, disabledForm: false, alertError: true, messageAlert: 'Something went wrong during save your insurance.' });
                this.handleSetInterval();
            });
    };

    handleDontHaveInsurance = () => {
        let id = localStorage.getItem("uidp");
        this.setState({ isModal: false });

        axios({
            method: "post",
            url: Baseurl + `api/user/setinsuranceflag?uid=${id}`,
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => {
                // console.log("get-save-insurance-response------->", res);
                // this.props.handleGetUserDetails(id);
                // toast.success('Successfully Saved !', { position: toast.POSITION.TOP_CENTER });
                // toast.success(<ToastMsg message="Successfully Saved." />, {
                //     position: toast.POSITION.TOP_CENTER,
                // });
                this.setState({ alertSuccessInsurance: true, messageAlertSuccessInsurance: 'Successfully Saved.' });
                this.handleSetIntervalSuccessInsurance();
                console.log("handleSaveInsurance 11111111", this.state.routeState)
                if (this.state.routeState) {
                    if (this.state.routeState.routename === "schedule") {

                        localStorage.setItem("scheduleAppId", this.state.routeState.doctor_id)
                        // Router.push({
                        //     pathname: `/scheduleAppointment`,
                        //     query: { id: this.state.routeState.doctor_id }
                        // });
                        Router.push(`/scheduleAppointment?${this.state.routeState.doctor_id}`);
                        // this.props.history.push(
                        //     `/${this.state.routeState.routename}/${this.state.routeState.doctor_id}`
                        // );
                    }
                } else {
                    this.props.handleGetUserDetails(id);
                }
            })
            .catch((err) => {
                console.log("get-save-insurance-error------->");
            });
    };

    renderCurrentVerifiedInsurancePayername = () => {
        // console.log("userInsurancePayerCode", this.state.userInsurancePayerCode);
        let arr = [];
        this.state.payerNameList.map((value) => {
            if (value.group) {
                value.group.map((data) => {
                    arr.push(data);
                    return null;
                });
            } else {
                arr.push(value);
            }
            return null;
        });

        let filterData = arr.filter(
            (d) => d.payerCode === this.state.userInsurancePayerCode
        );

        return filterData.map((v, i) => {
            return (
                <div key={i}>
                    {this.isLoading || !this.state.disabledForm ? null : (
                        <p className="text-center" style={{ paddingTop: 15, color: "#47b475", fontSize: ".9rem" }}>
                            Your insurance has been verified with <b><span>{v.payerName}</span>{" "}
                                {this.state.Medicaid}.</b>
                        </p>
                    )}
                </div>
            );
        });
    };

    render() {
        const { selectedOption } = this.state;
        return (
            <React.Fragment>
                <Form className="d-flex flex-column">
                    <Modal
                        isOpen={this.state.isModal}
                        // onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel="Modal"
                    >        <React.Fragment>
                            <h5 style={{ fontSize: 16 }}>Your insurance cannot be verified at this time for one of the following reasons:</h5>
                            <div className='col-sm-12'>
                                <ul>
                                    <li> Your insurance plan name, member ID, or date of birth is incorrect.</li>
                                    <li> Your insurance has expired.</li>
                                    <li> The provider you requested does not accept your insurance.</li>
                                </ul>

                            </div>
                            <h5 style={{ fontSize: 16, paddingTop: '1rem', paddingBottom: '1rem' }}>Would you like to book this ah5pointment using Self pay?</h5>
                            <div className='col-lg-12'>
                                <div className="row">
                                    <div className='col-4 ' style={{ textAlign: 'center' }}>
                                        {/* <button className='btn btn-sm btn-primary btn-filled' onClick={this.handleCheckDetails}>Go back</button> */}
                                        <Button color="primary" style={{ letterSpacing: '0.01rem' }}
                                            onClick={this.handleDontHaveInsurance}
                                        >
                                            Use Self Pay
                                        </Button>
                                    </div>
                                    <div className='col-4' style={{ textAlign: 'center' }}>
                                        {/* <button className='btn btn-sm btn-primary btn-filled' onClick={this.props.handleCash}>Use Self Pay</button> */}
                                        <Button color="primary" style={{ width: '7rem', letterSpacing: '0.01rem' }}
                                            onClick={this.closeModal}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    </Modal>
                    <Modal
                        // isOpen={true}
                        isOpen={this.state.insuranceVerifiedRedirect}
                        style={customStyles}
                        contentLabel="Modal"
                    >
                        <React.Fragment>
                            <h5 style={{ textAlign: "center", fontSize: 16, paddingTop: '1rem' , color:'#47b475' , marginBottom:'1.5rem'}}>Your insurance is verified successfully.</h5>
                            <div className='col-lg-12'>
                                <div className="row" >
                                    <div className='col-12' style={{ textAlign: "center" }}>
                                        <Button color="primary" style={{ width: '5rem'}}
                                            onClick={this.redirectToSchedule}
                                        >
                                            Ok
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    </Modal>
                    <Modal
                        // isOpen={true}
                        isOpen={this.state.updatePasswordErrorModal}
                        style={customStyles}
                        contentLabel="Modal"
                    >
                        <React.Fragment>
                            <h5 style={{ textAlign: "center", fontSize: 16, paddingTop: '1rem' }}>For your account security purposes you need to validate your existing account.</h5>
                            <h5 style={{ textAlign: "center", fontSize: 16, paddingBottom: '1rem' }}> Please  sign in with original sign in information.</h5>
                            <div className='col-lg-12'>
                                <div className="row" >
                                    <div className='col-6 ' style={{ textAlign: "end" }}>
                                        <Button color="primary" style={{ letterSpacing: '0.01rem' }}
                                            onClick={()=>this.handleLogout()}
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                    <div className='col-6' style={{ textAlign: "start" }}>
                                        <Button color="primary" style={{ width: '7rem', letterSpacing: '0.01rem' }}
                                            onClick={this.closeModal}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    </Modal>
                    <Modal
                        // isOpen={true}
                        ariaHideApp={false}
                        isOpen={this.state.insuranceModal}
                        style={customStyles}
                        contentLabel="Modal"
                    >
                        <React.Fragment>
                            <h5 style={{ textAlign: "center", fontSize: 16, paddingTop: '1rem', paddingBottom: '1rem' }}>You need to book an appointment with a doctor first.</h5>
                            <div className='col-lg-12'>
                                <div className="row" >
                                    <div className='col-6 ' style={{ textAlign: "center" }}>
                                        <Button color="primary" style={{ letterSpacing: '0.01rem' }}
                                            onClick={this.handleGoToSearch}
                                        >
                                            Search for doctor
                                        </Button>
                                    </div>
                                    <div className='col-6' style={{ textAlign: "center" }}>
                                        <Button color="primary" style={{ width: '10rem', letterSpacing: '0.01rem' }}
                                            onClick={this.closeModal}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    </Modal>
                    <Row className="form-block" style={{ order: `${this.state.scroolId.length ? 2 : 1}` }}>
                        <Col lg="4">
                            <h4>
                                PROFILE
                        </h4>
                        </Col>
                        <Col
                            lg="7"
                            className="ml-auto"
                        >
                            <div className="row">
                                <div className="col-md-12">
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
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="first_name" className="form-label">first Name</label>
                                        <input name="first_name" id="first_name" type="text" className="form-control" placeholder="First name" value={this.state.first_name} onChange={(e) => this.handleOnChange(e)} />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="last_name" className="form-label">last Name</label>
                                        <input name="last_name" id="last_name" type="text" className="form-control" placeholder="Last name" value={this.state.last_name} onChange={(e) => this.handleOnChange(e)} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">E-Mail</label>
                                        <input name="email" id="email" type="text" disabled className="form-control" placeholder="Email Address" value={this.state.email} onChange={(e) => this.handleOnChange(e)} />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="mobile" className="form-label">mobile Number</label>
                                        <input name="mobile" id="mobile" type="text" className="form-control" value={this.state.mobile}
                                            placeholder="Mobile number"
                                            maxLength={10}
                                            onKeyPress={(e) => (e.charCode >= 48 && e.charCode <= 57) ? true : e.preventDefault()}
                                            onChange={(e) => this.handleOnChange(e)}
                                            style={{ border: this.state.mobileError ? '1px solid #c64444' : '' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="zip" className="form-label">Zip Code</label>
                                        <input name="zip" id="zip" type="text" className="form-control" value={this.state.zip} placeholder="ZIP Code"
                                            onChange={(e) => this.handleOnChange(e)}
                                            onKeyPress={(e) => (e.charCode >= 48 && e.charCode <= 57) ? true : e.preventDefault()} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group gender-setting">
                                <label htmlFor="genders" className="form-label">GENDER</label>
                                <Select
                                    instanceId="guestsSelect"
                                    id="genders"
                                    name="genders"
                                    value={selectedOption}
                                    onChange={this.handleOnChangeSelect}
                                    options={this.state.options}
                                    className="selectpicker insuranceGender"
                                    classNamePrefix="selectpicker"
                                    placeholder="Select Gender"
                                />
                            </div>

                            <div className="form-group p-2 text-right">
                                <Button color="primary" onClick={this.handleSaveProfile} disabled={this.state.btnDisabled} style={{ letterSpacing: "1px" }}>Save</Button>
                            </div>
                        </Col>
                    </Row>
                    <Row className="form-block" style={{ order: `${this.state.scroolId.length ? 3 : 2}` }}>
                        <Col lg="4">
                            <h4>
                                PASSWORD
                        </h4>
                        </Col>
                        <Col
                            lg="7"
                            className="ml-auto"
                        >
                            <div className="row">
                                <div className="col-md-12">
                                    {this.state.alertErrorPassword ?
                                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                            {this.state.messageAlertPassword}
                                            <button type="button" className="close" data-dismiss="alert" onClick={this.handleCloseAlert} aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        : ''
                                    }

                                    {this.state.alertSuccessPassword ?
                                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                                            {this.state.messageAlertSuccessPassword}
                                            <button type="button" className="close" data-dismiss="alert" onClick={this.handleCloseAlert} aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        : ''
                                    }
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="new_password" className="form-label">Enter New Password</label>
                                        <input name="new_password" id="new_password" className="form-control"
                                            value={this.state.new_password}
                                            type="password"
                                            autoComplete="off"
                                            placeholder="Enter new password"
                                            onChange={(e) => this.handleOnChangePassword(e)}
                                            style={{ border: this.state.newPasswordError ? '1px solid #c64444' : '' }} />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                                        <input name="confirm_password" id="confirm_password" className="form-control"
                                            value={this.state.confirm_password}
                                            type="password"
                                            autoComplete="off"
                                            placeholder="Confirm password"
                                            onChange={(e) => this.handleOnChangePassword(e)}
                                            style={{ border: this.state.confirmPasswordError ? '1px solid #c64444' : '' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group p-2 text-right">
                                <Button color="primary" disabled={this.state.isLoading} onClick={this.handleChangePassword} style={{ letterSpacing: "1px" }}>Save</Button>
                            </div>
                        </Col>
                    </Row>
                    <Row className="form-block" style={{ order: `${this.state.scroolId.length ? 1 : 3}` }}>
                        {/* {`form-block ${this.state.scroolId ? 'order-3' : 'order-2'}`} */}
                        <Col lg="4">
                            <h4>
                                INSURANCE
                        </h4>
                        </Col>
                        <Col
                            lg="7"
                            className="ml-auto"
                            style={{ backgroundColor: this.state.hasInsurance === "1" && this.state.fillInsurance === "no" && this.state.vStatus !== "Active" ? "#f0f0f0" : "" }}
                        >
                            <div className="row">
                                {this.state.vStatus === "Active" && (
                                    <div className="col-md-12">
                                        <div className="form-group text-center p-2 " style={{ background: "#47b475", color: "#fff" }}>
                                            Your Insurance is Verified.
                                 </div>
                                    </div>
                                )}
                                <div className="col-md-12">
                                    {this.state.alertErrorInsurance ?
                                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                            {this.state.messageAlertInsurance}
                                            <button type="button" className="close" data-dismiss="alert" onClick={this.handleCloseAlert} aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        : ''
                                    }

                                    {this.state.alertSuccessInsurance ?
                                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                                            {this.state.messageAlertSuccessInsurance}
                                            <button type="button" className="close" data-dismiss="alert" onClick={this.handleCloseAlert} aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        : ''
                                    }
                                </div>
                                <div className="col-md-12">

                                    <div className="form-group gender-setting ">
                                        <label htmlFor="insurance_select" className="form-label">INSURANCE CARRIER</label>

                                        <Select
                                            isDisabled={this.state.disabledForm || (this.state.hasInsurance === "1" && this.state.fillInsurance === "no" && this.state.vStatus !== "Active")}
                                            name="payer_name"
                                            id="insurance_select"
                                            options={this.state.payerNameListSelect}
                                            className="selectpicker"
                                            placeholder="Payer Name"
                                            onChange={this.handlePlayerNameOnchange}
                                        />
                                    </div>

                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="mamber_id" className="form-label">MEMBER ID</label>
                                        <input name="mamber_id" id="mamber_id" type="text" className="form-control"
                                            disabled={this.state.disabledForm || (this.state.hasInsurance === "1" && this.state.fillInsurance === "no" && this.state.vStatus !== "Active")}
                                            value={this.state.mamber_id}
                                            autoComplete='on'
                                            placeholder="Member Id"
                                            onChange={(e) => this.handleOnchange(e)} />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="dob" className="form-label">DATE OF BIRTH</label>
                                        <MaskedInput
                                            className="form-control"
                                            mask="11/11/1111"
                                            disabled={this.state.disabledForm || (this.state.hasInsurance === "1" && this.state.fillInsurance === "no" && this.state.vStatus !== "Active")}
                                            id="dob"
                                            name="dob"
                                            placeholder="MM/DD/YYYY"
                                            value={this.state.dob}
                                            onChange={(e) => this.handleOnchange(e)}
                                            style={{
                                                height: 45,
                                                width: "100%",
                                                border: "1px solid transparent",
                                                paddingLeft: 25,
                                                background: "#f5f5f5",
                                                outline: "none",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {this.renderCurrentVerifiedInsurancePayername()}
                            <div className=" text-right p-2"  >
                                {this.state.vStatus === "Active" ? null : (
                                    <div
                                        style={{
                                            paddingTop: 10,
                                            cursor: "pointer"
                                        }}
                                    >
                                        <p
                                            disabled={this.state.hasInsurance === "1" && this.state.fillInsurance === "no"}
                                            style={{ color: this.state.hasInsurance === "1" && this.state.fillInsurance === "no" && this.state.vStatus !== "Active" ? "#f0f0f0" : "#47b475", cursor: "pointer" }}
                                            onClick={this.handleDontHaveInsurance}

                                        >
                                            I Don't Have Insurance
                                </p>
                                    </div>
                                )}
                            </div>

                        </Col>
                        <Col
                            lg="7"
                            className="ml-auto"
                        >

                            <div className=" text-right p-2">
                                <Button color="primary" disabled={this.state.disabledForm}
                                    style={{ letterSpacing: "1px" }}
                                    onClick={this.handleVerifyInsurance}>{this.state.isLoading && (
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    )}
                                    {this.state.vStatus === "Active" ? "Verified" : "Verify"}</Button>

                            </div>
                        </Col>
                    </Row>

                </Form>
            </React.Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        userDetails: state.userDetails,
        docDetails: state.docDetails
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleGetUserDetails: data => dispatch({ type: GETUSER_DETAILS_REQUEST, data }),
        handleGetDocDetails: data => dispatch({ type: DOC_PROFILE_REQUEST, data })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Setting);