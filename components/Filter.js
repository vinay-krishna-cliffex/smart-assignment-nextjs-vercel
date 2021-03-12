import React, { Component } from "react";
import { Button } from 'reactstrap'

export default class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      open: false,
      genderCheckedArr: [],
      hospital_affiliationCheckedArr: [],
      languagesCheckedArr: [],
    };
  }

  handleFilDropDown = (e, data) => {
    e.preventDefault();
    if (data.filterData && data.filterData.length !== 0) {
      this.setState({ open: !this.state.open });
    } else {
      return null;
    }
  };

  handleBackdrop = () => {
    this.setState({ open: false });
  };

  handleApply = (name) => {
    this.props.filterApply_Handler();
    this.setState({ open: false });
  };

  /*---------------------------------------handleCheckedBox-------------------------------*/

  handleCheckfilterCheckbox = (e, name) => {
    //-------------------------------------genderCheckArr--------------------------------------*/

    if (name === "Gender") {
      let index = this.state.genderCheckedArr.indexOf(e.target.value);
      if (index < 0) {
        this.state.genderCheckedArr.push(e.target.value);
        this.setState({ genderCheckedArr: this.state.genderCheckedArr });
        this.props.setFilterState(
          "genderCheckedArr",
          this.state.genderCheckedArr
        );
      } else {
        this.state.genderCheckedArr.splice(index, 1);
        this.setState({ genderCheckedArr: this.state.genderCheckedArr });
        this.props.setFilterState(
          "genderCheckedArr",
          this.state.genderCheckedArr
        );
      }
      // console.log("gender-checked----------->", this.state.genderCheckedArr);
    }

    //-------------------------------------Hospital Affiliation CheckArr--------------------------------------*/

    if (name === "Hospital Affiliation") {
      let index = this.state.hospital_affiliationCheckedArr.indexOf(
        e.target.value
      );
      if (index < 0) {
        this.state.hospital_affiliationCheckedArr.push(e.target.value);
        this.setState({
          hospital_affiliationCheckedArr: this.state
            .hospital_affiliationCheckedArr,
        });
        this.props.setFilterState(
          "hospital_affiliationCheckedArr",
          this.state.hospital_affiliationCheckedArr
        );
      } else {
        this.state.hospital_affiliationCheckedArr.splice(index, 1);
        this.setState({
          hospital_affiliationCheckedArr: this.state
            .hospital_affiliationCheckedArr,
        });
        this.props.setFilterState(
          "hospital_affiliationCheckedArr",
          this.state.hospital_affiliationCheckedArr
        );
      }
      // console.log("affiliation-checked----------->", this.state.hospital_affiliationCheckedArr);
    }

    //-------------------------------------Languages CheckArr--------------------------------------*/

    if (name === "Languages") {
      let index = this.state.languagesCheckedArr.indexOf(e.target.value);
      if (index < 0) {
        this.state.languagesCheckedArr.push(e.target.value);
        this.setState({ languagesCheckedArr: this.state.languagesCheckedArr });
        this.props.setFilterState(
          "languagesCheckedArr",
          this.state.languagesCheckedArr
        );
      } else {
        this.state.languagesCheckedArr.splice(index, 1);
        this.setState({ languagesCheckedArr: this.state.languagesCheckedArr });
        this.props.setFilterState(
          "languagesCheckedArr",
          this.state.languagesCheckedArr
        );
      }
      // console.log("languages-checked----------->", this.state.languagesCheckedArr);
    }
  };

  render() {
    // console.log(this.props.filterData);
    const filter = this.props.filterData;
    const cat_name = filter.name.toLowerCase().split(" ").join("_");

    return (
      <React.Fragment>
        <div
          style={{
            position: "relative",
            marginLeft: 5,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
    
          <Button outline className="btn  btn-selectpicker bs-placeholder  btn-outline-primary" color="primary" style={{ letterSpacing: "1px", textTransform: "none"}}
            onClick={(e) => this.handleFilDropDown(e, this.props.filterData)}>
              {this.props.filterData.name}
            </Button>
          {this.state.open && (
            <div className="filterby-sort-by1 dropdown-menu py-0 dro_right" style={filtStyle}>
              <ul className="text-left list-hospitail overflow-auto mb-0" style={{ width: "100%", maxHeight:'350px' }}>
                {filter.filterData &&
                  filter.filterData.map((value, key) => {
                    return (
                      <li className="dropdown-item " style={{whiteSpace: 'initial'}}
                        key={key}
                        
                      >
                        <div className="custom-control custom-checkbox">
                        <input className="custom-control-input"
                          type="checkbox"
                          name={filter.name}
                          value={value}
                          checked={
                            this.state[`${cat_name}CheckedArr`].filter(
                              (v) => v === value
                            ).length
                          }
                          onChange={(e) =>
                            this.handleCheckfilterCheckbox(e, filter.name)
                          }
                        />
                          <label className="custom-control-label">
                           <span>{value}</span>
                        </label>
                        </div>
                      
                      </li>
                    );
                  })}
              </ul>
             <div className="shadow col-12 py-2">
             <Button color="primary" className="w-100" style={{letterSpacing: "1px"}}
                onClick={() => this.handleApply(filter.name)}>APPLY
              </Button>
               </div>
             
            </div>
          )}
        </div>
        {/* <div
          onClick={this.handleBackdrop}
          style={{
            height: "100%",
            width: "100%",
            position: "fixed",
            top: 0,
            background: "",
            opacity: 1,
            zIndex: 50,
            display: this.state.open ? "block" : "none",
          }}
        ></div> */}
      </React.Fragment>
    );
  }
}

const filtStyle = {
  display: "flex",
  flexWrap: "wrap",
};
