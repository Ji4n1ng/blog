import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import BlogHeader from '../components/blog-header'
import BlogCell from '../components/blog-cell'
import './blog-list.css'

export default class BlogList extends React.Component {
  render() {
    const posts = this.props.data.allMarkdownRemark.edges
    const siteTitle = this.props.data.site.siteMetadata.title
    const { currentPage, numPages } = this.props.pageContext
    const isFirst = currentPage === 1
    const isLast = currentPage === numPages
    const prevPage = currentPage - 1 === 1 ? '/blog' : '/blog/' + (currentPage - 1).toString()
    const nextPage = 'blog/' + (currentPage + 1).toString()

    return (
      <Layout>
        <SEO title={siteTitle}/>
        <div className="Blog">
          <BlogHeader
            title={siteTitle}
            subtitle={"Night gets darkest right before dawn."}
            backgroundImage="https://s2.ax1x.com/2019/04/23/EEJEIf.jpg" />
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
          <div className="Pagination">
            <ul
              style={{
                display: 'flex',
                margin: '0 auto',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                listStyle: 'none',
                padding: 0,
              }}>
              {!isFirst && (
                <Link to={prevPage} rel="prev">
                  ← Prev
                </Link>
              )}
              {Array.from({ length: numPages }, (_, i) => (
                <li 
                  key={`pagination-number${i + 1}`}
                  style={{
                    margin: 20,
                  }}
                >
                  <Link
                    to={`/blog/${i === 0 ? '' : i + 1}`}
                    style={{
                      padding: 10,
                      textDecoration: 'none',
                      borderRadius: 10,
                      color: i + 1 === currentPage ? '#ffffff' : '',
                      backgroundImage: i + 1 === currentPage ? 'linear-gradient(to bottom right, #65D1F9, #2457F5)' : '',
                    }}
                  >
                    {i + 1}
                  </Link>
                </li>
              ))}
              {!isLast && (
                <Link to={nextPage} rel="next">
                  Next →
                </Link>
              )}
            </ul>
          </div>
        </div>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query blogListQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { template: { eq: "post" } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
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
            template
          }
        }
      }
    }
  }
`