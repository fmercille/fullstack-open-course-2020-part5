import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import NewBlogForm from './NewBlogForm'

describe('<NewBlogForm />', () => {
  test('Call event handler with proper values', () => {
    const createBlog = jest.fn()

    const component = render(
      <NewBlogForm createBlog={createBlog} />
    )

    const form = component.container.querySelector('form')
    const titleInput = component.container.querySelector('#titleInput')
    const authorInput = component.container.querySelector('#authorInput')
    const urlInput = component.container.querySelector('#urlInput')

    fireEvent.change(titleInput, { target: { value: 'My Awesome Blog' } })
    fireEvent.change(authorInput, { target: { value: 'Foobar McJohnson' } })
    fireEvent.change(urlInput, { target: { value: 'https://www.example.net' } })
    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('My Awesome Blog')
    expect(createBlog.mock.calls[0][0].author).toBe('Foobar McJohnson')
    expect(createBlog.mock.calls[0][0].url).toBe('https://www.example.net')
  })
})

