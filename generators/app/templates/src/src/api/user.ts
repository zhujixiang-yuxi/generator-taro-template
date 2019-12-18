import { http } from '@/utils'

export const getUserInfo = () => {
	const url = '/wx/customer/info'
	return http.post(url)
}
