import { createStore, applyMiddleware, combineReducers, compose } from "redux";

import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";

import reducers from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [thunk, sagaMiddleware, logger];

const store = createStore(
  combineReducers({ ...reducers }),
  compose(applyMiddleware(...middlewares))
);

sagaMiddleware.run(rootSaga);

export { store };
