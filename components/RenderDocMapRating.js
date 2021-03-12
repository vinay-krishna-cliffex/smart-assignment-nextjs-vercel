import React, { Component } from 'react';
import { Baseurl } from '../utils/Baseurl';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';

export default class RenderDocMapRating extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reviewLength: '',
            reviewAllRatings: '',
            latastReview: {},
            isLoading: false
        }
    }


    componentDidMount() {
        this.handleGetDocReview(this.props.id);
    }


    /*-----------------------------------handle-get-handleGetDocReview----------------------------------*/


    handleGetDocReview = (id) => {
        // this.setState({isLoading:true});
        //this.handleAllRatingandLeatestReview(res.data.data);      
    }


    /*handleAllRatingandLeatestReview = (data) => {
        let latastCreated = {
            createdAt: 0,
        };

        let rating = 0;
        data.map((value) => {
            rating += value.rating;
            if (value.createdAt > latastCreated.createdAt) {
                latastCreated = value;
            }
            return null;
        });

        this.setState({ reviewLength: data.length, reviewAllRatings: rating / data.length, latastReview: latastCreated });
    };*/



    render() {
        return (
            <React.Fragment>
                {
                    this.state.isLoading ?
                        <div style={{ marginBottom: 0 }}>Loading...</div>
                        :
                        this.props.reviewLength === 0 ?
                            <div style={{ marginBottom: 0 }}>No review</div>
                            :
                            <div className="start_box" style={{ display: 'flex', justifyContent: 'center' }}>
                                <div style={{ marginTop: '5px' }}>
                                    <StarRatingComponent
                                        name="rate1"
                                        starCount={5}
                                        value={Number(this.props.reviewAverage)}
                                        starColor={'#ec8a19'}
                                        emptyStarColor={'lightgray'}
                                    />
                                </div>
                                <span>({this.props.reviewLength})</span>
                            </div>
                }
            </React.Fragment>
        )
    }
}
