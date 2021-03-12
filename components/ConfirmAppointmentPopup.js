import React, { Component } from 'react';
import Modal from 'react-modal';
import OtpInput from 'react-otp-input';
import axios from 'axios';
// import { ToastMsg } from './ToastMsg';
// import { toast } from 'react-toastify';
import { Baseurl } from '../utils/Baseurl';
import Router from 'next/router'
import { Button } from 'reactstrap'

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

Modal.setAppElement('#__next')
Modal.defaultStyles.overlay.backgroundColor = 'rgba(111, 111, 111, 0.75)';


class ConfirmAppointmentPopup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen_modal: false,
            apointData: {},
            otp: '',
            modalLoading: false,
            openConfirm: 0,
            offer_telemedicine: '',
            SelectedTelemedicine: 0,
            alertError: false,
            messageAlert: '',
            alertSuccess: false,
            messageAlertSuccess: ''
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            isOpen_modal: props.hasModel,
            apointData: props.modalData
        })
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



    closeModal = () => {
        this.setState({ isOpen_modal: false, openConfirm: 0 });
        this.props.handleSetReminder()
    }

    //

    /*--------------------------------handleaddInsurance----------------------------*/

    handleAddInsurance = () => {
        let data = { routename: 'schedule', doctor_id: this.props.doctorId, scroll_id: 'yes', fillInsurance: "yes" }
        localStorage.setItem("settingId", JSON.stringify(data));
        Router.push({ pathname: '/setting', query: { routename: 'schedule', doctor_id: this.props.doctorId, scroll_id: 'yes' } });
    }

    handleNewPataintModal = () => {
        return (
            <div>
                <h5 className="text-center" style={{ fontSize: 14 }}>Are you a new patient to this provider ? </h5>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button onClick="" className="btn btn-md btn-filled btn-rounded">Yes</button>
                    <button onClick="" className="btn btn-md btn-filled btn-rounded">No</button>
                </div>
            </div>
        )
    }

    /*--------------------------------handleaddInsurance----------------------------*/

    handleOk = () => {

        this.props.handleSetReminder()
        this.props.handleLoader(true);
        let patientId = localStorage.getItem('uidp');
        let clientuid = patientId;
        this.state.apointData.appoint.availability[this.state.apointData.index].client = clientuid;
        //this.state.apointData.appoint.availability[this.state.apointData.index].offer_telemedicine = clientuid;
        this.props.setAppointData();
        //this.handleNewPataintModal();

        var telemedicine = null;

        if (this.state.apointData.appoint.availability[this.state.apointData.index].offer_telemedicine == 2) {
            if (this.state.SelectedTelemedicine === "1") {
                telemedicine = 1;
            } else {
                telemedicine = 0;
            }
        } else {
            telemedicine = this.state.apointData.appoint.availability[this.state.apointData.index].offer_telemedicine;
        }


        let data = {
            date: this.state.apointData.appoint.date,
            time: this.state.apointData.appoint.availability[this.state.apointData.index].time,
            telemedicine: telemedicine,
            patient_id: patientId,
            doc_id: this.state.apointData.appoint.uid,
            payment_mode: this.state.apointData.insuranceName,
            practice_id: this.state.apointData.practice_id

        };
        console.log("handleOk data is", data)

        axios({
            method: 'post',
            url: Baseurl + 'api/appointments/save_appointments',
            headers: { 'content-type': 'application/json' },
            data: data,

        }).then((res) => {
            // console.log("save-appointment-response-------->", res);
            this.props.handleLoader(false);
            Router.push('/viewAppointments');

        }).catch((error) => {
            console.log("put-appointment-error------->", error.response);
            this.props.handleLoader(false);
            if (error.response.data.message === 'slotTaken') {
                // toast.error(<ToastMsg message="Sorry, this slot is already booked." />, { position: toast.POSITION.TOP_CENTER });
                this.setState({ alertError: true, messageAlert: 'Sorry, this slot is already booked.' })
                this.handleSetInterval();
                this.props.handleGetAppointmentData();
            }
            else {
                // toast.error(<ToastMsg message={error.response.data.message} />, { position: toast.POSITION.TOP_CENTER });
                this.setState({ alertError: true, messageAlert: error.response.data.message })
                this.handleSetInterval();
                this.props.handleGetAppointmentData();
            }
        })
    }




    renderStatusZeroView = () => {
        return (<div>
            <h5 className="text-center" style={{ fontSize: 14 }}>You have not entered your insurance information. If you do not have insurance you must opt into cash payments.</h5>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button color="primary"
                    onClick={this.handleAddInsurance}
                    style={{
                        width: "10rem",
                        marginTop: "1.1rem",
                        marginRight: "1rem",

                    }}
                >
                    Add Insurance
                </Button>
                <Button color="primary"
                    onClick={this.handleSendVerificationCode}
                    style={{
                        width: "9rem",
                        marginTop: "1.1rem",

                    }}
                >
                    Self Pay
                </Button>
            </div>
        </div>)
    }



    /*------------------------------------renderStatusOneView-------------------------------------*/

    renderStatusOneView = () => {
        return (
            <div>
                <h1 className="text-center" style={{ fontSize: 14 }}>You need to fill insurance details.</h1>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary"
                        onClick={this.handleAddInsurance}
                        style={{
                            width: "7rem",
                            marginTop: "1.1rem",

                        }}
                    >
                        Ok
                </Button>
                </div>
            </div>
        )
    }


    renderStatusThreeView = () => {
        return (
            <div>
                <h5 className="text-center" style={{ fontSize: 14 }}>There seems to be some problem with your Insurance or it has expired.</h5>
                <h5 className="text-center" style={{ fontSize: 14 }}> Please re-check your Insurance settings.</h5>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary"
                        onClick={this.handleAddInsurance}
                        style={{
                            width: "11rem",
                            marginTop: "1.1rem",

                        }}
                    >
                        Go to Insurance
                </Button>
                    <Button color="primary"
                        onClick={this.closeModal}
                        style={{
                            width: "6rem",
                            marginTop: "1.1rem",
                            marginLeft: "1rem",

                        }}
                    >
                        Cancel
                </Button>
                </div>
            </div>
        )
    }



    renderForthView = () => {
        return (
            <div>
                <h5 className="text-center" style={{ fontSize: 14 }}>Unfortunately, the physician you have selected does not accept your insurance. </h5>
                <h5 className="text-center" style={{ fontSize: 14 }}>Please select the “self pay” option in order to proceed.</h5>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary"
                        onClick={this.handleSendVerificationCode}
                        style={{
                            width: "6rem",
                            marginTop: "1.1rem",

                        }}
                    >
                        Ok
                </Button>
                    <Button color="primary"
                        onClick={this.closeModal}
                        style={{
                            marginLeft: "1rem",
                            width: "6rem",
                            marginTop: "1.1rem",

                        }}
                    >
                        Cancel
                </Button>
                </div>
            </div>
        )
    }



    renderSameTimeComponent = () => {
        return (
            <div>
                <h5 className="text-center" style={{ fontSize: 14 }}>You already have scheduled the same time with {this.state.apointData.appointLength} other doctor(s).</h5>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary"
                        onClick={() => this.props.handleSetClientInScheduleTime(this.state.apointData.appoint, this.state.apointData.index)}
                        style={{
                            width: "6rem",
                            marginTop: "1.1rem",
                        }}
                    >
                        Ok
                </Button>
                    <Button color="primary"
                        onClick={this.closeModal}
                        style={{
                            width: "6rem",
                            marginTop: "1.1rem",
                            marginLeft: "1rem",
                        }}
                    >
                        Cancel
                </Button>
                </div>
            </div>
        )
    }


    handleHasInsuranceModal = () => {
        return (
            <div>
                <h5 className="text-center" style={{ fontSize: 14, fontWeight: 400 }}>Are you sure you want to make an appointment for this time? </h5>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button color="primary"
                        onClick={this.handleOk}
                        style={{
                            width: "6rem",
                            marginTop: "1.1rem",
                        }}
                    >
                        Ok
                </Button>
                    <Button color="primary"
                        onClick={this.closeModal}
                        style={{
                            marginLeft: "1rem",
                            width: "6rem",
                            marginTop: "1.1rem",
                        }}
                    >
                        Cancel
                </Button>
                </div>
            </div>
        )
    }


    /*---------------------------handle-send-verification code---------------------------*/

    handleSendVerificationCode = () => {
        this.setState({ modalLoading: true });

        axios({
            method: 'post',
            url: Baseurl + `api/phone_auth/send_verification_code?phone=${this.state.apointData.patientMobile}`,
            headers: { 'content-type': 'application/json' }
        }).then((res) => {
            this.setState({ apointData: { ...this.state.apointData, modalStatus: 'FMV_modal' }, modalLoading: false, alertSuccess: true, messageAlertSuccess: 'A verification code has been sent to you via SMS. Please enter code here to verify your phone number.' });
            // toast.success('A verification code has been sent to you via SMS. Please enter code here to verify your phone number.', { position: toast.POSITION.TOP_CENTER });
            this.handleSetIntervalSuccess();

        }).catch((error) => {
            console.log("error--->", error.response);
            this.setState({ modalLoading: false });
        })
    }

    /*---------------------------------handle-verify otp----------------------------*/

    handleVerifyOtp = () => {
        this.setState({ modalLoading: true });
        var code = this.state.otp;

        if (!code) {
            // toast.error('Enter your code.', { position: toast.POSITION.TOP_CENTER });
            this.setState({ modalLoading: false, alertError: true, messageAlert: 'Enter your code.' })
            this.handleSetInterval();
        }
        else {
            axios({
                method: 'post',
                url: Baseurl + `api/phone_auth/verify_code?phone=${this.state.apointData.patientMobile}&code=${code}&user_email=${this.state.apointData.patientEmail}`,
                headers: { "content-type": 'application/json' }
            }).then((res) => {
                // console.log(res);
                this.setState({ modalLoading: false, });
                this.handleOk();

            }).catch((err) => {
                console.log(err);
                // toast.error('You have entered an incorrect code. Please enter again or request new code.', { position: toast.POSITION.TOP_CENTER });
                this.setState({ modalLoading: false, alertError: true, messageAlert: 'You have entered an incorrect code. Please enter again or request new code.' })
                this.handleSetInterval();
            })
        }
    }


    /*---------------------------------handle-handleResentOtp----------------------------*/

    handleResentOtp = (e) => {
        e.preventDefault();
        this.setState({ modalLoading: true });
        this.setState({ otp: '' });

        axios({
            method: 'post',
            url: Baseurl + `api/phone_auth/send_verification_code?phone=${this.state.apointData.patientMobile}`,
            headers: { 'content-type': 'application/json' }
        }).then((res) => {
            this.setState({ modalLoading: false, alertSuccess: false, messageAlertSuccess: '' });
            // console.log(res);
            // toast.success('A verification code has been sent to you via SMS. Please enter code here to verify your phone number.', { position: toast.POSITION.TOP_CENTER });
            this.handleSetIntervalSuccess();
        }).catch((error) => {
            this.setState({ modalLoading: false });
            console.log("error--->", error);
        })
    }





    /*---------------------------renderSendOtpModalView-method()---------------------------*/

    renderSendOtpModalView = () => {
        return (
            <React.Fragment>
                <div style={{ textAlign: 'center' }} className="otp_input">
                    <h3 className="mt-4 mb-3" >Enter verification code</h3>
                    <OtpInput
                        onChange={otp => this.setState({ otp: otp })}
                        onKeyPress={(e) => (e.charCode >= 47 && e.charCode <= 57) ? true : e.preventDefault()}
                        numInputs={6}
                        value={this.state.otp}
                        isInputNum={true}
                        shouldAutoFocus={true}
                    />
                    <button className="popUpButton" style={{ marginTop: 25 }} onClick={this.handleVerifyOtp}>VERIFY</button>
                    <button className="popUpButton" style={{ marginTop: 25, marginLeft: 20 }} onClick={(e) => this.handleResentOtp(e)}>RESEND CODE</button>
                </div>
            </React.Fragment>
        );
    }

    handleSelectTeleMedicine = () => {
        this.setState({ SelectedTelemedicine: this.state.offer_telemedicine });
        this.setState({ openConfirm: 1 });
        var modalStatus = this.state.apointData.modalStatus;
        if (modalStatus === "4") {
            this.renderForthView();
        } else if (modalStatus === "2") {
            this.handleHasInsuranceModal();
        } else if (modalStatus === "1") {
            this.renderStatusOneView();
        } else if (modalStatus === "0") {
            this.renderStatusZeroView();
        }
    }


    handleTeleMedicine = () => {
        return (<div style={{ textAlign: 'left' }}>
            <div className="time_container">
                <div style={{ paddingLeft: 0, paddingRight: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <label style={{ marginRight: "20px" }} htmlFor="from"><p><strong>Please Select Provider Offer</strong></p></label>
                    <div className="custom-control custom-radio">
                        <input type="radio" id="customCheck1" className="form-check-input" name="offer_telemedicine" value="1" onChange={e => { this.setState({ offer_telemedicine: e.target.value }); }} />
                        <label htmlFor="customCheck1" > &nbsp;&nbsp;Telemedicine</label>
                    </div>
                    <div className="custom-control custom-radio">
                        <input type="radio" className="form-check-input" name="offer_telemedicine" onChange={e => { this.setState({ offer_telemedicine: e.target.value }); }} id="customCheck2" value="0" />
                        <label htmlFor="customCheck2">&nbsp;&nbsp; Office visit</label>
                    </div>

                </div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <Button color="primary"
                    onClick={this.handleSelectTeleMedicine}
                    disabled={!(this.state.offer_telemedicine.length) ? "disabled" : ''}
                    style={{
                        width: "6rem",
                        marginTop: "1.1rem",
                    }}
                >
                    SAVE
                </Button>
                <Button color="primary"
                    onClick={this.handleSelectTeleMedicine}
                    disabled={!(this.state.offer_telemedicine.length) ? "disabled" : ''}
                    style={{
                        marginLeft: "1rem",
                        width: "6rem",
                        marginTop: "1.1rem",
                    }}
                >
                    Cancel
                </Button>
            </div>
        </div>)
    }


    render() {
        let modalStatus = this.state.apointData.modalStatus;
        let teleStatus = this.state.apointData.teleStatus;

        // console.log("teleStatus -------------->", teleStatus)
        // console.log("!!!!!!!!!!!!!!!", modalStatus)

        return (
            <React.Fragment>
                <Modal
                    isOpen={this.state.isOpen_modal}
                    style={customStyles}
                    contentLabel="Modal"
                >
                    {
                        this.state.modalLoading ?
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                            :
                            <React.Fragment>

                                {this.state.alertError ?
                                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                        {this.state.messageAlert}
                                        <button type="button" class="close" data-dismiss="alert" onClick={this.handleCloseAlert} aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    : ''
                                }

                                {this.state.alertSuccess ?
                                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                                        {this.state.messageAlertSuccess}
                                        <button type="button" class="close" data-dismiss="alert" onClick={this.handleCloseAlert} aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    : ''
                                }
                                <span className="pull-right schedule-time">
                                    {
                                        modalStatus === 'FMV_modal' ?
                                            null
                                            :
                                            <img alt="cross" src="https://www.pngfind.com/pngs/m/193-1931093_cross-icon-png-black-cross-png-transparent-png.png"
                                                style={{ height: 15, width: 15, cursor: 'pointer' }}
                                                onClick={this.closeModal}
                                            />
                                    }
                                </span>

                                <br />
                                {
                                    modalStatus === '5' ?
                                        this.renderSameTimeComponent()
                                        :
                                        modalStatus === '3' ?
                                            this.renderStatusThreeView()
                                            :
                                            modalStatus === 'FMV_modal' ?
                                                this.renderSendOtpModalView()
                                                :
                                                null
                                }
                                {(teleStatus === '2' && this.state.openConfirm === 0) ? this.handleTeleMedicine() : modalStatus === '4' ? this.renderForthView() : modalStatus === '2' ? this.handleHasInsuranceModal() : modalStatus === '1' ? this.renderStatusOneView() : modalStatus === '0' ? this.renderStatusZeroView() : () => { }}

                            </React.Fragment>
                    }
                </Modal>
            </React.Fragment>
        )
    }
}

export default ConfirmAppointmentPopup;
