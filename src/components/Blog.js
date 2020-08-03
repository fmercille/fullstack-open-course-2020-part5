import React, { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [expanded, setExpanded] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const deleteButtonStyle = {
    display: (blog.user.username === user.username ? '' : 'none')
  }

  const like = (event) => {
    event.preventDefault()
    handleLike(blog)
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Delete "${blog.title}" by ${blog.author}?`)) {
      handleDelete(blog)
    }
  }

  let expandedInfo = ''
  if (expanded) {
    expandedInfo = (
      <>
        <div>
          {blog.url}
        </div>
        <div>
          Likes {blog.likes} <button onClick={like}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div style={deleteButtonStyle}>
          <button onClick={deleteBlog}>remove</button>
        </div>
      </>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={() => setExpanded(!expanded)}>{expanded ? 'Hide' : 'Show'}</button>
      {expandedInfo}
    </div>
  )
}

export default Blog
