import Taro from '@tarojs/taro'
import { getAuthCode, isType } from '@/utils'
import { HttpResponse } from '@/interfaces'
import { CUSTOM_HTTP_STATUS } from '@/constants'
import interceptors from './interceptors'
import store from '../store'
import { setToken } from '../store/actions/user'
import Queue from './queue'

interceptors.forEach(interceptorItem => Taro.addInterceptor(interceptorItem))
const requestQueue = new Queue()
const env = process.env.NODE_ENV

export default class Http {
	//自定义错误处理队列
	protected middlewares
	//获取token的接口地址（不含domain）
	protected loginUrl: string
	//获取token的接口的入参名, 具体的获取交由request去做
	//这里只要给一个入参名字，目前支持微信和支付宝
	protected loginParamsName

	constructor({ loginUrl, loginParamsName }) {
		this.loginUrl = loginUrl
		this.loginParamsName = loginParamsName
		this.middlewares = []
	}

	//将请求错误进行一次封装
	encapsulationResponseErr(err) {
		console.log(err)
		return err
	}

	use(code, fn) {
		this.middlewares.push([code, fn])
	}

	getBaseUrl() {
		return API_GATEWAY[env]
	}

	getToken() {
		return new Promise(async (resolve, reject) => {
			const authCode = await getAuthCode('auth_base')
			this.post(this.loginUrl, { [this.loginParamsName]: authCode })
				.then(res => {
					const token = res.result.token
					store.dispatch(setToken(token))
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
		})
	}

	async handleNotAuthRequest(config, resolve, reject, selfRequestErrorHandler) {
		const notTokenRequest = async () => {
			return resolve(await this.request(config, selfRequestErrorHandler).catch(err => reject(err)))
		}
		requestQueue.enqueue(notTokenRequest)
		if (requestQueue.size() === 1) {
			await this.getToken()
			requestQueue.loopExec()
		}
	}

	request(config: Taro.request.Param<any>, selfRequestErrorHandler): Promise<HttpResponse> {
		return new Promise(async (resolve, reject) => {
			const { user } = store.getState()
			config.header = {
				'Content-Type': 'application/json', // 默认值
				Authorization: `Bearer ${user.token}`,
			}
			if (!user.token && !config.url.includes(this.loginUrl)) {
				return this.handleNotAuthRequest(config, resolve, reject, selfRequestErrorHandler)
			}
			const { data: response } = await Taro.request(config).catch(err => this.encapsulationResponseErr(err))
			const { code, errorMsg } = response
			if (code === CUSTOM_HTTP_STATUS.SUCCESS) return resolve(response)
			if (isType(selfRequestErrorHandler, 'function')) {
				selfRequestErrorHandler(response)
				return reject(response)
			}
			const matchError = this.middlewares.some(element => {
				const [errCode, handleErrFn] = element
				if (errCode === code) {
					handleErrFn(response)
					return true
				}
			})
			if (!matchError) {
				Taro.showToast({
					title: errorMsg || '服务暂不可用，请稍后重试',
					icon: 'none',
				})
			}
			reject(response)
		})
	}

	post(path, data = {}, selfRequestErrorHandler?: any): Promise<HttpResponse> {
		const url = this.getBaseUrl() + path
		const method = 'POST'
		return this.request({ method, url, data }, selfRequestErrorHandler)
	}

	get(path: string, selfRequestErrorHandler?: any): Promise<HttpResponse> {
		const url = this.getBaseUrl() + path
		const method = 'GET'
		return this.request({ method, url }, selfRequestErrorHandler)
	}
}
