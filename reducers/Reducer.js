let initialState = {
    isLoading: false,
    docList: [],
    docDetails: {},
    docReviewData: [],
    patientReviewData: [],
    searchDocResult: [],
    zipResult: [],
    user_appointments: [],
    userDetails: {},
    spinner:false,
    isAuth:false
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {

        case "HANDLE_AUTH":
            {
                return {
                    ...state,
                    isAuth: action.data
                }
            }
              /*---------------------------------------------SAVE_USER_IN_REDUX----------------------------------------------*/

        case "SAVE_USER_IN_REDUX":
            {
                return {
                    ...state,
                    userDetails: action.data
                }
            }


        /*---------------------------------------------save-user-details----------------------------------------------*/

        case "GETUSER_DETAILS_REQUEST":
            {
                return {
                    ...state,
                    isLoading: true
                }
            }
        case "GETUSER_DETAILS_SUCCESS_REQUEST":
            {
                return {
                    ...state,
                    isLoading: false,
                    userDetails: action.userProfile
                }
            }
        case "GETUSER_DETAILS_FAILURE_REQUEST":
            {
                return {
                    ...state,
                    isLoading: false,
                    userDetails: action.error
                }
            }


        /*---------------------------------------------save-doc-search-result-state----------------------------------------------*/

        case "SEARCH_DOC_SPECIALITY_REQUEST":
            {
                return {
                    ...state,
                }
            }
        case "SEARCH_DOC_SPECIALITY_SUCCESS_REQUEST":
            {
                return {
                    ...state,
                    searchDocResult: action.docSearchResult,
                }
            }
        case "SEARCH_DOC_SPECIALITY_FAILURE_REQUEST":
            {
                return {
                    ...state,
                    searchDocResult: action.error,
                }
            }



        /*---------------------------------------------save-zip-search-result-state----------------------------------------------*/

        case "SEARCH_ZIP_REQUEST":
            {
                return {
                    ...state,
                }
            }
        case "SEARCH_ZIP_SUCCESS_REQUEST":
            {
                return {
                    ...state,
                    zipResult: action.zipResult,
                }
            }
        case "SEARCH_ZIP_FAILURE_REQUEST":
            {
                return {
                    ...state,
                    zipResult: action.error,
                }
            }



        /*---------------------------------------------doc-list----------------------------------------------*/

        case "GET_DOCTOR_LIST_REQUEST":
            {
                return {
                    ...state,
                    isLoading: true,
                }
            }
        case "GET_DOCTOR_LIST_SUCCESS_REQUEST":
            {
                return {
                    ...state,
                    isLoading: false,
                    docList: action.docList

                }
            }
        case "GET_DOCTOR_LIST_FAILURE_REQUEST":
            {
                return {
                    ...state,
                    isLoading: false,
                    docList: action.error
                }
            }

        /*---------------------------------------------doc-profile----------------------------------------------*/

        case "DOC_PROFILE_REQUEST":
            {
                return {
                    ...state,
                    spinner: true
                }
            }
        case "DOC_PROFILE_SUCCESS_REQUEST":
            {
                return {
                    ...state,
                    docDetails: action.docProfile,
                    spinner: false
                }
            }
        case "DOC_PROFILE_FAILURE_REQUEST":
            {
                return {
                    ...state,
                    docDetails: action.error,
                    spinner: false
                }
            }

        /*----------------------------------------------set-doc-review-data----------------------------------*/

        case "GET_DOC_REVIEW_REQUEST":
            {
                return {
                    ...state,
                }
            }
        case "GET_DOC_REVIEW_SUCCESS_REQUEST":
            {
                return {
                    ...state,
                    docReviewData: action.reviewData,
                }
            }
        case "GET_DOC_REVIEW_FAILURE_REQUEST":
            {
                return {
                    ...state,
                    docReviewData: action.error,
                }
            }

        /*----------------------------------------------set-patient-review-data----------------------------------*/

        case "GET_PATIENT_REVIEW_REQUEST":
            {
                return {
                    ...state,
                    isLoading: true,
                }
            }
        case "GET_PATIENT_REVIEW_SUCCESS_REQUEST":
            {
                return {
                    ...state,
                    isLoading: false,
                    patientReviewData: action.patientreviews
                }
            }
        case "GET_PATIENT_REVIEW_FAILURE_REQUEST":
            {
                return {
                    ...state,
                    isLoading: false,
                    patientReviewData: action.error
                }
            }


        /*----------------------------------------------set-user-appointments-data----------------------------------*/

        case "USER_APPOINTMENTS_REQUEST":
            {
                return {
                    ...state,
                    isLoading: true,
                }
            }
        case "USER_APPOINTMENTS_SUCCESS_REQUEST":
            {
                return {
                    ...state,
                    isLoading: false,
                    user_appointments: action.userAppoints
                }
            }
        case "USER_APPOINTMENTS_FAILURE_REQUEST":
            {
                return {
                    ...state,
                    isLoading: false,
                    user_appointments: action.error
                }
            }


        default:
            return state;

    }
}
