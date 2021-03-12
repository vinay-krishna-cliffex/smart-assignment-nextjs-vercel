import React, { Component } from 'react';
import DoctorName from '../components/DoctorName';
import StarRatings from 'react-star-ratings';
import { GET_PATIENT_REVIEW_REQUEST, GETUSER_DETAILS_REQUEST } from '../actions/Action';
import { connect } from 'react-redux';
import EditUserReview from '../components/EditUserReview';
import ViewuserReviewMobileView from '../components/ViewuserReviewMobileView';
import ShowMoreText from 'react-show-more-text';
// import Link from 'next/link'

import {
    Container,
    Row,
    Button,

} from 'reactstrap'

// import Stars from '../components/Stars'

import data from '../data/compare.json'

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


class ViewUserReviews extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_reviewData: [],
            isLoading: false,
            user_name: '',
        }
       
    }


    componentDidMount() {
        window.scrollTo(0, 0);
        let id = localStorage.getItem('uidp');
        if (!id) {
            window.location.href="/login";
        }
        this.props.handlegetPatientreviews(id);
        this.props.handleGetUserDetails(id);
    }
    /*----------------------------------------------handle-componentWillReceiveProps-------------------------------*/

    UNSAFE_componentWillReceiveProps(props) {
        if (props.patientReviewData) {
            this.setState({
                user_reviewData: props.patientReviewData ? props.patientReviewData : [],
                user_name: `${props.userDetails.first_name} ${props.userDetails.last_name}`,
            })
        }
    }


    executeOnClick = (isExpanded) => {
        this.setState({ isExpanded: isExpanded })
    }

    renderReviewsTable = () => {

        return this.state.user_reviewData.map((value, key) => {
            // console.log("value is", value)
            let date = new Date(value.createdAt);
            let dd = String(date.getDate()).padStart(2, '0');
            let mm = String(date.getMonth() + 1).padStart(2, '0');
            let yy = date.getFullYear();

            let fullDate = String(mm) + "/" + String(dd) + "/" + String(yy);

            return <tr key={key}>
                <td >{fullDate}</td>
                <td>
                    <DoctorName docId={value.doc_id} lable_for="user_review" /></td>
                <td>
                    <StarRatings
                        rating={value.rating}
                        starRatedColor="#ec8a19"
                        numberOfStars={5}
                        name='userRating1'
                        starDimension="20px"
                        starSpacing="1px"
                    />
                </td>
                <td style={{ width: 300 }}>
                    <ShowMoreText
                        lines={1}
                        more='Show more'
                        less='Show less'
                        anchorClass=''
                        onClick={this.executeOnClick}
                        expanded={false}
                    >
                        {value.dec}
                    </ShowMoreText>
                </td>
                <td>
                    <EditUserReview handleEditButton={value} userName={this.state.user_name} />
                </td>
            </tr>
        })
    }


    render() {

        // useEffect(() => {
        //     const script = document.createElement('script');

        //     script.src = "https://www.kryogenix.org/code/browser/sorttable/sorttable.js";
        //     script.async = true;

        //     document.body.appendChild(script);

        //     return () => {
        //       document.body.removeChild(script);
        //     }
        //   }, []);

        return (
            <React.Fragment>
                <section className="hero py-5 py-lg-5">
                    <Container className="position-relative">
                        <h1 className="hero-heading" style={{ marginBottom: 'auto' }}>{data.title}</h1>
                    </Container>
                </section>

                <section className="py-4 review-table">
                    <Container>
                        <Row>
                            <div className="table-responsive-lg w-100">


                                <table className="text-gray-700 table table-striped table-hover sortable reviex-tbl view_appointment text-sm">
                                    <thead>
                                        <tr>
                                            <th>Date of Review</th>
                                            <th>Doctor Name</th>
                                            <th>Rating</th>
                                            <th>Review</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {this.props.isLoading ?
                                        <tbody>
                                            <tr className="text-center">
                                                <td colSpan="5">
                                                    <div className="spinner-border" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody> : this.state.user_reviewData.length === 0 ?
                                            <tbody >
                                                <tr>
                                                    <td colSpan="5">
                                                        <div style={{ paddingTop: '1em' }}>
                                                            <h5 className="text-center" style={{ color: 'rgb(0, 35, 75)', fontWeight: 'bold' }}>No data Found..</h5>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody> :
                                            <tbody>
                                                {
                                                    this.renderReviewsTable()
                                                }
                                            </tbody>
                                    }

                                </table>
                                <div className="accordion accordion-1 view_user_reviews_mobile_view" style={{ listStyle: 'none' }}>
                                    {/* <hr></hr> */}
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', width: '100%', height: 'auto', padding: '10px' }}>
                                        <div className="text-left" style={{ height: 'auto', width: '50%', fontWeight: 'bold', color: '#495057' }}>Doctor name</div>
                                        <div className="text-right" style={{ height: 'auto', width: '48%', fontWeight: 'bold', color: '#495057' }}>Created at</div>
                                    </div>
                                    {/* <hr></hr> */}
                                    {this.props.isLoading ?
                                        // <tbody >
                                        // <tr>
                                        // <td colSpan="2" style={{ textAlign: "center" }}>
                                        <div className="col-12 text-center">
                                            No data Found..
                                                    </div>
                                        // </td> 
                                        // </tr>
                                        // </tbody> 
                                        :
                                        this.state.user_reviewData.map((value, key) => {
                                            return <ViewuserReviewMobileView data={value} key={key} user_name={this.state.user_name} />
                                        })
                                    }
                                </div>
                            </div>
                        </Row>
                        <Row className="text-center mt-5">
                            <Button href="/" className="btn-btn-nw mx-auto" color="primary">Search Providers</Button>
                        </Row>
                    </Container>
                </section>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        patientReviewData: state.patientReviewData,
        userDetails: state.userDetails,
        isLoading: state.isLoading,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handlegetPatientreviews: data => dispatch({ type: GET_PATIENT_REVIEW_REQUEST, data }),
        handleGetUserDetails: data => dispatch({ type: GETUSER_DETAILS_REQUEST, data })
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(ViewUserReviews);