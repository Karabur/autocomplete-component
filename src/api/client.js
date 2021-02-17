//this could be probably made not module level but scoped in some form - for component for example.
let abortController

export function fetchData(search) {
	if (abortController) abortController.abort()
	abortController = new AbortController()

	//results can be a big list, we should handle that properly, but it depends on specific API implementation
	return fetch(`https://rickandmortyapi.com/api/character/?name=${search}`, {
		signal: abortController.signal,
	})
		.then((res) => res.json())
		.catch((e) => {
			//we should catch in a component and display UI message
			//either throw proper error here or remove that catch completely
			console.error(`Error fetching data`, e)
		})
		.then((data) => {
			return data?.results || []
		})
}
