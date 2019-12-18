import { SET_TOKEN } from '../constants/user'

const INITIAL_USER_STATE = {
	token: '',
}

export function user(state = INITIAL_USER_STATE, action) {
	switch (action.type) {
		case SET_TOKEN:
			return {
				...state,
				token: action.token,
			}
		default:
			return state
	}
}
