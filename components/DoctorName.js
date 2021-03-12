import React, { Component } from 'react'
import { Baseurl } from '../utils/Baseurl';
import axios from 'axios';


export default class DoctorName extends Component {

    constructor(props) {
        super(props);
        this.state = {
            doc_name: '',
        }
    }
 
    componentDidMount() {
        // console.log(this.props.docId);
        this.handleGetDocNames(this.props.docId);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.handleGetDocNames(props.docId);
    }

    /*----------------------------------------handle get-doctors-names---------------------------------------------------*/


    handleGetDocNames = (id) => {
        axios({
            method: 'get',
            url: Baseurl + `api/doc/getDetails?userId=${id}`,
            headers: { 'content-type': 'application/json' },

        }).then((res) => {
            this.setState({ doc_name: `${res.data.user.first_name} ${res.data.user.last_name}` });
            // console.log("doc-name-response------>", res.data);

        }).catch((err) => {
            console.log("doc-name-error------>", err);
        })
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.props.lable_for === 'mobile' ?
                        <div className="text-left" style={{padding:'.5rem', height: 'auto', width: '33.3%',  fontWeight: '400',fontSize: '1rem',lineHeight: '1.6' }}>{this.state.doc_name}</div>
                        : this.props.lable_for === 'td' ?
                            <td>{this.state.doc_name}</td>
                            : this.props.lable_for === 'user_review' ?
                                <div className="user_reivew_table-body-cell">{this.state.doc_name}</div>
                                : this.props.lable_for === "review_mobile" ?
                                    <div className="text-left" style={{padding:'.5rem', height: 'auto', width: '50%', fontWeight: '400',fontSize: '1rem',lineHeight: '1.6' }}>{this.state.doc_name}</div>
                                    :
                                    <div className="table-body-cell">{this.state.doc_name}</div>
                }

            </React.Fragment>
        )
    }
}
