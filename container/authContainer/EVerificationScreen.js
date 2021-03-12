import React, { Component } from 'react';
import firebaseApp from '../../utils/Fire';
import queryString from 'query-string';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { ToastMsg } from '../../components/ToastMsg';


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

// Modal.setAppElement('#root')
Modal.defaultStyles.overlay.backgroundColor = 'rgba(111, 111, 111, 0.75)';



export default class EVerificationScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accountEmail: '',
            ispopup: false,
            newPassword: '',
            isLoading: false,
        }
    }



    componentDidMount() {
        let parameters = queryString.parse(this.props.location.search);
        if (parameters.mode === 'verifyEmail') {
            this.setState({ isLoading: true });
            firebaseApp.auth().applyActionCode(parameters.oobCode).then((resp) => {
                // toast.success('Email successfully verified. You can login to your account now.', { position: toast.POSITION.TOP_CENTER });
                toast.success(<ToastMsg message="Email successfully verified. You can login to your account now." />, { position: toast.POSITION.TOP_CENTER });
                this.setState({ isLoading: false });
                // this.props.history.push('/access/login');
                this.props.history.push({ pathname: '/access/login', state: { routename: 'verification' } })
            }).catch((error) => {
                // console.log(error);
                toast.error(error.message, { position: toast.POSITION.TOP_CENTER });
                this.setState({ isLoading: false });
                // this.props.history.push('/access/login');
                this.props.history.push({ pathname: '/access/login', state: { routename: 'verification' } })
            });

        }
        else if (parameters.mode === 'resetPassword') {
            firebaseApp.auth().verifyPasswordResetCode(parameters.oobCode).then((email) => {
                this.setState({ accountEmail: email, ispopup: true });

            }).catch((error) => {
                toast.error(error.message, { position: toast.POSITION.TOP_CENTER });
                this.setState({ ispopup: false });
                this.props.history.push('/access/login');
            });

        }
        else {
            toast.error('Invalid url.', { position: toast.POSITION.TOP_CENTER });
            this.props.history.push('/access/login');
        }
    }


    /*----------------------handle-reset-password-handler----------------------------*/

    handleResetPassword = () => {

        let parameters = queryString.parse(this.props.location.search);
        firebaseApp.auth().confirmPasswordReset(parameters.oobCode, this.state.newPassword).then((resp) => {
            this.setState({ ispopup: false });
            // toast.success('Password successfully reset.', { position: toast.POSITION.TOP_CENTER });
            toast.success(<ToastMsg message="Password successfully reset." />, { position: toast.POSITION.TOP_CENTER });
            this.props.history.push('/access/login');
        }).catch((error) => {
            toast.error(error.message, { position: toast.POSITION.TOP_CENTER });
            this.props.history.push('/access/login');
        });
    }



    closeModal = () => {
        this.setState({ ispopup: false });
    }


    render() {
        return (
            <React.Fragment>
                {
                    this.state.isLoading ?
                        <div style={{ height: window.innerHeight + 'px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        </div>
                        :
                        <Modal
                            isOpen={this.state.ispopup}
                            onRequestClose={this.closeModal}
                            style={customStyles}
                            contentLabel="Modal"
                        >

                            <h5>Enter new password for  <b>{this.state.accountEmail}</b>.</h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                                <input className="col-md-12" type="password" name='newPassword' placeholder="New password" onChange={(e) => { this.setState({ newPassword: e.target.value }) }} />
                                <button onClick={this.handleResetPassword} className="btn btn-md btn-filled btn-rounded">RESET</button>
                            </div>
                        </Modal>

                }

            </React.Fragment>
        )
    }
}
