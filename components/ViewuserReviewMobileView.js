import React, { Component } from 'react';
import DoctorName from './DoctorName';
import EditUserReview from './EditUserReview';
// import StarRatingComponent from 'react-star-rating-component';
import StarRatings from 'react-star-ratings';
import ShowMoreText from 'react-show-more-text';
import downArrowImage from '../images/down-arrow.png';



export default class ViewuserReviewMobileView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
            mobListColor: false
        }
    }

    handleToggle = () => {
        this.setState({ toggle: !this.state.toggle, mobListColor: !this.state.mobListColor });
    }

    executeOnClick = (isExpanded) => {
        console.log(isExpanded);
    }


    render() {

        let date = new Date(this.props.data.createdAt);
        let yy = date.getFullYear();
        let mm = String(date.getMonth() + 1).padStart(2, "0");
        let dd = date.getDate();
        let created_at = `${yy}/${mm}/${dd}`;

        return (
            <React.Fragment>
                <li>
                    <div onClick={this.handleToggle} className={`title mobile_userReivews_title_box ${this.state.mobListColor ? "mobListColor" : ""}`}>
                        <DoctorName docId={this.props.data.doc_id} lable_for="review_mobile" />
                        <div className="text-right" style={{ padding: '.5rem', height: 'auto', width: '50%', fontWeight: '400', fontSize: '1rem', lineHeight: '1.6' }}>
                            {created_at}
                            <span style={{ paddingLeft: 5 }}>
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
                    {this.state.toggle ?
                        <div className="content apintmobile_content_table">
                            <p></p>
                            <table style={{ width: '100%' }} className="text-gray-700 table table-striped table-hover sortable reviex-tbl appointments-table ">
                                <tbody>
                                    <tr>
                                        <th>Created at</th>
                                        <td>{created_at}</td>
                                    </tr>
                                    <tr>
                                        <th>Doctor name</th>
                                        <DoctorName docId={this.props.data.doc_id} lable_for="td" />
                                    </tr>
                                    <tr>
                                        <th>Ratings</th>
                                        <td>
                                            {/* <StarRatingComponent
                                                name="userRating1"
                                                starCount={5}
                                                value={this.props.data.rating}
                                                starColor={'#ec8a19'}
                                                emptyStarColor={'lightgray'}

                                            /> */}
                                            <StarRatings
                                                rating={this.props.data.rating}
                                                starRatedColor="#ec8a19"
                                                numberOfStars={5}
                                                name='userRating1'
                                                starDimension="20px"
                                                starSpacing="1px"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Review</th>
                                        <td>
                                            <ShowMoreText
                                                lines={1}
                                                more='Show more'
                                                less='Show less'
                                                anchorClass=''
                                                onClick={this.executeOnClick}
                                                expanded={false}
                                            >
                                                {this.props.data.dec}
                                            </ShowMoreText>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Action</th>
                                        <td>
                                            <EditUserReview handleEditButton={this.props.data} userName={this.props.user_name} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <hr></hr>
                        </div> : ''}
                    {/* <hr></hr> */}
                </li>
            </React.Fragment>
        )
    }

}

