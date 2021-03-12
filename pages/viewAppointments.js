import React, { Component } from 'react';
import { connect } from 'react-redux';
import { USER_APPOINTMENTS_REQUEST, GETUSER_DETAILS_REQUEST } from '../actions/Action';
import { Baseurl } from '../utils/Baseurl';
import axios from 'axios';
// import { handleTimeFormat, handleDateFormat } from '../utils/DateMethod';

import { ConfirmAppointmentMailToDoctor } from '../components/ConfirmAppointmentMailToDoctor';
import { ConfirmAppointmentMailToPatient } from '../components/ConfirmAppointmentMailToPatient';

// import { CancelAppointmentMailToDoctor } from '../components/CancelAppointmentMailToDoctor';
// import { CancelAppointmentMailToPatient } from '../components/CancelAppointmentMailToPatient';

import { ReScheduleAppointmentMailToPatient } from '../components/ReScheduleAppointmentMailToPatient';
import { ReScheduleAppointmentMailToDoctor } from '../components/ReScheduleAppointmentMailToDoctor';
import AppointmentRow from "./AppointmentRow";
import MobileAppointmentRow from '../components/MobileAppointmentRow';

import Link from 'next/link'

import {
    Container,
    Row,
    Button,
} from 'reactstrap'

import data from '../data/yourappointments.json'

