module.exports = {
  siteMetadata: {
    title: 'Jianing\'s blog',
    description: 'Jianing\'s blog. Personal blog.',
    keywords: 'ios development, swift, web development',
    copyright: 'All background images are from DesignCode. iOS app and this website are made entirely by @Ji4n1ng. © 2018'
  },
  plugins: [
    'gatsby-plugin-react-helmet', 
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    'gatsby-transformer-remark'
  ],
}
