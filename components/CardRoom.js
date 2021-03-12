import React from 'react';
import DoctorCardReviewBox from './DoctorCardReviewBox';
import Link from 'next/link'
import defaultImage from '../images/images.jpeg';

import {
    Card,
    CardSubtitle,
    CardText,
    Button
} from 'reactstrap'


// import Stars from './Stars'


export default class DoctorListCard extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            hasInsurance_match: false
        }
    }

    componentDidMount() {
        this.handleGetInsuranceDetails();
    }

    createScheduleItem = (id) => {
        localStorage.setItem("scheduleAppId", id)
    }


    createViewProfileItem = (id) => {
        localStorage.setItem("viewProfileId", id)
    }

    /*----------------------------handle-match doc and patient-insurance-provider---------------------------*/



    handleGetInsuranceDetails = () => {
        //console.log('this.props.pataintPayerCode',this.props.pataintPayerCode);
        let doc_insurance = this.props.insurance_providers && this.props.insurance_providers.length > 0 ? this.props.insurance_providers : [];
        let filterdocinsurance = doc_insurance.filter(v => v.code === this.props.pataintPayerCode)
        if (filterdocinsurance.length !== 0) {
            this.setState({ hasInsurance_match: true });
        }
        else {
            this.setState({ hasInsurance_match: false });
        }
    }

    render() {

        const location = this.props.location && this.props.location.length > 0 ? this.props.location : [];
        return (
            <Card className="border-0 shadow">

                <div className="d-flex align-items-center card-body">

                    <div className="w-100">
                        <div className="user-info-header mb-3 align-items-center d-flex">
                            <div>
                                <img src={`${this.props.doc_image ? this.props.doc_image : defaultImage}`} className="avatar avatar-lg avatar-border-white mr-2" style={{ objectFit: 'cover' }} />
                            </div>

                            <div className="d-flex justify-content-between align-items-center w-100">
                                <div className="d-block w-100">
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
                                        <h6 className="mt-3">{this.props.doc_name}</h6>
                                        <h6 style={{ fontSize: 12, fontWeight: 'bold', color: '#47b475', marginTop: "1rem", paddingRight: "auto" }}>{this.state.hasInsurance_match ? 'Insurance matched' : ''}</h6>
                                    </div>  

                                    <span className="pull-right">{this.props.distance}</span>
                                    <p className="flex-shrink-1 mb-2 card-stars text-muted text-sm">{this.props.primary_speciality}</p>
                                </div>
                                {/* <p className="mb-0 badge badge-info-light">{this.props.insurance}</p> */}
                            </div>
                        </div>
                        <p className="custom-scroll max-height-70 text-sm text-muted">
                            {
                                location.map(value => {
                                    return ` ${value.practice_name}, ${value.city} ${value.practice_location} ,${value.zip} `
                                })
                            }
                        </p>
                        <CardSubtitle className="mb-3">
                            <div className="flex-shrink-1 mb-2 card-stars text-xs">
                                {this.props.reviewLength > 0 ? <DoctorCardReviewBox docId={this.props.id} reviewAverage={this.props.reviewAverage} reviewLength={this.props.reviewLength} latastReview={this.props.latastReview} /> : ''}
                            </div>

                        </CardSubtitle>
                        <CardText className="text-muted">

                            {/* <Link href={{ pathname: `/scheduleAppointment`, query: { id: this.props.id } }} as={`/scheduleAppointment?${this.props.id}`}>
                                <Button outline className="btn-btn-nw mr-2 font-08r font-w500 outline-clr" onClick={() => this.createScheduleItem(this.props.id)} color="primary">Schedule Appointment</Button>
                            </Link> */}

                            {/* <Link href={{ pathname: `/viewProfile`, query: { id: this.props.id } }} as={`/viewProfile?${this.props.id}`}>
                                <Button outline className="btn-btn-nw  font-08r font-w500 outline-clr" onClick={() => this.createViewProfileItem(this.props.id)} color="primary">View profile</Button>
                            </Link> */}

                            <Link href={{ pathname: `/scheduleAppointment`, query: { id: this.props.id } }} as={`/scheduleAppointment?${this.props.id}`}>
                                <a onClick={() => this.createScheduleItem(this.props.id)} className="btn btn-btn-nw mr-2 font-08r font-w500 outline-clr btn-outline-primary laptop-screen">Schedule Appointment</a>
                            </Link>
                            <Link href={{ pathname: `/viewProfile`, query: { id: this.props.id } }} as={`/viewProfile?${this.props.id}`}>
                                <a onClick={() => this.createViewProfileItem(this.props.id)} className="btn btn-btn-nw  font-08r font-w500 outline-clr btn-outline-primary laptop-screen">View profile</a>
                            </Link>

                        </CardText>
                    </div>
                </div>
            </Card>
        )
    }
}