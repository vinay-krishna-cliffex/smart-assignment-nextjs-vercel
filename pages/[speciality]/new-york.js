import React, { Component } from 'react';
// import firebase from '../../utils/Fire';
import dynamic from 'next/dynamic'
import UseWindowSize from '../../hooks/UseWindowSize'
import 'react-dates/initialize'
import Select from 'react-select'
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { GET_DOCTOR_LIST_REQUEST } from '../../actions/Action';
import Filter from '../../components/Filter';
import axios from 'axios';
import { Baseurl } from '../../utils/Baseurl';
import Router from 'next/router'
import defaultImage from '../../images/images.jpeg';
import Head from 'next/head'
// import queryString from 'query-string';
import ReactHtmlParser from 'react-html-parser';
var decode = require('decode-html');

import {
    Container,
    Row,
    Col,
    Form,
    Input,
    Label,
    Collapse,
    Button,
    CustomInput
} from 'reactstrap'

import CardRoom from '../../components/CardRoom'


let Map

Modal.setAppElement('#__next')
Modal.defaultStyles.overlay.backgroundColor = 'rgb(0 0 0 / 50%)';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        borderRadius: '8px',
        maxWidth: '548px',
        border: 'none'
    }
};

const data = [
    { name: "Primary Care Doctor" }, { name: "OB-GYN" }, { name: "Dentist" }, { name: "Dermatologist" }, { name: "Ophthalmologist" }, { name: "ENT Specialist" }, { name: "Nutritionist" }, { name: "Cardiologist" },
    { name: "Acupuncturist" }, { name: "Aesthetic medicine" }, { name: "Allergist" }, { name: "Audiologist" }, { name: "Cardiothoracic Surgeon" },

    { name: "Chiropractor" }, { name: "Colorectal Surgeon" }, { name: "Dietitian" }, { name: "Endocrinologist" }, { name: "Eye Surgeon" },

    { name: "Gastroenterologist" }, { name: "General surgeon" }, { name: "Geriatrician" }, { name: "Hematologist and Oncologist" }, { name: "Infectious Disease Specialist" },

    { name: "Infertility specialist" }, { name: "Midwife" }, { name: "Mental health specialist" }, { name: "Nephrologist" }, { name: "Neurosurgeon" },

    { name: "Gynecologist" }, { name: "Optometrist" }, { name: "Oral Surgeon" }, { name: "Orthodontist" }, { name: "Orthopedic Surgeon" },

    { name: "Pain Management specialist" }, { name: "Pediatric Dentist" }, { name: "Pediatrician" }, { name: "Pshycholgist" }, { name: "Physiatrist" },

    { name: "Physical Therapist" }, { name: "Podiatrist" }, { name: "Prosthodontist" }, { name: "Psychiatrist" }, { name: "Psychologist" },

    { name: "Psychotherapist" }, { name: "Pulmonologist" }, { name: "Plastic Surgeon" }, { name: "Radiologist" }, { name: "Rheumatologist" },
    { name: "Sleep Medicine Specialist " }, { name: "Sports Medicine Specialist" }, { name: "Urologist" }, { name: "Urgent care specialist" }, { name: "Vascular Surgeon" }
]

export const getStaticPaths = async () => {
    
    const paths = data.map(obj => {
        let string = obj.name
        let specialityData = ''
        for (var i = 0; i < string.length; i++) {
            if (string.charAt(i) === ' ') {
                specialityData = specialityData + '-'
            } else {
                specialityData = specialityData + string.charAt(i)
            }
        }
        return {
            params: { speciality: specialityData.toLowerCase() }
        }
    })
    return {
        paths,
        fallback: false
    }
};

export const getStaticProps = async (context) => {
    const name = context.params.speciality;
    // const res = await fetch(`${Baseurl}api/user/get_payers`);
    // const data = await res.json();
    return {
        props: { staticSpeciality: name }
    }
};


