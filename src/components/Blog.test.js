import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component

  beforeEach(() => {
    const blog = {
      id: '1234',
      title: 'My Blog Title',
      author: 'Foobar McJohnson',
      likes: 9001,
      url: 'https://www.example.net',
      user: {
        id: '5678',
        name: 'Test User',
        username: 'foobar'
      }
    }

    const user = {
      username: 'foobar'
    }

    const handleLike = jest.fn()
    const handleDelete = jest.fn()

    component = render(
      <Blog blog={blog} user={user} handleLike={handleLike} handleDelete={handleDelete} />
    )
  })

  test('Renders content not expanded by default', () => {
    const div = component.container.querySelector('.blog')
    expect(div).toHaveTextContent('My Blog Title')
    expect(div).toHaveTextContent('Foobar McJohnson')
    expect(div).not.toHaveTextContent('https://www.example.net')
    expect(div).not.toHaveTextContent('Likes ')
  })

  test('Renders expanded when click "show" button', () => {
    const div = component.container.querySelector('.blog')
    const button = component.getByText('Show')
    fireEvent.click(button)
    expect(div).toHaveTextContent('My Blog Title')
    expect(div).toHaveTextContent('Foobar McJohnson')
    expect(div).toHaveTextContent('https://www.example.net')
    expect(div).toHaveTextContent('Likes ')
  })
})

