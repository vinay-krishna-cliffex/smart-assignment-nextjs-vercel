import { takeLatest } from "redux-saga/effects";
import { docListSaga } from './workersagas/GetDocListSaga';
import { docProfileSaga } from './workersagas/GetDocProfileSaga';
import { docReviewsSaga } from './workersagas/GetDocReviewSaga';
import { patientReviewsSaga } from './workersagas/GetPatientReviewSaga';
import { searchDocSaga } from './workersagas/SearchDocSaga';
import { searchZipSaga } from './workersagas/SearchZipSaga';
import { getUserAppointmentsSaga } from './workersagas/GetUserAppointmentSaga';
import { userDetailsSaga } from './workersagas/GetUserDetails';


import {
    GET_DOCTOR_LIST_REQUEST,
    DOC_PROFILE_REQUEST,
    GET_DOC_REVIEW_REQUEST,
    GET_PATIENT_REVIEW_REQUEST,
    SEARCH_DOC_SPECIALITY_REQUEST,
    SEARCH_ZIP_REQUEST,
    USER_APPOINTMENTS_REQUEST,
    GETUSER_DETAILS_REQUEST
} from '../actions/Action';

export function* watcherSaga() {
    yield takeLatest(GET_DOCTOR_LIST_REQUEST, docListSaga);
    yield takeLatest(DOC_PROFILE_REQUEST, docProfileSaga);
    yield takeLatest(GETUSER_DETAILS_REQUEST, userDetailsSaga);
    yield takeLatest(GET_DOC_REVIEW_REQUEST, docReviewsSaga);
    yield takeLatest(GET_PATIENT_REVIEW_REQUEST, patientReviewsSaga);
    yield takeLatest(SEARCH_DOC_SPECIALITY_REQUEST, searchDocSaga);
    yield takeLatest(SEARCH_ZIP_REQUEST, searchZipSaga);
    yield takeLatest(USER_APPOINTMENTS_REQUEST, getUserAppointmentsSaga);
}