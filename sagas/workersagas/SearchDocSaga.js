import { call, put } from "redux-saga/effects";
import axios from "axios";
import { SEARCH_DOC_SPECIALITY_SUCCESS_REQUEST, SEARCH_DOC_SPECIALITY_FAILURE_REQUEST } from '../../actions/Action';
import { Baseurl } from '../../utils/Baseurl';

export function handleSearchDoc(url) {
    let headers = {
        'Content-Type': 'application/json',
    };
    return axios({
        method: "get",
        url: Baseurl + url,
        headers
    });
}


export function* searchDocSaga(action) {
    try {
        const response = yield call(handleSearchDoc, `api/doc/dropdowncontent?search=${action.data}`);
        // console.log("in-saga-searchDoc---->", response.data.data);
        const docSearchResult = response.data.data;

        // dispatch a success action to the store with the new data
        yield put({ type: SEARCH_DOC_SPECIALITY_SUCCESS_REQUEST, docSearchResult });
    } catch (error) {
        // dispatch a failure action to the store with the error
        yield put({ type: SEARCH_DOC_SPECIALITY_FAILURE_REQUEST, error });
    }
}




