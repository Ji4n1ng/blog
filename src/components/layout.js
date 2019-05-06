import React from "react"
import Header from "./header"
import Footer from "./footer"
import './layout.css'

class Layout extends React.Component {
  render() {
    const { children } = this.props
    
    return (
      <div>
        <Header />
        <main>{children}</main>
        <Footer>
          Email me if you need anything.<br/>
          contact@jianing.wang
        </Footer>
      </div>
    )
  }
}

export default Layout
