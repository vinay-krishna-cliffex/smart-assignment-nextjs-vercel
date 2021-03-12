import { call, put } from "redux-saga/effects";
import axios from "axios";
import { GET_PATIENT_REVIEW_SUCCESS_REQUEST, GET_PATIENT_REVIEW_FAILURE_REQUEST } from '../../actions/Action';
import { Baseurl } from '../../utils/Baseurl';

export function getPatientReviews(url) {
    let headers = {
        'Content-Type': 'application/json',
        'Pragma': 'no-cache'
    };
    return axios({
        method: "get",
        url: Baseurl + url,
        headers
    });
}


export function* patientReviewsSaga(action) {
    try {
        const response = yield call(getPatientReviews, `api/review/get_review?parameter=${action.data}-patient_id`);
        // console.log("in-saga-patientRevies---->", response.data.data);
        const patientreviews = response.data.data;

        // dispatch a success action to the store with the new data
        yield put({ type: GET_PATIENT_REVIEW_SUCCESS_REQUEST, patientreviews });
    } catch (error) {
        // dispatch a failure action to the store with the error
        yield put({ type: GET_PATIENT_REVIEW_FAILURE_REQUEST, error });
        //{openNotificationWithIcon('error',"User Registration",error)}
    }
}






