import styles from './App.module.sass'
import AutoComplete from './components/AutoComplete'
import withDataLoading from './components/AutoCompleteWithData'
import { useState } from 'react'
import AutoCompleteHooks from './components/AutoCompleteHooks'

const AutoCompleteWithData = withDataLoading(AutoComplete)
const AutoCompleteWithDataHooks = withDataLoading(AutoCompleteHooks)

function App() {
	const [selectedChar, setSelectedChar] = useState(null)
	return (
		<div className={styles.container}>
			<div className={styles.dogHolder} />
			<h2>Choose your character</h2>
			<div className={styles.inputs}>
				<div>
					Class based: <AutoCompleteWithData onChange={setSelectedChar} />
				</div>
				<div>
					Hooks: <AutoCompleteWithDataHooks onChange={setSelectedChar} />
				</div>
			</div>
			{selectedChar && (
				<div className={styles.character}>
					<img src={selectedChar.image} className={styles.image} alt={selectedChar.name} />
					{selectedChar.name}
				</div>
			)}
		</div>
	)
}

export default App
