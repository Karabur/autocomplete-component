import styles from './App.module.sass'
import AutoComplete from './components/AutoComplete'
import withDataLoading from './components/AutoCompleteWithData'
import { useState } from 'react'

const AutoCompleteWithData = withDataLoading(AutoComplete)

function App() {
	const [selectedChar, setSelectedChar] = useState(null)
	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Choose your character</h2>
			<AutoCompleteWithData onChange={setSelectedChar} />
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
