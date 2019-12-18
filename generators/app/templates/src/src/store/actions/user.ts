import { SET_TOKEN } from '../constants/user'

export function setToken(token) {
	return {
		type: SET_TOKEN,
		token,
	}
}
