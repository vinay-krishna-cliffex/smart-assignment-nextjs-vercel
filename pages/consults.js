import React, { Component } from 'react';
import { Baseurl } from '../utils/Baseurl';
// import { toast } from 'react-toastify';
import axios from 'axios';
import ConsultMobileView from '../components/ConsultMobileView';
import Router from 'next/router'
import Link from 'next/link'

import {
    Container,
    Row,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap'


export default class Consults extends Component {

    constructor(props) {
        super(props);
        this.state = {
            patientConsults: [],
            isLoading: false,
            alertError: false,
            messageAlert: '',
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.handleGetPatientConsults();
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

    handleGetPatientConsults = () => {
        this.setState({ isLoading: true });
        let id = localStorage.getItem('uidp');
        axios({
            method: 'get',
            url: Baseurl + `api/consult/get_patientconsults?id=${id}`,
            headers: { 'content-type': 'application/json' }
        }).then((repsonse) => {
            // console.log("get-patient-consults------->", repsonse);
            const patientConsultsByDate = repsonse.data.data.sort((a, b) => {
                var keyA = new Date(a.createdAt),
                    keyB = new Date(b.createdAt);
                if (keyB < keyA) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });

            // console.log("&&&&&&&&&&check -->", patientConsultsByDate)

            this.setState({ patientConsults: patientConsultsByDate, isLoading: false })

        }).catch((error) => {
            console.log("get-patient-consults-error------->");
            this.setState({ isLoading: false });
        })

    }


    handlesearchConsult = (e, data) => {
        console.log("consult data", data)
        e.preventDefault();

        // console.log("Consult search --->", data)

        if (data.interested !== null) {
            let consultData = { name: "", practice_name: "", insurance_provider: "", zip: "", consultAt: data ? data.createdAt : '' }
            localStorage.setItem("homeQuerys", JSON.stringify(consultData));
            let insuranceData = ''
            Router.router.push(`/doctors?${insuranceData}`)
            // console.log("success")
        }
        else {
            // toast.error('No doctors are interested. Please try again later');
            this.setState({ alertError: true, messageAlert: 'No doctors are interested. Please try again later' })
            this.handleSetInterval();
            console.log("errrrror")
        }
    }

    render() {
        return (
            <React.Fragment>
                <section className="hero py-5 py-lg-5">
                    <Container className="position-relative">
                        <Breadcrumb listClassName="pl-0 justify-content-center">
                            <BreadcrumbItem >
                                <h1>Consults</h1>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </Container>
                </section>
                <section className="py-4 review-table">
                    <Container>
                        <Row>
                            <div className="table-responsive-lg w-100">
                                {/* <div className="text-center p-4" style={{ fontWeight: 'bold', fontSize: "2.7rem" }}> Consults</div> */}
                                {this.state.alertError ?
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        {this.state.messageAlert}
                                        <button type="button" className="close" data-dismiss="alert" onClick={this.handleCloseAlert} aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    : ''
                                }
                                <table className="text-gray-700 table table-striped table-hover sortable reviex-tbl">
                                    <thead>
                                        <tr>
                                            <th>Created at</th>
                                            <th>From Doctor name</th>
                                            <th>Specialization</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {this.props.isLoading ?
                                        <tbody>
                                            <tr>
                                                <td colSpan="4">
                                                    <div className="spinner-border" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody> : this.state.patientConsults.length === 0 ?
                                            <tbody >
                                                <tr>
                                                    <td colSpan="4">
                                                        <div style={{ paddingTop: '1em' }}>
                                                            <h5 className="text-center" style={{ color: '#4E66F8', fontWeight: 'bold' }}>No data Found..</h5>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody> :
                                            <tbody>

                                                {
                                                    this.state.patientConsults.map((value, index) => {
                                                        return <tr key={index}>
                                                            <td > {new Date(value.createdAt).toLocaleString()} </td>
                                                            <td> {value.doctor_name} </td>
                                                            <td > {value.speciality ? value.speciality : 'No Specialization'} </td>
                                                            <td>
                                                                <p onClick={(e) => this.handlesearchConsult(e, value)} style={{ color: '#4E66F8', fontWeight: 'bold', cursor: "pointer" }}><a>
                                                                    View Doctors</a>
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    })
                                                }
                                            </tbody>
                                    }
                                </table>
                                <ul className="accordion accordion-1 view_user_reviews_mobile_view">
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', width: '100%', height: 'auto', padding: '20px 10px 20px 10px ' }}>
                                        <div className="text-left" style={{ height: 'auto', width: '50%', fontWeight: 'bold' }}>Created at</div>
                                        <div className="text-right" style={{ height: 'auto', width: '48%', fontWeight: 'bold' }}>From Doctor name</div>
                                    </div>

                                    {this.props.isLoading ?
                                        <tbody >
                                            <tr>
                                                <td colSpan="2" style={{ textAlign: "center" }}>
                                                    No data Found..
                                                    </td>
                                            </tr>
                                        </tbody> :
                                        this.state.patientConsults.map((mobileValue, key) => {
                                            return <ConsultMobileView data={mobileValue} key={key} handlesearchConsult={this.handlesearchConsult} />
                                        })
                                    }
                                </ul>
                            </div>
                        </Row>
                    </Container>
                </section>

            </React.Fragment>
        )
    }
}

{/* <ul className="accordion accordion-1 consult_mobile_view" style={{ marginBottom: 5 }}>
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', width: '100%', height: 'auto', padding: 10 }}>
        <div className="text-left" style={{ height: 'auto', width: '50%', fontWeight: 'bold' }}>Created at</div>
        <div className="text-center" style={{ height: 'auto', width: '50%', fontWeight: 'bold' }}>From Doctor name</div>
    </div>

    {
        this.state.patientConsults.map((mobileValue, key) => {
            return <ConsultMobileView data={mobileValue} key={key} handlesearchConsult={this.handlesearchConsult} />
        })

    }

</ul>  */}
