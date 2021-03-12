import React, { Component } from 'react';
import Container from 'reactstrap/lib/Container';

export default class PracticeBenefit extends Component {
    render() {
        return (
            <React.Fragment>
                <Container>
                    <div className='custombox-content custombox-x-center custombox-y-center custombox-top custombox-blur custombox-open' style={{ opacity: 1 }}>
                        <div id="animationModal" className="js-modal-window" style={{ width: '100%' , margin: 'auto', marginTop: "4rem", marginBottom: "3rem" }}>
                            <div className="card">
                                <header className="card-header bg-light py-3 px-5">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h3 className="h6 mb-0">Discover features for doctors of using smart appointment</h3>
                                    </div>
                                </header>

                                <div className="card-body p-5">
                                    <ul className="list-group">
                                        <li className="media align-items-center pb-3 list-group-item active" style={{ fontSize: '15px', background: '#24292e', borderColor: '#24292e' }}>
                                            <p style={{ color: '#fff', fontWeight: '500' }}>Learn how Smart Appointment can drive value for your practice</p>
                                        </li>
                                        <li className="media align-items-center pb-3 list-group-item" style={{ fontSize: '15px' }}>

                                            <div className="media-body">
                                                <p style={{ color: '#000' }}><span className="badge" style={{ background: '#24292e', color: '#fff', marginRight: '5px' }}>01.</span> Practices struggle to attract new patients and retain existing patients when the appointment-booking experience is not satisfactory.<br /><br />
                                                    <b>SmartAppointment Solution:</b><br />
Capture more office visits for both new and established patients. </p>
                                                <p style={{ color: '#000' }}>With SmartAppointment’s new technology, optimize your schedule and make the most of your staff’s time by scheduling appointments instantly using our mobile app or website</p>
                                                <p style={{ color: '#000' }}>Avoid long wait times on the phone
                                                Reduce call volume to your practice, thus reducing hold times for patients
                                                Rest assured that the patient you are seeing has an active and valid health insurance
Avoid seeing patients with the insurance plans that you don’t participate with.</p>
                                            </div>
                                        </li>
                                        <li className="media align-items-center py-3 list-group-item" style={{ fontSize: '15px' }}>

                                            <div className="media-body">

                                                <p style={{ color: '#000' }}>  <span className="badge" style={{ background: '#24292e', color: '#fff', marginRight: '5px' }}>02.</span>
                              Most calls received by front-office staff are appointment-related, creating long hold times and tying up staff time dealing with scheduling issues, thereby requiring more staff to keep up with call volume, increasing overhead costs.</p>
                                                <p style={{ color: '#000' }}><b>SmartAppointment Solution:</b><br />
Decrease practice overhead.  With Smart Appointment, patients can quickly and easily book appointments online, with instant insurance verification.   Smart appointment algorithm will block any appointment request from a patient if there is a mismatch between patients health insurance and the plans that doctor accepts requiring less interaction with office staff.</p>
                                                <p style={{ color: '#000' }}>Reduce call volume of appointment-related questions by instantly verifying patient’s insurance information
                                                Optimize staff time to focus on more complex issues such as prescription refills and test results - which tend to have a greater impact on patient satisfaction.
Reduce the need to hire extra staff due to large call volume</p>
                                            </div>
                                        </li>
                                        <li className="media align-items-center pt-3 list-group-item" style={{ fontSize: '15px' }}>


                                            <div className="media-body">

                                                <p style={{ color: '#000' }}><span className="badge" style={{ background: '#24292e', color: '#fff', marginRight: '5px' }}>03.</span>
                                                             About half of all patients referred to a specialist will not see that specialist due to long wait times, ineffective communications, and confusion around insurance eligibility.<br /><br /><b>SmartAppointment Solution:</b><br />
                                                             Streamline the specialist referral process.  With SmartAppointment, instantly schedule your patient for a follow-up appointment with an in-network specialist, driving 100% retention and adherence to care plans.
Create a hassle-free experience for your patient, reducing wait times to see a specialist and guaranteeing appointment is made before the patient leaves your office.
                                                        </p>
                                                <p style={{ color: '#000' }}>Close gaps in care and improve patient outcomes by ensuring conditions don’t go untreated due to long wait times and miscommunications.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </React.Fragment>
        )
    }
}
