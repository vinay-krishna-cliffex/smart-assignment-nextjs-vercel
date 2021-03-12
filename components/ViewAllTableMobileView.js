import React, { Component } from 'react';
import ShowMoreText from 'react-show-more-text';
// import StarRatingComponent from 'react-star-rating-component';
import PatientName from './PatientName';
import StarRatings from 'react-star-ratings';
import downArrowImage from '../images/down-arrow.png';

export default class ViewAllTableMobileView extends Component {
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

        let date = new Date(this.props.data.createdAt);
        let yy = date.getFullYear();
        let mm = String(date.getMonth() + 1).padStart(2, "0");
        let dd = date.getDate();
        let created_at = `${yy}/${mm}/${dd}`;

        return (
            <React.Fragment>
                <li>
                    <div onClick={this.handleToggle} className={`title mobile_userReivews_title_box ${this.state.mobListColor ? "mobListColor" : ""}`} style={{paddingLeft:"10px" , paddingTop:"10px"}}>
                        <PatientName patientId={this.props.data.patient_id} lable_for="review_mobile" />
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
                                        <th>Patient name</th>
                                        <PatientName patientId={this.props.data.patient_id} lable_for="td" />
                                    </tr>
                                    <tr>
                                        <th>Ratings</th>
                                        <td>

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

                                </tbody>
                            </table>
                            <hr></hr>
                        </div> : ''}

                </li>

                {/* <li className={this.state.toggle ? "active" : ""} >
                    <div onClick={this.handleToggle} className="title mobile_veiw_all_title_box">
                        <PatientName patientId={this.props.data.patient_id} lable_for="review_mobile" />
                        <div className="text-right" style={{ height: 'auto', width: '50%', fontWeight: 'bold' }}>
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

                    <div className="content view_all_mobile_content">
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr>
                                    <th>Created at</th>
                                    <td>{created_at}</td>
                                </tr>
                                <tr>
                                    <th>Patient name</th>
                                    <PatientName patientId={this.props.data.patient_id} lable_for="td" />
                                </tr>
                                <tr>
                                    <th>Ratings</th>
                                    <td>
                                        <StarRatingComponent
                                            name="userRating1"
                                            starCount={5}
                                            value={this.props.data.rating}
                                            starColor={'#ec8a19'}
                                            emptyStarColor={'lightgray'}

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
                                            expanded={false}
                                        >
                                            {this.props.data.dec}
                                        </ShowMoreText>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </li> */}
            </React.Fragment>
        )
    }
}
