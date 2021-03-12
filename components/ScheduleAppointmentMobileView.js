import React, { Component } from 'react';
import { handleTimeFormat } from '../utils/DateMethod';
import { Collapse } from 'reactstrap'

export default class ScheduleAppointmentMobileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false,
            reviewCollapse: false,
            toggle: false,
            weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        }
    }

    handleToggle = () => {
        this.setState({ toggle: !this.state.toggle });
    }

    toggleClass = () => {
        this.setState({ isActive: !this.state.isActive });
    };


    render() {
        const { isActive, reviewCollaps } = this.state;

        let date = new Date();
        let currentTimes = String(date.getHours()) + String(date.getMinutes());

        let y = date.getFullYear();
        let m = String(date.getMonth() + 1).padStart(2, 0);
        let da = String(date.getDate()).padStart(2, "0");

        let currentDate = `${y}${m}${da}`;
        // console.log("props---->", this.props.data);
        const year = this.props.data.date.slice(0, 4);
        const month = this.props.data.date.slice(4, 6);
        const day = this.props.data.date.slice(6, 8);

        const newDate = new Date(`${year}-${month}-${day}`);
        let sday = this.state.weekday[newDate.getUTCDay()];
        let fullMonth = this.state.month[newDate.getUTCMonth()];

        return (

            <React.Fragment>
                <div className="accordion accordion-1 schedule_mobile_view mobile-show" onClick={() => this.setState({ reviewCollaps: !reviewCollaps })}>

                    <div className={isActive ? 'mobile-schedule-title bg-white rounded shadow active' : 'mobile-schedule-title bg-white rounded shadow'}
                        onClick={this.toggleClass}>
                        <div className="day">
                            {sday}
                        </div>
                        <div className="date">
                            {`${fullMonth}   ${day}, ${year}`}
                            <span className="ml-1">
                                <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-6q0nyr-Svg"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>
                            </span>
                        </div>
                    </div>
                    <Collapse
                        isOpen={reviewCollaps}
                    >
                        <div className="content-schedule-view bg-white shadow">
                            <div className="schedule_btn_box">
                                {/* {this.state.currentFiveDaysData.availability.length === 0 ? (
                                <div style={{ height: "auto", width: "100%" }}>
                                    <h4
                                        classNameName="text-center"
                                        style={{
                                            color: "rgb(0, 35, 75)",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        No Results
                                     </h4>
                                </div>
                            ) :
                                ( */}
                                {this.props.data.availability.map(
                                    (value, key) => {
                                        let background = value.offer_telemedicine == 1 ? '#008f8e' : value.offer_telemedicine == 2 ? "#d3d3d3" : "#1dc478";
                                        return (
                                            <button key={key} type="submit" className="btn-btn-nw font-08r btn btn-outline-primary"
                                                style={{ background: background , color: "#fff" , borderColor:background}}
                                                disabled={this.props.isClickTime || (currentDate === this.props.data.date && parseInt(value.time) < parseInt(currentTimes))}
                                                onClick={() => this.props.handleSetClientInScheduleTime(this.props.data, key)}
                                            >
                                                {handleTimeFormat(value.time)}
                                            </button>
                                        );
                                    }
                                )
                                }


                            </div>
                        </div>
                    </Collapse>

                </div>
            </React.Fragment>
        )
    }
}
