import React, { Component } from 'react'
import queryString from 'query-string';
import { Baseurl } from '../utils/Baseurl';
import axios from 'axios';

import { ConfirmAppointmentMailToDoctor } from '../components/ConfirmAppointmentMailToDoctor';
import { ConfirmAppointmentMailToPatient } from '../components/ConfirmAppointmentMailToPatient';

import { CancelAppointmentMailToDoctor } from '../components/CancelAppointmentMailToDoctor';
import { CancelAppointmentMailToPatient } from '../components/CancelAppointmentMailToPatient';

export default class AppointmentConfirmation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
        }
    }


    // UNSAFE_componentWillMount() {

    //     let param = queryString.parse(this.props.location.search);
    //     if (this.props.isAuth) {
    //         if (param.status === "0") {
    //             this.handlePatientConfirmBtn();
    //         }
    //         else if (param.status === "1") {
    //             this.props.history.push(`view-appointments/?date=${param.date}&time=${param.time}&docId=${param.docId}&id=${param.id}&status=${param.status}`);
    //         }
    //         else if (param.status === "2") {
    //             this.handlePatientCancelButton();
    //         }
    //         else {
    //             this.setState({ message: 'somthing went wrong . invalid url !' });
    //             setTimeout(() => {
    //                 this.props.history.push('/view-appointments');
    //             }, 1000);
    //         }

    //     }
    //     else {
    //         this.props.history.push({ pathname: '/access/login', state: { routename: 'confirm', date: param.date, time: param.time, docId: param.docId, id: param.id, status: param.status } });
    //     }
    // }



    /*-------------------------------------handle get schedule time and date--------------------*/

    // handleGetScheduleData = (id) => {
    //     return axios({
    //         method: 'get',
    //         url: Baseurl + `api/schedule/get_schedules?uid=${id}`,
    //         headers: { 'content-type': 'application/json' },
    //     })
    // };




    // /*------------------------------------------------------handle-patient-confirm-button----------------------------------------------*/

    // handlePatientConfirmBtn = () => {
    //     let param = queryString.parse(this.props.location.search);
    //     let userId = localStorage.getItem('uidp');
    //     if (param.id === userId) {
    //         /*------------user-details---------------*/
    //         axios({
    //             method: 'get',
    //             url: Baseurl + `api/user/getuserdetails?userId=${userId}&1=2`,
    //             headers: { 'content-type': 'application/json' }
    //         }).then((user) => {
                // console.log("user-details-response-------->", user.data.user);
                /*------------doc-details---------------*/

    //             axios({
    //                 method: 'get',
    //                 url: Baseurl + `api/doc/getDetails?userId=${param.docId}`,
    //                 headers: { 'content-type': 'application/json' }

    //             }).then(res => {

    //                 let practiceName;
    //                 let practice = res.data.user.practice.filter((k, i) => i === 0 ? k : null);
    //                 practice.map((value) => {
    //                     practiceName = `${value.practice_name}, ${value.practice_location}, ${value.zip}`;
    //                     return null
    //                 })

    //                 this.setState({ message: 'Loading..!' });

    //                 let data = {
    //                     emailto_doc: res.data.user.email,
    //                     emailto_grpdoc: res.data.user.groupDrEmail,
    //                     doc_subject: 'Your appointment has been confirmed !',
    //                     doc_message: ConfirmAppointmentMailToDoctor(practiceName, param.date, param.time, `${user.data.user.first_name} ${user.data.user.last_name}`),


    //                     emailto_patient: user.data.user.email,
    //                     patient_subject: 'Your appointment has been confirmed !',
    //                     patient_message: ConfirmAppointmentMailToPatient(practiceName, param.date, param.time, `${res.data.user.first_name} ${res.data.user.last_name}`)

    //                 }
    //                 /*------------patient_confirm_appointment---------------*/
    //                 axios({
    //                     method: 'post',
    //                     url: Baseurl + `api/appointment/patient_confirm_appointment?appointDate=${param.date}&appointTime=${param.time}&status_by=${param.id}`,
    //                     headers: { 'content-type': 'application/json' },
    //                     data: data
    //                 }).then((res) => {
    //                     // console.log("update-appointment confirmation status--------->", res);
    //                     this.setState({ message: 'Congratulations your appointment has confirmed !' })
    //                     setTimeout(() => {
    //                         this.props.history.push('/view-appointments');
    //                     }, 2000);

    //                 }).catch((error) => {
    //                     console.log("update-appointment confirmation status error--------->", error);
    //                 })


    //             }).catch(error => {
    //                 console.log("something wrong during get doc details---->", error);
    //             })


    //         }).catch((error) => {
    //             console.log("petient-details-error------->", error);
    //         })


    //     }
    //     else {
    //         this.setState({ message: 'invalid url !' });
    //         setTimeout(() => {
    //             this.props.history.push('/view-appointments');
    //         }, 1000);
    //     }

    // }


    // /*-----------------------------------------------------------handle patient cancel button--------------------------------------------*/

    // handlePatientCancelButton = () => {
        
    //     let param = queryString.parse(this.props.location.search);
    //     let userId = localStorage.getItem('uidp');
    //     let availarr = [];
    //     const getScheduleData = this.handleGetScheduleData(param.docId);

    //     if (param.id === userId) {
    //         getScheduleData.then(res => {
    //             res.data.data.map(value => {
    //                 if (value.date === param.date) {
    //                     const par = JSON.parse(value.availability);
    //                     par.map(v => {
    //                         if (v.time === param.time) {
    //                             if (v.client === param.id) {
    //                                 v.client = null;
    //                             }
    //                             else {
    //                                 this.setState({ message: 'invalid user !' });
    //                                 setTimeout(() => {
    //                                     this.props.history.push('/view-appointments');
    //                                 }, 1000);

    //                             }
    //                         }
    //                         return null
    //                     });
    //                     availarr.push(JSON.stringify(par));
    //                 }
    //                 return null
    //             });

    //             /*------------user-details---------------*/
    //             axios({
    //                 method: 'get',
    //                 url: Baseurl + `api/user/getuserdetails?userId=${userId}&2=1`,
    //                 headers: { 'content-type': 'application/json' }
    //             }).then((user) => {
                    // console.log("user-details-response-------->", user.data.user);

    //                 axios({
    //                     method: 'get',
    //                     url: Baseurl + `api/doc/getDetails?userId=${param.docId}`,
    //                     headers: { 'content-type': 'application/json' }

    //                 }).then(doc => {
    //                     this.setState({ message: 'Loading..!' });

    //                     let practiceName;
    //                     let practice = doc.data.user.practice.filter((k, i) => i === 0 ? k : null);
    //                     practice.map((value) => {
    //                         practiceName = `${value.practice_name}, ${value.practice_location}, ${value.zip}`;
    //                         return null
    //                     });

    //                     let data = {
    //                         docId: param.docId,
    //                         availability: availarr,

    //                         emailto_doc: doc.data.user.email,
    //                         emailto_grpdoc: doc.data.user.groupDrEmail,
    //                         doc_subject: 'Your appointment has been Cancelled !',
    //                         doc_message: CancelAppointmentMailToDoctor(practiceName, param.date, param.time, `${user.data.user.first_name} ${user.data.user.last_name}`),


    //                         emailto_patient: user.data.user.email,
    //                         patient_subject: 'Your appointment has been confirmed !',
    //                         patient_message: CancelAppointmentMailToPatient(practiceName, param.date, param.time, `${doc.data.user.first_name} ${doc.data.user.last_name}`)

    //                     }

    //                     axios({
    //                         method: 'post',
    //                         url: Baseurl + `api/appointment/patient_cancel_appointment?appointDate=${param.date}&appointTime=${param.time}&status_by=${param.id}`,
    //                         headers: { 'content-type': 'application/json' },
    //                         data: data
    //                     }).then((res) => {

    //                         this.setState({ message: 'Congratulations your appointment has cancelled !' })
    //                         setTimeout(() => {
    //                             this.props.history.push('/view-appointments');
    //                         }, 2000);

    //                     }).catch((error) => {
    //                         console.log("patient cancelled appointment error--------->", error);
    //                     })


    //                 }).catch(error => {
    //                     console.log("get doc details error----->", error);
    //                 })

    //             }).catch((error) => {
    //                 console.log("petient-details-error------->", error);
    //             })

    //         }).catch((error => {
    //             console.log(error);
    //         }))

    //     }
    //     else {
    //         this.setState({ message: 'invalid url !' });
    //         setTimeout(() => {
    //             this.props.history.push('/view-appointments');
    //         }, 1000);
    //     }


    // }



    render() {
        return (
            <React.Fragment>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h5>{this.state.message}</h5>
                </div>
            </React.Fragment>
        )
    }
}



