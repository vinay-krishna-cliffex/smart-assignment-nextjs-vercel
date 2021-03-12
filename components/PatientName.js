import React, { Component } from 'react';
import { Baseurl } from '../utils/Baseurl';
import axios from 'axios';

export default class PatientName extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_name: 'Add Review'
        }
    }

    componentDidMount() {
        this.handleGetDocNames();
    }

    /*----------------------------------------handle get-doctors-names---------------------------------------------------*/


    handleGetDocNames = (id) => {
        // console.log("handleGetDocNames name",id)
        let patientId = id ? id : this.props.patientId;
        if (patientId) {
            axios({
                method: 'get',
                url: Baseurl + `api/user/getuserdetails?userId=${patientId}`,
                headers: { 'content-type': 'application/json' },

            }).then((res) => {
                this.setState({ user_name: `${res.data.user.first_name} ${res.data.user.last_name}` });
                // console.log("doc-name-response------>", res.data);

            }).catch((err) => {
                console.log("patient-name-error------>");
            })
        }

    }


    UNSAFE_componentWillReceiveProps(props) {
            this.handleGetDocNames(props.patientId);
        
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.props.lable_for === 'review_mobile' ?
                        <div className="text-left" style={{ height: 'auto', width: '50%' }}>{this.state.user_name}</div>
                        : this.props.lable_for === "td" ?
                            <td>{this.state.user_name}</td>
                            :
                          <div className="text-left">{this.state.user_name} {this.props.children}</div>
                }

            </React.Fragment>
        )
    }
}


