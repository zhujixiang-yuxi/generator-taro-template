import Taro from '@tarojs/taro'
import _ from 'lodash-miniprogram'

const {
	ENV_TYPE: { WEAPP, ALIPAY },
} = Taro
const env = Taro.getEnv()

export const promisely = (func, args) => {
	return new Promise((resolve, reject) => {
		func({
			...args,
			success() {
				resolve(...arguments)
			},
			fail() {
				reject(...arguments)
			},
			complete() {
				resolve(...arguments)
			},
		})
	})
}

export const getAuthCode = (...scopes) => {
	return new Promise(async (resolve, reject) => {
		switch (env) {
			case WEAPP:
				wx.login({
					success,
				})
				break
			case ALIPAY:
				scopes = _.isEmpty(scopes) ? ['auth_base'] : scopes
				my.getAuthCode({
					scopes,
					success,
					fail,
				})
				break
		}

		function success(res) {
			const { code, authCode = code } = res
			resolve(authCode)
		}

		function fail() {
			reject()
		}
	})
}

export const setClipboard = async text => {
	switch (env) {
		case WEAPP:
			return await Taro.setClipboardData({
				data: text,
			})
		case ALIPAY:
			return await promisely(my.setClipboard, {
				text,
			})
	}
}

export const downloadFile = async url => {
	switch (env) {
		case WEAPP:
			return await promisely(wx.downloadFile, {
				url,
			})
		case ALIPAY:
			return await promisely(my.setClipboard, {
				url,
			})
	}
}

const versionToNumber = version =>
	parseInt(
		version
			.split('.')
			.map(n => ('000000' + n).slice(-5))
			.join(''),
		10,
	)

export const gte = minVersion => {
	minVersion = versionToNumber(minVersion)
	let currentVersion = ''
	switch (env) {
		case WEAPP:
			currentVersion = wx.getSystemInfoSync().SDKVersion
			break
		case ALIPAY:
			currentVersion = my.SDKVersion
			break
	}
	return versionToNumber(currentVersion) >= minVersion
}

// export const requestPayment = async args => {
// 	return new Promise(async (resolve, reject) => {
// 		switch (env) {
// 			case WEAPP:
// 				Taro.requestPayment(args)
// 					.then(res => resolve(res))
// 					.catch(e => reject(e))
// 				break
// 			case ALIPAY:
// 				promisely(my.tradePay, args)
// 					.then(res => {
// 						const resultCode = res.resultCode
// 						if (~~resultCode === 9000) {
// 							resolve(res)
// 						} else {
// 							reject(res)
// 						}
// 					})
// 					.catch(e => reject(e))
// 		}
// 	})
// }

export const isIPhoneX = () => {
	const { model } = Taro.getSystemInfoSync()
	return /iphone\s?(x|11)/gi.test(model)
}
