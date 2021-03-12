import { call, put } from "redux-saga/effects";
import axios from "axios";
import { GET_DOCTOR_LIST_SUCCESS_REQUEST, GET_DOCTOR_LIST_FAILURE_REQUEST } from '../../actions/Action';
import { Baseurl } from '../../utils/Baseurl';

export function getDocList(url) {
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


export function* docListSaga(action) {
    try {
        const response = yield call(getDocList, `api/doc/getDoctorsList?speciality=${action.data.specaility}&practice=${action.data.practice}&insurance_providers=${action.data.insurance_provider}&zip=${action.data.zip}`);
        // console.log("in-saga-doclist---->",response);
        const docList = response.data.data;


        // dispatch a success action to the store with the new data
        yield put({ type: GET_DOCTOR_LIST_SUCCESS_REQUEST, docList });
    } catch (error) {
        // dispatch a failure action to the store with the error
        yield put({ type: GET_DOCTOR_LIST_FAILURE_REQUEST, error });
        //{openNotificationWithIcon('error',"User Registration",error)}
    }
}




