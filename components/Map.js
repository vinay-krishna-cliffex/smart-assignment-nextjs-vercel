import React from "react"
import Link from 'next/link'
import { Map, Marker, Popup, TileLayer, Tooltip, Circle } from 'react-leaflet'
import RenderDocMapRating from './RenderDocMapRating';
import MarkerIcon from '../public/content/svg/marker.svg'
import MarkerIconHighlight from '../public/content/svg/marker-hover.svg'
import defaultImage from '../images/images.jpeg';
// import leftArrow from '../images/left-arrow.png';
// import reftArrow from '../images/right-arrow.png';

// import { Button } from 'reactstrap'
import Carousel from "react-elastic-carousel";
// import AliceCarousel from 'react-alice-carousel';

// import Stars from './Stars'


const distanceToMouse = (pt, mousePos, markerProps) => {
    if (pt && mousePos) {
        return Math.sqrt(
            (pt.x - mousePos.x) * (pt.x - mousePos.x) +
            (pt.y - mousePos.y) * (pt.y - mousePos.y)
        );
    }
};

export default class DoctorsMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            isOpennew: -1,
            mapData: [],
            hover: false,
            focus: false,
            isOpen: false,
            currentIndex: 0,
            responsive: { 0: { items: 1 }, 1024: { items: 1 } },
            mouseOnTitle: '',
            centerLatLong: {
                lat: 40.730610,
                lng: -73.935242
            },
            isOpen: true,

        }
    }

    static defaultProps = {
        center: {
            lat: 40.730610,
            lng: -73.935242
        },
        // zoom: 10
    };

    slideNext = (data) => {

        this.setState({ currentIndex: this.state.currentIndex + 1 })
    }

    slidePrev = (data) => {
        this.setState({ currentIndex: this.state.currentIndex - 1 })
    }

    createScheduleItem = (id) => {
        localStorage.setItem("scheduleAppId", id)
    }


    createViewProfileItem = (id) => {
        localStorage.setItem("viewProfileId", id)
    }



    UNSAFE_componentWillMount() {
        let data = this.props.docData.map((value, index) => {
            return { isOpen: false, index: index }
        })

        this.setState({ mapData: data });
    }


    /*----------------------handle-marker-click-------------------------*/

    handleMarkerclick = (index) => {

        let data = this.state.mapData.map((value, key) => {
            if (index === key) {
                if (value.isOpen) {
                    return { isOpen: false, index: key }
                }
                return { isOpen: true, index: key }
            }
            return { isOpen: false, index: key }
        })



        this.setState({ mapData: data, isOpennew: index, });
    }
    render() {

        const mouseOnTitle = this.props.activeMarkerData ? `${this.props.activeMarkerData.first_name} ${this.props.activeMarkerData.last_name}` : '';

        let tileLayers = []

        tileLayers[1] = { tiles: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>', subdomains: 'abcd' }
        tileLayers[2] = { tiles: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }
        tileLayers[3] = { tiles: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png', attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }
        tileLayers[4] = { tiles: 'https://mapserver.mapy.cz/base-m/{z}-{x}-{y}', attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, <a href="https://seznam.cz">Seznam.cz, a.s.</a>' }
        tileLayers[5] = { tiles: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>', subdomains: 'abcd' }
        tileLayers[6] = { tiles: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia maps</a>' }

        const icon = L.icon({
            iconUrl: MarkerIcon,
            shadowUrl: '',
            iconRetinaUrl: MarkerIcon,
            iconSize: [25, 37.5],
            popupAnchor: [0, -18],
            tooltipAnchor: [0, 19]
        })

        const highlightIcon = L.icon({
            iconUrl: MarkerIconHighlight,
            shadowUrl: '',
            iconRetinaUrl: MarkerIconHighlight,
            iconSize: [25, 37.5],
            popupAnchor: [0, -18],
            tooltipAnchor: [0, 19]
        })

        const markers = this.props.geoJSON && this.props.geoJSON.features && this.props.geoJSON.features.map(feature =>
            [
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0]
            ]
        )




        return (
            <Map
                distanceToMouse={distanceToMouse}
                center={this.state.centerLatLong}
                zoom={12}
                scrollWheelZoom={focus}
                className={this.props.className}
                // dragging={this.props.dragging}
                dragging={true}
                tap={this.props.tap}
                bounds={this.props.geoJSON ? markers : null}
                onFocus={() =>
                    this.setState({ focus: true })
                }
                onBlur={() =>
                    this.setState({ focus: false })
                }
            >
                <TileLayer
                    url={tileLayers[1].tiles}
                    attribution={tileLayers[1].attribution}

                />

                {

                    this.props.docData.map((value, key) => {

                        // ---------------------------------------------------------------------------------------------------------------------------------------

                        if (this.state.isOpennew === key) {
                            var newFlag = true;
                        } else {
                            var newFlag = false;
                        }
                        // ----------------------------------------------------------------------------------------------------------------------------------------

                        return (
                            <Marker
                                key={key}
                                responsive={this.state.responsive}
                                slideNext={() => this.slideNext(key)}
                                slidePrev={() => this.slidePrev(key)}
                                handleMarkerOnClick={() => this.handleMarkerclick(key)}
                                isOpen={newFlag}
                                // isOpen={false}
                                onClick={this.props.handleMarkerOnClick}
                                icon={icon}
                                opacity={0}
                                position={[value.latitude ? value.latitude : '', value.longitude ? value.longitude : '']}
                                onMouseOver={() => {
                                    this.setState({ hover: value._id })
                                }}
                                onMouseOut={() => {
                                    this.setState({ hover: false })

                                }}
                            >
                                <Tooltip
                                    permanent={true}
                                    interactive={true}
                                    direction="top"

                                    className={`map-custom-tooltip ${this.state.hover === value._id || this.props.hoverCard === value._id ? 'active' : mouseOnTitle === `${value.first_name} ${value.last_name}` ? 'active' : ''}`}

                                >
                                    {value.first_name}
                                </Tooltip>
                                {
                                    this.state.isOpen &&
                                    <React.Fragment>

                                        < Popup className="map-custom-popup " maxWidth="600" minWidth="200"
                                            items={this.props.docData.filter(data => data.latitude === value.latitude && data.longitude === value.longitude)}>
                                            {/* {
                                                    this.props.docData.filter(data => data.latitude === value.latitude && data.longitude === value.longitude).length > 1 &&
                                                    <div className="next_preview_action_container">
                                                        <span style={{ marginRight: 15 }}>{`${this.state.currentIndex + 1} of ${this.props.docData.filter(data => data.latitude === value.latitude && data.longitude === value.longitude).length}`}</span>
                                                        <div className="preNextActionButton mr-5">
                                                            <button title="prev" onClick={() => this.slidePrev(this.props.docData.filter(data => data.latitude === value.latitude && data.longitude === value.longitude))} disabled={this.state.currentIndex === 0} className="btn" style={{ marginBottom: 0, lineHeight: 0, height: 30, padding: '0 8px', minWidth: 0 }}>
                                                                <img src={require(leftArrow} style={{ height: 18, width: 18 }} />
                                                            </button>
                                                            <button title="next" onClick={() => this.slideNext(this.props.docData.filter(data => data.latitude === value.latitude && data.longitude === value.longitude))} disabled={(this.state.currentIndex + 1) === this.props.docData.filter(data => data.latitude === value.latitude && data.longitude === value.longitude).length} className="btn" style={{ marginBottom: 0, lineHeight: 0, height: 30, padding: '0 8px', minWidth: 0 }}>
                                                                <img src={require(reftArrow} style={{ height: 18, width: 18 }} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                } */}

                                            {/* {console.log("value.length is 7777777777777777777", this.props.docData.filter(data => data.latitude === value.latitude && data.longitude === value.longitude))} */}
                                            <Carousel className="cs_sldr">
                                                {/* <AliceCarousel
                                                    // mouseTrackingEnabled 
                                                    items={ this.props.docData.filter(data => data.latitude === value.latitude && data.longitude === value.longitude)}
                                                    responsive={this.state.responsive}
                                                    slideToIndex={this.state.currentIndex}
                                                    dotsDisabled={true}
                                                    buttonsDisabled={true}
                                                    swipeDisabled={ this.props.docData.filter(data => data.latitude === value.latitude && data.longitude === value.longitude).length > 1 ? false : true}
                                                > */}
                                                {
                                                    this.props.docData.filter(data => data.latitude === value.latitude && data.longitude === value.longitude).map((value, key) =>
                                                        <div key={key} className="popup-rental yours-custom-class text-center img_round_cls w-100 mt-3">

                                                            <img src={`${value.profile_image ? value.profile_image : defaultImage}`} />
                                                            <div className="wrapper_content_box">
                                                                <h6>
                                                                    {`${value.first_name} ${value.last_name}`}
                                                                </h6>
                                                                <p>
                                                                    {value.primary_speciality}
                                                                </p>
                                                                <p className="text-muted mb-1 over-flow">
                                                                    {
                                                                        value.practice && value.practice.length > 0 ?
                                                                            value.practice.map(v => {
                                                                                return ` ${v.practice_name} ,${v.practice_location} ,${v.zip} `
                                                                            })
                                                                            :
                                                                            null
                                                                    }
                                                                </p>
                                                                <div className="text-muted mb-2">
                                                                    {value.reviewLength > 0 ? <RenderDocMapRating id={value.uid} reviewAverage={value.reviewAverage} reviewLength={value.reviewLength} latastReview={value.latastReview} /> : ''}
                                                                </div>
                                                                <div className="d-flex align-items-center justify-content-between" >
                                                                    <Link href={{ pathname: `/scheduleAppointment`, query: { id: value.uid } }} as={`/scheduleAppointment?${value.uid}`} ><a onClick={() => this.createScheduleItem(value.uid)}>
                                                                        Schedule Appointment</a>
                                                                                </Link>
                                                                    <Link href={{ pathname: `/viewProfile`, query: { id: value.uid } }} as={`/viewProfile?${value.uid}`} ><a onClick={() => this.createViewProfileItem(value.uid)}>
                                                                        View profile</a>
                                                                                </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                {/* </AliceCarousel> */}
                                            </Carousel>
                                        </Popup>


                                    </React.Fragment>
                                }
                            </Marker>
                        )
                        //     }
                        //     )
                        // }

                    })
                }



                {/* {this.props.geoJSON && this.props.geoJSON.features && this.props.geoJSON.features.map(feature => {
                    const data = feature.properties
                    return (
                        this.props.popupVenue ?
                            <Marker
                                // key={data.id}

                                position={[
                                    feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}

                                onMouseOver={() => {
                                    this.setState({ hover: data.id })
                                    // setHover(data.id)
                                }}
                                onMouseOut={() => {
                                    this.setState({ hover: false })
                                    // setHover(false)
                                }}
                                icon={this.state.hover === data.id || this.props.hoverCard === feature.properties.id ? highlightIcon : icon}
                            >

                                <Popup className="map-custom-popup" maxWidth="600" minWidth="200">
                                    <div className="popup-venue">
                                        {data.image ?
                                            <div
                                                className={`image d-none d-md-block`}
                                                style={{ backgroundImage: `url(/content/img/photo/${data.image})` }}
                                            />
                                            :
                                            <div className="image" />
                                        }
                                        <div className="text">
                                            {data.name &&
                                                <h6>
                                                    <Link href={data.link}>
                                                        <a>
                                                            {data.name}
                                                        </a>
                                                    </Link>
                                                </h6>
                                            }
                                            {data.about &&
                                                <p>
                                                    {data.about}
                                                </p>
                                            }
                                            {data.adress &&
                                                <p className="text-muted mb-1">
                                                    {data.adress}
                                                </p>
                                            }
                                            {data.email &&
                                                <p className="text-muted mb-1">
                                                    <i className="fas fa-envelope-open fa-fw text-dark mr-2" />
                                                    <a href={`mailto:${data.email}`}>
                                                        {data.email}
                                                    </a>

                                                </p>
                                            }
                                            {data.phone &&
                                                <p className="text-muted mb-1">
                                                    <i className="fa fa-phone fa-fw text-dark mr-2" />
                                                    {data.phone}

                                                </p>
                                            }
                                        </div>
                                    </div>

                                </Popup>
                            </Marker>
                            :
                            <Marker
                                key={data.id}
                                icon={icon}
                                opacity={0}
                                position={[
                                    feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                                onMouseOver={() => {
                                    this.setState({ hover: data.id })
                                    // setHover(data.id)
                                }}
                                onMouseOut={() => {
                                    this.setState({ hover: false })
                                    // setHover(false)
                                }}
                            >
                                <Tooltip
                                    permanent={true}
                                    interactive={true}
                                    direction="top"

                                    className={`map-custom-tooltip ${this.state.hover === data.id || this.props.hoverCard === feature.properties.id ? 'active' : ''}`}

                                >
                                    ${data.price}
                                </Tooltip>

                                <Popup className="map-custom-popup" maxWidth="600" minWidth="200">

                                    <div className="popup-rental">
                                        {data.image ?
                                            <div
                                                className={`image d-none d-md-block`}
                                                style={{ backgroundImage: `url(/content/img/photo/${data.image})` }}
                                            />
                                            :
                                            <div className="image" />
                                        }
                                        <div className="text">
                                            {data.name &&
                                                <h6>
                                                    <Link href={data.link}>
                                                        <a>
                                                            {data.name}
                                                        </a>
                                                    </Link>
                                                </h6>
                                            }
                                            <div className="text-xs">
                                                <Stars stars={data.stars} />
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                    )
                }
                )} */}
                {/* {this.props.markerPosition &&
                    <Marker
                        position={this.props.markerPosition}
                        icon={icon}
                    />
                } */}
                {/* {this.props.circlePosition &&
                    <Circle
                        center={this.props.circlePosition}
                        color={'#4E66F8'}
                        fillColor={'#8798fa'}
                        opacity={.5}
                        radius={this.props.circleRadius}
                        weight={2}
                    />
                } */}
            </Map >
        )
    }
}

 // this.props.popupVenue ?
                            // <React.Fragment>
                            //     <Marker
                            //         key={value.id}
                            //         onClick={this.props.handleMarkerOnClick}
                            //         position={[value.latitude ? value.latitude : '', value.longitude ? value.longitude : '']}
                            //         onMouseOver={() => {
                            //             this.setState({ hover: value.id })
                            //         }}
                            //         onMouseOut={() => {
                            //             this.setState({ hover: false })
                            //         }}
                            //         icon={this.state.hover === value.id || this.props.hoverCard === value.id ? highlightIcon : icon}
                            //     >
                            //         <Popup className="map-custom-popup" maxWidth="600" minWidth="200">

                            //             <div className="popup-venue">
                            //                 {/* ---------------------------------------------------------------------------------------------------------------- */}
                            //                 {/* <div style={{
                            //                 height: 'auto', width: '100%', padding: 5,
                            //                 display: 'flex',
                            //                 justifyContent: 'flex-end',
                            //                 alignItems: 'center',
                            //             }}>
                            //                 <img onClick={() => this.handleMarkerclick(-1)} src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-close-512.png" style={{ height: 12, width: 12, cursor: 'pointer' }} />
                            //             </div>
                            //             {
                            //                 value.length > 1 &&
                            //                 <div className="next_preview_action_container">
                            //                     <span style={{ marginRight: 15 }}>{`${this.state.currentIndex + 1} of ${value.length}`}</span>
                            //                     <div className="preNextActionButton">
                            //                         <button title="prev" onClick={() => this.slidePrev(value)} disabled={this.state.currentIndex === 0} className="btn" style={{ marginBottom: 0, lineHeight: 0, height: 30, padding: '0 8px', minWidth: 0 }}>
                            //                             <img src={require(leftArrow} style={{ height: 18, width: 18 }} />
                            //                         </button>
                            //                         <button title="next" onClick={() => this.slideNext(value)} disabled={(this.state.currentIndex + 1) === value.length} className="btn" style={{ marginBottom: 0, lineHeight: 0, height: 30, padding: '0 8px', minWidth: 0 }}>
                            //                             <img src={require(reftArrow} style={{ height: 18, width: 18 }} />
                            //                         </button>
                            //                     </div>
                            //                 </div>
                            //             } */}
                            //                 {/* ------------------------------------------------------------------------------------------------------------------------------------------------ */}
                            //                 <img src={`${value.profile_image ? value.profile_image : defaultImage}`} />
                            //                 <div className="text">
                            //                     <h6>
                            //                         {`${value.first_name} ${value.last_name}`}
                            //                     </h6>
                            //                     <p>
                            //                         {value.primary_speciality}
                            //                     </p>
                            //                     <p className="text-muted mb-1">
                            //                         {
                            //                             value.practice && value.practice.length > 0 ?
                            //                                 value.practice.map(v => {
                            //                                     return ` ${v.practice_name} ,${v.practice_location} ,${v.zip} `
                            //                                 })
                            //                                 :
                            //                                 null
                            //                         }
                            //                     </p>
                            //                     <p className="text-muted mb-1">
                            //                         {value.reviewLength > 0 ? <RenderDocMapRating id={value.uid} reviewAverage={value.reviewAverage} reviewLength={value.reviewLength} latastReview={value.latastReview} /> : ''}
                            //                     </p>
                            //                     <div>
                            //                         <table width="100%">
                            //                             <tr>
                            //                                 <td align="left"> <Link href={{ pathname: `/scheduleAppointment`, query: { id: this.props.id } }}>
                            //                                     <Button outline className="btn-btn-nw font-08r font-w500 outline-clr" color="primary">Schedule Appointment</Button>
                            //                                 </Link>
                            //                                 </td>
                            //                                 <td align="right"> <Link href={{ pathname: `/viewProfile`, query: { id: this.props.id } }} >
                            //                                     <Button outline className="btn-btn-nw ml-2 font-08r font-w500 outline-clr" color="primary">View profile</Button>
                            //                                 </Link></td>
                            //                             </tr>
                            //                         </table>
                            //                     </div>
                            //                 </div>
                            //             </div>

                            //         </Popup>
                            //     </Marker>
                            // </React.Fragment>
                            // :

