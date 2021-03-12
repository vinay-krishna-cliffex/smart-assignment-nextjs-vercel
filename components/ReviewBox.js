import React from 'react'
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import { Baseurl } from '../utils/Baseurl';
import PatientName from './PatientName';
import { GET_DOC_REVIEW_REQUEST, GETUSER_DETAILS_REQUEST } from '../actions/Action';
import { connect } from 'react-redux';
// import { toast } from 'react-toastify';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import { ShareReviewEmailTamplate } from '../components/ShareReviewEmailTamplate';
// import { ToastMsg } from './ToastMsg';
import { Button } from 'reactstrap'
import Router from 'next/router'
import Link from 'next/link'

class ReviewBox extends React.Component {

    constructor(props) {
        super(props);
        this.openShare = React.createRef();
        this.state = {
            rating: 0,
            decription: '',
            reviewData: [],
            postReviewVisibility: false,
            currentEditPatientId: '',
            emails: [],
            facebookChecked: false,
            emailChecked: false,
            share_facebookvalue: '',
            share_emailValue: '',
            user_name: '',
            userId: "",
            alertError: false,
            alertSuccess: false,
            messageAlert: '',
            messageAlertSuccess: '',
            id:''
        }
    }


    componentDidMount() {
        // this.handleGetReviewData();
        let patientId = localStorage.getItem('uidp');
        let id = localStorage.getItem("viewProfileId") ? localStorage.getItem("viewProfileId") : window.location.search.substring(1);
        this.setState({ userId: patientId , id:id})
        // console.log("dataaaaaaaaaa iss", id)
        this.props.handlegetDocreview({ docId: id, handleAllRating: this.props.handleAllRating });
        this.props.handleGetUserDetails(patientId);
    }

    
    createViewReviewAllItem = (id) => {
        localStorage.setItem("viewReviewAllId", id)
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


    /*----------------------------------------------------handle-click-ratings-------------------------------*/

    onStarClick = (nextValue, prevValue, name) => {
        this.setState({ rating: nextValue });
        if (nextValue > 3) {
            this.setState({ facebookChecked: true, emailChecked: true, share_facebookvalue: 'facebook', share_emailValue: 'email' });
        }
        else {
            this.setState({ facebookChecked: false, emailChecked: false, share_facebookvalue: '', share_emailValue: '' });
        }
    }



    /*----------------------------------------------------handle-save-review-------------------------------*/

    handleSaveReviews = () => {

        // console.log("handleSaveReviews isssss");
        if (this.state.rating < 1) {
            // toast.error(<ToastMsg message="It is mandatory to provide ratings." />, { position: toast.POSITION.TOP_CENTER });
            // console.log("this.state.rating")
            this.setState({ alertError: true, messageAlert: 'It is mandatory to provide ratings.' })
            this.handleSetInterval();
        }
        else if (!this.state.decription) {
            // toast.error(<ToastMsg message="It is mandatory to provide review." />, { position: toast.POSITION.TOP_CENTER });
            // console.log("this.state.decription")
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
                doc_id: this.props.docId,
                dec: this.state.decription,
                rating: this.state.rating,
            }


            if (this.state.share_emailValue || this.state.share_facebookvalue) {
                if (this.state.share_emailValue && this.state.share_facebookvalue) {
                    if (this.state.emails.length === 0) {
                        // toast.error('Please Enter your emails !', { position: toast.POSITION.TOP_CENTER });
                        // console.log("Please Enter your emails")
                        this.setState({ alertError: true, messageAlert: 'Please Enter your emails !' })
                        this.handleSetInterval();
                    }
                    else {
                        if (this.props.isAuth) {
                            window.open(myURL, 'Smart Appointment', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + 1050 + ', height=' + 550 + ', top=' + top + ', left=' + left);
                            axios({
                                method: 'post',
                                url: Baseurl + 'api/review/save_review',
                                headers: { 'content-type': 'application/json' },
                                data: data,
                            }).then((res => {
                                // console.log("review-response----->", res);
                                this.handleShareOnEmails();
                                this.props.handlegetDocreview({ docId: this.props.docId, handleAllRating: this.props.handleAllRating });
                                this.setState({ postReviewVisibility: true, alertSuccess: true, messageAlertSuccess: 'Your review has been saved.' });
                                // toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER });
                                this.handleSetIntervalSuccess();
                            })).catch((error) => {
                                console.log("review-error------>", error);
                            })
                        }
                        else {
                            Router.push({ pathname: '/login', query: { routename: 'searchdoc_profile', uid: this.props.docId, dec: this.state.decription, rating: this.state.rating } });
                        }

                    }

                }
                else if (this.state.share_facebookvalue) {

                    if (this.props.isAuth) {
                        window.open(myURL, 'Smart Appointment', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + 1050 + ', height=' + 550 + ', top=' + top + ', left=' + left);
                        axios({
                            method: 'post',
                            url: Baseurl + 'api/review/save_review',
                            headers: { 'content-type': 'application/json' },
                            data: data,
                        }).then((res => {
                            // console.log("review-response----->", res);
                            this.props.handlegetDocreview({ docId: this.props.docId, handleAllRating: this.props.handleAllRating });
                            this.setState({ postReviewVisibility: true, alertSuccess: true, messageAlertSuccess: 'Your review has been saved !' });
                            // toast.success('Your review has been saved !', { position: toast.POSITION.TOP_CENTER });
                            // toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER });
                            this.handleSetIntervalSuccess();
                        })).catch((error) => {
                            console.log("review-error------>", error);
                        })
                    }
                    else {
                        Router.push({ pathname: '/login', state: { routename: 'searchdoc_profile', uid: this.props.docId, dec: this.state.decription, rating: this.state.rating } });
                    }

                }
                else {
                    if (this.state.emails.length === 0) {
                        // toast.error('Please Enter your emails !', { position: toast.POSITION.TOP_CENTER });
                        this.setState({ alertError: true, messageAlert: 'Please Enter your emails !' })
                        this.handleSetInterval();
                    }
                    else {
                        if (this.props.isAuth) {
                            axios({
                                method: 'post',
                                url: Baseurl + 'api/review/save_review',
                                headers: { 'content-type': 'application/json' },
                                data: data,
                            }).then((res => {
                                // console.log("review-response----->", res);
                                this.handleShareOnEmails();
                                this.props.handlegetDocreview({ docId: this.props.docId, handleAllRating: this.props.handleAllRating });
                                this.setState({ postReviewVisibility: true, alertSuccess: true, messageAlertSuccess: 'Your review has been saved !' });
                                // toast.success('Your review has been saved !', { position: toast.POSITION.TOP_CENTER });
                                // toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER });
                                this.handleSetIntervalSuccess();
                            })).catch((error) => {
                                console.log("review-error------>", error);
                            })
                        }
                        else {
                            Router.push({ pathname: '/login', state: { routename: 'searchdoc_profile', uid: this.props.docId, dec: this.state.decription, rating: this.state.rating } });
                        }
                    }
                }

            }
            else {

                if (this.props.isAuth) {
                    axios({
                        method: 'post',
                        url: Baseurl + 'api/review/save_review',
                        headers: { 'content-type': 'application/json' },
                        data: data,
                    }).then((res => {
                        // console.log("review-response----->", res);
                        this.props.handlegetDocreview({ docId: this.props.docId, handleAllRating: this.props.handleAllRating });
                        this.setState({ postReviewVisibility: true, alertSuccess: true, messageAlertSuccess: 'Your review has been saved !' });
                        // toast.success('Your review has been saved !', { position: toast.POSITION.TOP_CENTER });
                        // toast.success(<ToastMsg message="Your review has been saved." />, { position: toast.POSITION.TOP_CENTER });
                        this.handleSetIntervalSuccess();
                    })).catch((error) => {
                        console.log("review-error------>", error);
                    })
                }
                else {
                    Router.push({ pathname: '/login', state: { routename: 'searchdoc_profile', uid: this.props.docId, dec: this.state.decription, rating: this.state.rating } });
                }

            }

        }
    }


