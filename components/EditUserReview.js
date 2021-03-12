import React, { Component } from 'react'
// import StarRatingComponent from 'react-star-rating-component';
import StarRatings from 'react-star-ratings';
import PatientName from './PatientName';
import { connect } from 'react-redux';
import { GET_PATIENT_REVIEW_REQUEST } from '../actions/Action';
// import { toast } from 'react-toastify';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import { Baseurl } from '../utils/Baseurl';
import { ShareReviewEmailTamplate } from '../components/ShareReviewEmailTamplate';
// import { ToastMsg } from './ToastMsg';
import Modal from 'react-modal';
import axios from 'axios';
import { Collapse } from 'reactstrap';
import editIcon from '../images/edit_icon.png';


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



class EditUserReview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            userRating: 0,
            userDec: '',
            patientId: '',
            docId: '',

            emails: [],
            facebookChecked: false,
            emailChecked: false,
            share_facebookvalue: '',
            share_emailValue: '',
            isPopup: false,
            doc_name: '',
            profile: '',
            reviewCollapse: false,
            alertError: false,
            alertSuccess: false,
            messageAlert: '',
            messageAlertSuccess: ''
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


    handleOpenEditBox = () => {
        this.setState({
            userRating: this.props.handleEditButton.rating,
            userDec: this.props.handleEditButton.dec,
            patientId: this.props.handleEditButton.patient_id,
            docId: this.props.handleEditButton.doc_id,
            open: !this.state.open,
        }, () => {
            this.handleGetDocDetails(this.props.handleEditButton.doc_id)
        });

        if (this.props.handleEditButton.rating > 3) {
            this.setState({ facebookChecked: true, emailChecked: true, share_facebookvalue: 'facebook', share_emailValue: 'email' });
        }
        else {
            this.setState({ facebookChecked: false, emailChecked: false, share_facebookvalue: '', share_emailValue: '' });
        }
    }



    /*-------------------------handleGetDocDetails--------------------------------*/

    handleGetDocDetails = (docId) => {
        axios({
            method: 'get',
            url: Baseurl + `api/doc/getDetails?userId=${docId}`,
            headers: { 'content-type': 'application/json' }
        }).then((res) => {
            // console.log("doc Details---->",res);
            this.setState({ doc_name: `${res.data.user.first_name} ${res.data.user.last_name}`, profile: res.data.user.profile_image })
        }).catch((err) => {
            console.log("doc error---->", err);
        })
    }


    /*-----------------set-current-user-ratings-----------------*/

    onStarClick = (nextValue, prevValue, name) => {
        this.setState({ userRating: nextValue });

        if (nextValue > 3) {
            this.setState({ facebookChecked: true, emailChecked: true, share_facebookvalue: 'facebook', share_emailValue: 'email' });
        }
        else {
            this.setState({ facebookChecked: false, emailChecked: false, share_facebookvalue: '', share_emailValue: '' });
        }

    }


    handleBackdrop = () => {
        this.setState({ open: false });
    };


    /*------------------------------------update-user-review----------------------*/

    handleUpdate_userReviews = () => {

        if (this.state.userRating < 1) {
            // toast.error(<ToastMsg message="It is mandatory to provide ratings." />, { position: toast.POSITION.TOP_CENTER });
            this.setState({ alertError: true, messageAlert: 'It is mandatory to provide ratings.' })
            this.handleSetInterval();
        }
        else if (!this.state.userDec) {
            // toast.error(<ToastMsg message="It is mandatory to provide review." />, { position: toast.POSITION.TOP_CENTER });
            this.setState({ alertError: true, messageAlert: 'It is mandatory to provide review.' })
            this.handleSetInterval();
        }
        else {
            var myURL = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsmartappointment.com&quote=Smart%20Appointment';
            var left = (window.innerWidth - 1050) / 2;
            var top = (window.innerHeight - 550) / 4;

            let patientId = localStorage.getItem('uidp');
            let data = {
                patient_id: patientId,
                doc_id: this.state.docId,
                dec: this.state.userDec,
                rating: this.state.userRating,
            }


            if (this.state.share_emailValue || this.state.share_facebookvalue) {

                if (this.state.share_emailValue && this.state.share_facebookvalue) {

                    if (this.state.emails.length === 0) {
                        this.setState({ alertError: true, messageAlert: 'Please Enter your emails !' })
                        this.handleSetInterval();
                    }
                    else {
                        window.open(myURL, 'Smart Appointment', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + 1050 + ', height=' + 550 + ', top=' + top + ', left=' + left);
                        axios({
                            method: 'post',
                            url: Baseurl + 'api/review/save_review',
                            headers: { 'content-type': 'application/json' },
                            data: data,
                        }).then((res => {
                            console.log("update-user-review----->", res);
                            this.handleShareOnEmails();
                            this.props.handlegetDocreview(patientId);
                            this.setState({ open: false, alertSuccess: true, messageAlertSuccess: 'Your review has been saved.' });
                            this.handleSetIntervalSuccess();
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
                        console.log("update-user-review----->", res);
                        this.props.handlegetDocreview(patientId);
                        // this.setState({ open: false });
                        // toast.success('Your review has been saved !', { position: toast.POSITION.TOP_CENTER });
                        // toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER });
                        this.setState({ open: false, alertSuccess: true, messageAlertSuccess: 'Your review has been saved !' });
                        // toast.success('Your review has been saved !', { position: toast.POSITION.TOP_CENTER });
                        // toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER });
                        this.handleSetIntervalSuccess();
                    })).catch((error) => {
                        console.log("review-error------>", error);
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
                            console.log("update-user-review----->", res);
                            this.handleShareOnEmails();
                            this.setState({ open: false, alertSuccess: true, messageAlertSuccess: 'Your review has been saved !' });
                            this.props.handlegetDocreview(patientId);
                            // this.setState({ open: false });
                            // toast.success('Your review has been saved !', { position: toast.POSITION.TOP_CENTER });
                            // toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER })
                            this.handleSetIntervalSuccess();
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
                    console.log("update-user-review----->", res);
                    // this.setState({ open: false });
                    this.setState({ open: false, alertSuccess: true, messageAlertSuccess: 'Your review has been saved !' });
                    this.props.handlegetDocreview(patientId);
                    // toast.success('Your review has been saved !', { position: toast.POSITION.TOP_CENTER });
                    // toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER });
                    this.handleSetIntervalSuccess();
                })).catch((error) => {
                    console.log("review-error------>", error);
                })
            }
        }
    }


    /*----------------------handle-send-multi-email-------------------------*/

    handleShareOnEmails = () => {
        let docProfile = this.state.profile ? this.state.profile : "../../assets/img/default-placeholder-doctor-half-length-portrait-vector-20847585.jpg";
        let data = {
            emails: this.state.emails,
            subject: `${this.props.userName} invites you to Smart Appointment`,
            message: ShareReviewEmailTamplate(this.props.userName, docProfile, this.state.doc_name, this.state.userDec)
        }

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
    }


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



    openPopup = () => {
        this.setState({
            userRating: this.props.handleEditButton.rating,
            userDec: this.props.handleEditButton.dec,
            patientId: this.props.handleEditButton.patient_id,
            docId: this.props.handleEditButton.doc_id,
            isPopup: true,
        });

        if (this.props.handleEditButton.rating > 3) {
            this.setState({ facebookChecked: true, emailChecked: true, share_facebookvalue: 'facebook', share_emailValue: 'email' });
        }
        else {
            this.setState({ facebookChecked: false, emailChecked: false, share_facebookvalue: '', share_emailValue: '' });
        }
    }


    closeModal = () => {
        this.setState({ isPopup: false });
    }


    render() {
        return (
            <React.Fragment>
                {/* ------------------------end of modal----------------------- */}
                <Modal
                    isOpen={this.state.isPopup}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Modal"
                >
                    {/* <div className="feature mb-xs-24 mb32 bordered bg-secondary">
                        <div>
                            <PatientName patientId={this.state.patientId} />
                            <StarRatingComponent
                                name="userRating2"
                                starCount={5}
                                value={this.state.userRating}
                                onStarClick={this.onStarClick}
                                starColor={'#ec8a19'}
                                emptyStarColor={'lightgray'}
                            />
                        </div>
                        <div style={{ paddingTop: 15 }}>
                            <textarea value={this.state.userDec} placeholder="Description" maxLength={1500}
                                onChange={(e) => this.setState({ userDec: e.target.value })}>

                            </textarea>
                        </div>


                        <div className="user_review_box_share_on_container">
                            <div id="user_checkbox_container">
                                <div><b>Share on:</b></div>
                                <div><span><b>Facebook</b> <input type="checkbox" value="facebook" name="facebook" checked={this.state.facebookChecked} onChange={(e) => this.handleFBOnchange(e)} /></span></div>
                                <div><span><b>Emails</b> <input type="checkbox" value="email" name="facebook" checked={this.state.emailChecked} onChange={(e) => this.handleEmailOnchange(e)} /></span></div>
                            </div>
                            <div id="user_share_onemail_container">

                                <ReactMultiEmail
                                    placeholder={
                                        <>
                                            Enter emails...
                                        </>
                                    }
                                    style={{ minHeight: '40px', background: '#f5f5f5', padding: 0, maxWidth: '100%', borderRadius: 3, display: this.state.share_emailValue ? 'block' : 'none' }}
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


                        <div className="text-right">
                            <button className="btn btn-lg btn-filled"
                                onClick={this.handleUpdate_userReviews}
                                style={{ height: 30, lineHeight: 0, minWidth: 0 }}>SAVE</button>
                        </div>

                    </div> */}
                    {/* ------------------------------------------------------------------------------------------------------------------------------------------------- */}
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
                            rating={this.state.userRating}
                            starRatedColor="#ec8a19"
                            numberOfStars={5}
                            name='userRating2'
                            changeRating={this.onStarClick}
                            starDimension="20px"
                            starSpacing="1px"
                        />
                        <form className="form review-field mt-3" id="contact-form" method="get" action="#">
                            <div className="form-group">
                                <textarea value={this.state.userDec} className="form-control" rows="4" name="review" id="review" placeholder="Description"
                                    required="required"
                                    onChange={(e) => this.setState({ userDec: e.target.value })}>
                                </textarea>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="mr-3"><span className="text-gray-700  font-weight-light text-sm">Share on :</span></div>
                                <div className="text-muted custom-checkbox custom-control font-08r mr-2">

                                    <input name="facebook" id="facebook" type="checkbox" className="custom-control-input" checked={this.state.facebookChecked} onChange={(e) => this.handleFBOnchange(e)} />
                                    <label className="custom-control-label pt-1" htmlFor="facebook">Facebook</label>
                                </div>
                                <div className="custom-checkbox custom-control font-08r text-muted">

                                    <input type="checkbox" id="facilities_2" name="facilities_2" className="custom-control-input " checked={this.state.emailChecked} onChange={(e) => this.handleEmailOnchange(e)} />
                                    <label className="custom-control-label pt-1" htmlFor="facilities_2" >Email</label>
                                </div>
                            </div>
                            <Collapse
                                className="mt-4"
                                isOpen={this.state.emailChecked}
                            >
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
                            </Collapse>
                        </form>

                        <div className="text-right mt-4">
                            <button className="btn btn-primary" type="submit" onClick={this.handleUpdate_userReviews}>save</button>
                        </div>
                    </div>
                </Modal>

                {/* ------------------------end of modal----------------------- */}

                <div className="edit-review-btn" style={{ background: '', paddingLeft: 5, position: 'relative' }}>
                    {/* <img className="web_user_edit_icon" onClick={this.handleOpenEditBox} alt="edit" title="Edit Review" src={editIcon} style={{ height: 25, width: 25, cursor: 'pointer' }} /> */}
                    <img className="mobile_user_edit_icon" onClick={this.openPopup} alt="edit" title="Edit Review" src={editIcon} style={{ height: 25, width: 25, cursor: 'pointer' }} />
                    {
                        this.state.open &&

                        <div className="feature mb-xs-24 mb32 bordered bg-secondary edit_box">
                            {/* <div>
                                <PatientName patientId={this.state.patientId} />
                                <StarRatingComponent
                                    name="userRating2"
                                    starCount={5}
                                    value={this.state.userRating}
                                    onStarClick={this.onStarClick}
                                    starColor={'#ec8a19'}
                                    emptyStarColor={'lightgray'}
                                />
                        
                            </div> */}
                            {/* <div style={{ paddingTop: 15 }}>
                                <textarea value={this.state.userDec} placeholder="Description" maxLength={1500}
                                    onChange={(e) => this.setState({ userDec: e.target.value })}>

                                </textarea>
                            </div> */}

                            {/* -------------------------------start share container----------------------------*/}
                            {/* <div className="user_review_box_share_on_container">
                                <div id="user_checkbox_container">
                                    <div><b>Share on:</b></div>
                                    <div><span><b>Facebook</b> <input type="checkbox" value="facebook" name="facebook" checked={this.state.facebookChecked} onChange={(e) => this.handleFBOnchange(e)} /></span></div>
                                    <div><span><b>Emails</b> <input type="checkbox" value="email" name="facebook" checked={this.state.emailChecked} onChange={(e) => this.handleEmailOnchange(e)} /></span></div>
                                </div>
                                <div id="user_share_onemail_container">

                                    <ReactMultiEmail
                                        placeholder={
                                            <>
                                                Enter emails...
                                        </>
                                        }
                                        style={{ minHeight: '40px', background: '#f5f5f5', padding: 0, maxWidth: '100%', borderRadius: 3, display: this.state.share_emailValue ? 'block' : 'none' }}
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
                            </div> */}
                            {/* -------------------------------end-share container----------------------------*/}

                            {/* <div className="text-right">
                                <button className="btn btn-lg btn-filled"
                                    onClick={this.handleUpdate_userReviews}
                                    style={{ height: 30, lineHeight: 0, minWidth: 0 }}>SAVE</button>
                            </div> */}
                        </div>

                    }
                </div>
                <div onClick={this.handleBackdrop} style={{ height: '100%', width: '100%', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '', opacity: 1, zIndex: 50, display: this.state.open ? 'block' : 'none' }}></div>
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        //state:state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handlegetDocreview: data => dispatch({ type: GET_PATIENT_REVIEW_REQUEST, data }),
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(EditUserReview);