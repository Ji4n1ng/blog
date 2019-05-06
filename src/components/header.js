import React from 'react'
import Link from 'gatsby-link'
import './header.css'

const Header = ({ siteTitle }) => (
  <div className="Header">
    <Link to="/" id="logo"><img alt="logo" src={require('../../content/assets/logo_white.png')} /></Link>
    <ul>
      <li><Link to="/"><button>Home</button></Link></li>
      <li><Link to="/about"><button>About</button></Link></li>
      <li><Link to="/blog"><button>Blog</button></Link></li>
    </ul>
  </div>
)

export default Header
