import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { config } from '@/decorators'

@(config as any)
class Deco extends Component {
	config = {
		navigationBarTitleText: '',
	}

	state = {}

	componentWillMount() {
		console.log('这个生命周期函数会延迟2秒执行\n你也可以通过这种方式在页面初次请求之前获取token')
	}

	componentDidMount() {}

	// componentWillReceiveProps (nextProps,nextContext) {}

	componentWillUnmount() {}

	componentDidShow() {}

	componentDidHide() {}

	componentDidCatchError() {}

	componentDidNotFound() {}

	render() {
		return <View></View>
	}
}
export default Deco
