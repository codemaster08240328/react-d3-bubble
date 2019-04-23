import { all } from "redux-saga/effects";
import modelSaga from "./model/saga";

export default function* rootSaga(getState) {
  yield all([modelSaga()]);
}
