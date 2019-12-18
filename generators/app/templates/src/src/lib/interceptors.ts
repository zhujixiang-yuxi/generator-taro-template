import { HTTP_STATUS } from '@/constants'

const rspInterceptor = chain => {
	const requestParams = chain.requestParams
	return chain.proceed(requestParams).then(res => {
		if (res.statusCode > 200 && res.statusCode < 300) {
			res.selfMessage = '请求资源不存在'
			return Promise.reject(res)
		} else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
			res.selfMessage = '服务端出现了问题'
			return Promise.reject(res)
		} else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
			// TODO 根据自身业务修改
			res.selfMessage = '没有权限访问'
			return Promise.reject(res)
		} else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
			res.selfMessage = '没有权限访问'
			return Promise.reject(res)
		} else if (res.statusCode === HTTP_STATUS.SUCCESS) {
			return Promise.resolve(res)
		} else {
			res.selfMessage = '服务端出现了问题'
			return Promise.reject(res)
		}
	})
}

// Taro 提供了两个内置拦截器
// logInterceptor - 用于打印请求的相关信息
// timeoutInterceptor - 在请求超时时抛出错误。
const interceptors = [rspInterceptor]

export default interceptors
