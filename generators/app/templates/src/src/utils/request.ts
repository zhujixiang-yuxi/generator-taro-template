import Http from '../lib/request'

const httpConfig = {
	// 获取token的接口地址（不含domain）
	loginUrl: '/wxLogin',
	// 获取token的接口的入参形式, 具体的获取交由request去做
	// 这里只要给一个入参名字
	loginParamsName: 'code',
}

const http = new Http(httpConfig)

http.use(1403, (response: any) => {
	console.log(response, '-----')
})

export default http
