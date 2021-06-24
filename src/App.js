import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
	const [value, setValue] = useState('')

	const onChange = (event) => {
		setValue(event.target.value)
	}

	return {
		type,
		value,
		onChange,
	}
}

// Useful resource on using useEffect inside custom hooks: https://blog.logrocket.com/guide-to-react-useeffect-hook/
// Fetching data is done inside the useEffect + a dependecy so it won't fetch again on every re-render
// which is what happens when you leave out the useEffect hook and fetchResources will be re-created and loop infinitely

const useResource = (baseUrl) => {
	const [resources, setResources] = useState([])

	console.log(resources)

	useEffect(() => {
		const fetchResources = async () => {
			const { data } = await axios.get(baseUrl)

			setResources(data)
		}

		fetchResources()
	}, [baseUrl])

	const create = async (resource) => {
		const { data } = await axios.post(baseUrl, resource)
		setResources([...resources, data])
	}

	const service = {
		create,
	}

	return [resources, service]
}

const App = () => {
	const content = useField('text')
	const name = useField('text')
	const number = useField('text')

	const [notes, noteService] = useResource('http://localhost:3005/notes')
	const [persons, personService] = useResource('http://localhost:3005/persons')

	const handleNoteSubmit = (event) => {
		event.preventDefault()
		noteService.create({ content: content.value })
	}

	const handlePersonSubmit = (event) => {
		event.preventDefault()
		personService.create({ name: name.value, number: number.value })
	}

	return (
		<div>
			<h2>notes</h2>
			<form onSubmit={handleNoteSubmit}>
				<input {...content} />
				<button>create</button>
			</form>
			{notes.map((n) => (
				<p key={n.id}>{n.content}</p>
			))}

			<h2>persons</h2>
			<form onSubmit={handlePersonSubmit}>
				name <input {...name} /> <br />
				number <input {...number} />
				<button>create</button>
			</form>
			{persons.map((n) => (
				<p key={n.id}>
					{n.name} {n.number}
				</p>
			))}
		</div>
	)
}

export default App
