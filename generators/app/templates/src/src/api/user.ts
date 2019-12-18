import { http } from '@/utils'

export const getUserInfo = () => {
	const url = '/customer/info'
	return http.post(url)
}
