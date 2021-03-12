import React, { Component } from 'react';
// import DoctorName from './DoctorName';
import { handleTimeFormat } from "../utils/DateMethod";
import { Button } from 'reactstrap';
import downArrowImage from '../images/down-arrow.png';

export default class MobileAppointmentRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
            action: 'none',
            mobListColor:false
        }
    }

    handleToggle = () => {
        this.setState({ toggle: !this.state.toggle , mobListColor:!this.state.mobListColor});
    }

    /*---------------------------------------------handle-Action-Onchange--------------------------------------*/

    handleActionOnChange = (value) => {
        const { action } = this.state;

        if (action === 'Confirm') {
            this.props.handlePatientConfirmButton(value);
        }
        else if (action === 'Re-Schedule') {
            this.props.setScheduleData(value);
        }
        else if (action === 'Cancel') {
            this.props.handlePatientCancelButton(value);
        }
    };


    render() {

        const { data } = this.props;
        const year = data.date.slice(0, 4);
        const month = data.date.slice(4, 6);
        const day = data.date.slice(6, 8);
        const newDate = `${month} -${day}-${year}`;
        const expireTime = data.createdAt + 86400000;

        let renderLocation = data.doc_location.filter(value => value._id === data.practice_id);

        return (
            <React.Fragment>
                <li className="mb-2" >
                    <div onClick={this.handleToggle} className={`title mobile_apoint_title_box ${this.state.mobListColor ? "mobListColor" : ""}`}>
                        <div className="text-left" style={{
                            padding: '.5rem',
                            height: 'auto', width: '33.3%', fontWeight: '400', fontSize: '1rem', lineHeight: '1.6',  
                        }}>{data.doc_name}</div>
                        <div className="text-center" style={{ padding: '.5rem', height: 'auto', width: '33.3%', fontWeight: '400', fontSize: '1rem', lineHeight: '1.6',   }}>{newDate}</div>
                        <div className="text-right" style={{ padding: '.5rem', height: 'auto', width: '33.3%', fontWeight: '400', fontSize: '1rem', lineHeight: '1.6',   }}>
                            {handleTimeFormat(data.time)}
                            <span style={{ paddingLeft: 12 }}>
                                <img alt="down-arrow" src={downArrowImage}
                                    style={{
                                        height: 20, width: 20,
                                        WebkitTransform: this.state.toggle ? 'rotate(180deg)' : '',
                                        MozTransformStyle: this.state.toggle ? 'rotate(180deg)' : '',
                                        msTransform: this.state.toggle ? 'rotate(180deg)' : '',
                                        OTransform: this.state.toggle ? 'rotate(180deg)' : '',
                                        transform: this.state.toggle ? 'rotate(180deg)' : ''
                                    }}
                                />
                            </span>
                        </div>
                    </div>
                    {this.state.toggle ?
                        <div className="content apintmobile_content_table" >
                            <p></p>
                            <table style={{ width: '100%' }} className="text-gray-700 table table-striped table-hover sortable reviex-tbl appointments-table ">
                                <tbody>
                                    <tr>
                                        <th>Created at</th>
                                        <td>{new Date(data.createdAt).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <th>Doctor name</th>
                                        <td>{data.doc_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Date</th>
                                        <td>{newDate}</td>
                                    </tr>
                                    <tr>
                                        <th>Time</th>
                                        <td>{handleTimeFormat(data.time)}</td>
                                    </tr>
                                    <tr>
                                        <th>Status</th>
                                        <td style={{ color: data.status === 'Confirmed' ? 'green' : 'tomato' }}>{data.status}</td>
                                    </tr>
                                    <tr>
                                        <th>Action</th>
                                        <td>
                                            {/* <button className='btn btn-sm btn-filled'
                                                disabled={expireTime < Date.now() || data.status === 'Cancelled'}
                                                onClick={() => this.props.handlePatientCancelButton(data)}
                                            >
                                                CANCEL APPOINTMENT
                                        </button> */}
                                            <Button color="primary"
                                                onClick={() => this.props.handlePatientCancelButton(data)}
                                                disabled={expireTime < Date.now() || data.status === 'Cancelled'}
                                                style={{
                                                    fontSize: '.6rem',
                                                    width: "12rem",
                                                    margin: ".2rem",


                                                }}
                                            >
                                                CANCEL APPOINTMENT
                                            </Button>

                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Practice Location</th>
                                        <td>
                                            {
                                                renderLocation.map(value => {
                                                    return `${value.practice_name}, ${value.zip}`
                                                })
                                            }
                                        </td>
                                    </tr>

                                </tbody>

                            </table>
                            <hr></hr>
                        </div> : ''}
                    {/* <hr></hr> */}
                </li>
            </React.Fragment >
        )
    }
}
