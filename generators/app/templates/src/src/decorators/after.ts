import _ from 'lodash-miniprogram'

export default (target, name, descriptor) => {
	const { value: original } = descriptor
	descriptor.value = async function(...args) {
		const handler = _.get(target, `__proto__.${name}`)
		if (_.isFunction(handler)) {
			try {
				await handler.apply(this, args)
			} catch (e) {
				console.error(e)
			}
		}

		try {
			await original.apply(this, args)
		} catch (e) {
			console.error(e)
		}
	}
}