class Specility extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            mainData: [],
            doctorsResults: [],
            practiceList: [],
            pracList: [],
            docList: [],
            practiceNameForShow: '',
            specialityData: [],
            docdropdownlist: [],
            docfilterData: [],
            insurance_provider: '',
            insuranceProviderArr: [],
            speciality: '',
            zip: '',
            zipList: [],
            practiceName: '',
            consult_at: '',
            filter: {
                gender: [],
                hospital_affiliation: [],
                languages: []
            },
            isModal: false,
            zipDoctors: [],
            zipDropdown: false,
            zipcheckArr: [],
            isOpen: false,
            specialityLoader: false,

            activeMarker: {},
            selectedPlace: {},
            showingInfoWindow: false,
            ismapFixed: '',
            isLoading: false,
            activeUseronMarker: {},
            pataintPayerCode: '',
            mapLoaded: false,
            tap: false,
            dragging: false,
            hoverCard: null,
            htmlContent: '',
            htmlMetaTag: '',
            htmlTittle: '',
            htmlMetaDescription: ''

        }
        this.scrollIcon = React.createRef();
        this.handleZipInputClick = this.handleZipInputClick.bind(this);
        this.hideZipDropdown = this.hideZipDropdown.bind(this);
    }

    onCardEnter = (value) => {
        this.setState({ hoverCard: value.uid });
        this.handleShowActiveMarkerOnHover(value);
    }

    onCardLeave = () => {
        this.setState({ hoverCard: null });
        this.handleonMounseOut();
    }

    componentDidMount() {

        // console.log("componentDidMount router", window.location.search.split('/')[0].substring(1))

        window.addEventListener('scroll', this.handleScroll);
        const size = new UseWindowSize()
        Map = dynamic(
            () => import('../../components/Map'),
            { ssr: false }
        )
        this.setState({ mapLoaded: true })
        this.setState({ tap: size.width > 700 ? true : false })
        this.setState({ dragging: size.width > 700 ? true : false })
        let id = localStorage.getItem('uidp');
        id !== null &&
            axios({
                method: 'get',
                url: Baseurl + `api/user/getuserdetails?userId=${id}`,
                headers: { 'content-type': 'application/json' }
            }).then((res) => {
                this.setState({ pataintPayerCode: res.data.user.payerCode });
            }).catch((error) => {
                console.log("get-user-details-error", error);
            })


        let valuesTesting = JSON.parse(localStorage.getItem('homeQuerys'));
        console.log("////////////", valuesTesting)
        let length = window.location.pathname.length - 9
        var windowValue = window.location.pathname.substring(1, length);

        let string = windowValue;
        let specility = ''
        for (var i = 0; i < string.length; i++) {
            if (string.charAt(i) === '-') {
                specility = specility + ' '
            }
            else {
                specility = specility + string.charAt(i)
            }
        }

        // windowValue = specility;
        //   console.log("111111111111111111", windowValue)
        let compare = specility;
        console.log("111111111111111111", compare)
        for(var i=0; i < data.length; i++){
            //console.log("111111111111111111", data[2].name.toLowerCase(),compare)
            if(data[i].name.toLowerCase() == compare){
                console.log("compare",data[i].name,compare)
                windowValue = data[i].name
            }else{
                console.log('=====>',i,data[i].name);
            }
        }
        if (valuesTesting && valuesTesting.insurance_provider && valuesTesting.name !== windowValue) {
            let data = { name: windowValue, practice_name: '', insurance_provider: 'cash-pay', zip: '', consultAt: '' }
            localStorage.setItem("homeQuerys", JSON.stringify(data));
        } else if (!valuesTesting) {
            let data = { name: windowValue, practice_name: '', insurance_provider: 'cash-pay', zip: '', consultAt: '' }
            localStorage.setItem("homeQuerys", JSON.stringify(data));
        }

        let values = JSON.parse(localStorage.getItem('homeQuerys'));
        // console.log("componentDidMount", values)
        if (values) {
            this.setState({ speciality: values.name, practiceName: '', insurance_provider: 'cash pay', zip: '', consult_at: '' }, () => {
                this.props.handlegetDocList({ insurance_provider: '', specaility: '', practice: '' });
                !values.consultAt && this.handleGetZipDoctors('', this.state.speciality, this.state.zip, this.state.practiceName);
            }
            );
        }

        if (values.name) {
            this.handleHtmlData(values.name)
        }

        this.handleGetPayersFromPverify();
    }

    createViewProfileItem = (id) => {
        localStorage.setItem("viewProfileId", id)
        // Router.push({ pathname: `/viewProfile`, query: { id: id } })
        Router.push(`/viewProfile?${id}`)
    }


    /*---------------------------handle--map-scroll---------------------------------*/

    // handleScroll = () => {
    //     if (this.scrollIcon !== null) {
    //         if (window.pageYOffset < 280) {
    //             this.scrollIcon.className = 'doctor_map_container';
    //         } else {
    //             this.scrollIcon.className = 'doctor_map_container_fixed';
    //         }
    //     }
    // }



    /*--------------------------------------getInsurance-provider from p-verify-----------------------------------------*/

    handleGetPayersFromPverify = () => {
        axios({
            method: 'get',
            url: Baseurl + 'api/user/get_payers',
            headers: { 'content-type': 'application/json' }
        }).then((res) => {
            // console.log("response-------->", res.data);
            const arr = [{ value: "cash pay", label: "Self Pay" }];

            res.data.map((obj) => {
                arr.push({ value: obj.payerName, label: obj.payerName })
            })
            this.setState({ insuranceProviderArr: arr });

        }).catch((error) => {
            console.log("error -------->");
        })
    }


    /*-----------------------------------------------handle-doc-name-onchange------------------------------------------------------*/

    handleDocNameOnChange = (e) => {
        var q = e.target.value.toLowerCase();

        let filterLocation = this.state.pracList.filter(data => {
            return data.practice_name.toLowerCase().includes(q);
        });

        let filterDoctor = this.state.docList.filter(dataIs => {
            let name = `${dataIs.first_name} ${dataIs.last_name}`;
            return name.toLowerCase().includes(q)
        });

        if (e.target.value.length > 2) {
            this.setState({ practiceName: e.target.value, doc_dropDownDisplay: true, practiceList: filterLocation, doctorsResults: filterDoctor });
        } else {
            this.setState({ practiceName: e.target.value, doc_dropDownDisplay: false });
        }
    };



    // /*------------------------------------------------------handle-zip-dropdown--------------------------------------------------*/


    handleZipInputClick = () => {
        this.setState({ zipDropdown: false }, () => {
            document.addEventListener('click', this.hideZipDropdown);
        });
    }


    hideZipDropdown = () => {
        this.setState({ zipDropdown: false }, () => {
            document.removeEventListener('click', this.hideZipDropdown);
        });

    }



    /*------------------------------------------------------handle-doc-search-drop-down--------------------------------------------------*/


    opendocSearchDropDown = () => {
        this.setState({ doc_dropDownDisplay: false }, () => {
            document.addEventListener('click', this.hidedocSearchDropDown);
        });
    }

    hidedocSearchDropDown = () => {
        this.setState({ doc_dropDownDisplay: false }, () => {
            document.removeEventListener('click', this.hidedocSearchDropDown);
        });
    }

    componentWillUnmount = () => {
        document.removeEventListener('click', this.hidedocSearchDropDown);
        document.removeEventListener('click', this.hideZipDropdown);
        window.removeEventListener('scroll', this.handleScroll);
    };


    handleOptionsClick = (name) => {
        this.setState({ specaility: name });
    }

    /*-----------------------------------------------handle-seach-doctor-list------------------------------------------------------*/

    handleSearchDoc = (e) => {
        e.preventDefault();
        this.setState({ practiceNameForShow: this.state.practiceName });
        // let values = Router.query;
        let values = JSON.parse(localStorage.getItem('homeQuerys'));

        // console.log('this.state', this.state);

        if (this.state.insurance_provider === '') {
            this.setState({ isModal: true });
        }
        else {
            if (values && values.consultAt.length > 0) {
                let data = { name: this.state.speciality, practice_name: this.state.practiceName, insurance_provider: this.state.insurance_provider, zip: this.state.zip, consultAt: values.consultAt }
                localStorage.setItem("homeQuerys", JSON.stringify(data));
                // let insuranceData = this.state.insurance_provider.replace(' ', '_');
                let string = this.state.insurance_provider
                let insuranceData = ''
                for (var i = 0; i < string.length; i++) {
                    if (string.charAt(i) === ' ') {
                        insuranceData = insuranceData + '_'
                    } else {
                        insuranceData = insuranceData + string.charAt(i)
                    }
                }
                Router.router.push(`/doctors?${insuranceData}`),
                    this.componentDidMount();
            }
            else {
                let data = { name: this.state.speciality, practice_name: this.state.practiceName, insurance_provider: this.state.insurance_provider, zip: this.state.zip, consultAt: "" }
                localStorage.setItem("homeQuerys", JSON.stringify(data));
                // let insuranceData = this.state.insurance_provider.replace(' ', '_');
                let string = this.state.insurance_provider
                let insuranceData = ''
                for (var i = 0; i < string.length; i++) {
                    if (string.charAt(i) === ' ') {
                        insuranceData = insuranceData + '_'
                    } else {
                        insuranceData = insuranceData + string.charAt(i)
                    }
                }
                Router.router.push(`/doctors?${insuranceData}`),
                    this.componentDidMount();
            }
        }
    }


    // /*----------------------------handleShowActiveMarkerOnHover------------------------------*/

    handleShowActiveMarkerOnHover = (value) => {
        this.setState({ activeUseronMarker: value })
    }

    /*------------------------------------------handleonMounseOut-----------------------------------------*/

    handleonMounseOut = () => {
        this.setState({ activeUseronMarker: {} })
    }

    /*-----------------------------------------------handle-render-doctor-list------------------------------------------------------*/

    renderDocList = () => {
        if (this.state.docfilterData.length === 0) {
            return (
                <Col
                    sm="6"
                    className="mb-5 hover-animate"
                >
                    <h4 className="text-center" style={{ color: 'rgb(0, 35, 75)', fontWeight: 'bold' }}>We couldn't find doctors  or practices for you</h4>
                    <p className="text-center"> {this.state.practiceNameForShow ? `Your search for text search in  ${this.state.practiceNameForShow}  didn't match anything.` : ''}</p>
                </Col>
            )
        }
        else {
            return this.state.docfilterData.map((value, key) => {
                return <div key={key}
                    className="mb-5 hover-animate col-md-6  col-lg-12 col-xl-6"
                    onMouseEnter={() => this.onCardEnter(value)}
                    onMouseLeave={() => this.onCardLeave()}
                >
                    <CardRoom
                        //  data={room.properties} 
                        key={key}
                        doc_name={`${value.first_name} ${value.last_name}`}
                        primary_speciality={value.primary_speciality}
                        doc_image={value.profile_image}
                        location={value.practice}
                        id={value.uid}
                        pataintPayerCode={this.state.pataintPayerCode}
                        reviewAverage={value.reviewAverage}
                        reviewLength={value.reviewLength}
                        latastReview={value.latastReview}
                        insurance_providers={value.insurance_providers}
                        distance={value.zip_distance && value.zip_distance > 0 ? `${value.zip_distance} miles` : ''}
                    />

                </div>

            })
        }
    }

    getFromPracticeNameOrDoctorName = (list, values) => {
        let docFromPracticeName = list.filter(data => {
            return data.practice.find(pract => pract.practice_name.toLowerCase().includes(values.practice_name.toLowerCase()))
        });

        let docFromName = list.filter(data => {
            let name = `${data.first_name} ${data.last_name}`;
            return name.toLowerCase().includes(values.practice_name.toLowerCase());
        });

        let newDocList = docFromPracticeName.filter(value => {
            return docFromName.length ? docFromName.some(val => val.uid !== value.uid) && value : value
        });

        return [...docFromName, ...newDocList]
    };

    // /*-----------------------------------------------handle-componentWillRecieveProps------------------------------------------------------*/

    UNSAFE_componentWillReceiveProps(props) {

        let id = localStorage.getItem('uidp');
        // let values = "";
        // let values = Router.query;
        let values = JSON.parse(localStorage.getItem('homeQuerys')) ? JSON.parse(localStorage.getItem('homeQuerys')) : Router.query;
        // console.log("UNSAFE_componentWillReceiveProps", values)
        let doctorListResult = [];
        // console.log("values issss",values)
        let arr = [];
        let zipCodes = [];
        let zipArr = [];
        props.doctorslist.map(value => {
            return arr = arr.concat(value.speciality);
        });


        let newSpecialityArr = arr.filter((a, b) => arr.indexOf(a) === b);

        let specialitydataFilter = props.doctorslist.filter(data => data.speciality.find(special => special === values.name));

        if (values.name) {
            doctorListResult = values.practice_name ?
                this.getFromPracticeNameOrDoctorName(props.doctorslist, values)
                :
                values.zip ?
                    props.doctorslist.filter(data => data.practice.find(value => value.zip === values.zip))
                    :
                    specialitydataFilter
        }
        else if (values.practice_name) {
            doctorListResult = this.getFromPracticeNameOrDoctorName(props.doctorslist, values)
        }
        else if (values.zip) {
            doctorListResult = props.doctorslist.filter(data => data.practice.find(value => value.zip === values.zip));
        }
        else {
            doctorListResult = props.doctorslist
        }


        let isSpeciality = specialitydataFilter.length > 0 ? specialitydataFilter : props.doctorslist;
        let zipdata = doctorListResult.map(value => {
            return value.practice;
        })

        zipdata.map(data => {
            return zipCodes.push(...data);
        });

        zipCodes.map(value => {
            zipArr = zipArr.concat(value.zip);
        });

        let uniqueZip = [...new Set(zipArr)];

        const sortZipData = uniqueZip.sort((a, b) => {
            var keyA = a,
                keyB = b;
            if (keyA < keyB) return -1;
            if (keyB > keyA) return 1;
            return 0;
        });

        /*----------------------spread all practice-list-----------------------------*/



        let Parr = [];
        let practiceArr = doctorListResult.map(value => {
            return value.practice;
        })

        practiceArr.map(d => {
            return Parr.push(...d);
        });

        var handleDuplicateLocation = Parr.reduce((unique, o) => {
            if (!unique.some(obj => obj.practice_name === o.practice_name && obj.zip === o.zip)) {
                unique.push(o);
            }
            return unique;
        }, []);



        if (values.consultAt) {
            axios({
                method: 'get',
                url: Baseurl + `api/consult/get_consult?id=${id}&time=${values.consultAt}`,
                headers: { 'content-type': 'application/json' }
            }).then((res) => {
                let interestedDoc = JSON.parse(res.data.data.interested);

                const initialFilter = interestedDoc.map(int => {
                    const filtered = doctorListResult.filter(d => d.uid === int.docId);
                    return filtered.length ? filtered[0] : null
                });

                const docListFilter = initialFilter.filter(v => v !== null);


                let consult_arr = [];
                docListFilter.map(value => {
                    return consult_arr = consult_arr.concat(value.speciality);
                })

                let consult_newSpecialityArr = consult_arr.filter((a, b) => arr.indexOf(a) === b);


                let consult_Parr = [];
                let consult_zipArr = [];

                let consultpracticeArr = doctorListResult.map(value => {
                    return value.practice;
                })

                consultpracticeArr.map(d => {
                    return consult_Parr.push(...d);
                });


                consult_Parr.map(data => {
                    consult_zipArr = consult_zipArr.concat(data.zip);
                })

                let consult_uniqueZip = [...new Set(consult_zipArr)];

                const sortConsultZipData = consult_uniqueZip.sort((a, b) => {
                    var keyA = a,
                        keyB = b;
                    if (keyA < keyB) return -1;
                    if (keyB > keyA) return 1;
                    return 0;
                });

                var consult_handleDuplicateLocation = consult_Parr.reduce((unique, o) => {
                    if (!unique.some(obj => obj.practice_name === o.practice_name && obj.zip === o.zip)) {
                        unique.push(o);
                    }
                    return unique;
                }, []);


                // console.log("consult_newSpecialityArr.sort()", consult_newSpecialityArr.sort())
                this.setState({
                    data: docListFilter.length > 0 ? docListFilter : [],
                    docfilterData: docListFilter.length > 0 ? docListFilter : [],
                    docdropdownlist: props.searchDocResult,
                    specialityData: consult_newSpecialityArr.sort(),


                    doctorsResults: docListFilter.length > 0 ? docListFilter : [],
                    docList: docListFilter.length > 0 ? docListFilter : [],
                    practiceList: consult_handleDuplicateLocation,
                    pracList: consult_handleDuplicateLocation,
                    zipList: sortConsultZipData,
                    specialityLoader: props.isLoading
                }
                    // , () => {
                    //     this.state.zip && this.handleGetZipDoctors(this.state.zip);
                    // }
                )

            }).catch((error) => {
                console.log("get-interested-doc-error------>", error);
            })
        }
        else {

            const sortDocfilterData = doctorListResult.sort((a, b) => {
                var keyA = a.reviewAverage,
                    keyB = b.reviewAverage;
                if (keyB < keyA) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });

            const array = [{ value: "", label: "All" }];
            newSpecialityArr.sort().map((obj) => {
                array.push({ value: obj, label: obj })
            })

            this.setState({
                data: props.doctorslist.length > 0 ? props.doctorslist : [],
                docdropdownlist: props.searchDocResult,
                specialityData: array,
                doctorsResults: sortDocfilterData.length > 0 ? sortDocfilterData : [],
                docList: sortDocfilterData.length > 0 ? sortDocfilterData : [],
                practiceList: handleDuplicateLocation,
                pracList: handleDuplicateLocation,
                specialityLoader: props.isLoading
                // zipList: sortZipData,
            }
                // , () => {
                //     this.state.zip && this.handleGetZipDoctors(this.state.zip);
                // }
            );
        }

    }



    handleSetfilterOptions = () => {
        let filterArr = [
            // { name: 'Illness' },
            { name: 'Gender' },
            // { name: 'Availability' },
            { name: 'Hospital Affiliation' },
            // { name: 'Special Hours' },
            // { name: 'Child Friendly' },
            // { name: 'Languages' },
        ];

        let gender = [];
        let languages = [];
        let affiliation = [];

        var uniqueArray_validater = (arr) => {
            const stringifiedArray = arr.map((item) => JSON.stringify(item));
            const set = new Set(stringifiedArray);
            return Array.from(set).map((item) => JSON.parse(item));
        }

        if (this.state.docfilterData.length > 0) {

            this.state.docfilterData.map((value) => {

                if (value.gender) {
                    gender.push(value.gender);
                }
                if (value.languages) {

                    value.languages.map(v => {
                        languages.push(v);
                        return null;
                    })
                }
                if (value.hospital_affiliations) {
                    value.hospital_affiliations.map(v => {
                        affiliation.push(v);
                        return null;
                    })
                }

                return null;
            })

            /*-------------------gender-unique---------------------------*/

            const gArr = uniqueArray_validater(gender);

            /*-------------------languages-unique---------------------------*/

            const lArr = uniqueArray_validater(languages);

            /*-------------------languages-unique---------------------------*/

            const aArr = uniqueArray_validater(affiliation);


            /*-------------------set-filter-data---------------------------*/

            // this.state.filterArr

            filterArr.map((value) => {

                if (value.name === "Gender") {
                    value.filterData = gArr;
                }
                if (value.name === 'Languages') {
                    value.filterData = lArr;
                }
                if (value.name === 'Hospital Affiliation') {
                    value.filterData = aArr;
                }
                return null;
            });

            return filterArr.map((val, key) => {
                return <Filter key={key}
                    filterData={val}
                    filterApply_Handler={this._handleFilterApply}
                    setFilterState={this.setFilterState} />
            })

        }
        else {
            return null;
        }
    }



    setFilterState = (state, value) => {
        state = state.replace('CheckedArr', '');
        this.setState(({ filter }) => ({ filter: { ...filter, [state]: value } }));
    };



    multiPropsFilter = (products, filters) => {
        const filterKeys = Object.keys(filters);
        return products.filter(product => {
            return filterKeys.every(key => {
                if (!filters[key].length) return true;
                // Loops again if product[key] is an array (for material attribute).
                if (Array.isArray(product[key])) {
                    return product[key].some(keyEle => filters[key].includes(keyEle));
                }
                return filters[key].includes(product[key]);
            });
        });
    };



    // /*-----------------------------------------------handle-filter-of filter-data------------------------------------------------------*/

    _handleFilterApply = () => {
        const { gender, hospital_affiliation, languages } = this.state.filter;

        if (gender.length || hospital_affiliation.length || languages.length) {

            let filters = {};
            filters.isDeleted = [0];
            if (gender.length) { filters.gender = gender }
            if (hospital_affiliation.length) { filters.hospital_affiliations = hospital_affiliation }
            if (languages.length) { filters.languages = languages }

            // console.log('filters', filters);

            this.setState({ docfilterData: this.multiPropsFilter(this.state.data, filters) });

        } else {
            this.setState({ docfilterData: this.state.data });
        }
    }


    /*-------------------------------------handleInsuranceOnchange---------------------------------*/

    handleInsuranceProviderOnchange = (selectedOption) => {
        if (selectedOption.value === 'cash pay') {
            this.setState({ insurance_provider: selectedOption.value }, () => {
                this.props.handlegetDocList({ insurance_provider: '', specaility: '', practice: '' });
            });
        }
        else {
            this.setState({ insurance_provider: selectedOption.value }, () => {
                this.props.handlegetDocList({ insurance_provider: this.state.insurance_provider, specaility: '', practice: '' });
            });
        }

    }

    /*-------------------------------------handleInsuranceOnchange---------------------------------*/

    handleSpecialityOnchange = (selectedOption) => {

        if (selectedOption.value) {
            let filterSpecaility = this.state.data.filter(data => data.speciality.find(special => special === selectedOption.value));
            let Parr = [];
            let practiceArr = filterSpecaility.map(value => {
                return value.practice;
            })

            practiceArr.map(d => {
                return Parr.push(...d);
            });

            var handleDuplicateLocation = Parr.reduce((unique, o) => {
                if (!unique.some(obj => obj.practice_name === o.practice_name && obj.zip === o.zip)) {
                    unique.push(o);
                }
                return unique;
            }, []);

            this.setState({ doctorsResults: filterSpecaility, docList: filterSpecaility, practiceList: handleDuplicateLocation, pracList: handleDuplicateLocation, speciality: selectedOption.value, practiceName: '' });
        }
        else {

            let Parr = [];
            let practiceArr = this.state.data.map(value => {
                return value.practice;
            })

            practiceArr.map(d => {
                return Parr.push(...d);
            });

            var DuplicateLocation = Parr.reduce((unique, o) => {
                if (!unique.some(obj => obj.practice_name === o.practice_name && obj.zip === o.zip)) {
                    unique.push(o);
                }
                return unique;
            }, []);

            this.setState({ doctorsResults: this.state.data, docList: this.state.data, practiceList: DuplicateLocation, pracList: DuplicateLocation, speciality: selectedOption.value, practiceName: '' });
        }
    }





    // /*--------------------------------handleZipOnchange--------------------------*/


    handleZipOnchange = (e) => {
        var pattern = /^\d{5,5}$/;

        if (!pattern.test(e)) {
            //console.log('only 5,5 allowed');
            //this.setState({digitZipToolTip:true });
        }
        this.setState({ zip: e.target.value, practiceName: '', zipDoctors: [], zipDropdown: false });
    }

    // /*--------------------------------handleZipOnCLick--------------------------*/

    handleZipOnCLick = (e, zip) => {
        e.preventDefault();
        this.setState({ zip: zip });
    }


    // /*--------------------------------handlePracticeClick--------------------------*/

    handlePracticeClick = (e, practice) => {
        e.preventDefault();
        this.setState({ practiceName: practice })
    }



    handleSelectInsuranceforModal = () => {
        this.setState({ isModal: false });
    }


    closeModal = () => {
        this.setState({ isModal: false });
    }


    handleHtmlData = (speciality) => {
        axios({
            method: 'get',
            url: Baseurl + `api/seo/getContent?location=California&speciality=${speciality}`,
            headers: { 'content-type': 'application/json' }
        }).then((response) => {
            // console.log("speciality-response-------------------->", response.data.data);
            let res = response.data.data;
            if (res) {
                this.setState({ htmlContent: res.content ? res.content : '', htmlMetaTag: res.metaTag, htmlTittle: res.metaTitle, htmlMetaDescription: res.metaDescription }, () => {
                    // console.log("speciality-response-------------------->", this.state.htmlMetaTag, this.state.htmlTittle, this.state.htmlMetaDescription);
                });
            }
        }).catch((error) => {
            console.log("zip-error----------------------->", error);
        })
    }


    // /*----------------------------------------------handleGetZipDoctors---------------------------------------*/

    handleGetZipDoctors = (insurance, speciality, zip, practice) => {
        this.setState({ isLoading: true });
        axios({
            method: 'get',
            url: Baseurl + `api/doc/search_doctors?ins_provider=${insurance}&speciality=${speciality}&zip=${zip}&dr_name=${practice}`,
            headers: { 'content-type': 'application/json' }
        }).then((response) => {
            // console.log("zip-response-------------------->", response.data.data);

            let zipCodes = [];
            let zipArr = [];


            let zipdata = response.data.data.map(value => {
                return value.practice;
            })

            zipdata.map(data => {
                return zipCodes.push(...data);
            });

            zipCodes.map(value => {
                zipArr = zipArr.concat(value.zip);
            });

            let uniqueZip = [...new Set(zipArr)];

            var sortZipData = uniqueZip.sort(function (a, b) {
                return a > b ? 1 : -1;
            });


            /*-----------------sort by average and distance------------------------*/
            var sortDocfilterData;

            if (zip) {
                sortDocfilterData = response.data.data;
            }
            else {
                sortDocfilterData = response.data.data.sort((a, b) => {
                    var keyA = a.reviewAverage,
                        keyB = b.reviewAverage;
                    if (keyB < keyA) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                });
            }


            this.setState({ isLoading: false, docfilterData: sortDocfilterData, zipList: sortZipData, mainData: response.data.data });
        }).catch((error) => {
            console.log("zip-error----------------------->", error);
            this.setState({ isLoading: false });
        })
    }



    // handleIgnoreZip = () => {
    //     this.setState({ zip: '', zipDoctors: [] });
    //     // this.props.history.push(`/searchdoc?name=${this.state.speciality}&practice_name=${this.state.practiceName}&insurance_provider=${this.state.insurance_provider}&zip=`);
    //     Router.push({
    //         pathname: `/doctors`,
    //         query: { name: this.state.speciality, practice_name: this.state.practiceName, insurance_provider: this.state.insurance_provider, zip: '', consultAt: "" }
    //     });
    //     this.componentDidMount();
    // }



    // /*----------------handle-zipcheckbox------------------------------*/

    handlezipFilterBox = (e) => {

        let index = this.state.zipcheckArr.indexOf(e.target.value);
        if (index < 0) {
            this.state.zipcheckArr.push(e.target.value);
            this.setState({ zipcheckArr: this.state.zipcheckArr })
        }
        else {
            this.state.zipcheckArr.splice(index, 1);
            this.setState({ zipcheckArr: this.state.zipcheckArr })
        }
    }


    // /*--------------------------handle-zip apply button------------------------------*/


    handleAppyZip = () => {

        if (this.state.zipcheckArr.length === 0) {
            this.setState({ docfilterData: this.state.mainData, isOpen: false });
        }
        else {
            let filterzipData = this.state.mainData.filter(value => value.practice.find(data => this.state.zipcheckArr.find(zip => data.zip === zip)));
            this.setState({ docfilterData: filterzipData, isOpen: false });
        }
    }



    handleSortByZip = () => {
        if (this.state.zipList && this.state.zipList.length !== 0) {
            this.setState({ isOpen: !this.state.isOpen });
        }
        else {
            return null;
        }
    }


    handleBackdrop = () => {
        this.setState({ isOpen: false });
    }


    // /*----------------------------------google map actions-----------------------------*/


    onMarkerClick = (props, marker) =>
        this.setState({
            activeMarker: marker,
            selectedPlace: props,
            showingInfoWindow: true
        });

    onInfoWindowClose = () =>
        this.setState({
            activeMarker: null,
            showingInfoWindow: false
        });

    onMapClicked = () => {
        if (this.state.showingInfoWindow)
            this.setState({
                activeMarker: null,
                showingInfoWindow: false
            });
    };

    render() {

        const { mapLoaded, tap, dragging, hoverCard, htmlContent, htmlTittle, htmlMetaTag, htmlMetaDescription } = this.state;

        const displayDropdown = (this.state.doctorsResults.length > 0 && this.state.doc_dropDownDisplay) || (this.state.practiceList.length > 0 && this.state.doc_dropDownDisplay);

        // let values = Router.search;
        const html = '<div>Example HTML string</div><ul><li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li><li>Aliquam tincidunt mauris eu risus.</li><li>Vestibulum auctor dapibus neque.</li></ul>';

        return (
            <React.Fragment>

                <Head>
                    <title> {htmlTittle ? htmlTittle : 'Smart Appointment'} </title>
                    <meta name='description' content={htmlMetaDescription ? htmlMetaDescription : 'Smart Appointment'} />
                    <meta name="keywords" content={htmlMetaTag ? htmlMetaTag : 'Smart Appointment'} />
                </Head>

                <Container fluid>
                    <Row className="reverse-block">
                        <Col
                            lg="6"
                            className="py-4 p-xl-5 sm_full_wid"
                        >
                            {/* <h1 className="text-serif mb-4">Eat in Manhattan, NY</h1>
                            <hr className="my-4" /> */}
                            <Form className="service-provider" data-error="" onSubmit={this.handleSearch} autoComplete="off">
                                <Row className="d-flex align-items-center">
                                    <Col
                                        lg="6"
                                        className="col-xl-6 col-sm-6 mb-4"
                                    >
                                        <label className="form-label" htmlFor="form_search">Insurance</label>
                                        <Select
                                            instanceId="guestSelect"
                                            name="guests"
                                            id="form_INSURANCE"
                                            // defaultValue={this.state.insurance_provider ? { value: this.state.insurance_provider, label: this.state.insurance_provider } :
                                            //     { value: "", label: "Insurance Provider" }}
                                            options={this.state.insuranceProviderArr}
                                            className="form-control dropdown bootstrap-select custom-select"
                                            classNamePrefix="selectpicker"
                                            placeholder={this.state.insurance_provider === "cash pay" ? "Self Pay" : this.state.insurance_provider ? this.state.insurance_provider : "Self Pay"}
                                            onChange={this.handleInsuranceProviderOnchange}
                                        />

                                    </Col>
                                    <Col
                                        lg="6"
                                        className="col-xl-6 col-sm-6 mb-4"
                                    >
                                        <label className="form-label" htmlFor="form_search">Choose Speciality</label>
                                        <Select
                                            instanceId="guestsSelect"
                                            name="guests"
                                            id="form_Speciality"
                                            // defaultValue={this.state.speciality ? { value: this.state.speciality, label: this.state.speciality } :
                                            //     { value: "", label: "Choose Speciality" }}
                                            options={this.state.specialityData}
                                            className="form-control dropdown bootstrap-select custom-select"
                                            classNamePrefix="selectpicker"
                                            placeholder={this.state.speciality ? this.state.speciality : "Choose Speciality"}
                                            onChange={this.handleSpecialityOnchange}
                                        />

                                    </Col>
                                    <Col
                                        lg="6"
                                        className="col-xl-4 col-sm-6 mb-4"
                                    >
                                        <label className="form-label" htmlFor="form_search">Zip Code</label>
                                        <Input id="form_zip" type="text" aria-describedby="emailHelp" placeholder="" onClick={this.handleZipInputClick}
                                            value={this.state.zip} name="zip" min={5} maxLength={5} placeholder="Zip code" onChange={(e) => this.handleZipOnchange(e)}
                                        />

                                    </Col>
                                    <Col
                                        lg="6"
                                        className="col-xl-4 col-sm-6 mb-4">
                                        <label className="form-label" htmlFor="form_search"> Physician Or Practice</label>
                                        <div className="input-label-absolute input-label-absolute-right">
                                            {/* <div className="label-absolute"><i className="fa fa-search" /></div> */}
                                            <Input id="form_physician" type="search" aria-describedby="emailHelp" placeholder="Keywords" className="pr-2"
                                                onClick={this.opendocSearchDropDown}
                                                value={this.state.practiceName}
                                                name="speciality"
                                                autoComplete="off"
                                                onChange={(e) => this.handleDocNameOnChange(e)}
                                                disabled={this.state.insurance_provider === ''}
                                            />
                                        </div>

                                        {
                                            displayDropdown &&
                                            <div className="home_search_dropdown_box dropdown-menu"
                                                style={{ height: 'auto', display: displayDropdown ? 'block' : 'none' }}>

                                                <React.Fragment>
                                                    {
                                                        this.state.practiceList.length === 0 ?
                                                            null
                                                            :
                                                            <div className="searchDoc_speciality_group">
                                                                <div id="searchDoc_group_header">Practice</div>
                                                                {
                                                                    this.state.practiceList.map((data, key) => {
                                                                        return <div className="searchDoc_speciality_group_data" key={key} onClick={(e) => this.handlePracticeClick(e, data.practice_name)}>
                                                                            <p>{data.practice_name}</p>
                                                                            <p style={{ color: '#787887', fontSize: 11 }}>{data.zip}</p>
                                                                        </div>
                                                                    })
                                                                }
                                                            </div>

                                                    }

                                                    {
                                                        this.state.doctorsResults.length === 0 ?
                                                            null
                                                            :
                                                            <div className="searchDoc_doctor_group">
                                                                <div id="searchDoc_group_header">Doctors</div>
                                                                {
                                                                    this.state.doctorsResults.map((value, key) => {
                                                                        return (
                                                                            <div onClick={() => this.createViewProfileItem(value.uid)} id="doc_search_box" className="text-left" key={key}>
                                                                                <img alt="profile placeholder" src={value.profile_image ? value.profile_image : defaultImage} style={{ height: 30, width: 30, borderRadius: 50 }} />
                                                                                <div style={{ paddingLeft: 15 }}>
                                                                                    <p style={{ fontSize: 13, color: '#414146', letterSpacing: 0.5, marginBottom: 0 }}>{`${value.first_name} ${value.last_name}`}</p>
                                                                                    <p style={{ marginBottom: 0, color: '#787887', fontSize: 11, letterSpacing: 0.5 }}>{value.primary_speciality}</p>
                                                                                </div>

                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                    }
                                                </React.Fragment>
                                            </div>
                                        }

                                    </Col>
                                    <Col className="tab-col mt-2">

                                        <Button
                                            outline
                                            type="submit"
                                            color="primary"
                                            className="btn-btn-nw font-08r"
                                            onClick={this.handleSearchDoc}
                                        >
                                            <i className="fas fa-search mr-1" />
                                            Search
                                    </Button>
                                    </Col>

                                    <Col lg='12'>
                                        {this.state.insurance_provider === 'cash pay' ? <span style={{ marginLeft: '6px', fontSize: ".8rem" }}><span style={{ color: 'red' }}>*</span> You have selected Self Pay. To get bettter search result, select your insurance.</span> : ''}
                                    </Col>
                                </Row>
                                <hr className="my-4" />
                                <Row className="d-flex align-items-center">
                                    <div className="col">
                                        <span className="">Filtered by:&nbsp;&nbsp;</span>
                                    </div>
                                    <div className="col-auto d-flex mob-block">
                                        {

                                            this.handleSetfilterOptions()
                                        }
                                    </div>
                                </Row>
                                <hr className="my-4" />
                                <Row className=" mb-4">
                                    <div className="col-12">
                                        <div className="d-flex justify-content-between align-items-center sm_between">
                                            <div className="left_side">
                                                <strong className="mr-1">{this.state.docfilterData.length}</strong ><span>Providers</span>
                                            </div>
                                            <div className="right_side position-relative">
                                                <span>Sorted by :</span>
                                                <Button outline className="btn dropdown-toggle btn-selectpicker bs-placeholder ml-2" color="primary" style={{ letterSpacing: "1px", textTransform: "none" }}
                                                    onClick={this.handleSortByZip}>Zip</Button>
                                                {
                                                    this.state.isOpen &&
                                                    <div className="zipfilterdropDown dropdown-menu pb-0" >
                                                        <ul className="text-left p-0 inner mb-0 w-100 zip_dropdown">
                                                            {
                                                                this.state.zipList.map((value, key) => {
                                                                    return <li key={key} className="dropdown-item">
                                                                        <div className="custom-control custom-checkbox">
                                                                            <input type="checkbox"
                                                                                className="custom-control-input"
                                                                                name={value} value={value}
                                                                                checked={this.state.zipcheckArr.filter(v => v === value).length}

                                                                                onChange={(e) => this.handlezipFilterBox(e)} />
                                                                            <label className="custom-control-label">
                                                                                &nbsp; &nbsp;<span>{value}</span>
                                                                            </label>



                                                                        </div>
                                                                    </li>
                                                                })
                                                            }

                                                        </ul>
                                                        <div className="btn_apply shadow w-100 p-3">
                                                            <button className="text-white d-block border-0 focus_out" onClick={this.handleAppyZip}>APPLY</button>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                </Row>


                            </Form>

                            {/* <ResultsTopBar /> */}
                            <Row>
                                {
                                    this.state.isLoading ?
                                        <Col
                                            sm="6"
                                            className="mb-5 hover-animate"
                                        >
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>

                                        </Col>
                                        :
                                        <React.Fragment>
                                            {this.renderDocList()}
                                        </React.Fragment>
                                }
                            </Row>
                            {/* <Pagination /> */}

                            {/* ----------------------------------------------------------------------html----------------------------------------------------------------------------------- */}

                            <div>{ReactHtmlParser(decode(htmlContent))}</div>

                            {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}
                        </Col>



                        <Col
                            lg="6"
                            className="map-side-lg pr-lg-0 sm-map-hide map_sm_hide"
                        >
                            {this.state.isLoading ?
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> :
                                mapLoaded &&
                                <Map
                                    docData={this.state.docfilterData}
                                    ref={(ref) => this.scrollIcon = ref}
                                    activeMarkerData={this.state.activeUseronMarker}
                                    className="map-full shadow-left"
                                    center={[51.505, -0.09]}
                                    zoom={14}
                                    dragging={dragging}
                                    tap={tap}
                                    hoverCard={hoverCard}
                                />
                            }

                        </Col>
                    </Row>
                </Container>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        doctorslist: state.docList,
        searchDocResult: state.searchDocResult,
        zipResult: state.zipResult,
        isLoading: state.isLoading,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        handlegetDocList: data => dispatch({ type: GET_DOCTOR_LIST_REQUEST, data }),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Specility);