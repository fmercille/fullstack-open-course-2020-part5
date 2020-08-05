import React, { useState } from 'react'
import PropTypes from 'prop-types'

const NewBlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => setNewTitle(event.target.value)
  const handleAuthorChange = (event) => setNewAuthor(event.target.value)
  const handleUrlChange = (event) => setNewUrl(event.target.value)

  const addBlog = (event) => {
    console.log('addBlog')
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <form onSubmit={addBlog} className="newBlogForm">
        <div>Title: <input id="titleInput" value={newTitle} onChange={handleTitleChange} /></div>
        <div>Author: <input id="authorInput" value={newAuthor} onChange={handleAuthorChange} /></div>
        <div>Url: <input id="urlInput" value={newUrl} onChange={handleUrlChange} /></div>
        <div>
          <button id="newBlogSubmitButton" type="submit">Add</button>
        </div>
      </form>
    </div>
  )
}

NewBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default NewBlogForm