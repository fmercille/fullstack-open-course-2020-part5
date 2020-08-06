import React, { useState } from 'react'
import PropTypes from 'prop-types'

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
        <div className="blogLikes">
          Likes {blog.likes} <button onClick={like} className="likeButton">like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div style={deleteButtonStyle} className="deleteButton">
          <button onClick={deleteBlog}>remove</button>
        </div>
      </>
    )
  }

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author} <button className="showButton" onClick={() => setExpanded(!expanded)}>{expanded ? 'Hide' : 'Show'}</button>
      {expandedInfo}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog
