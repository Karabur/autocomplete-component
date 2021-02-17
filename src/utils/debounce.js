export default function debounce(timeout, target) {
	let timer = null
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			target(...args)
		}, timeout)
	}
}
