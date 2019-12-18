import { useEffect, useRef } from '@tarojs/taro'

export function useInterval(callback, delay) {
	const savedCallback = useRef(callback)

	// // 保存新回调
	// useEffect(() => {
	// 	savedCallback.current = callback
	// })

	// 建立 interval
	useEffect(() => {
		function tick() {
			savedCallback.current()
		}
		if (delay !== null) {
			let id = setInterval(tick, delay)
			return () => clearInterval(id)
		}
	}, [delay])
}
