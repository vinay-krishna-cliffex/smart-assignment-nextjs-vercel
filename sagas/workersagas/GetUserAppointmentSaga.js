import { call, put } from "redux-saga/effects";
import axios from "axios";
import { USER_APPOINTMENTS_SUCCESS_REQUEST, USER_APPOINTMENTS_FAILURE_REQUEST } from '../../actions/Action';
import { Baseurl } from '../../utils/Baseurl';

export function getUserAppointments(url) {
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


export function* getUserAppointmentsSaga(action) {
    try {
        const response = yield call(getUserAppointments, `api/appointment/get_appointments?uid=${action.data}`);
        // console.log("in-saga-doclist---->",response.data.data);
        const userAppoints = response.data.data;

        // dispatch a success action to the store with the new data
        yield put({ type: USER_APPOINTMENTS_SUCCESS_REQUEST, userAppoints });
    } catch (error) {
        // dispatch a failure action to the store with the error
        yield put({ type: USER_APPOINTMENTS_FAILURE_REQUEST, error });
    }
}




