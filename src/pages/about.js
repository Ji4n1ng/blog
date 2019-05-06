import React from 'react'
import Layout from "../components/layout"
import SEO from "../components/seo"
import BlogHeader from '../components/blog-header'
import '../templates/blog-post.css'

class AboutPage extends React.Component {
  render() {
    return (
      <Layout>
        <div className="About">
          <SEO title="About" />
          <BlogHeader
            title="About"
            subtitle=""
            backgroundImage="https://s2.ax1x.com/2019/04/23/EEJiqI.jpg" />
          <div className='MarkDownWrapper'>
            <div className="markdown-body">

              <h2>About Jianing</h2>

              <ul>
                <li>GitHub: <a href="https://github.com/Ji4n1ng">Ji4n1ng</a></li>
                <li>Twitter: <a href="https://twitter.com/Ji4n1ng">Ji4n1ng</a></li>
                <li>Email: <a href="mailto:contact@jianing.wang">contact@jianing.wang</a></li>
              </ul>

              <p>Jianing is a fan of Apple <span role="img" aria-label="Man Technologist">👨‍💻</span></p>
              <p>Only good at doing what I like.<span role="img" aria-label="Red Heart">❤️</span></p>
              <p>Not good at talking, I prefer to be immersed in my own world and write code with music. <span role="img" aria-label="Headphone">🎧</span></p>

              <h2>关于 Jianing</h2>

              <p>Jianing 是一个果粉 <span role="img" aria-label="Man Technologist">👨‍💻</span></p>
              <p>只擅长做自己喜欢的事情 <span role="img" aria-label="Red Heart">❤️</span></p>
              <p>不善言谈，更喜欢沉浸在自己的世界里听着音乐写代码 <span role="img" aria-label="Headphone">🎧</span></p>

              <hr />

              <p>第一门语言是 Java，但却是 Swift 帮我打开了编程之门。无比喜欢后者。</p>
              <p>曾想做一名 设计 + 编程 的个人开发者。</p>

              <h2>关于本站</h2>

              <p>本站建于 2015 年，最初是基于 <a href="https://hexo.io/">Hexo</a> 并托管在 GitHub 上，于 2018 年 8 月开始基于 <a href="https://www.gatsbyjs.org/">Gatsby</a> 来写并托管在 <a href="https://www.netlify.com">Netlify</a>。</p>
              <p><s>本站的图床从七牛迁移至 <a href="https://imgur.com">imgur</a>。</s>因 imgur 被墙，现迁移至<a href="https://imgchr.com/">路过图床</a>。（迁移图床真的要命）</p>
              <p>本站的域名原来为 imjianing.wang，后来是 ningjia.wang，在 2018 年 2 月迁移至 jianing.wang。jianing.wang 这个域名原先一直在域名商的手里，差不多等了三年才等到它过期而且没有被续期。也可能是为了这个域名，我隐约觉得应该手撸一个博客才对得起它。。。</p>
              <p><em>因为本站托管在国外的 Netlify，所以国内的访问速度并不理想</em></p>

              <h2>另外</h2>

              <p>因为本站建设仍未完成，会有些奇奇怪怪的问题，比如中英文混杂、没有分页等，所以体验并不友好。</p>
              <p>博客开源地址： <a href="https://github.com/Ji4n1ng/blog">https://github.com/Ji4n1ng/blog </a> </p>
              <p>Jianing</p>

            </div>
          </div>
          
        </div>
      </Layout>
    )
  }
}

export default AboutPage
