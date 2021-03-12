import React, { Component } from 'react';
// import DoctorName from "../../component/DoctorName";
import { handleTimeFormat } from "../utils/DateMethod";
// import queryString from "query-string";
// import LazyLoad, { lazyload } from 'react-lazyload'

import { Button } from 'reactstrap'
import Link from 'next/link'


export default class AppointmentRow extends Component {
    state = {
        action: 'none',
        isLoading: false
    };


    /*---------------------------------------------handle-Action-Onchange--------------------------------------*/

    handleActionOnChange = (value) => {
        this.setState({ isLoading: true });

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

    createViewProfileItem = (id) => {
        localStorage.setItem("viewProfileId", id)
    }

    render() {
        const { value, location } = this.props;
        // console.log("appoint row",value)
        const year = typeof value !== "undefined" ? value.date.slice(0, 4) : '';
        const month = typeof value !== "undefined" ? value.date.slice(4, 6) : '';
        const day = typeof value !== "undefined" ? value.date.slice(6, 8) : '';
        const newDate = `${month} -${day}-${year}`;

        const expireTime = typeof value !== "undefined" ? value.createdAt + 86400000 : '';

        let renderLocation = typeof value !== "undefined" ? value.doc_location.filter(data => data._id === value.practice_id) : '';

        return (
            <React.Fragment>
                <tr>
                    <td> {new Date(typeof value !== "undefined" ? value.createdAt : '').toLocaleString()}</td>
                    <td><img src={require('../public/content/svg/user-dark.svg')} className="avatar avatar-sm mr-2"></img>
                        <Link href={{ pathname: `/viewProfile`, query: { id: typeof value !== "undefined" ? value.doc_id : '' } }} as={`/viewProfile?${typeof value !== "undefined" ? value.doc_id : ''}`}>
                            <a onClick={() => this.createViewProfileItem(typeof value !== "undefined" ? value.doc_id : '')}>{typeof value !== "undefined" ? value.doc_name : ''}</a>
                        </Link>
                    </td>
                    <td>{newDate}</td>
                    <td>{typeof value !== "undefined" ? handleTimeFormat(value.time) : ''}</td>
                    <td style={{ color: typeof value !== "undefined" && value.status === 'Confirmed' ? 'green' : 'tomato' }}>{typeof value !== "undefined" ? value.status : ''}</td>
                    <td style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <select className="select-btn"
                            value={this.state.action}
                            disabled={expireTime < Date.now() || (typeof value !== "undefined" && value.status === 'Cancelled')}
                            name="action"
                            onChange={(e) => this.setState({ action: e.target.value })}
                            style={{ width: 'auto', float: 'none', margin: 0, height: 40, paddingRight: 10 }}
                        >
                            <option disabled value='none'>Select</option>
                            <option value="Cancel">Cancel</option>
                        </select>
                        {/* <Select

                                            name="action"
                                            options={data.insurance}
                                            className="form-control dropdown bootstrap-select custom-select"
                                            classNamePrefix="selectpicker"
                                            value={this.state.action}
                                            onChange={(e) => this.setState({ action: e.target.value })}
                                            >
                                            <option disabled value='none'>Select</option>
                                            <option value="Cancel">Cancel</option>
                                        /> */}
                        {
                            this.state.action !== 'none' && typeof value !== "undefined" && value.status !== 'Cancelled' &&
                            <Button className="button-cancel-hover ml-2"
                                disabled={this.state.isLoading}
                                onClick={() => this.handleActionOnChange(typeof value !== "undefined" ? value : '')}

                            >
                                OK
                            </Button>
                        }</td>
                    <td>{renderLocation &&
                        renderLocation.map(value => {
                            return `${value.practice_name}, ${value.zip}`
                        })
                    }</td>
                </tr>
            </React.Fragment>
        )
    }
}
