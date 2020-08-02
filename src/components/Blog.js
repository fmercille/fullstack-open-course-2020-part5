import React, { useState } from 'react'

const Blog = ({ blog }) => {
  const [expanded, setExpanded] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  let expandedInfo = ''
  if (expanded) {
    expandedInfo = (
      <>
        <div>
          {blog.url}
        </div>
        <div>
          Likes {blog.likes} <button onClick={() => console.log('Like')}>like</button>
        </div>
        <div>
          {blog.user.name}
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
