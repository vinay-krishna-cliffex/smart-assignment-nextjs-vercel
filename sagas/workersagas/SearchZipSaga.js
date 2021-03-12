import { call, put } from "redux-saga/effects";
import axios from "axios";
import { SEARCH_ZIP_SUCCESS_REQUEST, SEARCH_ZIP_FAILURE_REQUEST } from '../../actions/Action';
import { Baseurl } from '../../utils/Baseurl';

export function handleSearchZip(url) {
    let headers = {
        'Content-Type': 'application/json',
    };
    return axios({
        method: "get",
        url: Baseurl + url,
        headers
    });
}


export function* searchZipSaga(action) {
    try {
        const response = yield call(handleSearchZip, `api/doc/searchzipcode?zip=${action.data}`);
        // console.log("in-saga-searchDoc---->", response.data.data);
        const zipResult = response.data.data;

        // dispatch a success action to the store with the new data
        yield put({ type: SEARCH_ZIP_SUCCESS_REQUEST, zipResult });
    } catch (error) {
        // dispatch a failure action to the store with the error
        yield put({ type: SEARCH_ZIP_FAILURE_REQUEST, error });
    }
}




