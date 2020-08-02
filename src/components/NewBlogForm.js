import React from 'react'

const NewBlogForm = ({
  handleSubmit,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  title,
  author,
  url
}) => (
    <div>
      <form onSubmit={handleSubmit}>
        <div>Title: <input value={title} onChange={handleTitleChange} /></div>
        <div>Author: <input value={author} onChange={handleAuthorChange} /></div>
        <div>Url: <input value={url} onChange={handleUrlChange} /></div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  )

export default NewBlogForm