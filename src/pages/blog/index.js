import React from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import BlogHeader from '../../components/blog-header';
import BlogCell from '../../components/blog-cell';

class Blog extends React.Component {
  render() {
    const posts = get(this, 'props.data.allMarkdownRemark.edges')
    return (
      <div className="Blog">
        <BlogHeader
          title="Jianing's Blog"
          subtitle="Night gets darkest right before dawn"
          backgroundImage="https://i.imgur.com/Goy2m6Y.jpg" />
        { posts.map(({ node }) => {
          const title = get(node, 'frontmatter.title') || node.fields.slug
          console.log('fuck')
          console.log(node.fields.slug)
          return (
            <div key={node.fields.slug}>
              <BlogCell
                title={title}
                subtitle={node.frontmatter.date}
                text={node.excerpt}
                background={node.frontmatter.background}
                link={node.fields.slug} />
            </div>
          )
        })}
      </div>
    )
  }
}

export default Blog

export const pageQuery = graphql`
  query blogQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            background
          }
        }
      }
    }
  }
`
