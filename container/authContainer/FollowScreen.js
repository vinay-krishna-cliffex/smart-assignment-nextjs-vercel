import React, { Component } from 'react';

export default class FollowScreen extends Component {


    UNSAFE_componentWillMount= ()=> {
        console.log(this.props.location.state);
        if(!this.props.location.state)
        {
            this.props.history.push('/404');       
        }
    }
    

    handleNext = () => {
        this.props.history.push('/');
    }


    render() {
        return ( 
            <React.Fragment>
                <div className="main-container">
                    <section className="text-center" style={{ padding: '50px 0px 50px 0px'}}>
                            <h1>Follow us on Facebook</h1>
                            <h5>Follow Smart Appointment on Facebook to get updates from Practices in your area.</h5>

                            <div className="container" style={{display:'flex',justifyContent:'center',alignItems:'center',paddingTop:20}}>
                                <iframe src="https://www.facebook.com/plugins/like.php?href=https://www.facebook.com/Smartappt&width=450&layout=button&action=like&size=large&share=false&height=35&appId=1196896237183947" width="100" height="35"  scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>
                                <button className="btn btn-sm" style={{marginBottom: 8}} onClick={this.handleNext}>Next</button>
                            </div>
                    </section>
                </div>
            </React.Fragment>
        )
    }
}
