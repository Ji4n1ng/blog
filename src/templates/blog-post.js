import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import get from 'lodash/get'
import BlogHeader from '../components/blog-header';
import './avenir-white.css'

// import Bio from '../components/Bio'
// import { rhythm, scale } from '../utils/typography'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const { previous, next } = this.props.pathContext

    return (
      <div>
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        <BlogHeader
          title={post.frontmatter.title}
          subtitle={post.frontmatter.date}
          backgroundImage={post.frontmatter.background} />
        <div className='MarkDownWrapper'>
            <div className='MarkDown' dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            listStyle: 'none',
            padding: 0,
          }}
        >
          <li>
            {
              previous &&
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            }
          </li>
          <li>
            {
              next &&
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            }
          </li>
        </ul>
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
