import React, {Component} from 'react';

export default class PatientBenefit extends Component {
    render(){
        return(
            <React.Fragment>
                <div className='custombox-content custombox-x-center custombox-y-center custombox-top custombox-blur custombox-open' style={{opacity: 1}}>
                    <div id="animationModal" className="js-modal-window" style={{width: 800, marginTop: '7.5rem'}}>
                        <div className="card">
                            <header className="card-header bg-light py-3 px-5">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="h6 mb-0">Discover the benefits of using smart appointment</h3>

                                    {/*<Link to='/' type="button" className="close" aria-label="Close">*/}
                                    {/*    <span aria-hidden="true">&times;</span>*/}
                                    {/*</Link>*/}
                                </div>
                            </header>

                            <div className="card-body p-5">
                                <ul className="list-unstyled">
                                    <li className="media align-items-center pb-3">
                              <span className="btn-sm btn-icon btn-soft-primary rounded-circle mb-1 mr-3">
                                <span className="small font-weight-semi-bold btn-icon__inner">01.</span>
                              </span>
                                        <div className="media-body">
                                            <p className="text-dark mb-0">Find a doctor who has been reviewed and highly rated by your
                                                peers. </p>
                                        </div>
                                    </li>
                                    <li className="media align-items-center py-3">
                              <span className="btn-sm btn-icon btn-soft-primary rounded-circle mb-1 mr-3">
                                <span className="small font-weight-semi-bold btn-icon__inner">02.</span>
                              </span>
                                        <div className="media-body">
                                            <p className="text-dark mb-0">Instant appointments. No more waiting for confirmation from
                                                your doctor’s office.</p>
                                        </div>
                                    </li>
                                    <li className="media align-items-center pt-3">
                              <span className="btn-sm btn-icon btn-soft-primary rounded-circle mb-1 mr-3">
                                <span className="small font-weight-semi-bold btn-icon__inner">03.</span>
                              </span>
                                        <div className="media-body">
                                            <p className="text-dark mb-0">Instant Insurance verification. No more last minute surprises
                                                that your insurance is not accepted by the physician.</p>
                                        </div>
                                    </li>
                                    <li className="media pt-3">
                              <span className="btn-sm btn-icon btn-soft-primary rounded-circle mb-1 mr-3">
                                <span className="small font-weight-semi-bold btn-icon__inner">04.</span>
                              </span>
                                        <div className="media-body">
                                            <p className="text-dark mb-0">Doctor to doctor consult requests. Take away the hassle of
                                                finding a consultant that belongs to your plan. For the first time your primary care
                                                provider can book an instant visit/appointment before you leave the front desk of your
                                                medical provider.</p>
                                        </div>
                                    </li>
                                    <li className="media pt-3">
                              <span className="btn-sm btn-icon btn-soft-primary rounded-circle mb-1 mr-3">
                                <span className="small font-weight-semi-bold btn-icon__inner">05.</span>
                              </span>
                                        <div className="media-body">
                                            <p className="text-dark mb-0">Share your reviews with your friends on Facebook instantly.
                                                Wouldn’t you want your friends and family have the same great doctor that you have and
                                                trust.</p>
                                        </div>
                                    </li>
                                    <li className="media align-items-center pt-3">
                              <span className="btn-sm btn-icon btn-soft-primary rounded-circle mb-1 mr-3">
                                <span className="small font-weight-semi-bold btn-icon__inner">06.</span>
                              </span>
                                        <div className="media-body">
                                            <p className="text-dark mb-0">Dynamic appointment. Your doctor can notify you via text if
                                                their appointments are running late or on time. Similar technology to your favorite
                                                restaurant.</p>
                                        </div>
                                    </li>
                                    <li className="media align-items-center pt-3">
                              <span className="btn-sm btn-icon btn-soft-primary rounded-circle mb-1 mr-3">
                                <span className="small font-weight-semi-bold btn-icon__inner">07.</span>
                              </span>
                                        <div className="media-body">
                                            <p className="text-dark mb-0">Avoid unnecessary calls to doctor’s offices.</p>
                                        </div>
                                    </li>
                                    <li className="media align-items-center pt-3">
                              <span className="btn-sm btn-icon btn-soft-primary rounded-circle mb-1 mr-3">
                                <span className="small font-weight-semi-bold btn-icon__inner">08.</span>
                              </span>
                                        <div className="media-body">
                                            <p className="text-dark mb-0">Avoid long wait/hold times on the phone.</p>
                                        </div>
                                    </li>
                                </ul>
                                <div className="pt-3 pb-3">
                                    <hr className=""/>
                                </div>
                                <ul className="list-unstyled">
                                    <li className="media pb-3">
                              <span className="btn btn-icon btn-sm btn-soft-indigo rounded-circle mr-3">
                                <span className="fas fa-check btn-icon__inner"/>
                              </span>
                                        <div className="media-body">
                                            <h6>Share your reviews on Facebook instantly. </h6>
                                            <p className="text-dark mb-0">Give your friends and family a gift of having a doctor that
                                                you love and trust</p>
                                        </div>
                                    </li>

                                    <li className="media pb-3">
                              <span className="btn btn-icon btn-sm btn-soft-indigo rounded-circle mr-3">
                                <span className="fas fa-check btn-icon__inner"/>
                              </span>
                                        <div className="media-body">
                                            <h6>Doctor to doctor consult requests</h6>
                                            <p className="text-dark mb-0">Eliminate the hassle of finding a specialist. For the first
                                                time your PCP can book an instant appointment with a specialist before you leave the
                                                front desk</p>
                                        </div>
                                    </li>

                                    <li className="media pb-3">
                              <span className="btn btn-icon btn-sm btn-soft-indigo rounded-circle mr-3">
                                <span className="fas fa-check btn-icon__inner"/>
                              </span>
                                        <div className="media-body">
                                            <h6>Dynamic appointment </h6>
                                            <p className="text-dark mb-0">Your doctor can notify you via text if their appointments are
                                                running late.</p>
                                        </div>
                                    </li>


                                </ul>

                            </div>


                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
