import styles from './AutoComplete.module.sass'
import * as React from 'react'
import { useEffect, useState } from 'react'

// see class based component notes

function markTitle(title, search) {
	const parts = title.toLowerCase().split(search.toLowerCase())
	let start = 0
	return parts.flatMap((part, index) => {
		let res = [title.substr(start, part.length)]
		start += part.length
		if (index < parts.length - 1)
			res.push(
				<span key={index} className={styles.highlight}>
					{title.substr(start, search.length)}
				</span>
			)
		start += search.length
		return res
	})
}

export default function AutoCompleteHooks(props) {
	const [search, setSearch] = useState('')
	const [showList, setShowList] = useState(false)
	const [choosenItem, setChoosenItem] = useState(null)

	//same hackish way to handle escape key which should be done with proper keyboard/mouse events handling
	const inputRef = React.useRef()
	const resetRef = React.useRef(false)

	function handleSearchChange(event) {
		let search = event.target.value
		setSearch(search)
		props.onSearch?.(search.trim())
	}

	function handleInputKeyPress(event) {
		if (event.key !== 'Escape') return
		setChoosenItem(null)
		resetRef.current = true
	}

	useEffect(() => {
		if (resetRef.current) {
			resetRef.current = false
			inputRef.current.blur()
		}
	})

	function onBlur() {
		if (choosenItem) {
			props.onChange?.(choosenItem)
			setSearch(choosenItem.title)
		}
		setShowList(false)
		setChoosenItem(null)
	}

	const options = props.options || []
	return (
		<div className={styles.container}>
			{props.loading ? <div className={styles.loading} /> : null}
			<input
				ref={inputRef}
				className={styles.input}
				value={search}
				onChange={handleSearchChange}
				onKeyDown={handleInputKeyPress}
				onFocus={() => setShowList(true)}
				onBlur={onBlur}
			/>
			{options.length && showList ? (
				<div className={styles.optionsHolder} onMouseLeave={() => setChoosenItem(null)}>
					<div className={styles.options}>
						{options.map((option) => (
							<div key={option.id} className={styles.optionItem} onMouseEnter={() => setChoosenItem(option)}>
								{markTitle(option.title, search)}
							</div>
						))}
					</div>
				</div>
			) : null}
		</div>
	)
}
