import { call, put } from "redux-saga/effects";
import axios from "axios";
import { GETUSER_DETAILS_SUCCESS_REQUEST, GETUSER_DETAILS_FAILURE_REQUEST } from '../../actions/Action';
import { Baseurl } from '../../utils/Baseurl';

export function getUserDetails(url) {
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


export function* userDetailsSaga(action) {
    try {
        const response = yield call(getUserDetails, `api/user/getuserdetails?userId=${action.data}`);
        // console.log("in-saga-userProfile---->", response.data.user);
        const userProfile = response.data.user;

        // dispatch a success action to the store with the new data
        yield put({ type: GETUSER_DETAILS_SUCCESS_REQUEST, userProfile });
    } catch (error) {
        // dispatch a failure action to the store with the error
        yield put({ type: GETUSER_DETAILS_FAILURE_REQUEST, error });
        //{openNotificationWithIcon('error',"User Registration",error)}
    }
}




