import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import NewBlogForm from './components/NewBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [newBlogFormVisible, setNewBlogFormVisible] = useState(false)

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

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

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      displayNotification('Login successful')
      setUsername('')
      setPassword('')
    } catch (exception) {
      displayError('Wrong credentials')
    }
    console.log('Logging in with', username, password)
  }

  const handleLogout = async (event) => {
    window.localStorage.clear()
    setUser(null)
    displayNotification('Logout successful')
  }

  const addBlog = async (event) => {
    console.log('addBlog')
    event.preventDefault()
    const newBlogObject = { title: newTitle, author: newAuthor, url: newUrl }
    try {
      const newBlog = await blogService.create(newBlogObject)
      setBlogs(blogs.concat(newBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
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

  const handleNewTitleChange = async (event) => setNewTitle(event.target.value)
  const handleNewAuthorChange = async (event) => setNewAuthor(event.target.value)
  const handleNewUrlChange = async (event) => setNewUrl(event.target.value)

  const hideWhenVisible = { display: newBlogFormVisible ? 'none' : '' }
  const showWhenVisible = { display: newBlogFormVisible ? '' : 'none' }

  if (user === null) {
    return (
      <>
        <Notification message={notificationMessage} messageType='notice' />
        <Notification message={errorMessage} messageType='error' />
        <form onSubmit={handleLogin}>
          <div>
            Username:
        <input type="text" value={username} name="username" onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            Password:
        <input type="password" value={password} name="password" onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">Login</button>
        </form>
      </>
    )
  } else {
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
            <button onClick={() => setNewBlogFormVisible(true)}>New blog</button>
          </div>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
        <div style={showWhenVisible}>
          <h2>Create new blog</h2>
          <NewBlogForm
            addBlogHandler={addBlog}
            newTitleValue={newTitle}
            newTitleChangeHandler={handleNewTitleChange}
            newAuthorValue={newAuthor}
            newAuthorChangeHandler={handleNewAuthorChange}
            newUrlValue={newUrl}
            newUrlChangeHandler={handleNewUrlChange}
          />
          <button onClick={() => setNewBlogFormVisible(false)}>Cancel</button>
        </div>
      </>
    )
  }
}

export default App