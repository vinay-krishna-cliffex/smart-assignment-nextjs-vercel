import React, { Component } from 'react';
// import Footer from '../../component/Footer';
import { connect } from 'react-redux';
import { DOC_PROFILE_REQUEST, GET_DOC_REVIEW_REQUEST, GETUSER_DETAILS_REQUEST } from '../actions/Action';
// import StarRatingComponent from 'react-star-rating-component';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import { Baseurl } from '../utils/Baseurl';
import { toast } from 'react-toastify';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import { ShareReviewEmailTamplate } from '../components/ShareReviewEmailTamplate';
// import { ToastMsg } from '../components/ToastMsg';
import Modal from 'react-modal';
import ShowMoreText from 'react-show-more-text';
import PatientName from '../components/PatientName';
import ViewAllTableMobileView from '../components/ViewAllTableMobileView';
import defaultImage from '../images/images.jpeg';
import ArrowImage from '../images/arrow_left.png';
import downArrowImage from '../images/down-arrow.png';
import {
    Container,
    Row,
    Button,
    Col
} from 'reactstrap'


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

class ViewAllReview extends Component {   
      
    constructor(props) {
        super(props);
        this.state = {
            doc_name: '',
            practice: [],
            profile: '',
            speciality: [],
            reviewData: [],
            currentUserRating: 0,
            currentUserDec: '',
            // isPopup: false,
            isPopup: false,
            currentEditPatientId: '',

            emails: [],
            facebookChecked: false,
            emailChecked: false,
            share_facebookvalue: '',
            share_emailValue: '',
            user_name: '',
            toggle: false,
            userID: '',
            mobListColor: false,
            alertError: false,
            alertSuccess: false,
            messageAlert: '',
            messageAlertSuccess: '',
            id: ''
        }

        
    }


    componentDidMount() {
        // window.scrollTo(0, 0);
        // let id = localStorage.getItem('viewReviewAllId');
        let id =  window.location.search.substring(1);
        let userID = localStorage.getItem('uidp');   
        console.log('userID',userID);     
        if (!userID) {
            window.location.href="/login";
        }
        this.setState({ userID: userID, id: id });
        this.props.handlegetDocProfile(id);
        this.props.handlegetDocreview({ docId: id, handleAllRating: null });
        this.props.handleGetUserDetails(userID);
    }


    UNSAFE_componentWillReceiveProps(props) {
        // console.log("user-details----->", props.userDetails);

        if (props.docProfile) {
            this.setState({
                user_name: `${props.userDetails.first_name} ${props.userDetails.last_name}`,
                doc_name: `${props.docProfile.first_name} ${props.docProfile.last_name}`,
                practice: props.docProfile.practice && props.docProfile.practice.length > 0 ? [props.docProfile.practice[0]] : [],

                speciality: props.docProfile.speciality ? props.docProfile.speciality : [],
                profile: props.docProfile.profile_image,
                reviewData: props.docReviewData
            })
        }
    }

    handleSetInterval = () => {
        setTimeout(
            () => this.setState({ alertError: false, messageAlert: '' }),
            8000
        );
    }

    handleSetIntervalSuccess = () => {
        setTimeout(
            () => this.setState({ alertSuccess: false, messageAlertSuccess: '' }),
            8000
        );
    }

    handleCloseAlert = () => {
        this.setState({ alertError: false, messageAlert: '', alertSuccess: false, messageAlertSuccess: '' })
    }


    renderLocation = () => {
        let l = this.state.practice.filter((k, i) => i === 0 ? k : null);
        return l.map((value) => {
            return `${value.practice_name}, ${value.practice_location}, ${value.zip}`;
        })
    }

    /*-------------------------------handle visible edit box-----------------*/

    handlevisibleEditBtn = (value) => {
        this.setState({
            currentUserRating: value.rating,
            currentUserDec: value.dec,
            currentEditPatientId: value.patient_id,
            isPopup: true,
        });

        if (value.rating > 3) {
            this.setState({ facebookChecked: true, emailChecked: true, share_facebookvalue: 'facebook', share_emailValue: 'email' });
        }
        else {
            this.setState({ facebookChecked: false, emailChecked: false, share_facebookvalue: '', share_emailValue: '' });
        }

    };


    /*-----------------------------------------------render-current-user-review---------------------------------------*/

