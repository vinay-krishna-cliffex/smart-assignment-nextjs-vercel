import { call, put } from "redux-saga/effects";
import axios from "axios";
import { DOC_PROFILE_SUCCESS_REQUEST, DOC_PROFILE_FAILURE_REQUEST } from '../../actions/Action';
import { Baseurl } from '../../utils/Baseurl';

export function getDocProfile(url) {
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


export function* docProfileSaga(action) {
    try {
        const response = yield call(getDocProfile, `api/doc/getDetails?userId=${action.data}`);
        const docProfile = response.data.user;
        yield put({ type: DOC_PROFILE_SUCCESS_REQUEST, docProfile });
    } catch (error) {
        yield put({ type: DOC_PROFILE_FAILURE_REQUEST, error });
    }
}




