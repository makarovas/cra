import React, { Component } from 'react'

export default class ErrorMessage extends Component {
  render() {
    return (
      <div style={{color: 'red'}}>
        Error, please enter current URL
      </div>
    )
  }
}
