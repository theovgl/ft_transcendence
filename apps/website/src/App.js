import React from "react"

const App = () => {
    const myItem = "mike"
  
    return (
      <ul>
        <li>item1</li>
        <li>item255</li>
        <li>{myItem.toUpperCase()}</li>
      </ul>
    )
  }
  
  export default App