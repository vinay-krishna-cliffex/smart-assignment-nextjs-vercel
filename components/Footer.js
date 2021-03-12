import React from 'react'
// import  SmartLogo  from "../images/smartLogo.ico";
import Link from 'next/link'
import {
    Container,
    Row,
    Col,

} from 'reactstrap'

import footerContent from '../data/footer.json'

const Footer = () => {
    let year = new Date().getFullYear();
    return (
        <footer className="position-relative z-index-10 d-print-none" >
                        <div className="py-6 bg-gray-200 text-muted">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-2 col-md-6 mb-5 mb-lg-0">
                                        <h6 className="text-uppercase text-dark mb-3" style={{letterSpacing: "0"}}>SmartAppt</h6>
                                        <ul className="list-unstyled">

                                            <li><a className="text-muted" href="#">Home   </a></li>
                                            <li><a className="text-muted" href="#">About   </a></li>
                                            <li><a className="text-muted" href="#">health Q &amp; A </a></li>
                                            {/* <li><Link href="https://smartappointment.com" ><a className="text-muted">blog</a></Link></li> */}
                                            <li><a target="_blank" className="text-muted" href="https://smartappointment.com/blog">blog</a></li>
                                            <li><a className="text-muted" href="#">Press </a></li>
                                            <li><a className="text-muted" href="#">Contact Us </a></li>
                                            <li><a className="text-muted" href="#">Help  </a></li>

                                        </ul>
                                    </div>
                                    <div className="col-lg-2 col-md-6 mb-5 mb-lg-0">
                                        <h6 className="text-uppercase text-dark mb-3" style={{letterSpacing: "0"}}>Search by</h6>

                                        <ul className="list-unstyled">

                                            <li><a className="text-muted" href="#">Insurance </a></li>
                                            <li><a className="text-muted" href="#">Specialty   </a></li>
                                            <li><a className="text-muted" href="#">Location   </a></li>
                                            <li><a className="text-muted" href="#">Illness  </a></li>
                                            <li><a className="text-muted" href="#">Doctor Name </a></li>
                                            <li><a className="text-muted" href="#">All doctors </a></li>
                                        </ul>
                                        <div className="">

                                            <h6 className=" text-dark mb-3">Are you a doctor?</h6>
                                            <ul className="list-unstyled">

                                                <li><a className="text-muted" href="#">List your profile on smartAppt. </a></li>

                                            </ul>
                                        </div>



                                    </div>
                                    <div className="col-lg-2 col-md-6 mb-5 mb-lg-0">
                                        <h6 className="text-uppercase text-dark mb-3" style={{letterSpacing: "0"}}>For Doctors</h6>
                                        <ul className="list-unstyled">

                                            <li><a className="text-muted" href="#">Your Profile   </a></li>
                                            <li><a className="text-muted" href="#">Specialties   </a></li>
                                            <li><a className="text-muted" href="#">Side map   </a></li>
                                            <li><a className="text-muted" href="#">Contact  </a></li>
                                            <li><a className="text-muted" href="#">FAQ </a></li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-3 col-md-6 mb-5 mb-lg-0">
                                        <h6 className="text-uppercase text-dark mb-3" style={{letterSpacing: "0"}}>Contact</h6>
                                         <div className=" text-muted mb-2">
                                          <i className="fa fa-phone mr-2 phone_icon_rotate" />6316569040 <br/>
                                          
                                        </div>
                                          <div className="media  text-muted mb-2">  <i className="fa fa-envelope-open fa-fw mr-2" />
                                            <div className="media-body mt-n1"><Link href="//mailto:support@htmlstream.com" ><a className="text-muted text-sm">support@smartappointment.com</a></Link></div>
                                        </div>
                                         <div className="media text-muted"> <i className="fa fa-address-book fa-fw mr-2" />
                                            <div className="media-body mt-n1">732 Smithtown Bypass<br />Smithtown NY 11787</div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <h6 className="text-uppercase text-dark mb-3" style={{letterSpacing: "0"}}>We are also available in your phone</h6>
                                        <p className="mb-3"> Download the app from store</p>
                                        <li className="download-btn">
                                        <a target="_blank" className=" btn-xs inline-block transition-3d-hover text-left mb-2 mr-1" href="https://apps.apple.com/us/app/smartappointment-by-medsched/id1518530469" style={{width: '82%'}}><span className="media align-items-center"><span className="fab fa-apple fa-2x mr-3" /><span className="media-body"><span className="d-block">Download on the</span><strong className="font-size-1">App Store</strong></span></span></a>

                                        </li>
                                        <li className="download-btn">
                                        <a target="_blank" className=" btn-xs inline-block transition-3d-hover text-left mb-2" href="https://play.google.com/store/apps/details?id=com.smartappt.patient" style={{width: '82%'}} >
                                            <span className="media align-items-center"><span className="fab fa-google-play fa-2x mr-3" />
                                            <span className="media-body"><span className="d-block">Get it on</span><strong className="font-size-1">Google Play</strong>
                                            </span>
                                            </span>
                                            </a>
                                        </li>
                                    </div>
                                </div>
                            </div>
                        </div>

                
           
            <div className="py-4 font-weight-light bg-gray-800 text-gray-300">
                <Container>
                    <Row className="align-items-center">
                        <Col md="4" className="d-flex text-center text-md-left">
                            {/* <img className="logoFooter"  src={SmartLogo}></img> */}
                            <p className="text-sm mb-md-0 pl-2">
                            © {year} , Smart Appointment.  All rights reserved.
                            </p>
                        </Col>
                        <Col md="4">
                            <ul className="list-inline mb-0 mt-2 mt-md-0 text-center text-md-right">
                                <li className="list-inline-item">
                                <a className=" text-white text-sm pr-2" href="#">Terms of Use</a>
                                </li>
                                <li className="list-inline-item">
                                <a className=" text-white text-sm" target="_blank" href="/MedSched_Privacy_Policy.pdf">Privacy Policy</a>
                                </li>
                             </ul>
                        </Col>
                        <Col md="4">
                            <ul className="list-inline mb-0 mt-2 mt-md-0 text-center text-md-right">
                                <li className="list-inline-item">
                                <a className="btn btn-sm social-icon btn-soft-secondary rounded-circle" href="#"><span className="fab fa-facebook-f btn-icon__inner"></span></a>
                                </li>
                                <li className="list-inline-item">
                                   
                                  <a className="btn btn-sm social-icon btn-soft-secondary rounded-circle" href="#"><span className="fab fa-twitter btn-icon__inner" /></a>
                                </li>
                                <li className="list-inline-item">
                                    <a className="btn btn-sm social-icon btn-soft-secondary rounded-circle" href="#"><span className="fab fa-linkedin-in btn-icon__inner"></span></a>
                                </li>
                               
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer >
    )
}

export default Footer;