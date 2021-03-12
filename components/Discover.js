import React from 'react'
import Baby from '../images/baby.svg';
import Eye from '../images/eye.svg';
import Pimple from '../images/pimples.svg';
import Teeth from '../images/teeth.svg';
import Medicine from '../images/medicine.svg';
import Otoplasty from '../images/otoplasty.svg';
import {
    Container,
    Row,
    Col
} from 'reactstrap'

const Discover = (props) => {
    return (
        <section className={props.className}>
            <Container>
                <div className="pb-lg-4">
                    {/* <p className="subtitle text-secondary">
                        {props.subTitle}
                    </p>
                    <h2 className="mb-5">
                        {props.title}
                    </h2> */}
                </div>
                <Row>
                    <Col sm="6" lg={12 / 6} className="mb-3 mb-lg-0">
                        <div className="px-0 pr-lg-3">
                            <div className="text-center">
                                <img alt="Screenshot" className="mb-xs-16 " src={Medicine} width="80" />
                                <h6 className="uppercase pt24 mt-4">Primary care</h6>
                            </div>
                        </div>
                    </Col>
                    <Col sm="6" lg={12 / 6} className="mb-3 mb-lg-0">
                        <div className="px-0 pr-lg-3">
                            <div className="text-center">
                                <img alt="Screenshot" className="mb-xs-16 " src={Baby} width="80" />
                                <h6 className="uppercase pt24 mt-4">Obgyn</h6>
                            </div>
                        </div>
                    </Col>
                    <Col sm="6" lg={12 / 6} className="mb-3 mb-lg-0">
                        <div className="px-0 pr-lg-3">
                            <div className="text-center">
                                <img alt="Screenshot" className="mb-xs-16 " src={Teeth} width="80" />
                                <h6 className="uppercase pt24 mt-4">Dentist</h6>
                            </div>
                        </div>
                    </Col>
                    <Col sm="6" lg={12 / 6} className="mb-3 mb-lg-0">
                        <div className="px-0 pr-lg-3">
                            <div className="text-center">
                                <img alt="Screenshot" className="mb-xs-16 " src={Pimple} width="80" />
                                <h6 className="uppercase pt24 mt-4">Dermatologist</h6>
                            </div>
                        </div>
                    </Col>
                    <Col sm="6" lg={12 / 6} className="mb-3 mb-lg-0">
                        <div className="px-0 pr-lg-3">
                            <div className="text-center">
                                <img alt="Screenshot" className="mb-xs-16 " src={Eye} width="80" />
                                <h6 className="uppercase pt24 mt-4">Eye Doctor</h6>
                            </div>
                        </div>
                    </Col>
                    <Col sm="6" lg={12 / 6} className="mb-3 mb-lg-0">
                        <div className="px-0 pr-lg-3">
                            <div className="text-center">
                                <img alt="Screenshot" className="mb-xs-16 " src={Otoplasty} width="80" />
                                <h6 className="uppercase pt24 mt-4">ENT</h6>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Discover;