// export async function getStaticProps() {
//     return {
//         props: {
//             nav: {
//                 light: true,
//                 classes: "shadow",
//                 color: "white",
//             },
//             loggedUser: true,
//             title: "Compare"
//         },
//     }
// }
class ViewAppointments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            action: 'none',
            patientAppointdata: [],
            userEmail: '',
            userName: '',
            doctorId: '',
            scheduleData: [],
            newTimeArr: [],
            re_schedulePopup: false,
            reScheduleCurrnedate: '',
            reScheduleCurrnetime: '',
            reScheduleNewdate: '',
            reScheduleNewtime: '',
            rescheduleStatusBy: '',
            toggle: false,
            alertSuccess: false,
            messageAlertSuccess: ''

        }

        
    }


    // UNSAFE_componentWillMount() {
    //     
    // }

    getAppointments(id) {
        return axios({
            method: "get",
            url: Baseurl + `api/appointments/get_appointments?uid=${id}`,
            headers: { 'Content-Type': 'application/json', 'Pragma': 'no-cache' }
        });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        const id = localStorage.getItem('uidp');
        if (!id) {
            window.location.href="/login";
        }
        // console.log("id is ", id)
        this.props.handleGetUserDetails(id);

        this.getAppointments(id)
            .then(res => {
                this.setState({
                    patientAppointdata: res.data.data,
                    isLoading: false
                })
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    isLoading: false
                })
            });
    }


    handleSetIntervalSuccess = () => {
        setTimeout(
            () => this.setState({ alertSuccess: false, messageAlertSuccess: '' }),
            5000
        );
    }

    handleCloseAlert = () => {
        this.setState({ alertSuccess: false, messageAlertSuccess: '' })
    }


    // /*---------------------------------------------handle-get-appointments--------------------------------------*/

    UNSAFE_componentWillReceiveProps(props) {
        if (this.props.user_appointments) {
            this.setState({
                userName: `${this.props.userDetails.first_name} ${this.props.userDetails.last_name}`,
                userEmail: this.props.userDetails.email,
            })
        }
    }

    // /*-------------------------------------handle get schedule time and date--------------------*/

    handleGetScheduleData = (id) => {
        return axios({
            method: 'get',
            url: Baseurl + `api/schedule/get_schedules?uid=${id}`,
            headers: { 'content-type': 'application/json' },
        })
    };




    // /*------------------------------------------------------handle re-schedule-newTime-------------------------------------------*/

    newDateOnchange = (e) => {

        this.state.scheduleData.map(value => {
            if (value.date === e.target.value) {
                this.setState({ reScheduleNewdate: e.target.value, newTimeArr: JSON.parse(value.availability) });
            }
            return null;
        });
    };

    // /*----------------------------------------------handle confrim option --------------------------------------*/

    handlePatientConfirmButton = (value) => {

        // const docEmail = this.handleGetDocNames(value.doc_id);
        let userId = localStorage.getItem('uidp');

        axios({
            method: 'get',
            url: Baseurl + `api/doc/getDetails?userId=${value.doc_id}`,
            headers: { 'content-type': 'application/json' },
        }).then(res => {
            // console.log("doc--->", res);
            let practiceName;
            let practice = res.data.user.practice.filter((k, i) => i === 0 ? k : null);
            practice.map((value) => {
                practiceName = `${value.practice_name}, ${value.practice_location}, ${value.zip}`;
                return null
            });

            let data = {
                emailto_doc: res.data.user.email,
                emailto_grpdoc: res.data.user.groupDrEmail,
                doc_subject: 'Your appointment has been confirmed !',
                doc_message: ConfirmAppointmentMailToDoctor(practiceName, value.date, value.time, this.state.userName),


                emailto_patient: this.state.userEmail,
                patient_subject: 'Your appointment has been confirmed !',
                patient_message: ConfirmAppointmentMailToPatient(practiceName, value.date, value.time, `${res.data.user.first_name} ${res.data.user.last_name}`)

            }

            axios({
                method: 'post',
                url: Baseurl + `api/appointment/patient_confirm_appointment?appointDate=${value.date}&appointTime=${value.time}&status_by=${userId}`,
                headers: { 'content-type': 'application/json' },
                data: data
            }).then((res) => {
                // console.log("update-appointment confirmation status--------->", res);
                // toast.success('Appointment Confirmed !', { position: toast.POSITION.TOP_CENTER });
                this.setState({ alertSuccess: true, messageAlertSuccess: 'Appointment Confirmed !' });
                this.handleSetIntervalSuccess();
                // console.log(res);
                this.props.handleGetUserAppointments(userId);

            }).catch((error) => {
                console.log("update-appointment confirmation status error--------->", error);
            })

        }).catch(error => {
            console.log("something wrong during get doc details---->", error);
        })
    }





    // /*----------------------------------------------handle cancel option --------------------------------------*/

    handlePatientCancelButton = (value) => {
        let userId = localStorage.getItem('uidp');
        let data = {
            doc_id: value.doc_id,
            practice_id: value.practice_id,
            createdAt: value.createdAt,
            user_id: userId,
            date: value.date,
            time: value.time
        }

        axios({
            method: 'post',
            url: Baseurl + 'api/appointments/patient_cancel_appointment',
            headers: { 'content-type': 'application/json' },
            data: data
        }).then((res) => {
            // toast.success(<ToastMsg message="Appointment canceled successfully." />, { position: toast.POSITION.TOP_CENTER });
            this.setState({ alertSuccess: true, messageAlertSuccess: 'Appointment canceled successfully.' });
            this.handleSetIntervalSuccess();
            this.componentDidMount();

        }).catch((error) => {
            console.log("patient cancelled appointment error--------->", error);
            this.setState({ isLoading: false })
        })
    };


    // /*-----------------------------------------------handle patient re-schedule button-----------------------------*/

    handledocPatientRescheduleButton = () => {

        // const docEmail = this.handleGetDocNames(this.state.doctorId);
        let userId = localStorage.getItem('uidp');

        /*------------------------new date client-------------*/
        let availarr = [];
        let previousAvailability = [];

        this.state.scheduleData.map(value => {
            if (value.date === this.state.reScheduleNewdate) {
                const par = JSON.parse(value.availability);
                par.map(v => {
                    if (v.time === this.state.reScheduleNewtime) {
                        v.client = userId;
                    }
                    return null
                });
                availarr.push(JSON.stringify(par));
            }
            return null
        });

        /*------------------------previous date client-------------*/
        let [, date, time] = this.state.rescheduleStatusBy.split('&');

        this.state.scheduleData.map(value => {
            if (value.date === date) {
                const prevPar = JSON.parse(value.availability);
                prevPar.map(v => {
                    if (v.time === time) {
                        v.client = null;
                    }
                    return null
                });
                previousAvailability.push(JSON.stringify(prevPar));
            }
            return null
        });

        // console.log("availarr", availarr);
        // console.log("previousAvailability", previousAvailability)
        // console.log(this.state.rescheduleStatusBy);

        axios({
            method: 'get',
            url: Baseurl + `api/doc/getDetails?userId=${this.state.doctorId}`,
            headers: { 'content-type': 'application/json' },
        }).then(res => {
            let practiceName;
            let practice = res.data.user.practice.filter((k, i) => i === 0 ? k : null);
            practice.map((value) => {
                practiceName = `${value.practice_name}, ${value.practice_location}, ${value.zip}`;
                return null
            });


            let data = {
                doc_id: this.state.doctorId,
                new_date: this.state.reScheduleNewdate,
                new_time: this.state.reScheduleNewtime,
                availability: availarr,
                previousAvailability: previousAvailability,
                reScheduleStatusBy: this.state.rescheduleStatusBy,


                emailto_doc: res.data.user.email,
                emailto_grpdoc: res.data.user.groupDrEmail,
                doc_subject: 'Your appointment has been Re-Scheduled !',
                doc_message: ReScheduleAppointmentMailToDoctor(
                    practiceName,
                    this.state.reScheduleCurrnedate,
                    this.state.reScheduleCurrnetime,
                    this.state.reScheduleNewdate,
                    this.state.reScheduleNewtime,
                    this.state.userName,
                    this.state.doctorId,
                    userId
                ),



                emailto_patient: this.state.userEmail,
                patient_subject: 'Your appointment has been Re-Scheduled !',
                patient_message: ReScheduleAppointmentMailToPatient(
                    practiceName,
                    this.state.reScheduleCurrnedate,
                    this.state.reScheduleCurrnetime,
                    this.state.reScheduleNewdate,
                    this.state.reScheduleNewtime,
                    `${res.data.user.first_name} ${res.data.user.last_name}`,
                )

            };

            axios({
                method: 'post',
                url: Baseurl + `api/appointment/patient_reSchedule_appointment?appointDate=${this.state.reScheduleCurrnedate}&appointTime=${this.state.reScheduleCurrnetime}&status_by=${userId}`,
                headers: { "content-type": "application/json" },
                data: data
            }).then((res) => {
                // toast.success('Appointment Re-Scheduled !', { position: toast.POSITION.TOP_CENTER });
                this.setState({ re_schedulePopup: false, alertSuccess: true, messageAlertSuccess: 'Appointment Re-Scheduled !' });
                this.handleSetIntervalSuccess();
                // console.log(res);
                this.props.handleGetUserAppointments(userId);
            }).catch((error) => {
                console.log("Appointment Re-Schedule error---->", error);
                this.setState({ re_schedulePopup: false });
            })

        }).catch((error) => {
            console.log("getuser email error--->", error);
        })

    };

    // /*--------------------------------------setting data of doctor to re-schedule---------------------------------*/

    setScheduleData = (value) => {
        const getScheduleData = this.handleGetScheduleData(value.doc_id);
        getScheduleData.then(res => {
            // console.log(res);
            this.setState({ rescheduleStatusBy: value.statusBy, doctorId: value.doc_id, scheduleData: res.data.data, re_schedulePopup: true, reScheduleCurrnedate: value.date, reScheduleCurrnetime: value.time });
        })
    };


    // /*------------------------------------------------------handle backdrop-------------------------------------------*/

    handleBackdrop = () => {
        this.setState({ re_schedulePopup: false })
    };


    render() {

        // useEffect(() => {
        //     const script = document.createElement('script');

        //     script.src = "https://www.kryogenix.org/code/browser/sorttable/sorttable.js";
        //     script.async = true;

        //     document.body.appendChild(script);

        //     return () => {
        //         document.body.removeChild(script);
        //     }
        // }, []);

        return (
            <React.Fragment>
                <div className="viewAppointments-section">


                    <div className="hero py-5 py-lg-5">
                        <Container className="position-center">
                            <h1 className="hero-heading" style={{ marginBottom: 'auto' }}>{data.title}</h1>

                            {this.state.alertSuccess ?
                                <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
                                    {this.state.messageAlertSuccess}
                                    <button type="button" className="close" data-dismiss="alert" onClick={this.handleCloseAlert} aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                : ''
                            }

                        </Container>
                    </div>
                    <section className="py-4 review-table">
                        <Container>
                            <Row>
                                <table className="text-gray-700 table table-striped table-hover sortable reviex-tbl  view_appointment text-sm">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '18%' }} >Created at</th>
                                            <th >Doctor Name</th>
                                            <th style={{ width: '13%' }} >Date</th>
                                            <th style={{ width: '11%' }} >Time</th>
                                            <th >Status</th>
                                            <th >Action</th>
                                            <th style={{ width: '17%' }}>Practice Location</th>
                                        </tr>
                                    </thead>

                                    {this.state.isLoading ?
                                        <tbody>
                                            <tr className="text-center">
                                                <td colSpan="7">
                                                    <div className="spinner-border" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody> :
                                        this.state.patientAppointdata.length === 0 ?
                                            <tbody>
                                                <tr>

                                                    <td colSpan="7">
                                                        <div style={{ paddingTop: '1em' }}>
                                                            <h5 className="text-center" style={{ color: 'rgb(0, 35, 75)', fontWeight: 'bold' }}>No Appointments</h5>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            :
                                            <tbody>
                                                {
                                                    this.state.patientAppointdata.map((value, index) => {
                                                        return <AppointmentRow key={index}
                                                            value={value} {...this.props}
                                                            handlePatientConfirmButton={this.handlePatientConfirmButton}
                                                            setScheduleData={this.setScheduleData}
                                                            handlePatientCancelButton={this.handlePatientCancelButton} />
                                                    })
                                                }
                                            </tbody>
                                    }
                                </table>
                            </Row>

                        </Container>
                    </section>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="accordion accordion-1 view_user_reviews_mobile_view pl-0 w-100" style={{ listStyle: 'none' }}  >
                                    {/* <hr></hr> */}
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', width: '100%', height: 'auto', padding: 10 }}>
                                        <div className="text-left" style={{ height: 'auto', width: '33.3%', fontWeight: 'bold', color: '#495057' }}>Doctor Name</div>
                                        <div className="text-center" style={{ height: 'auto', width: '33.3%', fontWeight: 'bold', color: '#495057' }}>Date</div>
                                        <div className="text-right" style={{ height: 'auto', width: '25%', fontWeight: 'bold', color: '#495057' }}>Time</div>
                                    </div>
                                    {/* <hr></hr> */}
                                    {/* <thead>
                        <tr>
                            <th >Doctor Name</th>
                            <th >Date</th>
                            <th >Time</th>
                        </tr>
                    </thead> */}
                                    {this.props.isLoading ?
                                        // <tbody>
                                        //     <tr>
                                        <div className="col-12 text-center">
                                            {/* <td colSpan="5"> */}
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            {/* </td> */}
                                        </div>
                                        // </tr>
                                        //  </tbody>  
                                        : this.state.patientAppointdata.length === 0 ?
                                            // <tbody >
                                            //     <tr>
                                            //         <td colSpan="3" style={{ textAlign: "center" }}>
                                            <div className="col-12 text-center">
                                                No data Found..
                                            </div>
                                            // </td>
                                            //             </tr>
                                            //         </tbody> 
                                            :
                                            this.state.patientAppointdata.map((value, key) => {
                                                return <MobileAppointmentRow
                                                    key={key}
                                                    data={value}
                                                    handlePatientConfirmButton={this.handlePatientConfirmButton}
                                                    setScheduleData={this.setScheduleData}
                                                    handlePatientCancelButton={this.handlePatientCancelButton}
                                                />
                                            })
                                    }
                                </div>
                            </div>

                        </div>
                    </div>



                    <Container>
                        <Row className=" mt-5">
                            <div className="col-12 text-center">
                                <Link href="/"><Button  className="btn-btn-nw ml-auto mr-2 mb-4" color="primary">Search Providers</Button></Link>
                               <Link href="/consults"><Button  className="btn-btn-nw mr-auto mb-4" style={{ width: '11rem' }} color="primary"><a ></a>consults</Button></Link> 
                            </div>
                        </Row>
                    </Container>



                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user_appointments: state.user_appointments,
        userDetails: state.userDetails,
        isLoading: state.isLoading,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleGetUserAppointments: data => dispatch({ type: USER_APPOINTMENTS_REQUEST, data }),
        handleGetUserDetails: data => dispatch({ type: GETUSER_DETAILS_REQUEST, data }),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ViewAppointments);
