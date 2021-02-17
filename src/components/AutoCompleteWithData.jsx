import debounce from '../utils/debounce'
import * as React from 'react'
import { fetchData } from '../api/client'

export default function withDataLoading(Component) {
	return class AutoCompleteWithData extends React.Component {
		state = {
			characters: [],
			loading: false,
		}

		onSearch = debounce(500, async (search) => {
			if (!search) return
			this.setState({ loading: true })
			const data = await fetchData(search)
			this.setState({
				characters: data,
				loading: false,
			})
		})

		onChange = (option) => {
			let find = this.state.characters.find((char) => char.id === option.id)
			this.props.onChange?.(find)
		}

		render() {
			return (
				<Component
					loading={this.state.loading}
					options={this.state.characters.map((item) => ({ id: item.id, title: item.name }))}
					onSearch={this.onSearch}
					{...this.props}
					onChange={this.onChange}
				/>
			)
		}
	}
}
