import React, { Component } from "react";
import { connect } from "react-redux";
import {
    DOC_PROFILE_REQUEST,
    GETUSER_DETAILS_REQUEST,
    USER_APPOINTMENTS_REQUEST,
} from "../actions/Action";
import { HandleScheduleDate } from "../utils/DateMethod";
import { Baseurl } from "../utils/Baseurl";
import axios from "axios";
import firebase from "../utils/Fire";
import { handleTimeFormat } from '../utils/DateMethod';
import ConfirmAppointmentPopup from "../components/ConfirmAppointmentPopup";
import Modal from 'react-modal';

import ScheduleAppointmentMobileView from "../components/ScheduleAppointmentMobileView";
// import { toast } from "react-toastify";
// import InsuranceErrorToast from "../components/InsuranceErrorToast";
import { Container, Row, Col, Button } from 'reactstrap'
import defaultImage from '../images/images.jpeg';
import Router from 'next/router'
import ArrowImage from '../images/arrow_left.png';
import Select from 'react-select'
// import Head from 'next/head'


export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            // loggedUser: true,
            title: "User Profile"
        },
    }
}

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

class ScheduleAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doc_name: "",
            docPracticeLocation: [],
            selectedPracticeLocationId: "",
            profile: "",
            speciality: [],
            days: 0,
            appointData: [],
            rows: 5,
            currentFiveDaysData: [],
            currentDocEmail: "",
            userEmail: "",
            patientName: "",
            patientMobile: "",
            isAuth: false,
            isLoading: false,
            patient_insurance_id: "",
            doc_insurance: [],
            doc_medicaid_insurance: [],
            patient_hasInsurance: "",
            appointModel: false,
            modelAppintData: {},
            user_appointments: [],
            reminder: true,
            futureDateExist: false,
            groupRole: 7,
            isActive: false,
            reviewCollapse: false,
            options: [],
            alertError: false,
            messageAlert: '',
            isModal: false,
            doctorId: '',
            defaultOptionValue: ''
            // doctorScheduleId: router ? router.query.id : "",
            // docIdUse:"",
            // docId:""
        };
    }



    componentDidMount() {

        window.scrollTo(0, 0);
        let docId = window.location.search.substring(1);
        this.setState({ doctorId: docId }, () => {
            this.props.handlegetDocProfile(docId);
        })

        let id = localStorage.getItem("uidp");
        id !== null && this.props.handleGetUserDetails(id);
        this.props.handleGetUserAppointmentData(id);
        this.handleIsAuth();
    }

    handleIsAuth = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ isAuth: true }, () => {
                });
            } else {
                this.setState({ isAuth: false }, () => {
                });
            }
        });
    };


    closeModal = () => {
        this.setState({ isModal: false });
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


    toggleClass = () => {
        this.setState({ isActive: !this.state.isActive });
    };

    handleCheckDetails = () => {
        // console.log(this.props);
        this.setState({ isModal: false });
        Router.push({ pathname: '/setting', query: { routename: 'schedule', doctor_id: window.location.search.substring(1), scrool_id: 'yes' } });
    };

    UNSAFE_componentWillReceiveProps(props) {
        // console.log("props areeee", props)
        if (props.docProfile) {
            // console.log("patient_hasInsurance",props.userDetails.hasInsurance)

            const arrays = [];
            props.docProfile.practice && props.docProfile.practice.map((value) => {
                arrays.push({ value: value._id, label: `${value.practice_name},${value.zip}` })
            })

            this.setState(
                {
                    patient_insurance_id: props.userDetails.insurance_id,
                    patient_hasInsurance: props.userDetails.hasInsurance,
                    patientName: `${props.userDetails.first_name} ${props.userDetails.last_name}`,
                    patientMobile: props.userDetails.mobile
                        ? props.userDetails.mobile.substring(
                            props.userDetails.mobile.length - 10,
                            props.userDetails.mobile.length
                        )
                        : "",
                    doc_name: `${props.docProfile.first_name} ${props.docProfile.last_name}`,
                    groupRole: `${props.docProfile.groupRole}`,
                    docPracticeLocation: arrays.length > 0 ? arrays : [],
                    defaultOptionValue: arrays.length > 0 ? arrays[0].label : '',
                    selectedPracticeLocationId:
                        props.docProfile.practice && props.docProfile.practice.length > 0
                            ? props.docProfile.practice[0]._id
                            : "",
                    doc_insurance:
                        props.docProfile.insurance_providers &&
                            props.docProfile.insurance_providers.length > 0
                            ? props.docProfile.insurance_providers
                            : [],
                    doc_medicaid_insurance:
                        props.docProfile.medicaid_insurance_providers &&
                            props.docProfile.medicaid_insurance_providers.length > 0
                            ? props.docProfile.medicaid_insurance_providers
                            : [],
                    speciality: props.docProfile.speciality
                        ? props.docProfile.speciality
                        : [],
                    profile: props.docProfile.profile_image,
                    currentDocEmail: props.docProfile.email,
                    userEmail: props.userDetails.email,
                    user_appointments:
                        props.userAppointment.length !== 0 ? props.userAppointment : [],
                    isLoading: props.spinner,
                    // options: [{values:this.state.docPracticeLocation.value , label:`${this.state.docPracticeLocation.practice_name},${this.state.docPracticeLocation.zip}`} ]
                },
                () => {
                    this.handleGetAppointmentData();
                    // this.setState({options: [{values:this.state.docPracticeLocation.value , label:`${this.state.docPracticeLocation.practice_name},${this.state.docPracticeLocation.zip}`} ]})

                }
            );
        }
    }

    // /*-----------------------------render-doctor-location-----------------------------------------*/

    renderLocation = () => {
        let l = this.state.docPracticeLocation.filter(
            (location) => location._id === this.state.selectedPracticeLocationId
        );
        return l.map((value) => {
            return `${value.practice_name}, ${value.practice_location}, ${value.zip}`;
        });
    };

    // /*-----------------------------doctor-location-onchange-----------------------------------------*/

    // handleDocLocationOnchange = (e) => {
    //     this.setState({ selectedPracticeLocationId: e.target.value }, () => {
    //         this.handleGetAppointmentData();
    //     });
    // };

    handleDocLocationOnchange = (selectedOption) => {
        this.setState({ selectedPracticeLocationId: selectedOption.value }, () => {
            this.handleGetAppointmentData();
        });
    };

    /*----------------------------------------------------render-week-header-----------------------------------------------*/

    renderTableRow = () => {
        const { days } = this.state;

        let toDay = HandleScheduleDate(
            new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
        );
        let tomoro1 = HandleScheduleDate(
            new Date(new Date().getTime() + (days + 1) * 24 * 60 * 60 * 1000)
        );
        let tomoro2 = HandleScheduleDate(
            new Date(new Date().getTime() + (days + 2) * 24 * 60 * 60 * 1000)
        );
        let tomoro3 = HandleScheduleDate(
            new Date(new Date().getTime() + (days + 3) * 24 * 60 * 60 * 1000)
        );
        let tomoro4 = HandleScheduleDate(
            new Date(new Date().getTime() + (days + 4) * 24 * 60 * 60 * 1000)
        );

        return (
            <table className="text-gray-700 table table-striped table-hover sortable reviex-tbl">
                <thead>
                    <tr className="text-center">

                        <th>{toDay.date}</th>
                        <th>{tomoro1.date}</th>
                        <th>{tomoro2.date}</th>
                        <th>{tomoro3.date}</th>
                        <th>{tomoro4.date}</th>

                        {/* <li className="prev btn-icon">❮</li>
                    <li className="next btn-icon">❯</li> */}
                    </tr>
                </thead>
                <tbody>
                    {this.rendertiemRow(
                        toDay.timezone,
                        tomoro1.timezone,
                        tomoro2.timezone,
                        tomoro3.timezone,
                        tomoro4.timezone
                    )}
                </tbody>
            </table>
        );
    };

    /*----------------------------------------------------render-time-Row-method-----------------------------------------------*/

    rendertiemRow = (a, b, c, d, e) => {
        // console.log("rendertiemRow",a,b,c,d,e)
        const items = [];
        for (var i = 0; i < this.state.rows; i++) {
            items.push(
                <tr key={i}>
                    <td className="text-center">{this.handleToday(a, i)}</td>
                    <td className="text-center">{this.handleToday(b, i)}</td>
                    <td className="text-center">{this.handleToday(c, i)}</td>
                    <td className="text-center">{this.handleToday(d, i)}</td>
                    <td className="text-center">{this.handleToday(e, i)}</td>
                </tr>
            );
        }

        return items;
    };

    handleSetReminder = () => {
        this.setState({ reminder: true, appointModel: false });
    };

    // /*------------------------------------------handle-schedule-time and put clint and update time --------------------------------------*/

    handleSetClientInScheduleTime = (appoint, i, teleStatusIs) => {
        // console.log(" props uid is",this.props.docProfile.uid)
        this.setState({ isClickTime: true });

        if (this.state.isAuth) {
            var filterUserAppoints = this.state.user_appointments.filter(
                (d) =>
                    d.date === appoint.date &&
                    d.time === appoint.availability[i].time &&
                    d.offer_telemedicine === appoint.availability[i].offer_telemedicine &&
                    d.status === "Confirmed"
            );

            if (filterUserAppoints.length > 0 && this.state.reminder) {
                this.setState({
                    appointModel: true,
                    modelAppintData: {
                        modalStatus: "5",
                        appointLength: filterUserAppoints.length,
                        appoint,
                        index: i,
                    },
                    reminder: false,
                    isClickTime: false,
                });
            } else {
                if (this.state.patient_hasInsurance === "0") {
                    this.setState({
                        appointModel: true,
                        modelAppintData: {
                            appoint,
                            index: i,
                            docName: this.state.doc_name,
                            patientName: this.state.patientName,
                            patientMobile: this.state.patientMobile,
                            practice_id: this.state.selectedPracticeLocationId,
                            patientEmail: this.state.userEmail,
                            docEmail: this.state.currentDocEmail,
                            insuranceName: "cash",
                            hasInsurance: "0",
                            modalStatus: "0",
                            teleStatus: teleStatusIs
                        },
                        isLoading: false,
                        isClickTime: false,
                    });
                } else if (this.state.patient_hasInsurance === "1") {
                    this.setState({
                        appointModel: true,
                        modelAppintData: {
                            appoint,
                            index: i,
                            docName: this.state.doc_name,
                            patientName: this.state.patientName,
                            patientMobile: this.state.patientMobile,
                            practice_id: this.state.selectedPracticeLocationId,
                            patientEmail: this.state.userEmail,
                            docEmail: this.state.currentDocEmail,
                            insuranceName: "cash",
                            hasInsurance: "1",
                            modalStatus: "1",
                            teleStatus: teleStatusIs
                        },
                        isLoading: false,
                        isClickTime: false,
                    });
                } else {
                    const { userDetails, docProfile } = this.props;

                    axios({
                        method: "get",
                        url:
                            Baseurl +
                            `api/report/getreport_lastappointment?patientObj_id=${userDetails._id}&member_id=${userDetails.insurance_id}`,
                        headers: { "content-type": "application/json" },
                    })
                        .then((res) => {
                            if (res.data) {
                                let isMedicaidInsurancenew = 0;

                                let filterdocinsurance = this.state.doc_insurance.filter(
                                    (v) => v.code === userDetails.payerCode
                                );

                                let filterdocMedicaidinsurance = this.state.doc_medicaid_insurance.filter(
                                    (v) => v.code === userDetails.payerCode
                                );

                                isMedicaidInsurancenew = res.data.isMedicaidInsurance;

                                if (
                                    filterdocinsurance.length !== 0 &&
                                    isMedicaidInsurancenew == 0
                                ) {
                                    this.setState({
                                        appointModel: true,
                                        modelAppintData: {
                                            appoint,
                                            index: i,
                                            docName: this.state.doc_name,
                                            patientName: this.state.patientName,
                                            patientMobile: this.state.patientMobile,
                                            practice_id: this.state.selectedPracticeLocationId,
                                            patientEmail: this.state.userEmail,
                                            docEmail: this.state.currentDocEmail,
                                            hasInsurance: "2",
                                            modalStatus: "2",
                                            teleStatus: teleStatusIs,
                                            insuranceName: filterdocinsurance[0].provider_name,
                                        },
                                        isLoading: false,
                                        isClickTime: false,
                                    });
                                } else if (
                                    filterdocMedicaidinsurance.length !== 0 &&
                                    isMedicaidInsurancenew == 1
                                ) {
                                    this.setState({
                                        appointModel: true,
                                        modelAppintData: {
                                            appoint,
                                            index: i,
                                            docName: this.state.doc_name,
                                            patientName: this.state.patientName,
                                            patientMobile: this.state.patientMobile,
                                            practice_id: this.state.selectedPracticeLocationId,
                                            patientEmail: this.state.userEmail,
                                            docEmail: this.state.currentDocEmail,
                                            hasInsurance: "2",
                                            modalStatus: "2",
                                            teleStatus: teleStatusIs,
                                            insuranceName:
                                                filterdocMedicaidinsurance[0].provider_name,
                                        },
                                        isLoading: false,
                                        isClickTime: false,
                                    });
                                } else {
                                    this.setState({
                                        appointModel: true,
                                        modelAppintData: {
                                            appoint,
                                            index: i,
                                            docName: this.state.doc_name,
                                            patientName: this.state.patientName,
                                            patientMobile: this.state.patientMobile,
                                            practice_id: this.state.selectedPracticeLocationId,
                                            patientEmail: this.state.userEmail,
                                            docEmail: this.state.currentDocEmail,
                                            insuranceName: "cash",
                                            hasInsurance: "4",
                                            modalStatus: "4",
                                            teleStatus: teleStatusIs
                                        },
                                        isLoading: false,
                                        isClickTime: false,
                                    });
                                }
                            } else {
                                let date = new Date();
                                let yy = date.getFullYear();
                                let mm =
                                    date.getMonth() + 1 > 9
                                        ? date.getMonth() + 1
                                        : "0" + (date.getMonth() + 1);
                                let dd =
                                    date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
                                let fullCurrentDate = `${mm}/${dd}/${yy}`;

                                let data = {
                                    d_firstname: docProfile.first_name,
                                    d_lastname: docProfile.last_name,
                                    npi: docProfile.npi_number,

                                    payerCode: userDetails.payerCode,
                                    dob: userDetails.dob,
                                    memberID: userDetails.insurance_id,
                                    p_firstname: userDetails.first_name,
                                    p_lastname: userDetails.last_name,
                                    doS_StartDate: fullCurrentDate,
                                    doS_EndDate: fullCurrentDate,
                                    user_obj_id: userDetails._id,
                                    doctor_obj_id: docProfile._id,
                                };
                                console.log("schedule data", data)

                                if (parseInt(this.state.groupRole) === 7) {
                                    console.log("apii call data", data)
                                    axios({
                                        method: "post",
                                        url: Baseurl + "api/user/GetInsuranceDetails",
                                        headers: { "content-type": "application/json" },
                                        data,
                                    })
                                        .then((res) => {
                                            const response = res.data.data;
                                            const isMedicaidInsurance = res.data.isMedicaidInsurance;
                                            this.setState({ isClickTime: false });
                                            let filterdocinsurance = this.state.doc_insurance.filter(
                                                (v) => v.code === response.extensionProperties.payerCode
                                            );

                                            let filterdocMedicaidinsurance = this.state.doc_medicaid_insurance.filter(
                                                (v) => v.code === userDetails.payerCode
                                            );


                                            if (response.status === "Active") {
                                                if (
                                                    filterdocinsurance.length !== 0 &&
                                                    isMedicaidInsurance == 0
                                                ) {
                                                    this.setState({
                                                        appointModel: true,
                                                        modelAppintData: {
                                                            appoint,
                                                            index: i,
                                                            docName: this.state.doc_name,
                                                            patientName: this.state.patientName,
                                                            patientMobile: this.state.patientMobile,
                                                            practice_id: this.state.selectedPracticeLocationId,
                                                            patientEmail: this.state.userEmail,
                                                            docEmail: this.state.currentDocEmail,
                                                            hasInsurance: "2",
                                                            modalStatus: "2",
                                                            teleStatus: teleStatusIs,
                                                            insuranceName: filterdocinsurance[0].provider_name,
                                                        },
                                                        isLoading: false,
                                                        isClickTime: false,
                                                    });
                                                } else if (
                                                    filterdocMedicaidinsurance.length !== 0 &&
                                                    isMedicaidInsurance == 1
                                                ) {
                                                    this.setState({
                                                        appointModel: true,
                                                        modelAppintData: {
                                                            appoint,
                                                            index: i,
                                                            docName: this.state.doc_name,
                                                            patientName: this.state.patientName,
                                                            patientMobile: this.state.patientMobile,
                                                            practice_id: this.state.selectedPracticeLocationId,
                                                            patientEmail: this.state.userEmail,
                                                            docEmail: this.state.currentDocEmail,
                                                            hasInsurance: "2",
                                                            modalStatus: "2",
                                                            teleStatus: teleStatusIs,
                                                            insuranceName:
                                                                filterdocMedicaidinsurance[0].provider_name,
                                                        },
                                                        isLoading: false,
                                                        isClickTime: false,
                                                    });
                                                } else {
                                                    this.setState({
                                                        appointModel: true,
                                                        modelAppintData: {
                                                            appoint,
                                                            index: i,
                                                            docName: this.state.doc_name,
                                                            patientName: this.state.patientName,
                                                            patientMobile: this.state.patientMobile,
                                                            practice_id: this.state.selectedPracticeLocationId,
                                                            patientEmail: this.state.userEmail,
                                                            docEmail: this.state.currentDocEmail,
                                                            insuranceName: "cash",
                                                            hasInsurance: "4",
                                                            modalStatus: "4",
                                                        },
                                                        isLoading: false,
                                                        isClickTime: false,
                                                    });
                                                }
                                            } else {
                                                this.setState({
                                                    appointModel: true,
                                                    modelAppintData: {
                                                        appoint,
                                                        index: i,
                                                        docName: this.state.doc_name,
                                                        patientName: this.state.patientName,
                                                        patientMobile: this.state.patientMobile,
                                                        practice_id: this.state.selectedPracticeLocationId,
                                                        patientEmail: this.state.userEmail,
                                                        docEmail: this.state.currentDocEmail,
                                                        insuranceName: "cash",
                                                        hasInsurance: "3",
                                                        modalStatus: "3",
                                                        teleStatus: teleStatusIs
                                                    },
                                                    isLoading: false,
                                                    isClickTime: false,
                                                });
                                            }
                                        })
                                        .catch((error) => {
                                            console.log("get-insurance-error-------->", error.response);
                                            // toast.warn(
                                            //     <InsuranceErrorToast
                                            //         handleCashPay={this.handleDontHaveInsurance}
                                            //         hadInsurance={true}
                                            //         history={this.props.history}
                                            //     />,
                                            //     {
                                            //         position: toast.POSITION.TOP_CENTER,
                                            //         className: "custom-lg-toast",
                                            //     }
                                            // );
                                            this.setState({ isClickTime: false, isModal: true });

                                        });

                                } else {

                                    this.setState({
                                        appointModel: true,
                                        modelAppintData: {
                                            appoint,
                                            index: i,
                                            docName: this.state.doc_name,
                                            patientName: this.state.patientName,
                                            patientMobile: this.state.patientMobile,
                                            practice_id: this.state.selectedPracticeLocationId,
                                            patientEmail: this.state.userEmail,
                                            docEmail: this.state.currentDocEmail,
                                            insuranceName: "cash",
                                            hasInsurance: "4",
                                            modalStatus: "4",
                                            teleStatus: teleStatusIs
                                        },
                                        isLoading: false,
                                        isClickTime: false,
                                    });

                                }

                            }
                        })
                        .catch((error) => {
                            console.log("report-error-------->", error);
                            // toast.error("Something wrong.", {
                            //     position: toast.POSITION.TOP_CENTER,
                            // });
                            this.setState({ alertError: false, messageAlert: 'Something wrong.' })
                            this.handleSetInterval();
                        });
                }
            }
        } else {
            Router.push({
                pathname: "/login",
                query: { routename: "schedule", uid: window.location.search.substring(1) },
            });
            console.log("user not authorized to take appointment!");
        }
    };

    // /*----------------------------------------------------return-times-----------------------------------------------*/

    handleToday = (d, i) => {
        let date = new Date();

        let cdd = String(date.getDate()).padStart(2, "0");
        let cmm = String(date.getMonth() + 1).padStart(2, "0");
        let cyy = date.getFullYear();

        let cHours = String(date.getHours()).padStart(2, "0");
        let cMin = String(date.getMinutes() + 1).padStart(2, "0");

        let cTime = String(cHours) + String(cMin);
        let cDate = String(cyy) + String(cmm) + String(cdd);

        var v = {
            time: 0,
        };
        this.state.currentFiveDaysData.map((value) => {

            const sortData = value.availability.sort((a, b) => {
                var keyA = parseInt(a.time),
                    keyB = parseInt(b.time);
                if (keyB > keyA) return -1;
                if (keyA < keyB) return 1;
                return 0;
            });
            value.availability = sortData;
            return value;
        });

        this.state.currentFiveDaysData.map((value) => {
            if (value.date === cDate) {
                let filterAvalibility = value.availability.filter(
                    (data) => parseInt(data.time) > cTime
                );
                value.availability = filterAvalibility;
            }
            let pdd = String(d.getDate()).padStart(2, "0");
            let pmm = String(d.getMonth() + 1).padStart(2, "0");
            let pyy = d.getFullYear();
            let eventDate = String(pyy) + String(pmm) + String(pdd);

            if (value.date === eventDate) {
                v.value = value;
                v.date = value.date;
                v.time = value.availability[i] ? value.availability[i].time : null;
                v.client = value.availability[i] ? value.availability[i].client : null;
                v.availabilityLength = value.availability.length;
                v.offer_telemedicine = value.availability[i] ? value.availability[i].offer_telemedicine : 0;
                v.background = "#1dc478";
                // light green color
                if (v.offer_telemedicine == 1) {
                    v.background = '#008f8e';
                    // dark green color
                }
                if (v.offer_telemedicine == 2) {
                    v.background = "#d3d3d3"
                    // grey color
                }

            }
            return null;
        });

        return v.client ? (
            <span style={{ fontSize: 35, color: "gray" }}>-</span>
        ) : v.time ? (
            i === 4 && this.state.rows < 6 && v.availabilityLength > 5 ? (
                <Button color="primary"
                    onClick={this.handleViewMore}
                >
                    view more
                </Button>
            ) : (<div>
                <Button
                    style={{ backgroundColor: v.background, letterSpacing: '0.1em', borderColor: v.background }}
                    onClick={() => this.handleSetClientInScheduleTime(v.value, i, v.offer_telemedicine)}
                    disabled={this.state.isClickTime}
                    data-tele={v.offer_telemedicine}
                >
                    {handleTimeFormat(v.time)}
                </Button>

            </div>
            )
        ) : (
            <span style={{ fontSize: 35, color: "gray" }}>-</span>
        );
    };

    /*----------------------------------------------------handle-next-week-----------------------------------------------*/

    handleNext = () => {
        this.setState({ days: this.state.days + 5, rows: 5 }, () => {
            this.handleGetAppointmentData();
        });
    };

    /*----------------------------------------------------handle-pre-week-----------------------------------------------*/

    handlePreview = () => {
        if (this.state.days === 0) {
            console.log("you cant go back now !");
            return null;
        } else {
            this.setState({ days: this.state.days - 5, rows: 5 }, () => {
                this.handleGetAppointmentData();
            });
        }
    };

    /*------------------------------convert date-to string---------------------*/

    convertDateToString = (date) => {
        let pdd = String(date.getDate()).padStart(2, "0");
        let pmm = String(date.getMonth() + 1).padStart(2, "0");
        let pyy = date.getFullYear();

        return String(pyy) + String(pmm) + String(pdd);
    };

    /*----------------------------------------------------handle-get-appointments-----------------------------------------------*/

    handleGetAppointmentData = () => {
        // this.setState({ isLoading: true });
        const { days } = this.state;
        // console.log("handleGetAppointmentData 777777777 else areeee",window.location.search.substring(1))
        let id = window.location.search.substring(1);

        // console.log("id",id)
        axios({
            method: "get",
            url:
                Baseurl +
                `api/schedule/get_schedules?uid=${id}&practice_id=${this.state.selectedPracticeLocationId}`,
            headers: { "content-type": "application/json", Pragma: "no-cache" },
        })
            .then((response) => {
                // console.log("get-schedule-response------------->", response.data.data);

                let toDay = HandleScheduleDate(
                    new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
                );
                let tomoro1 = HandleScheduleDate(
                    new Date(new Date().getTime() + (days + 1) * 24 * 60 * 60 * 1000)
                );
                let tomoro2 = HandleScheduleDate(
                    new Date(new Date().getTime() + (days + 2) * 24 * 60 * 60 * 1000)
                );
                let tomoro3 = HandleScheduleDate(
                    new Date(new Date().getTime() + (days + 3) * 24 * 60 * 60 * 1000)
                );
                let tomoro4 = HandleScheduleDate(
                    new Date(new Date().getTime() + (days + 4) * 24 * 60 * 60 * 1000)
                );

                let filtertoDay = this.handleOnlyNull(
                    response.data.data.filter(
                        (value) => value.date === this.convertDateToString(toDay.timezone)
                    )
                );
                let filtertomoro1 = this.handleOnlyNull(
                    response.data.data.filter(
                        (value) => value.date === this.convertDateToString(tomoro1.timezone)
                    )
                );
                let filtertomoro2 = this.handleOnlyNull(
                    response.data.data.filter(
                        (value) => value.date === this.convertDateToString(tomoro2.timezone)
                    )
                );
                let filtertomoro3 = this.handleOnlyNull(
                    response.data.data.filter(
                        (value) => value.date === this.convertDateToString(tomoro3.timezone)
                    )
                );
                let filtertomoro4 = this.handleOnlyNull(
                    response.data.data.filter(
                        (value) => value.date === this.convertDateToString(tomoro4.timezone)
                    )
                );

                let filterDate = response.data.data.some(
                    (value) => value.date > this.convertDateToString(tomoro4.timezone)
                );

                this.setState({
                    isLoading: false,
                    futureDateExist: filterDate,
                    currentFiveDaysData: [
                        ...filtertoDay,
                        ...filtertomoro1,
                        ...filtertomoro2,
                        ...filtertomoro3,
                        ...filtertomoro4,
                    ],
                });
            })
            .catch((error) => {
                console.log("get-schedule-error------------->", error.response);
                this.setState({ isLoading: false });
            });
    };

    /*----------------------------------------handle only null schedule time and date ----------------------------------*/

    handleOnlyNull = (data) => {
        if (data.length) {
            const a = data[0].availability.filter((v) => {
                return v.client === null;
            });
            data[0].availability = a;
            return data;
        } else {
            return data;
        }
    };

    /*----------------------------------handle view more timing availbility--------------------------------------*/

    handleViewMore = () => {
        var maxLength = 0;

        this.state.currentFiveDaysData.map((value) => {
            if (value.availability.length > maxLength) {
                maxLength = value.availability.length;
            }
            return null;
        });

        this.setState({ rows: maxLength });
    };

    handleLoader = (isloader) => {
        this.setState({ isLoading: isloader });
    };

    setAppointData = () => {
        this.setState({ currentFiveDaysData: this.state.currentFiveDaysData });
    };

    render() {

        const { isActive, reviewCollaps } = this.state;

        let today = HandleScheduleDate(
            new Date(new Date().getTime() + this.state.days * 24 * 60 * 60 * 1000)
        );
        let tomoro4 = HandleScheduleDate(
            new Date(
                new Date().getTime() + (this.state.days + 4) * 24 * 60 * 60 * 1000
            )
        );

        let date = new Date();
        let currentTimes = String(date.getHours()) + String(date.getMinutes());

        let y = date.getFullYear();
        let m = String(date.getMonth() + 1).padStart(2, 0);
        let da = String(date.getDate()).padStart(2, "0");

        let currentDate = `${y}${m}${da}`;

        return (

            <React.Fragment>
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
                        <h5 style={{ fontSize: 16, paddingTop: '1rem', paddingBottom: '1rem' }}>Would you like to book this appointment using Self pay?</h5>
                        <div className='col-lg-12'>
                            <div className="row">
                                <div className='col-sm-6 ' style={{ paddingLeft: '10rem' }}>
                                    {/* <button className='btn btn-sm btn-primary btn-filled' onClick={this.handleCheckDetails}>Go back</button> */}
                                    <Button color="primary"
                                        style={{ letterSpacing: '0.1em' }}
                                        onClick={this.handleCheckDetails}
                                    >
                                        Go back
                            </Button>
                                </div>
                                <div className='col-sm-6' style={{ paddingRight: '10rem' }}>
                                    {/* <button className='btn btn-sm btn-primary btn-filled' onClick={this.props.handleCash}>Use Self Pay</button> */}
                                    <Button color="primary" style={{ width: '6rem', letterSpacing: '0.1em' }}
                                        onClick={this.closeModal}
                                    >
                                        Close
                            </Button>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                </Modal>
                <ConfirmAppointmentPopup
                    doctorId={this.state.doctorId}
                    hasModel={this.state.appointModel}
                    modalData={this.state.modelAppintData}
                    handleLoader={this.handleLoader}
                    setAppointData={this.setAppointData}
                    handleSetClientInScheduleTime={this.handleSetClientInScheduleTime}
                    handleSetReminder={this.handleSetReminder}
                    handleGetAppointmentData={() => this.handleGetAppointmentData()}
                />
                {this.state.isLoading ? (
                    <section className="py-5 bg-gray-100">
                        <Container>
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </Container>
                    </section>


                ) : (
                    <section className="py-5 bg-gray-100 ">
                        <Container>
                            <Row>
                                <Col lg="12">
                                    <div className="text-block pb-0 rounded  px-4 mb-4 ">
                                        <img
                                            alt="go_back"
                                            title="go back"
                                            src={ArrowImage}
                                            style={{ height: 25, width: 23, cursor: "pointer", marginTop: ".5rem" }}
                                            onClick={() => window.history.back()}
                                        />
                                        <div className="py-3 border-0 ">
                                            <div className="text-center">
                                                <div className="d-inline-block">
                                                    <img src={`${this.state.profile ? this.state.profile : defaultImage}`} alt="" className="d-block avatar avatar-xxl p-2 mb-2" />
                                                </div>
                                                <h3 className="bold mb0 mt16">
                                                    {this.state.doc_name}
                                                </h3>
                                                <h5 className="bold mb0">
                                                    {this.state.speciality.map((value, index) => {
                                                        return `${value} , `;
                                                    })}
                                                </h5>
                                            </div>

                                            <div className="row ">
                                                <div className=' location-address  max-w-300'>
                                                    <Select
                                                        instanceId="guestsSelect"
                                                        name="guests"
                                                        id="form_Speciality"
                                                        options={this.state.docPracticeLocation}
                                                        className="form-control dropdown bootstrap-select custom-select"
                                                        classNamePrefix="selectpicker"
                                                        // classNamePrefix="selectpicker"
                                                        placeholder={this.state.defaultOptionValue ? this.state.defaultOptionValue : "Select Location"}
                                                        onChange={this.handleDocLocationOnchange}
                                                    />
                                                </div>
                                            </div>
                                            <h6 className="bold mb16 uppercase ">
                                                {this.renderLocation()}
                                            </h6>
                                            <span className="bold hidden-lg hidden-md d-block text-center">
                                                {today.date} - {tomoro4.date}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}
                                    <div className="d-flex justify-content-between arrow-icon view_appointment">
                                        <div id="week_left_btn">
                                            <img
                                                onClick={this.handlePreview}
                                                alt="left"
                                                src="https://image.flaticon.com/icons/png/512/25/25409.png"
                                                style={{ height: 25, width: 25 }}
                                            />

                                        </div>
                                        <div id="week_right_btn " className="view_appointment">
                                            <img
                                                onClick={this.handleNext}
                                                alt="right"
                                                src="https://image.flaticon.com/icons/png/512/271/271228.png"
                                                style={{ height: 25, width: 25 }}
                                            />

                                        </div>
                                    </div>

                                    <div className="table-responsive-lg w-100 view_appointment">
                                        {this.renderTableRow()}
                                    </div>


                                    {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------                 */}
                                    {this.state.currentFiveDaysData.length === 0 ?
                                        <div className="accordion accordion-1 schedule_mobile_view mobile-show" >
                                            No Results
                                            </div>
                                        :
                                        (
                                            this.state.currentFiveDaysData.map(
                                                (value, key) => {
                                                    return (
                                                        <ScheduleAppointmentMobileView
                                                            data={value}
                                                            key={key}
                                                            handleSetClientInScheduleTime={
                                                                this.handleSetClientInScheduleTime
                                                            }
                                                            isClickTime={this.state.isClickTime}
                                                        />
                                                    );
                                                }
                                            )
                                        )
                                    }
                                    <div className='col-lg-12 schedule_mobile_view mobile-show mt-3'>
                                        <div className="row justify-content-center d-flex">

                                            <div className='mr-3'>
                                                <div className="wrap-flx" >
                                                    <div className="sqr-block bg-cl-one"></div> <span>Telemedicine</span>
                                                </div>
                                            </div>
                                            <div className='mr-3' >
                                                <div className="wrap-flx">
                                                    <div className="sqr-block bg-cl-two"></div> <span>Office visit</span>
                                                </div>
                                            </div>
                                            <div className=' ' >
                                                <div className="wrap-flx">
                                                    <div className="sqr-block bg-cl-three"></div> <span>Both.</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-12 schedule_mobile_view mobile-show mt-3'>
                                        <div className="row ">
                                            <div className='col-6 text-left'>
                                                <Button color="primary"
                                                    style={{ letterSpacing: '0.1em' }}
                                                    disabled={this.state.days === 0}
                                                    onClick={this.handlePreview}
                                                >
                                                    Previous
                                                    </Button>
                                            </div>
                                            <div className='col-6 text-right'>
                                                <Button color="primary"
                                                    style={{ width: '7rem', letterSpacing: '0.1em' }}
                                                    disabled={!this.state.futureDateExist}
                                                    onClick={this.handleNext}
                                                >
                                                    Next
                                                    </Button>
                                            </div>

                                            <div className='col-12 '>
                                                <p className="bold text-center mt-3">
                                                    {!this.state.futureDateExist
                                                        ? "No time is available in future"
                                                        : "Use the Next button to see available time in future."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-12 view_appointment mt-5'>
                                        <div className="row justify-content-center d-flex">

                                            <div className='mr-3'>
                                                <div className="wrap-flx" >
                                                    <div className="sqr-block bg-cl-one"></div> <span>Telemedicine</span>
                                                </div>
                                            </div>
                                            <div className='mr-3' >
                                                <div className="wrap-flx">
                                                    <div className="sqr-block bg-cl-two"></div> <span>Office visit</span>
                                                </div>
                                            </div>
                                            <div className=' ' >
                                                <div className="wrap-flx">
                                                    <div className="sqr-block bg-cl-three"></div> <span>Both.</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                )}
            </React.Fragment>

        )
    }
}
const mapStateToProps = (state) => {
    return {
        docProfile: state.docDetails,
        userDetails: state.userDetails,
        userAppointment: state.user_appointments,
        spinner: state.spinner,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleGetUserDetails: (data) =>
            dispatch({ type: GETUSER_DETAILS_REQUEST, data }),
        handlegetDocProfile: (data) =>
            dispatch({ type: DOC_PROFILE_REQUEST, data }),
        handleGetUserAppointmentData: (data) =>
            dispatch({ type: USER_APPOINTMENTS_REQUEST, data }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleAppointment);