    renderCurrentUserReview = () => {
        // let userId = localStorage.getItem('uidp');
        let userId = this.state.userID;

        let filterUserReview = this.state.reviewData.filter(value => value.patient_id === userId);
        return filterUserReview.map((value, key) => {
            return <tr key={key}>
                <td style={{ width: "230px" }}>{new Date(value.createdAt).toLocaleString()}
                </td>
                <td style={{ width: "230px" }}>
                    <PatientName patientId={value.patient_id} />
                </td>
                <td>
                    <StarRatings
                        rating={value.rating}
                        starRatedColor="#ec8a19"
                        numberOfStars={5}
                        name='userRating3'
                        starDimension="20px"
                        starSpacing="1px"
                    />
                    {/* <button onClick={() => this.handlevisibleEditBtn(value)} style={{ minWidth: 65, height: 30, lineHeight: 0, borderRadius: 3 }} className="btn btn-md btn-filled" >Edit</button> */}
                    <Button onClick={() => this.handlevisibleEditBtn(value)} className="btn-btn-nw mx-auto mt-1 " color="primary">Edit</Button>
                </td>
                <td>
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
            </tr>
        })
    }




    handleToggle = () => {
        this.setState({ toggle: !this.state.toggle, mobListColor: !this.state.mobListColor })
    }




    /*-----------------------------------render-current-user-for-mobile---------------------------------*/

