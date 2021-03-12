import React, { Component } from 'react';
import downArrowImage from '../images/down-arrow.png';

export default class ConsultMobileView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toggle: false
        }
    }

    handleToggle = () => {
        this.setState({ toggle: !this.state.toggle });
    }


    render() {
        const { data } = this.props;

        return (
            <React.Fragment>
                <li className={this.state.toggle ? "active" : ""}>
                    <div onClick={this.handleToggle} className="title consult_mobile_title_box">
                        <div className="text-left" style={{ height: 'auto', width: '50%', fontWeight: 'bold' }}>{new Date(data.createdAt).toLocaleString()}</div>
                        <div className="text-center" style={{ height: 'auto', width: '50%', fontWeight: 'bold' }}>
                            {data.doctor_name}
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

                    <div className="content consult_mobile_content_table">
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr>
                                    <th>Created at</th>
                                    <td>{new Date(data.createdAt).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <th>From Doctor name</th>
                                    <td>{data.doctor_name}</td>
                                </tr>
                                <tr>
                                    <th>Specialization</th>
                                    <td>{data.speciality ? data.speciality : 'No Specialization'}</td>
                                </tr>
                                <tr>
                                    <th>Action</th>
                                    <td><a onClick={(e) => this.props.handlesearchConsult(e, data)} to="">View Doctors</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </li>
            </React.Fragment>
        )
    }
}
