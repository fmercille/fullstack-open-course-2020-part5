import React from 'react'

const NewBlogForm = (props) => (
  <div>
    <form onSubmit={props.addBlogHandler}>
      <div>Title: <input value={props.newTitleValue} onChange={props.newTitleChangeHandler} /></div>
      <div>Author: <input value={props.newAuthorValue} onChange={props.newAuthorChangeHandler} /></div>
      <div>Url: <input value={props.newUrlValue} onChange={props.newUrlChangeHandler} /></div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  </div>
)

export default NewBlogForm