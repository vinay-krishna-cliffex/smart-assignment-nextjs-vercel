import React, { Component } from 'react';

export default class InsuranceLinkRedirectToast extends Component {

    handleGoToSearch = () => {
        this.props.history.push('/searchdoc?name=&zip=&insurance_provider=');
    }

    render() {
        return (
            <React.Fragment>
                <h5 className="text-center" style={{ color: '#fff' }}>You need to book an appointment with a doctor first.</h5>
                <div className="text-center">
                    <button style={{ margin: 5, height: 40, paddingLeft: 10, paddingRight: 10, color: '#333', fontWeight: 'normal', borderRadius: 5, fontSize: 12, outline: 'none', border: '1px solid #fff' }}>Cancel</button>
                    <button onClick={this.handleGoToSearch} style={{ margin: 5, height: 40, paddingLeft: 10, paddingRight: 10, color: '#333', fontWeight: 'normal', borderRadius: 5, fontSize: 12, outline: 'none', border: '1px solid #fff' }}>Search for doctor</button>
                </div>
            </React.Fragment>
        )
    }
}
