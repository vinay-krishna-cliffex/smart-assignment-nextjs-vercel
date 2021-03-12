import { call, put } from "redux-saga/effects";
import axios from "axios";
import { GET_DOC_REVIEW_SUCCESS_REQUEST, GET_DOC_REVIEW_FAILURE_REQUEST } from '../../actions/Action';
import { Baseurl } from '../../utils/Baseurl';

export function getDocReviews(url) {
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


export function* docReviewsSaga(action) {
    try {
        const response = yield call(getDocReviews, `api/review/get_review?parameter=${action.data.docId}-doc_id`);
        // console.log("getDocReviews is",action.data.docId)

        if(action.data.handleAllRating!==null)
        {
            action.data.handleAllRating(response.data.data);
        }

        // console.log("in-saga-docRevies---->", response.data.data);
        const reviewData = response.data.data;

        // dispatch a success action to the store with the new data
        yield put({ type: GET_DOC_REVIEW_SUCCESS_REQUEST, reviewData });
    } catch (error) {
        // dispatch a failure action to the store with the error
        yield put({ type: GET_DOC_REVIEW_FAILURE_REQUEST, error });
        //{openNotificationWithIcon('error',"User Registration",error)}
    }
}






