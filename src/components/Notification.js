import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message, messageType }) => {
  if (message === null) {
    return null
  } else {
    return (
      <div className={messageType}>
        {message}
      </div>
    )
  }
}

Notification.propTypes = {
  message: PropTypes.string,
  messageType: PropTypes.string.isRequired,
}

export default Notification