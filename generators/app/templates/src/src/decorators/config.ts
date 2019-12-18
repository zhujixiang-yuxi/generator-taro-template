import Taro from '@tarojs/taro'
import { before } from './index'

export default WrappedComponent => {
	class ConfigDecorator extends WrappedComponent {
		@before
		async componentWillMount() {
			const app = Taro.getApp()
			if (!app.__updateManagerReady) {
				app.__updateManagerReady = true
				const updateManager = Taro.getUpdateManager()

				updateManager.onCheckForUpdate(res => {
					if (res.hasUpdate) {
						console.log('发现新的版本！')
					}
				})

				updateManager.onUpdateReady(() => {
					Taro.showModal({
						title: '更新提示',
						content: '新版本已准备就绪，是否重启应用？',
						success(res) {
							if (res.confirm) {
								updateManager.applyUpdate()
							}
						},
					})
				})
			}
		}
	}

	return ConfigDecorator
}
