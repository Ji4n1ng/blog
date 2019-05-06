import React from 'react'
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import BlogHeader from '../components/blog-header';
import BlogCell from '../components/blog-cell';

class Blog extends React.Component {
  render() {
    const { data } = this.props
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout>
        <SEO title="Blog" />
        <div className="Blog">
          <BlogHeader
            title="Jianing's Blog"
            subtitle="Night gets darkest right before dawn"
            backgroundImage="https://s2.ax1x.com/2019/04/23/EEJiqI.jpg" />
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug
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
      </Layout>
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
