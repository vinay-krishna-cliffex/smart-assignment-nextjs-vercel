import React, { Component } from 'react';
import { FacebookShareButton } from 'react-share';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import { connect } from 'react-redux';
import { GETUSER_DETAILS_REQUEST } from '../actions/Action';
import axios from 'axios';
import { ReferralInviteEmail } from '../components/ReferralInviteEmail';
import { Baseurl } from '../utils/Baseurl';
// import { toast } from 'react-toastify';
// import { ToastMsg } from '../components/ToastMsg';

import Link from 'next/link'

import { Container, Row, Col, Button } from 'reactstrap'

import ProgressBar from '../components/ProgressBar'

import data from '../data/user-add.json'
import {
    TwitterShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    LinkedinShareButton,
    RedditShareButton,
    PocketShareButton,
    WorkplaceShareButton,
    TumblrShareButton,
    LineShareButton,
    TelegramIcon,
    WhatsappIcon,
    TwitterIcon,
    LinkedinIcon,
    RedditIcon,
    WorkplaceIcon,
    PocketIcon,
    TumblrIcon,
    LineIcon,
} from "react-share";

// export async function getStaticProps() {
//     return {
//         props: {
//             nav: {
//                 light: true,
//                 classes: "shadow",
//                 color: "white",
//             },
//             loggedUser: true,
//             title: "Add your listing"
//         },
//     }
// }

class ReferralScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emails: [],
            userRefferCode: '',
            isOtherReffer: '',
            otherRefferCode: '',
            userName: '',
            referralUser: [],
            referredByuser: '',
            emailsInputVisibility: false,
            alertError: false,
            messageAlert: '',
            alertSuccess: false,
            messageAlertSuccess: ''
        }
    }



    // UNSAFE_componentWillMount() {
    //     window.scrollTo(0, 0);
    // }

    componentDidMount() {
        let userId = localStorage.getItem('uidp');
        if (!userId) {
            window.location.href="/login";
        }
        this.props.handleGetUserDetails(userId);
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

    handleSetIntervalSuccess = () => {
        setTimeout(
            () => this.setState({ alertSuccess: false, messageAlertSuccess: '' }),
            8000
        );
    }

    /*-----------------------------------------------componentWillReceiveProps------------------------------*/


    UNSAFE_componentWillReceiveProps(props) {
        if (!props.isLoading) {
            if (props.userDetails.refer_code) {
                this.setState({
                    userRefferCode: props.userDetails.refer_code,
                    isOtherReffer: props.userDetails.other_code,
                    userName: `${props.userDetails.first_name} ${props.userDetails.last_name}`
                }, () => {
                    // props.userDetails.refer_code && this.handleGetreferrallUsers(props.userDetails.refer_code);
                    // props.userDetails.other_code && this.handleGetReferredBy(props.userDetails.other_code);
                });
            }
            else {
                this.setState({
                    userRefferCode: props.userDetails.refer_code,
                    isOtherReffer: props.userDetails.other_code,
                    userName: `${props.userDetails.first_name} ${props.userDetails.last_name}`
                }, () => {
                    this.handleGenretRendomCode();
                    // props.userDetails.refer_code && this.handleGetreferrallUsers(props.userDetails.refer_code);
                    // props.userDetails.other_code && this.handleGetReferredBy(props.userDetails.other_code);
                })
            }
        }
        else {
            return null;
        }

    }

    /*-----------------------------------------------handle get referred by------------------------------*/

    handleGetReferredBy = (code) => {
        axios({
            method: 'get',
            url: Baseurl + `api/user/getReferredBy?referralCode=${code}`,
            headers: { 'content-type': 'application/json' }
        }).then((res) => {
            // console.log("get referred by user---------->", res);
            this.setState({ referredByuser: `${res.data.data.first_name} ${res.data.data.last_name}` })
        }).catch((error) => {
            console.log("get referred by error----->", error);
        })
    }



    /*-----------------------------------------------handle handleGetreferrallUsers------------------------------*/

    handleGetreferrallUsers = (referralCode) => {
        axios({
            method: 'post',
            url: Baseurl + `api/user/getreferred_user?referredBy=${referralCode}`,
            headers: { 'content-type': 'application/json' }
        }).then(res => {
            // console.log("get referral users response---------->", res);

            this.setState({
                referralUser: res.data.user
            })
        }).catch(error => {
            console.log("get referral user error---------->", error);
        })
    }


    /*-----------------------------------------------handle genrete referral code------------------------------*/

    handleGenretRendomCode = () => {

        let userId = localStorage.getItem('uidp');
        var randHex = (len) => {
            var maxlen = 8;
            let min = Math.pow(16, Math.min(len, maxlen) - 1)
            let max = Math.pow(16, Math.min(len, maxlen)) - 1,
                n = Math.floor(Math.random() * (max - min + 1)) + min,
                r = n.toString(16);
            while (r.length < len) {
                r = r + randHex(len - maxlen);
            }
            return r;
        };

        let genretedNumber = randHex(8);
        let data = {
            id: userId,
            refer_code: genretedNumber,
            other_code: null,
            other_createdAt: null
        }

        // console.log(data);

        axios({
            method: 'post',
            url: Baseurl + 'api/user/save_referralcode',
            headers: { 'content-type': 'application/json' },
            data
        }).then((res) => {
            // console.log("referral code save response-------->", res);
            this.props.handleGetUserDetails(userId);
        }).catch((error) => {
            console.log("referral code save error-------->");
        })

    }

    /*-----------------------------------------------handle apply button------------------------------*/

    handleApplyButton = () => {
        let userId = localStorage.getItem('uidp');
        let data = {
            id: userId,
            refer_code: this.state.userRefferCode,
            other_code: this.state.otherRefferCode,
            other_createdAt: Date.now(),
        }

        axios({
            method: 'post',
            url: Baseurl + 'api/user/update_userby_referralby',
            headers: { 'content-type': 'application/json' },
            data
        }).then((res) => {

            this.setState({ alertSuccess: true, messageAlertSuccess: 'his code is referred successfully.' })
            this.handleSetIntervalSuccess();
            this.props.handleGetUserDetails(userId);
        }).catch((error) => {
            this.setState({ alertError: true, messageAlert: `${error.response.data.error} please try again.` })
            this.handleSetInterval();
        })
    }


    /*-----------------------------------------------handle share with emails------------------------------*/

    handleShareWithEmails = () => {
        let userId = localStorage.getItem('uidp');

        let data = {
            emails: this.state.emails,
            subject: `${this.state.userName} invites you to Smart Appointment`,
            message: ReferralInviteEmail(this.state.userName, this.state.userRefferCode)
        }

        if (this.state.emailsInputVisibility) {
            if (this.state.emails.length === 0) {
                this.setState({ alertError: true, messageAlert: `Please enter your emails.` })
                this.handleSetInterval();
            }
            else {

                axios({
                    method: 'post',
                    url: Baseurl + 'api/user/shareon_emails',
                    headers: { 'content-type': 'application/json' },
                    data
                }).then((res) => {
                    this.setState({ emails: [], emailsInputVisibility: false });
                    this.props.handleGetUserDetails(userId);
                    this.setState({ alertSuccess: true, messageAlertSuccess: 'Invite Email sent successfully.' })
                    this.handleSetIntervalSuccess();

                }).catch((error) => {
                    console.log("share on email response--------->");
                })
                // })

            }
        }
        else {
            this.setState({ emailsInputVisibility: true })
        }

    }


    /*-----------------------------------------------render referral user------------------------------*/

    renderReferralUsers = () => {
        return this.state.referralUser.map((value, key) => {

            return <tr key={key}>
                <td className="text-center">{new Date(parseInt(value.other_createdAt)).toLocaleString()}</td>
                <td className="text-left">{value.first_name} {value.last_name}</td>
                <td className="text-left">{value.refer_code}</td>
            </tr>
        })
    }




    handleShareOnFb = () => {
        var myURL = `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsmartappointment.com&quote=I just used the Smart Appointment app to book an appointment with my doctor. Smart Appointment is a fast and convenient way to make an appointment without any delays.
         %0D%0A
        Website - https://smartappointment.com %0D%0A 
        Download on Android - https://play.google.com/store/apps/details?id=com.smartappt.patient %0D%0A
        Download on iOS - https://apps.apple.com/us/app/smartappointment-by-medsched/id1518530469`;

        var left = (window.innerWidth - 1050) / 2;
        var top = (window.innerHeight - 550) / 4;

        window.open(myURL, 'facebook-share-dialog', 'Smart Appointment', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + 1050 + ', height=' + 550 + ', top=' + top + ', left=' + left);
    }



    render() {
        return (
            <React.Fragment>
                <ProgressBar progress={0} />
                <section className="py-5 py-lg-7">
                    <Container>
                        <Row className="sm-flow">
                            <Col lg="5" className="sm-top">
                                {/* <p className="subtitle text-primary">
                                {data[0].subtitle}
                            </p> */}
                                <h1 className="h2 mb-5">
                                    {data[0].title}
                                </h1>
                                <div dangerouslySetInnerHTML={{
                                    __html: data[0].content
                                }} />
                                <div className="mb-5 mb-lg-0 spc-r-10">
                                    <div className="mb-4 btn-btn-txt">

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
                                        <p className="text-muted text-sm mb-4">Invite your Facebook friends to Smart Appointment And Share Smart Appointment with your email contacts.</p>
                                        {/* <Link href="#!" passHref> */}
                                            <Button color="primary" onClick={this.handleShareOnFb}>
                                                facebook
                                        </Button>
                                        {/* </Link> */}

                                        {/* <Link href="#!" passHref> */}
                                            <Button color="primary" onClick={this.handleShareWithEmails} className="ml-3">
                                                send Email
                                        </Button>
                                        {/* </Link> */}
                                    </div>
                                    <ReactMultiEmail
                                       className="mt-2 mb-2"
                                        placeholder={
                                            <>
                                                Enter emails...
                                            </>
                                        }
                                        style={{ display: this.state.emailsInputVisibility ? 'block' : 'none' }}
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
                                <div className="blok-b">
                                    <h1 className="h2 mb-5 ">
                                        Share with any one
                                </h1>
                                    <ul className="m-0 p-0 social_link_share">
                                        <li>
                                            <TwitterShareButton url={"https://twitter.com/intent/tweet?url=http%3A%2F%2Fgithub.com&text=GitHub"}>
                                                <TwitterIcon size={32} round={true} />
                                            </TwitterShareButton>
                                        </li>
                                        <li>
                                            <TelegramShareButton url={"https://telegram.me/share/?url=http%3A%2F%2Fgithub.com&text=GitHub"}>
                                                <TelegramIcon size={32} round={true} />
                                            </TelegramShareButton>
                                        </li>
                                        <li>
                                            <WhatsappShareButton url={"https://web.whatsapp.com/"}>
                                                <WhatsappIcon size={32} round={true} />
                                            </WhatsappShareButton>
                                        </li>
                                        <li>
                                            <LinkedinShareButton url={"https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2FshareArticle%3Furl%3Dhttp%253A%252F%252Fgithub.com"}>
                                                <LinkedinIcon size={32} round={true} />
                                            </LinkedinShareButton>
                                        </li>
                                        <li>
                                            <TumblrShareButton url={"https://www.tumblr.com/widgets/share/tool/preview?canonicalUrl=http%3A%2F%2Fgithub.com&title=GitHub&posttype=link"}>
                                                <TumblrIcon size={32} round={true} />
                                            </TumblrShareButton>
                                        </li>
                                        <li>
                                            <LineShareButton url={"https://access.line.me/oauth2/v2.1/login?loginState=5BLOBaRPO7t72dZweOfpBw&loginChannelId=1446101138&returnUri=%2Foauth2%2Fv2.1%2Fauthorize%2Fconsent%3Fscope%3Dopenid%2Bprofile%2Bfriends%2Bgroups%2Btimeline.post%2Bmessage.write%26response_type%3Dcode%26redirect_uri%3Dhttps%253A%252F%252Fsocial-plugins.line.me%252Flineit%252FloginCallback%253FreturnUrl%253Dhttps%25253A%25252F%25252Fsocial-plugins.line.me%25252Flineit%25252Fshare%25253Furl%25253Dhttp%2525253A%2525252F%2525252Fgithub.com%252526text%25253DGitHub%26state%3D62e49efbfe11441e22ede69278720e%26client_id%3D1446101138#/"}>
                                                <LineIcon size={32} round={true} />
                                            </LineShareButton>
                                        </li>
                                        <li>
                                            <RedditShareButton url={"https://www.reddit.com/submit?url=http%3A%2F%2Fgithub.com&title=GitHub"}>
                                                <RedditIcon size={32} round={true} />
                                            </RedditShareButton>
                                        </li>
                                        <li>
                                            <PocketShareButton url={"https://getpocket.com/login?e=2&route=%2Fedit.php%3Furl%3Dhttp%253A%252F%252Fgithub.com%26url%3Dhttp%253A%252F%252Fgithub.com%26title%3DGitHub"}>
                                                <PocketIcon size={32} round={true} />
                                            </PocketShareButton>
                                        </li>
                                        <li>
                                            <WorkplaceShareButton url={"https://work.workplace.com/work/company_selector/?next=https%3A%2F%2Fwork.facebook.com%2Fsharer.php%3Fu%3Dhttp%253A%252F%252Fgithub.com%26quote%3DGitHub&session_id=CV%2FRYZQsx0Q"}>
                                                <WorkplaceIcon size={32} round={true} />
                                            </WorkplaceShareButton>
                                        </li>
                                    </ul>

                                </div>
                            </Col>
                            <Col lg="5" className="ml-auto d-flex align-items-center">
                                <img src="/content/img/illustration/banner_invite.svg" alt="" style={{ width: "500px" }}
                                    className="img-fluid" />
                            </Col>
                        </Row>
                    </Container>
                </section>
            </React.Fragment >
        )
    }
}
const mapStateToProps = (state) => {
    return {
        userDetails: state.userDetails,
        isLoading: state.isLoading,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleGetUserDetails: data => dispatch({ type: GETUSER_DETAILS_REQUEST, data })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ReferralScreen);
