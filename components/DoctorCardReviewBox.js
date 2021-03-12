import React, { Component } from 'react';
// import StarRatingComponent from 'react-star-rating-component';
import StarRatings from 'react-star-ratings';
import ShowMoreText from 'react-show-more-text';
import { Baseurl } from '../utils/Baseurl';
import axios from 'axios';

export default class DoctorCardReviewBox extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            reviewLength: '',
            reviewAllRatings: '',
            latastReview: {},
            isLoading: false
        }
    }


    UNSAFE_componentWillReceiveProps(props) {
        this.handleGetDocReview(props.docId);
    }

    /*----------------------------------------handle-get-handleGetDocReview---------------------------------------------*/


    handleGetDocReview = (id) => {
        this.setState({ isLoading: true });

        //this.handleAllRatingandLeatestReview(res.data.data);
        /*axios({
            method: 'get',
            url: Baseurl + `api/review/get_review?parameter=${id}-doc_id`,
            headers: { 'Content-Type': 'application/json'},
        }).then((res) => {
            // console.log("doc-reviews-response------>", res);
            this.setState({isLoading: false});
            this.handleAllRatingandLeatestReview(res.data.data);
        }).catch((error) => {
            console.log("doc-reviews-error------>", error);
            this.setState({isLoading: false});
        })*/
    }


    /*  handleAllRatingandLeatestReview = (data) => {
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


    executeOnClick = (isExpanded) => {
        // console.log(isExpanded);
    };



    render() {
        if (this.state.latastReview.createdAt === 0) return <p>No review</p>
        return (
            <React.Fragment>
                <div className="start_box" style={{ display: 'flex' }}>
                    {/* <StarRatingComponent
                        name="rate1"
                        starCount={5}
                        value={Number(this.props.reviewAverage)}
                        starColor={'#ec8a19'}
                        emptyStarColor={'lightgray'}
                    /> */}
                    <StarRatings 
                    className="top-2"
                        // value={Number(this.props.reviewAverage)}
                        rating={Number(this.props.reviewAverage)}
                        starRatedColor="#ec8a19"
                        numberOfStars={5}
                        name='rate1'
                        starDimension="15px"
                        starSpacing="1px"
                        
                    />
                    <span>({this.props.reviewLength})</span>
                </div>

                <ShowMoreText
                    lines={1}
                    more='Show more'
                    less='Show less'
                    anchorClass=''
                    onClick={this.executeOnClick}
                    expanded={false}>

                    {this.props.latastReview}
                </ShowMoreText>
            </React.Fragment>
        )
    }
}
