import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import BlogHeader from '../components/blog-header';
import './blog-post.css'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')

    return (
      <div>
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        <BlogHeader
          title={post.frontmatter.title}
          subtitle={post.frontmatter.date}
          backgroundImage={post.frontmatter.background} />
        <div className='MarkDownWrapper'>
            <div className='markdown-body' dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
        
      </div>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        background
      }
    }
  }
`
