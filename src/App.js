import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import NewBlogForm from './components/NewBlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  const [newBlogFormVisible, setNewBlogFormVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('user')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const displayNotification = (message) => {
    setNotificationMessage(message)

    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const displayError = (message) => {
    setErrorMessage(message)

    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      displayNotification('Login successful')
    } catch (exception) {
      displayError('Wrong credentials')
    }
    console.log('Logging in with', username, password)
  }

  const handleLogout = async () => {
    window.localStorage.clear()
    setUser(null)
    displayNotification('Logout successful')
  }

  const likeBlog = async (likedBlog) => {
    const payload = {
      ...likedBlog,
      likes: likedBlog.likes + 1,
    }

    try {
      await blogService.update(likedBlog.id, payload)
      const updatedBlogs = blogs.map(blog => blog.id === likedBlog.id ? { ...blog, likes: payload.likes } : blog)
      setBlogs(updatedBlogs)
    } catch (error) {
      console.log(error.response)
      if (error.response.data.error) {
        displayError(error.response.data.error)
      } else {
        displayError('An error occured')
      }
    }
  }

  const createBlog = async (blogObject) => {
    console.log('createBlog')
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      displayNotification('Blog added')
    } catch (error) {
      console.log(error.response)
      if (error.response.data.error) {
        displayError(error.response.data.error)
      } else {
        displayError('An error occured')
      }
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      await blogService.delete(blogObject.id)
      const updatedBlogs = blogs.filter(blog => blog.id !== blogObject.id)
      setBlogs(updatedBlogs)
    } catch (error) {
      console.log(error.response)
      if (error.response.data.error) {
        displayError(error.response.data.error)
      } else {
        displayError('An error occured')
      }
    }
  }

  const hideWhenVisible = { display: newBlogFormVisible ? 'none' : '' }
  const showWhenVisible = { display: newBlogFormVisible ? '' : 'none' }

  if (user === null) {
    return (
      <>
        <Notification message={notificationMessage} messageType='notice' />
        <Notification message={errorMessage} messageType='error' />
        <LoginForm handleLogin={handleLogin} />
      </>
    )
  } else {
    blogs.sort((a, b) => a.likes > b.likes ? -1 : (a.likes < b.likes ? 1 : 0))
    return (
      <>
        <Notification message={notificationMessage} messageType='notice' />
        <Notification message={errorMessage} messageType='error' />
        <div>
          <h2>blogs</h2>
          <div>
            {user.name} is logged in <button onClick={handleLogout}>Logout</button>
          </div>
          <div style={hideWhenVisible}>
            <button id="newBlogButton" onClick={() => setNewBlogFormVisible(true)}>New blog</button>
          </div>
          <div className="blogList">
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} handleLike={likeBlog} handleDelete={deleteBlog} user={user} />
            )}
          </div>
        </div>
        <div style={showWhenVisible}>
          <h2>Create new blog</h2>
          <NewBlogForm
            createBlog={createBlog}
          />
          <button onClick={() => setNewBlogFormVisible(false)}>Cancel</button>
        </div>
      </>
    )
  }
}

export default App