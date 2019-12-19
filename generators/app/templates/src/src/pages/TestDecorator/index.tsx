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
		console.log('生命周期会延时2s')
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
