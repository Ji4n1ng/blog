import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { ParallaxProvider } from 'react-scroll-parallax';

import Header from '../components/header'
import Footer from '../components/footer'
import './index.css'

const Layout = ({ children, data }) => {
  return (
    <ParallaxProvider>
    <div>
      <Helmet
        title={data.site.siteMetadata.title}
        meta={[
          { name: 'description', content: data.site.siteMetadata.description },
          { name: 'keywords', content: data.site.siteMetadata.keywords },
        ]}
      /> 
      <Header />
      {children()}
      <Footer>
        Email me if you need anything.<br/>
        contact@jianing.wang
      </Footer>
    </div>
    </ParallaxProvider>
  )}

Layout.propTypes = {
  children: PropTypes.func,
}

export default Layout

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
        description
        keywords
      }
    }
  }
`
