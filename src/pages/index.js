import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Paragraph from '../components/paragraph';
import Section from '../components/section';

class BlogIndex extends React.Component {
  render() {
    return (
      <Layout>
        <SEO
          title="Home"
          keywords={[`Swift`, `iOS`, `macOS`]}
        />
        <div className="Wrapper">
          <div className="Hero">
            <div className="BackgroundMask">
                <div className="Background"/>
            </div>
            <div className="HeroGroup">
              <div className="titleGroup">
                <h1>I constantly challenge<br/>myself to solve problems<br/><strong>from scratch.</strong></h1>
              </div>
              <div className="hand">
                <img className="hand" src="https://s2.ax1x.com/2019/04/23/EEJCMd.png" alt="hand"/>
              </div>
            </div>
          </div>
          <div className="Introduce">
            <img alt="logo" src={require('../../content/assets/logo_purple.png')}/>
            <Paragraph
              title="Nice to meet you!"
              text={["Hi, I’m Jianing.",<br/>,
              "I have studied iOS development in the past and now I'm pursuing my master's degree in computer security. Not good at talking, I prefer to be immersed in my own world and program with music. I'm a fan of Apple. Because of Apple, I started to like beautifully designed things."]}
              titleStyle={{color: 'black'}}
              textStyle={{color: 'black'}} /> 
            <p className="email">You can contact me by email</p>
            <a href="mailto:contact@jianing.wang"><button className="puple">contact@jianing.wang</button></a>
          </div>
          <Section 
            title="Starting with iOS development"
            titleStyle={{color: 'white', textShadow: '0px 20px 40px #613EF1'}}
            text="My programming career started with iOS development. The first thing I learned was the Swift language. I highly recommend you to use Swift as your first language."
            textStyle={{color: 'white'}}
            backgroundImage="https://s2.ax1x.com/2019/04/23/EEJEIf.jpg"
            image="https://s2.ax1x.com/2019/04/23/EEJAdP.png" />
          <div className="MiddleSection">
            <Paragraph
              title="Dedicated to becoming a T-type talent"
              text="T-type means that someone has a wide range of technologies and is specialized in a certain field. I want to write a lot of interesting programs with great technologies and also want to find the principles behind these technologies."
              titleStyle={{color: 'black'}}
              textStyle={{color: 'black'}} /> 
            <div className="LogoGroup">
              <img alt="swift" src={require('../../content/assets/logo_swift.png')}/>
              <img alt="nodejs" src={require('../../content/assets/logo_nodejs.png')}/>
              <img alt="sketch" src={require('../../content/assets/logo_sketch.png')}/>
              <img alt="reactivex" src={require('../../content/assets/logo_reactivex.png')}/>
              <img alt="react" src={require('../../content/assets/logo_react.png')}/>
              <img alt="vapor" src={require('../../content/assets/logo_vapor.png')}/>
              <img alt="angular" src={require('../../content/assets/logo_angular.png')}/>
            </div>
          </div>
          <Section 
            title="Programming from design"
            titleStyle={{color: 'white', textShadow: '0px 20px 40px #522E90'}}
            text="When I have any good ideas or thoughts in my mind, I am more used to opening Sketch instead of Xcode first. With the continuous design, the programming ideas have become clear gradually."
            textStyle={{color: 'white'}}
            backgroundImage="https://s2.ax1x.com/2019/04/23/EEJkZt.jpg"
            image="https://s2.ax1x.com/2019/04/23/EEJPsA.png" />
          <div className="Spacing" />
          <Paragraph
              title="If you are interested"
              text="You can read more articles from my blog."/> 
          <Link to="/blog"><button className="puple">View Blog</button></Link>
          <div className="Spacing"/>
        </div>
      </Layout>
    )
  }
}

export default BlogIndex