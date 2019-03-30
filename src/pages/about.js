import React from 'react'
import BlogHeader from '../components/blog-header'
import '../templates/blog-post.css'

class AboutPage extends React.Component {
  render() {
    return (
      <div className="About">
        <BlogHeader
          title="About"
          subtitle=""
          backgroundImage="https://i.imgur.com/Goy2m6Y.jpg" />
        <div className='MarkDownWrapper'>
          <div className="markdown-body">
            <h2>关于 Jianing</h2>

            <p>Jianing 是一个果粉但并不脑残</p>

            <p>最大的梦想是能一直做自己喜欢的事情</p>

            <p>喜欢自由，不喜欢约束</p>

            <p>不善言谈，喜欢沉浸在自己的世界里听着音乐敲代码</p>

            <hr />

            <p><s>第一门语言是 Java，但却是 Swift 帮我打开了编程之门。无比喜欢后者。</s>（现在又滚回 Java 了）</p>

            <p><s>主修 iOS，乱七八糟的点了些 node.js、Python、React 等技能。</s>（都是曾经了）</p>

            <p><s>主写移动端，能写一点后端、前端以及微信小程序。</s>（都是曾经了）</p>

            <p>现在在补基础，争取做一个安全傻白甜。</p>

            <hr />

            <p><s>喜欢折腾 App（手机里几百应用很常见…）</s>（老了啊）</p>

            <p><s>想做一名 设计 + 编程 的个人开发者</s>（当时好幼稚）</p>

            <p>现在想顺利毕业，嗯。。</p>

            <h2>关于本站</h2>

            <p>本站建于 2015 年，最初是基于 <a href="https://hexo.io/">Hexo</a> 来生成静态网站然后托管在 GitHub 上，于 2018 年 8 月开始基于 <a href="https://www.gatsbyjs.org/">Gatsby</a> 来写并托管在 <a href="https://www.netlify.com">Netlify</a>。从最初的在 Hexo 配置到现在可以手撸一个博客，可以看出 Gatsby 对于非 Web 开发人员也非常友好。然而在此时（2018.09）的国内，Gatsby 并不火。Gatsby 是一个基于 React 的框架，方便开发者生成静态站点。Netlify 可以自动化编译部署网站，可以和 GitHub、GitLab 等代码托管平台建立连接，自动编译部署。</p>

            <p>本站的图床从七牛迁移至 <a href="https://imgur.com">imgur</a>。七牛的免费空间与流量足以撑起个人博客，但是七牛的 Https 流量是另算的，也就是收费，因为本站升级到了 Https，所以迁移至国外的 imgur。</p>

            <p>本站的域名原来为 imjianing.wang，后来是 ningjia.wang，在 2018 年 2 月迁移至 jianing.wang。jianing.wang 这个域名原先一直在域名商的手里，差不多等了三年才等到它过期而且没有被续期。也可能是为了这个域名，我隐约觉得应该手撸一个博客才对得起它。。。</p>

            <p>本站的开发流程大体是这样的，基于 React 来写，用 Gatsby 来生成静态站点，本地只要测试没问题，把代码提交到 GitLab 上，事情就完成了。Netlify 会自动将代码编译，然后部署网站，Https 证书也是一键生成。顺带还尝试了一把最近超火的 GraphQL。写起来还是比较爽的。</p>

            <p><em>因为本站托管在国外的 Netlify 并且图床为国外的 imgur，所以国内的访问速度并不理想</em></p>

            <h2>另外</h2>

            <p>因为本站建设仍未完成，会有些奇奇怪怪的问题，比如中英文混杂、没有分页等，所以体验并不友好。多语言支持、分页等特性会在后续更新，但是短期应该不会，因为我最近要做一些其他的事，见谅。</p>

            <p>项目开源地址： <a href="https://github.com/Ji4n1ng/blog">https://github.com/Ji4n1ng/blog </a> </p>

            <p>Jianing </p>

            <p>2018.09.16</p>

          </div>
        </div>
        
      </div>
    )
  }
}

export default AboutPage
