import { all, takeEvery, put, call } from "redux-saga/effects";
import actions from "./action";

import ModelHelper from "../../services/model";

export function* getModels() {
  const fakeData = yield call(ModelHelper.getModels);

  yield put({
    type: actions.GET_MODELS_SUCCESS,
    payload: fakeData
  });
}

export function* getFiltered(payload) {
  const fakeData = yield call(ModelHelper.getFilteredData, payload);
  yield put({
    type: actions.GET_MODELS_SUCCESS,
    payload: fakeData
  });
}

export default function*() {
  yield all([
    takeEvery(actions.GET_MODELS, getModels),
    takeEvery(actions.GET_FILTER, getFiltered)
  ]);
}
