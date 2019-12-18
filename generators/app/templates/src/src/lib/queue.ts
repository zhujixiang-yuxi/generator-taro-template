class Queue {
	public queue: Array<any>
	constructor() {
		this.queue = []
	}

	//入队
	enqueue(arg: any) {
		this.queue.push(arg)
	}

	//出队
	dequeue() {
		let result = this.queue.shift()
		return typeof result != 'undefined' ? result : false
	}

	//队列是否为空
	isEmpty() {
		return this.queue.length == 0
	}

	//返回队列长度
	size() {
		return this.queue.length
	}

	//清空队列
	clear() {
		this.queue = []
	}

	//返回队列
	show() {
		return this.queue
	}

	//出队并且执行，直到清空队列
	loopExec() {
		if (this.isEmpty()) return
		let element = this.dequeue()
		typeof element === 'function' && element()
		this.loopExec()
	}
}

export default Queue
