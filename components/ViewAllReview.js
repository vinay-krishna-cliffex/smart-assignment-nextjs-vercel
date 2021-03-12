import React, { Component } from 'react';
// import Footer from '../../component/Footer';
import { connect } from 'react-redux';
import { DOC_PROFILE_REQUEST, GET_DOC_REVIEW_REQUEST, GETUSER_DETAILS_REQUEST } from '../../actions/Action';
import StarRatingComponent from 'react-star-rating-component';
import axios from 'axios';
import { Baseurl } from '../../utils/Baseurl';
import { toast } from 'react-toastify';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import { ShareReviewEmailTamplate } from '../../component/ShareReviewEmailTamplate';
import { ToastMsg } from '../../component/ToastMsg';
import Modal from 'react-modal';
import ShowMoreText from 'react-show-more-text';
import PatientName from '../../component/PatientName';
import ViewAllTableMobileView from '../../component/ViewAllTableMobileView';
import "react-multi-email/style.css";
import '../../styles/ViewAll.css';
import defaultImage from '../../assets/img/default-placeholder-doctor-half-length-portrait-vector-20847585.jpg';
import leftArrow from '../images/left-arrow.png';
import downArrowImage from '../images/down-arrow.png';


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

Modal.setAppElement('#root')
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
            toggle: false
        }
    }




    componentDidMount() {
        // window.scrollTo(0, 0);
        let id = this.props.match.params.id;
        let userID = localStorage.getItem('uidp');
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
        let userId = localStorage.getItem('uidp');

        let filterUserReview = this.state.reviewData.filter(value => value.patient_id === userId);
        return filterUserReview.map((value, key) => {
            return <div className="doc_review_inner_container" key={key}>
                <div id="doc_name_date_rating_box">
                    <div id="current_user_date"><b>{new Date(value.createdAt).toLocaleString()}</b></div>
                    <div id="current_user_name"><PatientName patientId={value.patient_id} /></div>
                    <div id="current_user_rating">
                        <StarRatingComponent
                            name="userRating3"
                            starCount={5}
                            value={value.rating}
                            starColor={'#ec8a19'}
                            emptyStarColor={'lightgray'}
                        />
                    </div>
                </div>
                <div id="current_user_dec">
                    <div style={{ height: 'auto', width: '50%', background: '' }}><b>{value.dec}</b></div>
                    <div id="current_edit_review">
                        <button onClick={() => this.handlevisibleEditBtn(value)} style={{ minWidth: 65, height: 30, lineHeight: 0, borderRadius: 3 }} className="btn btn-md btn-filled" >Edit</button>
                    </div>
                </div>
            </div>
        })
    }




    handleToggle = () => {
        this.setState({ toggle: !this.state.toggle })
    }




    /*-----------------------------------render-current-user-for-mobile---------------------------------*/

    renderCurrentUserReviewForMobile = () => {

        let userId = localStorage.getItem('uidp');

        let filterCurrentuser = this.state.reviewData.filter(value => value.patient_id === userId);
        return filterCurrentuser.map((value, key) => {
            let date = new Date(value.createdAt);
            let yy = date.getFullYear();
            let mm = String(date.getMonth() + 1).padStart(2, "0");
            let dd = date.getDate();
            let created_at = `${yy}/${mm}/${dd}`;

            return <li className={this.state.toggle ? "active" : ""} key={key}>
                <div onClick={this.handleToggle} className="title mobile_veiw_all_title_box">
                    <PatientName patientId={value.patient_id} lable_for="review_mobile" />
                    <div className="text-right" style={{ height: 'auto', width: '50%', fontWeight: 'bold' }}>
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

                <div className="content view_all_mobile_content">
                    <table style={{ width: '100%' }}>
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
                                <th>Rating</th>
                                <td>
                                    <StarRatingComponent
                                        name="userRating1"
                                        starCount={5}
                                        value={value.rating}
                                        starColor={'#ec8a19'}
                                        emptyStarColor={'lightgray'}

                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>Date of Review</th>
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
                                    <button onClick={() => this.handlevisibleEditBtn(value)} style={{ minWidth: 65, height: 30, lineHeight: 0, borderRadius: 3 }} className="btn btn-md btn-filled" >Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </li>
        })
    }

    /*----------------------------------------------------render-review------------------------------------------------*/

    renderAllReview = () => {
        let userId = localStorage.getItem('uidp');
        return this.state.reviewData.map((value, key) => {
            if (value.patient_id === userId) {
                return null;
            }
            else {
                return <div className="doc_review_inner_container" key={key}>
                    <div id="doc_name_date_rating_box">
                        <div id="doc_date"><b>{new Date(value.createdAt).toLocaleString()}</b></div>
                        <div id="doc_patient_name"><PatientName patientId={value.patient_id} /></div>
                        <div id="doc_rating">
                            <StarRatingComponent
                                name="rate4"
                                starCount={5}
                                value={value.rating}
                                starColor={'#ec8a19'}
                                emptyStarColor={'lightgray'}
                            />
                        </div>
                    </div>
                    <div id="doc_dec"><b>{value.dec}</b></div>
                </div>
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
            toast.error(<ToastMsg message="It is mandatory to provide ratings." />, { position: toast.POSITION.TOP_CENTER });
        }
        else if (!this.state.currentUserDec) {
            toast.error(<ToastMsg message="It is mandatory to provide review." />, { position: toast.POSITION.TOP_CENTER });
        }
        else {
            var myURL = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsmartappointment.com&quote=Smart%20Appointment';
            var left = (window.innerWidth - 1050) / 2;
            var top = (window.innerHeight - 550) / 4;

            let data = {
                patient_id: this.state.currentEditPatientId,
                doc_id: this.props.match.params.id,
                dec: this.state.currentUserDec,
                rating: this.state.currentUserRating,
            }

            if (this.state.share_emailValue || this.state.share_facebookvalue) {

                if (this.state.share_emailValue && this.state.share_facebookvalue) {

                    if (this.state.emails.length === 0) {
                        toast.error('Please Enter your emails !', { position: toast.POSITION.TOP_CENTER });
                    }
                    else {
                        window.open(myURL, 'Smart Appointment', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + 1050 + ', height=' + 550 + ', top=' + top + ', left=' + left);
                        axios({
                            method: 'post',
                            url: Baseurl + 'api/review/save_review',
                            headers: { 'content-type': 'application/json' },
                            data: data,
                        }).then((res => {
                            console.log("review-response----->", res);
                            this.handleShareOnEmails();
                            this.props.handlegetDocreview({ docId: this.props.match.params.id, handleAllRating: null });
                            this.setState({ isPopup: false });
                            // toast.success('Your review has been saved !', { position: toast.POSITION.TOP_CENTER });
                            toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER });
                        })).catch((error) => {
                            console.log("review-error------>", error);
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
                        console.log("review-response----->", res);
                        this.props.handlegetDocreview({ docId: this.props.match.params.id, handleAllRating: null });
                        this.setState({ isPopup: false });
                        // toast.success('Your review has been saved !', { position: toast.POSITION.TOP_CENTER });
                        toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER });
                    })).catch((error) => {
                        console.log("review-error------>", error);
                    })
                }
                else {
                    if (this.state.emails.length === 0) {
                        toast.error('Please Enter your emails !', { position: toast.POSITION.TOP_CENTER });
                    }
                    else {
                        axios({
                            method: 'post',
                            url: Baseurl + 'api/review/save_review',
                            headers: { 'content-type': 'application/json' },
                            data: data,
                        }).then((res => {
                            console.log("review-response----->", res);
                            this.handleShareOnEmails();
                            this.props.handlegetDocreview({ docId: this.props.match.params.id, handleAllRating: null });
                            this.setState({ isPopup: false });
                            // toast.success('Your review has been saved !', { position: toast.POSITION.TOP_CENTER });
                            toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER });
                        })).catch((error) => {
                            console.log("review-error------>", error);
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
                    console.log("review-response----->", res);
                    this.props.handlegetDocreview({ docId: this.props.match.params.id, handleAllRating: null });
                    this.setState({ isPopup: false });
                    // toast.success('Your review has been saved !', { position: toast.POSITION.TOP_CENTER });
                    toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER });
                })).catch((error) => {
                    console.log("review-error------>", error);
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
            console.log("share on email response--------->", error);
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
        let userId = localStorage.getItem('uidp');
        return (
            <React.Fragment>
                <Modal
                    isOpen={this.state.isPopup}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Modal"
                >

                    <div className="feature mb-xs-24 mb32 bordered bg-secondary view_all_reviewBox">
                        <div>
                            <PatientName patientId={this.state.currentEditPatientId} />
                            <StarRatingComponent
                                name="userRating5"
                                starCount={5}
                                value={this.state.currentUserRating}
                                onStarClick={this.onStarClick}
                                starColor={'#ec8a19'}
                                emptyStarColor={'lightgray'}
                            />
                        </div>
                        <div style={{ paddingTop: 15 }}>
                            <textarea value={this.state.currentUserDec} placeholder="Description" maxLength={1500} onChange={(e) => this.setState({ currentUserDec: e.target.value })}>

                            </textarea>
                        </div>


                        {/* -------------------------------start share container----------------------------*/}
                        <div className="view_all_review_box_share_on_container">
                            <div id="view_all_checkbox_container">
                                <div><b>Share on:</b></div>
                                <div><span><b>Facebook</b> <input type="checkbox" value="facebook" name="facebook" checked={this.state.facebookChecked} onChange={(e) => this.handleFBOnchange(e)} /></span></div>
                                <div><span><b>Emails</b> <input type="checkbox" value="email" name="facebook" checked={this.state.emailChecked} onChange={(e) => this.handleEmailOnchange(e)} /></span></div>
                            </div>
                            <div id="view_all_share_onemail_container">

                                <ReactMultiEmail
                                   className="mt-2"
                                    placeholder={
                                        <>
                                            Enter emails...
                                        </>
                                    }
                                    // style={{ minHeight: '40px', background: '#f5f5f5', padding: 0, borderRadius: 0, maxWidth: '100%', display: this.state.share_emailValue ? 'block' : 'none' }}
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
                            </div>
                        </div>
                        {/* -------------------------------end-share container----------------------------*/}


                        <div className="text-right">
                            <button className="btn btn-lg btn-filled"
                                onClick={this.handleSaveCurrent_userReviews}
                                style={{ height: 30, lineHeight: 0, minWidth: 0 }}>SAVE</button>
                        </div>
                    </div>

                </Modal>


                <div className="main-container">
                    <section>
                        <div className="container" style={{ position: 'relative' }}>

                            <div className="row">
                                <div className="col-md-12 col-sm-10">

                                    <div className="feature mb-xs-24 bordered" style={{ position: 'relative' }}>

                                        <img alt="go_back" title="go back" src={leftArrow} style={{ height: 25, width: 23, cursor: 'pointer' }} onClick={() => this.props.history.goBack()} />
                                        <div className="text-center" style={{
                                            height: 150,
                                            width: 150,
                                            backgroundImage: `url('${this.state.profile ? this.state.profile : defaultImage}')`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            borderRadius: '50%',
                                            margin: '0 auto'
                                        }}>
                                            {/* <img className="" alt="profile_img" src={this.state.profile ? this.state.profile : 'https://cdn1.vectorstock.com/i/thumb-large/75/85/default-placeholder-doctor-half-length-portrait-vector-20847585.jpg'} width="120" /> */}
                                        </div>

                                        <div className="text-center">
                                            <div className="">
                                                <h3 className="bold mb0 mt16">{this.state.doc_name}</h3>
                                                <h5 className="bold mb0">
                                                    {
                                                        this.state.speciality.map((value, index) => {
                                                            return `${value} , `;
                                                        })
                                                    }
                                                </h5>
                                                <h6 className="bold mb16 uppercase">{this.renderLocation()}</h6>
                                            </div>
                                        </div>
                                        <div style={{ height: 50 }}></div>
                                        {/* --------------------for-web-------------- */}


                                        <div className="review_all_container">
                                            {this.renderCurrentUserReview()}
                                            {this.renderAllReview()}
                                        </div>

                                        {/* --------------------for-mobile-------------- */}

                                        <ul className="accordion accordion-1 view_all_review_mobile_view">
                                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', width: '100%', height: 'auto', padding: 10 }}>
                                                <div className="text-left" style={{ height: 'auto', width: '50%', fontWeight: 'bold' }}>Patient name</div>
                                                <div className="text-right" style={{ height: 'auto', width: '48%', fontWeight: 'bold' }}>Created at</div>
                                            </div>
                                            {this.renderCurrentUserReviewForMobile()}
                                            {
                                                this.state.reviewData.map((value, key) => {
                                                    if (value.patient_id === userId) {
                                                        return null;
                                                    }
                                                    else {
                                                        return <ViewAllTableMobileView data={value} key={key} />
                                                    }
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* <Footer /> */}
                </div>
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
