import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      </>
    )
  }
}

export default App