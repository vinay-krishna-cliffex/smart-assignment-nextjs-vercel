import React from 'react';
import { connect } from 'react-redux';
import { GET_DOCTOR_LIST_REQUEST } from '../actions/Action';
import axios from 'axios';
import { Baseurl } from '../utils/Baseurl';
import firebase from '../utils/Fire';
import Router from 'next/router'
import defaultImage from '../images/images.jpeg';
import Modal from 'react-modal';
// import PrimarySpeciality from '../data/home-block-spec-search.json';
// import queryString from 'query-string'; 

import {
    Row,
    Col,
    Form,
    Input,
    Label,
    Button,

} from 'reactstrap'



const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        borderStyle: 'transparent',
    }),
    indicatorSeparator: (provided, state) => ({
        display: 'none'
    }),
    menu: (provided, state) => ({
        ...provided,
        color: 'red',
        border: '0 solid #fff',
        boxShadow: '0 0 1.2rem rgba(0, 0, 0, .15)',
        fontSize: '13px'

    }),
    placeholder: (provided, state) => ({
        ...provided,
        fontSize: '11px'

    })
}

import Select from 'react-select'

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

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: [],
            doctor_name: '',
            specialityData: [],
            docdropdownlist: [],
            practiceList: [],
            pracList: [],
            docList: [],
            doc_dropDownDisplay: false,
            zip: '',
            zipList: [],
            zipShowList: [],
            insurance_provider: '',
            insuranceProviderArr: [],
            speciality: '',
            practiceName: '',
            isModal: false,
            zipDropdown: false,
            specialityLoader: false,
            // hometable:false,
            // alertError: false,
            // messageAlert: ''
        }
        this.opendocSearchDropDown = this.opendocSearchDropDown.bind(this);
        this.hidedocSearchDropDown = this.hidedocSearchDropDown.bind(this);
        this.handleZipInputClick = this.handleZipInputClick.bind(this);
        this.hideZipDropdown = this.hideZipDropdown.bind(this);
    }

    componentDidMount() {
        // localStorage.removeItem('viewReviewAllId');
        // localStorage.removeItem("scheduleAppId");
        // localStorage.removeItem("viewProfileId");
        // localStorage.removeItem("homeQuerys");
        // localStorage.removeItem("settingId");
        window.scrollTo(0, 0);
        firebase.auth().onAuthStateChanged((user) => {
            // console.log("user", user)
            if (user) {
                this.setState({ isLoading: false });
                this.handleGetPayersFromPverify();
            }
            // else {
            //     Router.push("/")
            // }
        })
        this.handleGetPayersFromPverify();

    }

    closeModal = () => {
        this.setState({ isModal: false });
    }

    createViewProfileItem = (id) => {
        localStorage.setItem("viewProfileId", id)
        // Router.push({ pathname: `/viewProfile`, query: { id: id } })
        Router.push(`/viewProfile?${id}`)
    }

    // handleSetInterval = () => {
    //     setTimeout(
    //         () => this.setState({ alertError: false, messageAlert: '' }),
    //         5000
    //     );
    // }

    // handleCloseAlert = () => {
    //     this.setState({ alertError: false, messageAlert: '', alertSuccess: false, messageAlertSuccess: '' })
    // }


    /*---------------------------------------UNSAFE_componentWillReceiveProps------------------------------------*/

    UNSAFE_componentWillReceiveProps(props) {

        let arr = [];
        let zipArr = [];
        props.doctorslist.map(value => {
            return arr = arr.concat(value.speciality);
        })

        let newSpecialityArr = arr.filter((a, b) => arr.indexOf(a) === b);

        let Parr = [];

        let practiceArr = props.doctorslist && props.doctorslist.map(value => {
            return value.practice;
        })

        practiceArr.map(d => {
            return Parr.push(...d);
        });

        Parr.map(data => {
            zipArr = zipArr.concat(data.zip);
        })

        let uniqueZip = [...new Set(zipArr)];

        var handleDuplicateLocation = Parr.reduce((unique, o) => {
            if (!unique.some(obj => obj.practice_name === o.practice_name && obj.zip === o.zip)) {
                unique.push(o);
            }
            return unique;
        }, []);

        const array = [];

        newSpecialityArr.sort().map((obj) => {
            array.push({ value: obj, label: obj })
        })

        this.setState({
            docdropdownlist: props.doctorslist.length > 0 ? props.doctorslist : [],
            docList: props.doctorslist.length > 0 ? props.doctorslist : [],
            practiceList: handleDuplicateLocation,
            pracList: handleDuplicateLocation,
            specialityData: array,
            zipList: uniqueZip,
            zipShowList: uniqueZip,

            data: props.doctorslist.length > 0 ? props.doctorslist : [],

            specialityLoader: props.specialityLoader
        })
    }

    // handleHomeBlockSearch = (name, insurance_provider) => {
    //     let data = { name: name, practice_name: '', insurance_provider: insurance_provider, zip: '', consultAt: "" }
    //     localStorage.setItem("homeQuerys", JSON.stringify(data));
    //     let insuranceData = insurance_provider.replace(' ', '_');
    //     // Router.router.push(`/doctors?${insuranceData}`);
    //     Router.router.push({
    //         pathname: `/doctors`,
    //         query: { name: name, practice_name: '', insurance_provider: insuranceData, zip: '', consultAt: "" }
    //     });
    // }

    handleSearch = (e) => {
        e.preventDefault();

        if (this.state.insurance_provider === '') {
            this.setState({ isModal: true });
            // this.setState({ alertError: true, messageAlert: 'Please Select Your Insurance Provider' });
            // this.handleSetInterval();
        }
        else {
            let data = { name: this.state.speciality, practice_name: this.state.practiceName, insurance_provider: this.state.insurance_provider, zip: this.state.zip, consultAt: "" }
            localStorage.setItem("homeQuerys", JSON.stringify(data));
            // let insuranceData = this.state.insurance_provider.replace(' ', '_');
            let string = this.state.insurance_provider ? this.state.insurance_provider : 'cash_pay'
            let insuranceData = ''
            for (var i = 0; i < string.length; i++) {
                if (string.charAt(i) === ' ') {
                    insuranceData = insuranceData + '_'
                }  else {
                    insuranceData = insuranceData + string.charAt(i)
                }
            }
            Router.router.push(`/doctors?${insuranceData}`);

            // Router.router.push({
            //     pathname: `/doctors`,
            //     query: { name: this.state.speciality, practice_name: this.state.practiceName, insurance_provider: this.state.insurance_provider, zip: this.state.zip, consultAt: "" }
            // });
        }
    }


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
            console.log("error-------->");
        })
    }



    /*------------------------------------------------------handle-speciality-onchange--------------------------------------------------*/

    handleDocNameOnChange = (e) => {
        e.preventDefault();
        var q = e.target.value.toLowerCase();

        let filterLocation = this.state.pracList.filter(data => {
            return data.practice_name.toLowerCase().includes(q);
        });

        let filterDoctor = this.state.docList.filter(dataIs => {
            let name = `${dataIs.first_name} ${dataIs.last_name}`;
            return name.toLowerCase().includes(q)
        });

        if (e.target.value.length > 2) {
            this.setState({ practiceName: e.target.value, doc_dropDownDisplay: true, practiceList: filterLocation, docdropdownlist: filterDoctor });
        }
        else {
            this.setState({ practiceName: e.target.value, doc_dropDownDisplay: false });
        }
    }


    /*------------------------------------------------------handle-zip-dropdown--------------------------------------------------*/


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
    };


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

    /*-------------------------------------handleSpecialityOnchange---------------------------------*/

    handleSpecialityOnchange = (selectedOption) => {
        if (selectedOption.value) {
            let filterSpecaility = this.state.data.filter(data => data.speciality.find(special => special === selectedOption.value));

            let zipArr = [];
            let Parr = [];
            let practiceArr = filterSpecaility.map(value => {
                return value.practice;
            })

            practiceArr.map(d => {
                return Parr.push(...d);
            });

            Parr.map(data => {
                zipArr = zipArr.concat(data.zip);
            })

            let uniqueZip = [...new Set(zipArr)];

            var handleDuplicateLocation = Parr.reduce((unique, o) => {
                if (!unique.some(obj => obj.practice_name === o.practice_name && obj.zip === o.zip)) {
                    unique.push(o);
                }
                return unique;
            }, []);


            this.setState({ zipList: uniqueZip, zipShowList: uniqueZip, docdropdownlist: filterSpecaility, docList: filterSpecaility, practiceList: handleDuplicateLocation, pracList: handleDuplicateLocation, speciality: selectedOption.value });
        }
        else {
            let Parr = [];
            let zipArr = [];
            let practiceArr = this.state.data.map(value => {
                return value.practice;
            })

            practiceArr.map(d => {
                return Parr.push(...d);
            });

            Parr.map(data => {
                zipArr = zipArr.concat(data.zip);
            })

            let uniqueZipdata = [...new Set(zipArr)];

            var DuplicateLocation = Parr.reduce((unique, o) => {
                if (!unique.some(obj => obj.practice_name === o.practice_name && obj.zip === o.zip)) {
                    unique.push(o);
                }
                return unique;
            }, []);

            this.setState({ zipList: uniqueZipdata, zipShowList: uniqueZipdata, docdropdownlist: this.state.data, docList: this.state.data, practiceList: DuplicateLocation, pracList: DuplicateLocation, speciality: selectedOption.value });
        }
    }


    /*-------------------------------------handleZipCode Onchange method---------------------------------*/


    handleZipOnchange = (e) => {
        e.preventDefault();
        var zipValue = e.target.value.toLowerCase();

        var pattern = /^\d{5,5}$/;

        if (!pattern.test(e)) {
            //console.log('only 5,5 allowed');
            //this.setState({digitZipToolTip:true });
        }

        this.setState({ docList: this.state.data, zip: e.target.value, zipDropdown: false });

        /* if (e.target.value && e.target.value.length > 2) {
 
             let filterzip = this.state.docList.filter(data => data.practice.find(value => value.zip === e.target.value));
             let Parr = [];
             let practiceArr = filterzip.map(value => {
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
 
 
             let filterZipList = this.state.zipList.filter(value => {
                 return value.toLowerCase().includes(zipValue);
             });
 
             let asendingZip = filterZipList.sort((a, b) => a - b);
 
             this.setState({ zipShowList: asendingZip, docdropdownlist: filterzip, docList: filterzip, practiceList: handleDuplicateLocation, pracList: handleDuplicateLocation, zip: e.target.value, zipDropdown: true });
 
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
 
 
             let filterZipList = this.state.zipList.filter(value => {
                 return value.toLowerCase().includes(zipValue);
             });
 
             let asendingZip = filterZipList.sort((a, b) => a - b);
 
             this.setState({ zipShowList: asendingZip, docdropdownlist: this.state.data, docList: this.state.data, practiceList: DuplicateLocation, pracList: DuplicateLocation, zip: e.target.value, zipDropdown: false });
         }*/

    }



    handleZipOnCLick = (e, zip) => {
        e.preventDefault();
        this.setState({ zip: zip });
    }


    /*--------------------------------handlePracticeClick--------------------------*/

    handlePracticeClick = (e, practice) => {
        e.preventDefault();
        this.setState({ practiceName: practice });
    }


    handleSelectInsuranceforModal = () => {
        this.setState({ isModal: false });
    }


    closeModal = () => {
        this.setState({ isModal: false });
    }

    handleAllSpec = () => {
        this.setState({ hometable: !this.state.hometable })
    }

    render() {
        // console.log("Searchbar Is ----",queryString.parse(Router.pathname.search()))
        const displayDropdown = (this.state.docdropdownlist.length > 0 && this.state.doc_dropDownDisplay) || (this.state.practiceList.length > 0 && this.state.doc_dropDownDisplay);
        const haszipDropdown = (this.state.zipShowList.length > 0 && this.state.zipDropdown);
        return <>
            <div className={` ${this.props.className}`}>
                <Modal
                    isOpen={this.state.isModal}
                    // onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Modal"
                >
                    <div>
                        <h5 className="text-center" style={{ fontSize: 14, fontWeight: 400 }}> Please Select Your Insurance Provider </h5>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button color="primary"
                                onClick={this.closeModal}
                                style={{
                                    marginLeft: "1rem",
                                    width: "6rem",
                                    marginTop: "1.1rem",
                                }}
                            >
                                Ok
                            </Button>

                            {/* <button onClick={this.handleOk} className="btn btn-md btn-filled btn-rounded">Ok</button>
                    <button onClick={this.closeModal} className="btn btn-md btn-filled btn-rounded">Cancel</button> */}
                        </div>
                    </div>
                </Modal>
                <Form >
                    <Row className="justify-content-lg-between align-items-lg-center form-row">
                        <Col
                            lg="3"
                            md={this.props.halfInputs ? "6" : "12"}
                            className=" form-group no-divider select-100"
                        >
                            <label className="form-label d-block text-black-50 font-weight-bold" htmlFor="form_search" style={{ fontSize: "95%" }}>STEP 1</label>
                        
                            <Select
                                instanceId="guestsSelect"
                                name="guests"
                                id="reactselect"
                                defaultName="player"
                                styles={customSelectStyles}
                                options={this.state.insuranceProviderArr}
                                className="selectpicker"
                                classNamePrefix="selectpicker"
                                placeholder="Insurance Provider"
                                onChange={this.handleInsuranceProviderOnchange}
                            />
                        </Col>
                        <Col
                            lg="2"

                            md={this.props.halfInputs ? "6" : "12"}
                            className=" form-group no-divider select-100"
                        >
                            <label className="form-label d-block text-black-50 font-weight-bold" htmlFor="form_search" style={{ fontSize: "95%" }}>STEP 2</label>
                      
                                <Select
                                instanceId="guestsSelects"
                                isDisabled={this.state.insurance_provider === '' ? true : false}
                                name="guests"
                                id="reactselect"
                                styles={customSelectStyles}
                                options={this.state.specialityData}
                                className="selectpicker"
                                classNamePrefix="selectpicker"
                                placeholder="Choose Speciality"
                                onChange={this.handleSpecialityOnchange}
                            />
                        </Col>
                        <Col
                            lg="2"
                            className=" form-group"
                        >
                            <label className="form-label d-block text-black-50 font-weight-bold" style={{ fontSize: "95%" }}>STEP 3</label>
                            <Input
                                type="text"
                                name="zip"
                                min={5}

                                maxLength={5}
                                placeholder="Zip code"
                                className=" input-100"
                                onClick={this.handleZipInputClick}
                                disabled={this.state.insurance_provider === '' ? true : false}
                                value={this.state.zip}
                                style={{ fontSize: "13px" }}
                                onChange={(e) => this.handleZipOnchange(e)}
                            />
                            {
                                haszipDropdown &&
                                <div className="zip_searchContainer" style={{ display: haszipDropdown ? 'block' : 'none' }}>
                                    {
                                        this.state.zipShowList.map((value, key) => {
                                            return <div className="zip_items" key={key} onClick={(e) => this.handleZipOnCLick(e, value)}>{value}</div>
                                        })
                                    }
                                </div>
                            }
                        </Col>
                        <Col
                            lg="3"
                            className=" form-group"
                        >
                            <label className="form-label d-block text-black-50 font-weight-bold" style={{ fontSize: "95%" }}>STEP 4</label>
                            <Input
                                id="form_physician"
                                // className="border-0 shadow-0"
                                autoComplete="on"
                                type="text"
                                aria-describedby="emailHelp"
                                placeholder="Search for a physician or practice"
                                style={{ fontSize: "13px" }}
                                name="speciality"
                                className="input-100"
                                value={this.state.practiceName}
                                onChange={(e) => this.handleDocNameOnChange(e)}
                                disabled={this.state.insurance_provider === '' ? true : false}
                            />
                            {
                                displayDropdown &&
                                <div className="search_dropdown_box"
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
                                            this.state.docdropdownlist.length === 0 ?
                                                null
                                                :
                                                <div className="searchDoc_doctor_group">
                                                    <div id="searchDoc_group_header">Doctors</div>
                                                    {
                                                        this.state.docdropdownlist.map((value, key) => {
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
                        <Col
                            lg="2"
                            // className={this.props.btnMb ? `mb-${this.props.btnMb}` : ``}
                            className=" form-group"
                        >
                            <label className="form-label d-block text-black-50 font-weight-bold" style={{ fontSize: "95%" }}><br></br></label>
                            <Button
                                type="submit"
                                color="primary"
                                className={`btn-dark btn-block  btn-100 lift ${this.props.btnClassName ? this.props.btnClassName : ""}`}
                                onClick={this.handleSearch}
                            >
                                Search Now <span className="fas fa-angle-right align-middle ml-1"></span>
                            </Button>
                        </Col>
                        {/* {this.state.alertError ?
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {this.state.messageAlert}
                                <button type="button" className="close" data-dismiss="alert" onClick={this.handleCloseAlert} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            : ''
                        } */}
                    </Row>
                </Form>
            </div>

        </>
    }
}
const mapStateToProps = (state) => {
    return {
        // searchDocResult: state.searchDocResult,
        // zipResult: state.zipResult,
        doctorslist: state.docList,
        specialityLoader: state.isLoading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handlegetDocList: data => dispatch({ type: GET_DOCTOR_LIST_REQUEST, data })
        // handleGetSearchDocResult: data => dispatch({type: SEARCH_DOC_SPECIALITY_REQUEST, data }),
        // handleGetSearchZipResult: data => dispatch({type: SEARCH_ZIP_REQUEST, data })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
