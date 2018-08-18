import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { ParallaxProvider } from 'react-scroll-parallax';

import Header from '../components/header'
import Footer from '../components/footer'
import './index.css'

const Layout = ({ children, data }) => (
  <ParallaxProvider>
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' },
      ]}
    />
    <Header />
    {children()}
    <Footer data={data}>
      Email me if you need anything.<br/>
      contact@jianing.wang
    </Footer>
  </div>
  </ParallaxProvider>
)

Layout.propTypes = {
  children: PropTypes.func,
}

export default Layout

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
        copyright
      }
    }
  }
`
