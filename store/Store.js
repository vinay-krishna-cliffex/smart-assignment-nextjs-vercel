import { reducer } from "../reducers/Reducer";
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux'
// import logger from 'redux-logger';
import { watcherSaga } from "../sagas/AllWatcherSagas";
import createSagaMiddleware from "redux-saga";


const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducer,composeWithDevTools(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(watcherSaga);

export default store;
