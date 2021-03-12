import React, { Component } from "react";
import { DOC_PROFILE_REQUEST } from "../actions/Action";
import { connect } from "react-redux";
import ReviewBox from "../components/ReviewBox";
import firebase from "../utils/Fire";
import axios from "axios";
import { Baseurl } from "../utils/Baseurl";
import { formatPhoneNumber } from "react-phone-number-input";
import dynamic from 'next/dynamic'
import StarRatings from 'react-star-ratings';
import defaultImage from '../images/images.jpeg';
import ArrowImage from '../images/arrow_left.png';
import Link from 'next/link'
// import Router from 'next/router'

import 'react-dates/initialize'

import {
    Container,
    Row,
    Col,
    Button,
} from 'reactstrap'
import UseWindowSize from '../hooks/UseWindowSize'
import data from '../data/detail-rooms.json'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: 'Rooms detail'
        },
    }
}



let Map

class ViewProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doc_name: "",
            location: "",
            about: "",
            board_certification: "None",
            speciality: [],
            practice: [],
            hospital_affiliations: [],
            education_training: [],
            awards_publications: [],
            language: [],
            gender: "",
            npi_number: "",
            profile: "",
            uId: "",
            mobile: "",
            reviewLength: 0,
            reviewAllRatings: 0,
            isAuth: false,
            insurance_provider: [],
            medicaid_insurance_providers: [],
            hasInsurance_match: false,
            docLocation: [],
            telemedicine: 0,
            mapLoaded: false,
            dragging: false,
            tap: false,
            reviewCollapse: false,
            id: ""
        };
    }

    groupByN = (n, data) => {
        let result = [];
        for (let i = 0; i < data.length; i += n) result.push(data.slice(i, i + n));
        return result;
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        const size = new UseWindowSize();
        Map = dynamic(
            () => import('../components/Map'),
            { ssr: false }
        )
        let id = window.location.search.substring(1);
        this.setState({ mapLoaded: true, tap: size.width > 700 ? true : false, dragging: size.width > 700 ? true : false, id: id })
        this.props.handlegetDocProfile(id);

        this.handleIsAuth();
    }

    createScheduleItem = (id) => {
        localStorage.setItem("scheduleAppId", id)
    }

    handleIsAuth = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ isAuth: true });
            } else {
                this.setState({ isAuth: false });
            }
        });
    };

    UNSAFE_componentWillReceiveProps(props) {
        // console.log('profile props' ,props.docProfile)
        if (Object.keys(props.docProfile).length < 1) {
            return false;
        } else {
            // if (this.state.uId !== props.docProfile.uid) {
                this.setState(
                    {
                        doc_name: `${props.docProfile.first_name} ${props.docProfile.last_name}`,
                        location: props.docProfile.practice_location,
                        about: props.docProfile.about_me,
                        mobile: formatPhoneNumber(props.docProfile.mobile),
                        speciality: props.docProfile.speciality
                            ? props.docProfile.speciality
                            : [],
                        practice:
                            props.docProfile.practice && props.docProfile.practice.length > 0
                                ? [props.docProfile.practice[0]]
                                : [],
                        docLocation:
                            props.docProfile.practice && props.docProfile.practice.length > 0
                                ? props.docProfile.practice
                                : [],
                        insurance_provider:
                            props.docProfile.insurance_providers &&
                                props.docProfile.insurance_providers.length > 0
                                ? props.docProfile.insurance_providers
                                : [],
                        medicaid_insurance_providers:
                            props.docProfile.medicaid_insurance_providers &&
                                props.docProfile.medicaid_insurance_providers.length > 0
                                ? props.docProfile.medicaid_insurance_providers
                                : [],
                        hospital_affiliations: props.docProfile.hospital_affiliations,
                        education_training: props.docProfile.education_training,
                        awards_publications: props.docProfile.awards_publications,
                        language: props.docProfile.languages,
                        gender: props.docProfile.gender,
                        npi_number: props.docProfile.npi_number,
                        uId: props.docProfile.uid,
                        profile: props.docProfile.profile_image,
                        board_certification: props.docProfile.board_certification,
                        telemedicine: props.docProfile.telemedicine
                    },
                    () => {
                        this.handleGetInsuranceDetails();
                    }
                );
            // }
        }
    }

    /*------------------------------------match-insurance-provider------------------------------------*/

    handleGetInsuranceDetails = () => {
        let id = localStorage.getItem("uidp");
        axios({
            method: "get",
            url: Baseurl + `api/user/getuserdetails?userId=${id}`,
            headers: { "content-type": "application/json" },
        })
            .then((res) => {
                // console.log("get-insurance-response---->", res.data.user.payerCode);
                let filterdocinsurance = this.state.insurance_provider.filter(
                    (v) => v.code === res.data.user.payerCode
                );

                if (filterdocinsurance.length !== 0) {
                    this.setState({ hasInsurance_match: true });
                } else {
                    this.setState({ hasInsurance_match: false });
                }
            })
            .catch((error) => {
                console.log("get-user-details-error", error);
            });
    };

    /*--------------------------------------------render-location--------------------------------------*/

    renderLocation = () => {
        let l = this.state.practice.filter((k, i) => (i === 0 ? k : null));
        return l.map((value) => {
            return `${value.practice_name}, ${value.city} ${value.practice_location}, ${value.zip}`;
        });
    };

    /*------------------------------------handle-all-ratings----------------------------------------*/

    handleAllRatings = (data) => {
        // console.log("rating  data.length 555555555555555", data)
        let rating = 0;
        data.map((value) => {
            rating += value.rating;
            return null;
        });
        // console.log("rating  data.length", rating, data.length, rating / data.length)
        this.setState({
            reviewLength: data.length,
            reviewAllRatings: data.length !== 0 ? rating / data.length : 0,
        });
    };

    render() {
        // console.log("this.state.uId is", this.state.uId)
        // const groupedAmenities = data.amenities && this.groupByN(4, data.amenities)
        return (
            <React.Fragment>
                <section className="bg-gray-100">
                    {/* <SwiperGallery data={data.swiper} /> */}
                    <Container className="py-5">
                        <Row>
                            <Col lg="8">
                                <div className="text-block pb-0 bg-white rounded border-1 px-4 mb-4 shadow">
                                    <img
                                        alt="go_back"
                                        title="go back"
                                        src={ArrowImage}
                                        style={{ height: 25, width: 23, cursor: "pointer", marginTop: ".5rem" }}
                                        onClick={() => window.history.back()}
                                    />
                                    <div className="py-3 border-0 text-center">
                                        <div className="d-inline-block">
                                            <img src={`${this.state.profile
                                                ? this.state.profile
                                                : defaultImage
                                                }`} className="d-block avatar avatar-xxl p-2 mb-2" />
                                        </div>
                                        <h5 className="font-weight-500">{this.state.doc_name}</h5><p className="text-gray-700  font-weight-light text-sm mb-0">{this.state.speciality.map((value) => {
                                            return `${value} , `;
                                        })} </p>
                                        <p className="text-gray-700  font-weight-light text-sm mb-0">{this.renderLocation()}</p>
                                    </div>
                                </div>
                                <div className="text-block bg-white rounded border-1 px-4 mb-4 shadow">
                                    <h5 className="mb-4 font-weight-500">About {this.state.doc_name}</h5>
                                    <p className="text-gray-700  font-weight-light text-sm">{this.state.about}</p>
                                </div>

                                {data.amenities &&
                                    <React.Fragment>
                                        <div className="text-block bg-white rounded border-1 px-4 mb-4 shadow">
                                            <h5 className=" font-weight-500">Board Certifications</h5>
                                            <Row>
                                                <Col md="6">
                                                    <div className="text-muted card-text">
                                                        <p className="text-gray-700  font-weight-light text-sm">
                                                            {this.state.board_certification}
                                                        </p>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>

                                        {this.state.speciality.length === 0 ? (
                                            ""
                                        ) : (
                                                <div className="text-block bg-white rounded border-1 px-4 mb-4 shadow">
                                                    <h5 className=" mb-4 font-weight-500">Specialties</h5>
                                                    <Row>
                                                        <Col md="6">
                                                            <ul className="text-muted card-text">
                                                                {this.state.speciality.map((val, key) =>
                                                                    <li
                                                                        key={key}
                                                                        className="mb-2">
                                                                        <span className="text-gray-700  font-weight-light text-sm">
                                                                            {val}
                                                                        </span>
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        }
                                        {this.state.practice.length === 0 ? (
                                            ""
                                        ) : (
                                                <div className="text-block bg-white rounded border-1 px-4 mb-4 shadow">
                                                    <h5 className=" mb-4 font-weight-500">Practice Locations</h5>
                                                    <Row>
                                                        <Col md="6">
                                                            <ul className="text-muted card-text">
                                                                {this.state.docLocation.map((val, key) =>
                                                                    <li
                                                                        key={key}
                                                                        className="mb-2">

                                                                        <span className="text-gray-700  font-weight-light text-sm">
                                                                            {`${val.practice_name}, ${val.city} ${val.practice_location}, ${val.zip}`}
                                                                        </span>
                                                                    </li>
                                                                )}

                                                            </ul>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        }
                                        {this.state.hospital_affiliations.length === 0 ? (
                                            ""
                                        ) : (
                                                <div className="text-block bg-white rounded border-1 px-4 mb-4 shadow">
                                                    <h5 className=" mb-4 font-weight-500">Hospital Affiliations</h5>
                                                    <Row>
                                                        <Col md="6">
                                                            <ul className="text-muted card-text">
                                                                {this.state.hospital_affiliations.map((val, key) =>
                                                                    <li
                                                                        key={key}
                                                                        className="mb-2">

                                                                        <span className="text-gray-700  font-weight-light text-sm">
                                                                            {val}
                                                                        </span>
                                                                    </li>
                                                                )}

                                                            </ul>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        }
                                        {this.state.education_training.length === 0 ? (
                                            ""
                                        ) : (
                                                <div className="text-block bg-white rounded border-1 px-4 mb-4 shadow">
                                                    <h5 className=" mb-4 font-weight-500">Education and Training</h5>
                                                    <Row>
                                                        <Col md="6">
                                                            <ul className="text-muted card-text">
                                                                {this.state.education_training.map((val, key) =>
                                                                    <li
                                                                        key={key}
                                                                        className="mb-2">

                                                                        <span className="text-gray-700  font-weight-light text-sm">
                                                                            {val}
                                                                        </span>
                                                                    </li>
                                                                )}

                                                            </ul>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        }

                                        {this.state.awards_publications.length === 0 ? (
                                            ""
                                        ) : (
                                                <div className="text-block bg-white rounded border-1 px-4 mb-4 shadow">
                                                    <h5 className=" mb-4 font-weight-500">Awards and Publications</h5>
                                                    <Row>
                                                        <Col md="6">
                                                            <ul className="text-muted card-text">
                                                                {this.state.awards_publications.map((val, key) =>
                                                                    <li
                                                                        key={key}
                                                                        className="mb-2">

                                                                        <span className="text-gray-700  font-weight-light text-sm">
                                                                            {val}
                                                                        </span>
                                                                    </li>
                                                                )}

                                                            </ul>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        }
                                        {this.state.language.length === 0 ? (
                                            ""
                                        ) : (
                                                <div className="text-block bg-white rounded border-1 px-4 mb-4 shadow">
                                                    <h5 className=" mb-4 font-weight-500">Languages Spoken</h5>
                                                    <Row>
                                                        <Col md="6">
                                                            <ul className="text-muted card-text">
                                                                {this.state.language.map((val, key) =>
                                                                    <li
                                                                        key={key}
                                                                        className="mb-2">

                                                                        <span className="text-gray-700  font-weight-light text-sm">
                                                                            {val}
                                                                        </span>
                                                                    </li>
                                                                )}

                                                            </ul>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        }
                                        <div className="text-block bg-white rounded border-1 px-4 mb-4 shadow">
                                            <h5 className=" font-weight-500">Provider's Gender</h5>
                                            <Row>
                                                <Col md="6">
                                                    <div className="text-muted card-text">
                                                        <p className="text-gray-700  font-weight-light text-sm">
                                                            {this.state.gender}
                                                        </p>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="text-block bg-white rounded border-1 px-4 mb-4 shadow">
                                            <h5 className=" font-weight-500">Offer Telemedicine</h5>
                                            <Row>
                                                <Col md="6">
                                                    <div className="text-muted card-text">
                                                        <p className="text-gray-700  font-weight-light text-sm">
                                                            {this.state.telemedicine == 1 ? "YES" : "NO"}
                                                        </p>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        {this.state.insurance_provider.length === 0 ? (
                                            ""
                                        ) : (
                                                <div className="text-block bg-white rounded border-1 px-4 mb-4 shadow">
                                                    <h5 className=" mb-4 font-weight-500">In-network insurances</h5>
                                                    <Row>
                                                        <Col md="6">
                                                            <ul className="text-muted card-text">
                                                                {this.state.insurance_provider.map((val, key) =>
                                                                    <li
                                                                        key={key}
                                                                        className="mb-2">

                                                                        <span className="text-gray-700  font-weight-light text-sm">
                                                                            {val.provider_name}
                                                                        </span>
                                                                    </li>
                                                                )}

                                                            </ul>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        }
                                        {this.state.medicaid_insurance_providers.length === 0 ? (
                                            ""
                                        ) : (
                                                <div className="text-block bg-white rounded border-1 px-4 mb-4 shadow">
                                                    <h5 className=" mb-4 font-weight-500">Supported Medicaid Insurances Providers</h5>
                                                    <Row>
                                                        <Col md="6">
                                                            <ul className="text-muted card-text">
                                                                {this.state.medicaid_insurance_providers.map((val, key) =>
                                                                    <li
                                                                        key={key}
                                                                        className="mb-2">

                                                                        <span className="text-gray-700  font-weight-light text-sm">
                                                                            {val.provider_name}
                                                                        </span>
                                                                    </li>
                                                                )}

                                                            </ul>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        }


                                    </React.Fragment>
                                }

                            </Col>
                            <Col lg="4">
                                <div
                                    style={{ top: "100px" }}
                                    className="ml-lg-4 rounded sticky-top"
                                >
                                    <div className="text-block pb-0 bg-white rounded border-1 p-4 mb-4 shadow">
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
                                            <h6 className="font-weight-500">{this.state.doc_name}{" "}</h6>
                                            <h6
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: "bold",
                                                    color: "#47b475",
                                                }}
                                                className="pull-right"
                                            >
                                                {this.state.hasInsurance_match
                                                    ? "Insurance matched"
                                                    : ""}
                                            </h6>
                                        </div>

                                        <span className="text-gray-700  font-weight-light text-sm">
                                            {this.state.speciality.map((value, index) => {
                                                return `${value} , `;
                                            })}
                                            <br />
                                            {this.renderLocation()}
                                            <br />
                                        </span>
                                        <br /><span className="text-gray-700  font-weight-light text-sm">Phone: {this.state.mobile}</span>
                                        <div className="flex-shrink-1 mb-2 card-stars text-xs  pt-1">

                                            <StarRatings
                                                id='star-rating'
                                                rating={this.state.reviewAllRatings}
                                                starRatedColor="#ec8a19"
                                                numberOfStars={5}
                                                name='rate1'
                                                starDimension="15px"
                                                starSpacing="0px"
                                            />
                                            <span>({this.state.reviewLength})</span>
                                        </div>
                                        <Link href={{ pathname: `/scheduleAppointment`, query: { id: this.state.uId } }} as={`/scheduleAppointment?${this.state.id}`}>
                                            <Button outline className="btn-btn-nw font-08r font-w500 outline-clr" onClick={() => this.createScheduleItem(this.state.id)} color="primary">Schedule Appointment</Button>
                                        </Link>
                                    </div>

                                    {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------                              */}
                                    {this.state.uId !== '' ? <>

                                        <ReviewBox
                                            docId={this.state.uId}
                                            isAuth={this.state.isAuth}
                                            handleAllRating={this.handleAllRatings}
                                            docProfile={
                                                this.state.profile
                                                    ? this.state.profile
                                                    : defaultImage
                                            }
                                            doctor_name={this.state.doc_name}
                                            totaStarRating={this.state.reviewAllRatings}
                                            totalCount={this.state.reviewLength}
                                        /> </> : 'No Data Found'
                                    }
                                    {/* -------------------------------------------------------------------------------------------------------------------------------------- */}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

            </React.Fragment>
        )

    }
}

const mapStateToProps = (state) => {
    return {
        docProfile: state.docDetails,
        spinner: state.spinner,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handlegetDocProfile: (data) =>
            dispatch({ type: DOC_PROFILE_REQUEST, data }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewProfile);
