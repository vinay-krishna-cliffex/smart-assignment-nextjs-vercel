import React, { useState } from 'react'
import abstractShape from '../images/abstract-shapes.svg';
import smartDocPatient from '../images/smt-doc-patient.svg';
import Link from 'next/link'
import docPng from '../images/doctor.png';
import patientPng from '../images/patient.png';
import Router from 'next/router'

import {
    Container,
    Row,
    Col,
    Button
} from 'reactstrap'

// import Swiper from '../components/Swiper'

import SearchBar from '../components/SearchBar'
// import Discover from '../components/Discover'
import data from '../data/index2.json'
import PrimarySpeciality from '../data/home-block-spec-search.json';

// export async function getStaticProps() {
//     return {
//         props: {
//             nav: {
//                 light: true,
//                 classes: "shadow",
//                 color: "white",
//             },
//             title: 'Restaurants'
//         },
//     }
// }


const Index = () => {
    const [hometable, sethometable] = useState(false);


    const handleHomeBlockSearch = (name, insurance_provider) => {
        let data = { name: name, practice_name: '', insurance_provider: insurance_provider, zip: '', consultAt: "" }
        localStorage.setItem("homeQuerys", JSON.stringify(data));
        console.log("handleHomeBlockSearch",name)
        let string =  name
        let speciality = ''
        for (var i = 0; i < string.length; i++) {
            if (string.charAt(i) === ' ') {
                speciality = speciality + '-'
            }else {
                speciality = speciality + string.charAt(i)
            }
        }
        return ( Router.push(`/[speciality]/new-york`,`/${speciality.toLowerCase()}/new-york`)
        )

    }

    return (
        <React.Fragment>
            {data.hero &&
                <section
                    // style={{ backgroundImage: `url(content/${data.hero.img})` }}
                    className=" bg-smt-green position-relative">
                    <Container className=" pt-6   ">
                        <Row className="z-index-4 position-relative">

                            <Col
                                md="7"
                                className="mx-auto"
                            >
                                <h1 className="font-weight-bold display-4"
                                >
                                    {data.hero.title}
                                </h1>
                                {/* <p className="text-lg text-shadow">
                                    {data.hero.subTitle}
                                </p> */}
                            </Col>
                            <div className="col-md-5">
                                <img src={smartDocPatient} className="img-fluid" />
                            </div>
                        </Row>
                        <Row className="justify-content-lg-between align-items-lg-center">
                            <div className="col-lg-12 col-md-12 py-4">
                                <h3 className="h5 font-weight-semi-bold pb-4"> Schedule your appointment now </h3>
                                <SearchBar
                                    options={data.searchOptions}
                                    className="rounded  position-relative  z-index-20"
                                    halfInputs
                                    btnMb="0"
                                />

                            </div>
                            <div className="w-40 position-absolute bottom-0 right-0"><figure className="ie-wave-6-top-left d-none  d-lg-block mb-0">
                                <img src={abstractShape} alt="Image Description" /></figure>
                            </div>
                        </Row>
                    </Container>
                </section>
            }
            <Container>

                <div className=" space-2 space-lg-3 space-md-2">

                    <div className="w-md-80 w-lg-70 mb-5">
                        <h2 className="display-5 font-weight-bold"> Top specialties searched this month</h2>
                    </div>

                    <div id="featuresSVG" className=" mb-5">
                        <div className="row mx-n2">
                            <div style={{ cursor: 'pointer' }} onClick={() => handleHomeBlockSearch('Primary Care Doctor', 'cash pay')} className="col-12 col-sm-6 col-lg-4 col-xl-3 px-2 mb-3 mt-3 mb-sm-0">
                                <div className=" bg-primary-care rounded rounded-box-2 px-4 pt-4 h-180">
                                    <h3 className="h5 mb-3">Primary Care</h3>
                                    <p className="font-size-1 mb-3 pb-5 text-white">Top health care providers in New York for day-to-day healthcare.</p>

                                </div>

                            </div>

                            <div style={{ cursor: 'pointer' }} onClick={() => handleHomeBlockSearch('OB-GYN', 'cash pay')} className="col-12 col-sm-6 col-lg-4 col-xl-3 px-2 mb-4 mt-3 mb-sm-0">

                                <div className=" bg-obgyn rounded rounded-box-2 px-4 pt-4 h-180">
                                    <h3 className="h5 mb-3">OBGYN</h3>
                                    <p className="font-size-1 mb-3  pb-5 text-white">Top obstetrics and gynecology specialists for women’s health care.</p>

                                </div>

                            </div>

                            <div style={{ cursor: 'pointer' }} onClick={() => handleHomeBlockSearch('Dentist', 'cash pay')} className="col-12 col-sm-6 col-lg-4 col-xl-3 px-2 mb-4 mt-3 mb-sm-0">

                                <div className=" bg-dentist rounded rounded-box-2 px-4 pt-4 h-180">
                                    <h3 className="h5 mb-3">Dentist </h3>
                                    <p className="font-size-1 mb-3  pb-5 text-white">Top Dentists for diagnosis, prevention, and treatment and care of the teeth and gums.</p>

                                </div>

                            </div>

                            <div style={{ cursor: 'pointer' }} onClick={() => handleHomeBlockSearch('Dermatologist', 'cash pay')} className="col-12 col-sm-6 col-lg-4 col-xl-3 px-2 mb-3 mt-3 mb-sm-0">

                                <div className=" bg-dermatologist rounded rounded-box-2 px-4 pt-4 h-180">
                                    <h3 className="h5 mb-3">Dermatologist </h3>
                                    <p className="font-size-1 mb-3  pb-5 text-white">Top Dermatologists for treatment and care of skin, hair, and nails.</p>
                                </div>
                            </div>

                            <div style={{ cursor: 'pointer' }} className="col-12 col-sm-6 col-lg-4 col-xl-3 px-2 mb-3 mt-3 mb-sm-0">

                                <div onClick={() => handleHomeBlockSearch('Ophthalmologist', 'cash pay')} className=" bg-eye rounded rounded-box-2 px-4 pt-4 h-180">
                                    <h3 className="h5 mb-3">Ophthalmologist</h3>
                                    <p className="font-size-1 mb-3  pb-5 text-white">Top surgeons and specialists providing eye care.</p>

                                </div>

                            </div>

                            <div style={{ cursor: 'pointer' }} onClick={() => handleHomeBlockSearch('ENT Specialist', 'cash pay')} className="col-12 col-sm-6 col-lg-4 col-xl-3 px-2 mb-3 mt-3 mb-sm-0">

                                <div className=" bg-ent rounded rounded-box-2 px-4 pt-4 h-180">
                                    <h3 className="h5 mb-3">ENT</h3>
                                    <p className="font-size-1 mb-3  pb-5 text-white">Top specialists for the care of the ear, nose and throat.</p>

                                </div>

                            </div>

                            <div style={{ cursor: 'pointer' }} className="col-12 col-sm-6 col-lg-4 col-xl-3 px-2 mb-3 mt-3 mb-sm-0">

                                <div onClick={() => handleHomeBlockSearch('Nutritionist', 'cash pay')} className=" bg-nutritionist rounded rounded-box-2 px-4 pt-4 h-180">
                                    <h3 className="h5 mb-3">Nutritionist</h3>
                                    <p className="font-size-1 mb-3  pb-5 text-white">Top specialists in fitness, nutrition and their impacts on health.</p>

                                </div>

                            </div >

                            <div style={{ cursor: 'pointer' }} className="col-12 col-sm-6 col-lg-4 col-xl-3 px-2 mb-3 mt-3 mb-sm-0">

                                <div onClick={() => handleHomeBlockSearch('Cardiologist', 'cash pay')} className=" bg-allergy rounded rounded-box-2 px-4 pt-4 h-180">
                                    <h3 className="h5 mb-3">Cardiologist</h3>
                                    <p className="font-size-1 mb-3  pb-5 text-white">Top surgeons and specialists for conditions related to the heart.</p>

                                </div>

                            </div >
                        </div >
                    </div >
                    <div className="mx-lg-auto mb-10">

                        <div id="paymentDetails" className="accordion">

                            <div id="cardHeadingOne">

                                <div className=" btn-link btn-block text-center card-btn  "
                                >

                                    <span style={{ cursor: "pointer" }} onClick={() => sethometable(!hometable)}>View all specialties </span>
                                    <span className="fas fa-angle-right align-middle" />
                                </div>
                            </div>
                        </div>

                        <div className="row mx-n2 mt-3">
                            <div id="cardOne" className={`collapse w-100 ${hometable ? 'show' : ''}`} aria-labelledby="cardHeadingOne" data-parent="#paymentDetails">
                                <div className="card-body w-100">

                                    <div className="row">

                                        {
                                            PrimarySpeciality.speciality.map((item, key) => {
                                                return (

                                                    <div key={key} className="col-sm-12 col-lg-4 p-0">
                                                        <a className="list-docotr-specialties" style={{ cursor: "pointer" }} onClick={() => handleHomeBlockSearch(item.name, 'cash pay')}>{item.name} </a>
                                                    </div>

                                                )
                                            })
                                        }

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div >
            </Container>

            {/* {data.discover &&
                <Discover
                    className="py-6 "
                    title={data.discover.title}
                    subTitle={data.discover.subTitle}
                    blocks={data.discover.blocks}
                />
            } */}


            <figure>
                <svg
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    width="100%"
                    height="100px"
                    viewBox="0 0 1921 273"
                    style={{
                        marginBottom: '-16px'
                        , enableBackground: 'new 0 0 1921 273'
                    }}
                    xmlSpace="preserve" >
                    <polygon
                        className="fill-related-2"
                        points="0,273 1921,273 1921,0 " />
                </svg>
            </figure>


            <div className="position-relative bg-light-3" >
                <div className="container space-2 space-lg-3" >
                    <div className="row align-items-center" >
                        <div className="col-lg-6 mb-9 mb-lg-0" >
                            <div className="pr-lg-2">
                                <h2 className="display-5 font-weight-bold">How Smart Appointment Benefits your Practice</h2>
                            </div>



                            <div className="row">
                                <div className="col-sm-6">

                                    <ul className="list-unstyled">
                                        <li className="media pb-3">
                                            <span className=" btn-sm  icon-circles btn-soft-danger rounded-circle mr-4">

                                                <span className="fas fa-user-clock btn-icon__inner" />
                                            </span>
                                            <div className="media-body">
                                                <p className="text-dark mb-0">Increase patient satisfaction and retention</p>
                                            </div>
                                        </li>

                                        <li className="media pb-3">
                                            <span className="btn btn-sm icon-circles btn-soft-success rounded-circle mr-4">
                                                <span className="far fa-clock btn-icon__inner" />
                                            </span>

                                            <div className="media-body">
                                                <p className="text-dark mb-0">Reduce overhead expense</p>
                                            </div>
                                        </li>

                                    </ul>

                                </div>

                                <div className="col-sm-6">
                                    <ul className="list-unstyled">

                                        <li className="media pb-3">
                                            <span className="btn btn-sm icon-circles  btn-soft-primary rounded-circle mr-4">

                                                <span className="fas fa-piggy-bank btn-icon__inner" />
                                            </span>
                                            <div className="media-body">
                                                <p className="text-dark mb-0">Harness the power of social media</p>
                                            </div>
                                        </li>


                                        <li className="media pb-3">
                                            <span className="btn btn-sm icon-circles btn-soft-success rounded-circle mr-4">

                                                <span className="far fa-thumbs-up btn-icon__inner" />
                                            </span>

                                            <div className="media-body">
                                                <p className="text-dark mb-0">Increase practice profitability</p>
                                            </div>
                                        </li>
                                    </ul>

                                </div>
                            </div>
                            <div className="mb-6">
                                <Link href="/PracticeBenefit">
                                    <a>Click here to discover the benefits of using smart appointment</a>
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-5">

                            <div id="" className="text-center pt-6 pb-6">
                                <img className="img-fluid" src={docPng} alt="Image" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* <figure>
                <svg
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    width="100%"
                    height="100px"
                    viewBox="0 0 1921 273"
                    style={{ marginBottom: '-16px', enableBackground: 'new 0 0 1921 273' }}
                    xmlSpace="preserve" >
                    <polygon
                        className="fill-related-2"
                        points="0,273 1921,273 1921,0 " />
                </svg>
            </figure> */}




            <div className="position-relative bg-light-3" >

                <div className="container space-2 space-lg-3" >
                    <div className="row align-items-center" >
                        <div className="col-lg-7 mb-9 mb-lg-0" >
                            <div className="pr-lg-4" >
                                <h2 className="display-5 font-weight-bold" > Patient Benefits </h2>
                            </div>


                            <div className="row">
                                <div className="col-sm-6 col-lg-6 mb-5">
                                    <div className="media">
                                        <span className="btn btn-sm  btn-soft-primary rounded-circle mr-3" style={{ height: '1.5rem', width: '1.5rem' }}>

                                        </span>
                                        <div className="media-body">
                                            <h3 className="h6">Find highly rated doctors in your area</h3>
                                            <p>Select the right doctor for you based on reviews from other patients. </p>
                                        </div>
                                    </div>

                                </div>

                                <div className="col-sm-6 col-lg-6 mb-5">

                                    <div className="media">
                                        <span className="btn btn-sm  btn-soft-primary rounded-circle mr-3" style={{ height: '1.5rem', width: '1.5rem' }}>

                                        </span>
                                        <div className="media-body">
                                            <h3 className="h6">Book appointment instantaneously</h3>
                                            <p> No more waiting for the practice to confirm your appointment.</p>
                                        </div>
                                    </div>

                                </div>

                                <div className="col-sm-6 col-lg-6 mb-5">

                                    <div className="media">
                                        <span className="btn btn-sm  btn-soft-primary rounded-circle mr-3" style={{ height: '1.5rem', width: '1.5rem' }}>

                                        </span>
                                        <div className="media-body">
                                            <h3 className="h6">Instantly verify your insurance </h3>
                                            <p> No more last-minute surprises about coverage - make sure your doctor accepts your insurance before your appointment.</p>
                                        </div>
                                    </div>

                                </div>

                                <div className="col-sm-6 col-lg-6 mb-5">

                                    <div className="media">
                                        <span className="btn btn-sm  btn-soft-primary rounded-circle mr-3" style={{ height: '1.5rem', width: '1.5rem' }}>

                                        </span>
                                        <div className="media-body">
                                            <h3 className="h6">Get referred to specialists/consultants seamlessly</h3>
                                            <p>Your primary care provider can instantly book your appointment with a specialist.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-6 col-lg-6 mb-7">

                                    <div className="media">
                                        <span className="btn btn-sm  btn-soft-primary rounded-circle mr-3" style={{ height: '1.5rem', width: '1.5rem' }}>

                                        </span>
                                        <div className="media-body">
                                            <h3 className="h6">Get notified if the doctor is running late</h3>
                                            <p>Receive SMS text alerts if your doctor is delayed, and spend less time in the waiting room.</p>

                                        </div>
                                    </div>

                                </div>

                                <div className="col-sm-6 col-lg-6 mb-7">

                                    <div className="media">
                                        <span className="btn btn-sm  btn-soft-primary rounded-circle mr-3" style={{ height: '1.5rem', width: '1.5rem' }}>

                                        </span>
                                        <div className="media-body">
                                            <h3 className="h6">Share your reviews on Facebook</h3>
                                            <p>Let your friends and family know about your experience.</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5">

                            <div id="" className="text-center pt-5 pb-5">

                                <img className="img-fluid" src={patientPng} alt="Image" />

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 
            {data.bottomBlock &&
                <section className="py-6 bg-gray-100">
                    <Container>
                        <Row>
                            <Col
                                lg="6"
                                className="mb-5 mb-lg-0 text-center text-lg-left"
                            >
                                <p className="subtitle text-secondary">
                                    {data.bottomBlock.title}
                                </p>
                                <p className="text-lg">
                                    {data.bottomBlock.subTitle}
                                </p>
                                <p className="text-muted mb-0">
                                    {data.bottomBlock.content}
                                </p>
                            </Col>
                            <Col
                                lg="6"
                                className="d-flex align-items-center justify-content-center"
                            >
                                <div className="text-center">
                                    <p className="mb-2">
                                        <Link href={data.bottomBlock.buttonLink}>
                                            <Button
                                                href={data.bottomBlock.buttonLink}
                                                color="primary"
                                                size="lg"
                                                className="btn-btn-nw font-w500 font-08r"
                                            >
                                                {data.bottomBlock.button}
                                            </Button>
                                        </Link>
                                    </p>
                                    <p className="text-muted text-small">
                                        {data.bottomBlock.small}
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            } */}

            {/* <Instagram /> */}
        </React.Fragment>
    )
}

export default Index;