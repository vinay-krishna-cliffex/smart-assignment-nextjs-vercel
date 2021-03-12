import React, { Component } from 'react'

export default class Messagealert extends Component {

    componentDidMount() {
        setTimeout(() => {
            this.props.handleClose();
        }, 3000)
    }

    render() {
        return (
            <React.Fragment>
                <div className={this.props.danger ? `alert alert-danger alert-dismissible` : `alert alert-success alert-dismissible`} style={{ borderRadius: '0.25em', position: 'fixed', top: this.props.status ? 0 : - 55, transition: '0.5s', background: this.props.danger ? '#c64444' : '#47b475', zIndex: 1 }}>
                    <button onClick={this.props.handleClose} className="close" type="button" data-dsmiss="alert" area-label="close" style={{ background: this.props.danger ? '#c64444' : '#47b475' }}>
                        <span aria-hidden={true} >x</span>
                    </button>
                    <strong style={{ color: '#ffffff' }}>{this.props.message}</strong>
                </div>
            </React.Fragment>
        )
    }
}
