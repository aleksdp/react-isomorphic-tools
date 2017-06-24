import Immutable from 'immutable'
import {FETCH_TO_STATE_REQUEST, FETCH_TO_STATE_SUCCESS, FETCH_TO_STATE_FAIL} from '../constants'

const fetchData = (state = {}, action) => {
    switch (action.type) {
        case FETCH_TO_STATE_REQUEST:
            return {
                ...state, [action.meta.key]: {
                    ...state[action.meta.key],
                    _request: action.payload.request,
                    isFetching: true,
                    isFetched: false,
                    error: false
                }
            }
        case FETCH_TO_STATE_SUCCESS:
            return {
                ...state, [action.meta.key]: {
                    ...action.payload,
                    isFetched: true,
                    isFetching: false,
                    error: false,
                    _request: undefined
                }
            }
        case FETCH_TO_STATE_FAIL:
            return {
                ...state, [action.meta.key]: {
                    ...state[action.meta.key],
                    error: action.payload.error,
                    isFetching: false,
                    isFetched: false,
                }
            }
        default:
            return state
    }
}

const ImmutableFetchData = (state = Immutable.fromJS({}), action) => {
    switch (action.type) {
        case FETCH_TO_STATE_REQUEST:
            return state.mergeIn([action.meta.key], Immutable.fromJS({
                _request: action.payload.request,
                isFetching: true,
                isFetched: false,
                error: false
            }))

        case FETCH_TO_STATE_SUCCESS:
            return state.set(action.meta.key, Immutable.fromJS({
                ...action.payload,
                isFetched: true,
                isFetching: false,
                error: false,
            }))

        case FETCH_TO_STATE_FAIL:
            return state.set(action.meta.key, {
                error: action.payload.error,
                isFetching: false,
                isFetched: false,
            })

        default:
            return state
    }
}

export {fetchData, ImmutableFetchData}