    renderCurrentUserReviewForMobile = () => {

        // let userId = localStorage.getItem('uidp');
        let userId = this.state.userID;

        let filterCurrentuser = this.state.reviewData.filter(value => value.patient_id === userId);
        return filterCurrentuser.map((value, key) => {
            let date = new Date(value.createdAt);
            let yy = date.getFullYear();
            let mm = String(date.getMonth() + 1).padStart(2, "0");
            let dd = date.getDate();
            let created_at = `${yy}/${mm}/${dd}`;

            return <li key={key}>
                <div onClick={this.handleToggle} className={`title mobile_userReivews_title_box ${this.state.mobListColor ? "mobListColor" : ""}`} style={{ paddingLeft: "10px", paddingTop: "10px" }}>
                    <PatientName patientId={value.patient_id} lable_for="review_mobile" />
                    <div className="text-right" style={{ padding: '.5rem', paddingTop: "0px", height: 'auto', width: '50%', fontWeight: '400', fontSize: '1rem', lineHeight: '1.6' }}>
                        {created_at}
                        <span style={{ paddingLeft: 5 }}>
                            <img alt="down-arrow" src={downArrowImage}
                                style={{
                                    height: 20, width: 20,
                                    WebkitTransform: this.state.toggle ? 'rotate(180deg)' : '',
                                    MozTransformStyle: this.state.toggle ? 'rotate(180deg)' : '',
                                    msTransform: this.state.toggle ? 'rotate(180deg)' : '',
                                    OTransform: this.state.toggle ? 'rotate(180deg)' : '',
                                    transform: this.state.toggle ? 'rotate(180deg)' : ''
                                }}
                            />
                        </span>
                    </div>
                </div>
                {this.state.toggle ?
                    <div className="content apintmobile_content_table">
                        <p></p>
                        <table style={{ width: '100%' }} className="text-gray-700 table table-striped table-hover sortable reviex-tbl appointments-table ">
                            <tbody>
                                <tr>
                                    <th>Created at</th>
                                    <td>{new Date(value.createdAt).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <th>Patient Name</th>
                                    <PatientName patientId={value.patient_id} lable_for="td" />
                                </tr>
                                <tr>
                                    <th>Ratings</th>
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
                                </tr>
                                <tr>
                                    <th>Review</th>
                                    <td>
                                        <ShowMoreText
                                            lines={1}
                                            more='Show more'
                                            less='Show less'
                                            anchorClass=''
                                            // onClick={this.executeOnClick}
                                            expanded={false}
                                        >
                                            {value.dec}
                                        </ShowMoreText>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Action</th>
                                    <td>
                                        {/* <button onClick={() => this.handlevisibleEditBtn(value)} style={{ minWidth: 65, height: 30, lineHeight: 0, borderRadius: 3 }} className="btn btn-md btn-filled" >Edit</button> */}
                                        <Button onClick={() => this.handlevisibleEditBtn(value)} className="btn-btn-nw mx-auto mt-1 " color="primary">Edit</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <hr></hr>
                    </div> : ''}
            </li>
        })
    }

    /*----------------------------------------------------render-review------------------------------------------------*/

    executeOnClick = (isExpanded) => {
        this.setState({ isExpanded: isExpanded })
    }

    renderAllReview = () => {
        // let userId = localStorage.getItem('uidp');
        let userId = this.state.userID;
        return this.state.reviewData.map((value, key) => {
            if (value.patient_id === userId) {
                return null;
            }
            else {
                return <tr key={key}>
                    <td style={{ width: "230px" }}>{new Date(value.createdAt).toLocaleString()}
                    </td>
                    <td style={{ width: "230px" }}>
                        <PatientName patientId={value.patient_id} /></td>
                    <td>
                        <StarRatings
                            rating={value.rating}
                            starRatedColor="#ec8a19"
                            numberOfStars={5}
                            name='rate4'
                            starDimension="20px"
                            starSpacing="1px"
                        />
                    </td>
                    <td>
                        <ShowMoreText
                            style={{ width: "20px" }}
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
                </tr>
            }
        })
    }

    /*-----------------set-current-user-ratings-----------------*/

    onStarClick = (nextValue, prevValue, name) => {
        this.setState({ currentUserRating: nextValue });
        if (nextValue > 3) {
            this.setState({ facebookChecked: true, emailChecked: true, share_facebookvalue: 'facebook', share_emailValue: 'email' });
        }
        else {
            this.setState({ facebookChecked: false, emailChecked: false, share_facebookvalue: '', share_emailValue: '' });
        }
    }


    /*------------------------------handle-save-current-user-review------------------------------------*/

    handleSaveCurrent_userReviews = () => {
        if (this.state.currentUserRating < 1) {
            // toast.error(<ToastMsg message="It is mandatory to provide ratings." />, { position: toast.POSITION.TOP_CENTER });
            this.setState({ alertError: true, messageAlert: 'It is mandatory to provide ratings.' })
            this.handleSetInterval();
        }
        else if (!this.state.currentUserDec) {
            // toast.error(<ToastMsg message="It is mandatory to provide review." />, { position: toast.POSITION.TOP_CENTER });
            this.setState({ alertError: true, messageAlert: 'It is mandatory to provide review.' })
            this.handleSetInterval();
        }
        else {
            var myURL = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsmartappointment.com&quote=Smart%20Appointment';
            var left = (window.innerWidth - 1050) / 2;
            var top = (window.innerHeight - 550) / 4;

            let data = {
                patient_id: this.state.currentEditPatientId,
                doc_id: this.state.id,
                dec: this.state.currentUserDec,
                rating: this.state.currentUserRating,
            }

            if (this.state.share_emailValue || this.state.share_facebookvalue) {

                if (this.state.share_emailValue && this.state.share_facebookvalue) {

                    if (this.state.emails.length === 0) {
                        // toast.error('Please Enter your emails !', { position: toast.POSITION.TOP_CENTER });
                        this.setState({ alertError: true, messageAlert: 'Please Enter your emails !' })
                        this.handleSetInterval();
                    }
                    else {
                        // window.open(myURL, 'Smart Appointment', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + 1050 + ', height=' + 550 + ', top=' + top + ', left=' + left);
                        axios({
                            method: 'post',
                            url: Baseurl + 'api/review/save_review',
                            headers: { 'content-type': 'application/json' },
                            data: data,
                        }).then((res => {
                            // console.log("review-response----->", res);
                            this.handleShareOnEmails();
                            this.props.handlegetDocreview({ docId: this.state.id, handleAllRating: null });

                            // toast.success('Your review has been saved !', { position: toast.POSITION.TOP_CENTER });
                            // toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER });
                            this.setState({ isPopup: false, alertSuccess: true, messageAlertSuccess: 'Your review has been saved.' });
                            this.handleSetIntervalSuccess();
                        })).catch((error) => {
                            console.log("review-error------>");
                        })
                    }

                }
                else if (this.state.share_facebookvalue) {
                    window.open(myURL, 'Smart Appointment', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + 1050 + ', height=' + 550 + ', top=' + top + ', left=' + left);
                    axios({
                        method: 'post',
                        url: Baseurl + 'api/review/save_review',
                        headers: { 'content-type': 'application/json' },
                        data: data,
                    }).then((res => {
                        // console.log("review-response----->", res);
                        this.props.handlegetDocreview({ docId: this.state.id, handleAllRating: null });
                        // toast.success('Your review has been saved !', { position: toast.POSITION.TOP_CENTER });
                        // toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER });
                        this.setState({ isPopup: false, alertSuccess: true, messageAlertSuccess: 'Your review has been saved !' });
                        this.handleSetIntervalSuccess();
                    })).catch((error) => {
                        console.log("review-error------>");
                    })
                }
                else {
                    if (this.state.emails.length === 0) {
                        // toast.error('Please Enter your emails !', { position: toast.POSITION.TOP_CENTER });
                        this.setState({ alertError: true, messageAlert: 'Please Enter your emails !' })
                        this.handleSetInterval();
                    }
                    else {
                        axios({
                            method: 'post',
                            url: Baseurl + 'api/review/save_review',
                            headers: { 'content-type': 'application/json' },
                            data: data,
                        }).then((res => {
                            // console.log("review-response----->", res);
                            this.handleShareOnEmails();
                            this.props.handlegetDocreview({ docId: this.state.id, handleAllRating: null });
                            this.setState({ isPopup: false, alertSuccess: true, messageAlertSuccess: 'Your review has been saved !' });
                            // toast.success('Your review has been saved !', { position: toast.POSITION.TOP_CENTER });
                            // toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER });
                            this.handleSetIntervalSuccess();
                        })).catch((error) => {
                            console.log("review-error------>");
                        })
                    }
                }

            }
            else {
                axios({
                    method: 'post',
                    url: Baseurl + 'api/review/save_review',
                    headers: { 'content-type': 'application/json' },
                    data: data,
                }).then((res => {
                    // console.log("review-response----->", res);
                    this.props.handlegetDocreview({ docId: this.state.id, handleAllRating: null });
                    this.setState({ isPopup: false, alertSuccess: true, messageAlertSuccess: 'Your review has been saved !' });
                    // toast.success('Your review has been saved !', { position: toast.POSITION.TOP_CENTER });
                    // toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER });
                    this.handleSetIntervalSuccess();
                })).catch((error) => {
                    console.log("review-error------>");
                })
            }
        }
    }


    /*----------------------handle-send-multi-email-------------------------*/

    handleShareOnEmails = () => {
        let docProfile = this.state.profile ? this.state.profile : defaultImage;

        let data = {
            emails: this.state.emails,
            subject: `${this.state.user_name} invites you to Smart Appointment`,
            message: ShareReviewEmailTamplate(this.state.user_name, docProfile, this.state.doc_name, this.state.currentUserDec)
        };

        axios({
            method: 'post',
            url: Baseurl + 'api/user/shareon_emails',
            headers: { 'content-type': 'application/json' },
            data
        }).then((res) => {
            // console.log("share on email response--------->", res);

        }).catch((error) => {
            console.log("share on email error--------->");
        })
    };


    /*-----------------------handle----Fb-and-Email-onchange-----------------------*/

    handleFBOnchange = (e) => {
        if (this.state.share_facebookvalue) {
            this.setState({ facebookChecked: false, share_facebookvalue: '' });
        }
        else {
            this.setState({ facebookChecked: true, share_facebookvalue: e.target.value });
        }

    }

    handleEmailOnchange = (e) => {
        if (this.state.share_emailValue) {
            this.setState({ emailChecked: false, share_emailValue: '' });
        }
        else {
            this.setState({ emailChecked: true, share_emailValue: e.target.value });
        }

    }

    closeModal = () => {
        this.setState({ isPopup: false });
    }


    render() {
        // let userId = localStorage.getItem('uidp');
        return (
            <React.Fragment>
                <Modal
                    isOpen={this.state.isPopup}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Modal"
                >
                    <div className="text-block pb-0 bg-white rounded border-1 p-4 mb-4 shadow">
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
                        <h6 className="font-weight-500">Add Review</h6>

                        <StarRatings
                            rating={this.state.currentUserRating}
                            starRatedColor="#ec8a19"
                            numberOfStars={5}
                            name='userRating5'
                            changeRating={this.onStarClick}
                            starDimension="20px"
                            starSpacing="1px"
                        />
                        <form className="form review-field" id="contact-form" method="get" action="#">
                            <div className="form-group">
                                <textarea value={this.state.currentUserDec} className="form-control" rows="4" name="review" id="review" placeholder="Description"
                                    required="required"
                                    onChange={(e) => this.setState({ currentUserDec: e.target.value })}>
                                </textarea>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="mr-3"><span className="text-gray-700  font-weight-light text-sm">Share on :</span></div>
                                <div className="text-muted custom-checkbox custom-control font-08r">

                                    <input name="facebook" id="facebook" type="checkbox" className="custom-control-input" checked={this.state.facebookChecked} onChange={(e) => this.handleFBOnchange(e)} />
                                    <label className="custom-control-label pt-1" for="facebook">Facebook</label>
                                </div>
                                <div className="custom-checkbox custom-control font-08r text-muted">

                                    <input type="checkbox" id="facilities_2" name="facilities_2" className="custom-control-input " checked={this.state.emailChecked} onChange={(e) => this.handleEmailOnchange(e)} />
                                    <label className="custom-control-label pt-1" for="facilities_2" >Email</label>
                                </div>
                            </div>

                            <ReactMultiEmail
                                className="mt-2"
                                placeholder={
                                    <>
                                        Enter emails...
                                        </>
                                }

                                emails={this.state.emails}
                                onChange={(_emails) => {
                                    this.setState({ emails: _emails });
                                }}

                                validateEmail={email => {
                                    return isEmail(email);
                                }}
                                getLabel={(
                                    email,
                                    index,
                                    removeEmail
                                ) => {
                                    return (
                                        <div data-tag key={index}>
                                            <p>{email}
                                                <span data-tag-handle onClick={() => removeEmail(index)}>
                                                    ×
                                                        </span>
                                            </p>

                                        </div>
                                    );
                                }}
                            />
                        </form>
                        <div className="text-right mt-4">
                            <button className="btn btn-primary" type="submit" onClick={this.handleSaveCurrent_userReviews}>save</button>
                        </div>
                    </div>
                </Modal>

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
                                    <div className="py-3 border-0 text-center">
                                        <div className="d-inline-block mt-4">
                                            <img src={`${this.state.profile
                                                ? this.state.profile
                                                : defaultImage
                                                }`} className="d-block avatar avatar-xxl p-2 mb-2" />
                                        </div>
                                        <h5 className="font-weight-500">{this.state.doc_name}</h5><p className="text-gray-700  font-weight-light text-sm mb-0">{this.state.speciality.map((value) => {
                                            return `${value} , `;
                                        })} </p>
                                        <p className="text-gray-700  font-weight-light text-sm mb-0 mb-5">{this.renderLocation()}</p>


                                        {/* --------------------for-web-------------- */}

                                    </div>
                                </div>

                                <table className="text-gray-700 table table-striped table-hover sortable reviex-tbl view_appointment">
                                    <thead>
                                        <tr>
                                            <th>Date of Review</th>
                                            <th>Patient Name</th>
                                            <th>Rating</th>
                                            <th>Review</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderCurrentUserReview()}
                                        {this.renderAllReview()}
                                    </tbody>
                                </table>

                                {/* --------------------for-mobile-------------- */}

                                <ul className="accordion accordion-1 view_user_reviews_mobile_view" style={{ listStyle: 'none', padding: "0" }}>
                                    <hr></hr>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', width: '100%', height: 'auto', padding: '10px' }}>
                                        <div className="text-left" style={{ height: 'auto', width: '50%', fontWeight: 'bold', color: '#495057' }}>Patient name</div>
                                        <div className="text-right" style={{ height: 'auto', width: '48%', fontWeight: 'bold', color: '#495057' }}>Created at</div>
                                    </div>
                                    <hr></hr>
                                    {this.renderCurrentUserReviewForMobile()}
                                    {
                                        this.state.reviewData.map((value, key) => {
                                            if (value.patient_id === this.state.userID) {
                                                return null;
                                            }
                                            else {
                                                return <ViewAllTableMobileView data={value} key={key} />
                                            }
                                        })
                                    }
                                </ul>
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
        docReviewData: state.docReviewData,
        userDetails: state.userDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handlegetDocProfile: data => dispatch({ type: DOC_PROFILE_REQUEST, data }),
        handlegetDocreview: data => dispatch({ type: GET_DOC_REVIEW_REQUEST, data }),
        handleGetUserDetails: data => dispatch({ type: GETUSER_DETAILS_REQUEST, data }),
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAllReview);
