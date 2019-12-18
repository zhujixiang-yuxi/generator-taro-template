import _ from 'lodash-miniprogram'

const timer = () =>
	new Promise(resolve => {
		setTimeout(() => {
			resolve(11)
		}, 2000)
	})

export default (target, name, descriptor) => {
	const { value: original } = descriptor
	descriptor.value = async function(...args) {
		try {
			await original.apply(this, args)
			await timer()
		} catch (e) {
			console.error(e)
		}
		const handler = _.get(target, `__proto__.${name}`)
		if (_.isFunction(handler)) {
			try {
				await handler.apply(this, args)
			} catch (e) {
				console.error(e)
			}
		}
	}
}