    /*----------------------handle-send-multi-email-------------------------*/

    handleShareOnEmails = () => {
        let data = {
            emails: this.state.emails,
            subject: `${this.state.user_name} invites you to Smart Appointment`,
            message: ShareReviewEmailTamplate(this.state.user_name, this.props.docProfile, this.props.doctor_name, this.state.decription)
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


    /*----------------------------------------------------render-min-reviews------------------------------------------------*/

    renderReview = () => {
        // console.log("renderReview boxxx")
        let userId = localStorage.getItem('uidp');
        let minReviewData = [];
        this.state.reviewData.map((value, key) => {
            if (value.patient_id === userId) {
                console.log("ifffffffff",value.patient_id)
                return null;
            }
            else {
                console.log("elseeeeeeeeee",value.patient_id)
                minReviewData.push(value);
            }
            return null;
        });


        const handleMin_review = minReviewData.filter((v, i) => i < 2 ? v : null);
        return handleMin_review.map((value, key) => {
            return <div className="feature mb-xs-24" key={key}>
                <div>
                    {console.log("renderReview id is",value.patient_id)}
                    <PatientName patientId={value.patient_id} />
                    <StarRatings
                        rating={value.rating}
                        starRatedColor="#ec8a19"
                        numberOfStars={5}
                        name='rate1'
                        starDimension="15px"
                        starSpacing="0px"
                    />
                </div>
                <p className="text-gray-700  font-weight-light text-sm">{value.dec}</p>
                <hr></hr>
            </div>
        })

    }


    /*-----------------------------------------------handle-Edit-button for edit current user review---------------------------------------*/

    editCurrentUserReview = (value) => {
        // console.log(value);
        this.setState({
            rating: value.rating,
            decription: value.dec,
            currentEditPatientId: value.patient_id,
            postReviewVisibility: !this.state.postReviewVisibility,
        });

        if (value.rating > 3) {
            this.setState({ facebookChecked: true, emailChecked: true, share_facebookvalue: 'facebook', share_emailValue: 'email' });
        }
        else {
            this.setState({ facebookChecked: false, emailChecked: false, share_facebookvalue: '', share_emailValue: '' });
        }


    }

    /*-----------------------------------------------render-current-user-review---------------------------------------*/

    renderCurrentUserReview = () => {
        if (this.props.isAuth) {
            let userId = localStorage.getItem('uidp');
            let filterUserReview = this.state.reviewData.filter(value => value.patient_id === userId);
            return filterUserReview.map((value, key) => {
                return <div className="feature mb-xs-24" style={{ marginBottom: "1.2rem" }} key={key}>
                    <div>
                    {console.log("renderCurrentUserReview id is",value.patient_id)}
                        <PatientName patientId={value.patient_id} > <span style={{ cursor: 'pointer' }} className="text-gray-700  font-weight-light text-sm" onClick={() => this.editCurrentUserReview(value)}>(Edit review)</span></PatientName>
                        <StarRatings
                            rating={value.rating}
                            starRatedColor="#ec8a19"
                            numberOfStars={5}
                            name='rate1'
                            starDimension="15px"
                            starSpacing="0px"
                        />
                    </div>
                    <p className="text-gray-700  font-weight-light text-sm">{value.dec}</p>
                    <hr></hr>
                </div>
            })

        }
        else {
            return null;
        }
    }

    /*-----------------------------------------------handle-componentWillReceiveProps---------------------------------------*/


    UNSAFE_componentWillReceiveProps(props) {
        // console.log(" props.ReviewData is ", props.docId, props.docReviewData)
        if (props.isAuth) {
            this.setState({ postReviewVisibility: true, reviewData: props.docReviewData, user_name: `${props.userDetails.first_name} ${props.userDetails.last_name}` })
        }
        else {
            this.setState({ postReviewVisibility: false, reviewData: props.docReviewData })
        }
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



    render() {
        let userId = localStorage.getItem('uidp');
        // console.log("localStorage.getItem('uidp')....................", localStorage.getItem('uidp'))
        // let checkCurrentUserReview = this.state.reviewData.filter(value => value.patient_id === this.state.userId);
        let checkCurrentUserReview = this.state.reviewData.filter(value => value.patient_id === userId);


        return (
            <React.Fragment>
                <div>
                    {this.renderCurrentUserReview()}
                    {this.renderReview()}
                    <div className="text-block pb-0 bg-white rounded border-1 p-4 mb-4 shadow" style={{ display: this.state.postReviewVisibility && checkCurrentUserReview.length ? 'none' : 'block' }}>
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
                        <div className="font-weight-500">{
                            this.props.isAuth ?
                                <PatientName patientId={this.state.currentEditPatientId} />
                                :
                                <h6 className="bold mb0">Add Review</h6>
                        }</div>
                        <div className="flex-shrink-1 mb-4 card-stars text-xs ">
                            <StarRatings
                                rating={this.state.rating}
                                changeRating={this.onStarClick}
                                starRatedColor="#ec8a19"
                                numberOfStars={5}
                                name='rate1'
                                starDimension="15px"
                                starSpacing="0px"
                            />
                        </div>
                        <form className="form review-field" id="contact-form" method="get" action="#">
                            <div className="form-group">
                                <textarea value={this.state.decription} className="form-control" rows="4" name="review" id="review" placeholder="Description" required="required"
                                    maxLength={1500}
                                    onChange={(e) => this.setState({ decription: e.target.value })}
                                >
                                </textarea>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="mr-3"><span className="text-gray-700  font-weight-light text-sm">Share on :</span></div>
                                <div className="text-muted custom-checkbox custom-control font-08r">

                                    <input name="facebook" id="facebook" type="checkbox" className="custom-control-input" checked={this.state.facebookChecked} onChange={(e) => this.handleFBOnchange(e)} />
                                    <label className="custom-control-label pt-1" htmlFor="facebook">Facebook</label>
                                </div>
                                <div className="custom-checkbox custom-control font-08r text-muted">

                                    <input type="checkbox" id="facilities_2" name="facilities_2" className="custom-control-input " checked={this.state.emailChecked} onChange={(e) => this.handleEmailOnchange(e)} />
                                    <label className="custom-control-label pt-1" htmlFor="facilities_2" >Email</label>
                                </div>
                            </div>

                            <ReactMultiEmail className="mt-2"
                                placeholder={
                                    <>
                                        Enter emails...
                                        </>
                                }
                                // style={{ minHeight: '40px', background: '#f5f5f5', padding: 0, maxWidth: '100%', borderRadius: 3, display: this.state.share_emailValue ? 'block' : 'none' }}
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

                            {/* <Link href={{ pathname: `/viewProfile`, query: { id: this.props.id } }} >
                                <Button color="primary" >View all</Button>
                            </Link> */}
                        </form>
                        <div className="text-right mt-4">
                            <Button type="submit" color="primary" onClick={this.handleSaveReviews}>save</Button>
                        </div>
                    </div>

                    {/* -------------------------------end of box----------------------------*/}


                    <span><Link href={{ pathname: `/ViewAllReview`, query: { id: this.state.id } }} as={`/ViewAllReview?${this.state.id}`} ><a onClick={() => this.createViewReviewAllItem(this.state.id)}>View all</a></Link></span>

                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        docReviewData: state.docReviewData,
        userDetails: state.userDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handlegetDocreview: data => dispatch({ type: GET_DOC_REVIEW_REQUEST, data }),
        handleGetUserDetails: data => { dispatch({ type: GETUSER_DETAILS_REQUEST, data }) }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewBox);
