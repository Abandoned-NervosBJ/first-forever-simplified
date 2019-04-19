import React, { Component } from 'react'
import TreeList from './TreeList'

class TreeListContainer extends Component {
  onClick(id, level) {
    // console.log('treelist container', id, level)
    this.props.onClick(id, level);
  }
  render() {
    return (
      <TreeList {...this.props} onClick = { this.onClick.bind(this) } />
    )
  }
}

export default TreeListContainer
