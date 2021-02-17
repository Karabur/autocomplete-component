import styles from './AutoComplete.module.sass'
import * as React from 'react'

// it only allows to select values from the list, but not arbitrary string entered to input
// nor it does not accept value prop and does not follow value/onChange convention, which probably woudld be desired
// as real world component it would probably have way more functionalities, including noted above
export default class AutoComplete extends React.Component {
	state = {
		search: '',
		showList: false,
		//kind of hackish, it should properly handle clicks outside component to hide suggestions, and inside a list to select item
		choosenItem: null,
	}
	inputRef = React.createRef()

	handleSearchChange = (event) => {
		let search = event.target.value
		this.setState({ search: search })
		this.props.onSearch?.(search.trim())
	}

	markTitle(title) {
		const parts = title.toLowerCase().split(this.state.search.toLowerCase())
		let start = 0
		return parts.flatMap((part, index) => {
			let res = [title.substr(start, part.length)]
			start += part.length
			if (index < parts.length - 1)
				res.push(
					<span key={index} className={styles.highlight}>
						{title.substr(start, this.state.search.length)}
					</span>
				)
			start += this.state.search.length
			return res
		})
	}

	showList = () => {
		this.setState({ showList: true })
	}

	onBlur = () => {
		if (this.state.choosenItem) {
			this.props.onChange?.(this.state.choosenItem)
			this.setState((state) => ({ search: state.choosenItem.title }))
		}
		this.setState({ showList: false, choosenItem: null })
	}

	clearSelected = () => this.setState({ choosenItem: null })

	handleInputKeyPress = (event) => {
		if (event.key !== 'Escape') return
		this.setState({ choosenItem: null }, () => this.inputRef.current.blur())
	}

	render() {
		const options = this.props.options || []
		return (
			<div className={styles.container}>
				{this.props.loading ? <div className={styles.loading} /> : null}
				<input
					ref={this.inputRef}
					className={styles.input}
					value={this.state.search}
					onChange={this.handleSearchChange}
					onKeyDown={this.handleInputKeyPress}
					onFocus={this.showList}
					onBlur={this.onBlur}
				/>
				{options.length && this.state.showList ? (
					<div className={styles.optionsHolder} onMouseLeave={this.clearSelected}>
						<div className={styles.options}>
							{options.map((option) => (
								<div
									key={option.id}
									className={styles.optionItem}
									onMouseEnter={() => this.setState({ choosenItem: option })}
								>
									{this.markTitle(option.title)}
								</div>
							))}
						</div>
					</div>
				) : null}
			</div>
		)
	}
}
