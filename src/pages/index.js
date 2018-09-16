import React from 'react'
import Link from 'gatsby-link'
import Paragraph from '../components/paragraph';
import Section from '../components/section';
import { Parallax } from 'react-scroll-parallax';

class IndexPage extends React.Component {

  render() {
    return (
      <div className="Wrapper">
        <div className="Hero">
          <div className="BackgroundMask">
            <Parallax offsetYMax={20} offsetYMin={-20} slowerScrollRate>
              <div className="Background"/>
            </Parallax>
          </div>
          <div className="HeroGroup">
            <div className="titleGroup">
              <h1>I constantly challenge<br/>myself to solve problems<br/><strong>from scratch.</strong></h1>
            </div>
            <div className="hand">
              <img className="hand" src="https://i.imgur.com/EsaxCv6.png"/>
            </div>
          </div>
        </div>
        <div className="Introduce">
          <img src={require('../images/logo_purple.png')}/>
          <Paragraph
            title="Nice to meet you!"
            text={["Hi, I’m Jianing, a fan of Apple.",<br/>,
            "I am an iOS developer and also do some web development. Not good at talking, I prefer to be immersed in my own world and program with music. Because of Apple, I started to like beautifully designed things."]}
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
          backgroundImage="https://i.imgur.com/WOtqKAe.jpg"
          image="https://i.imgur.com/QQ1jr0i.png" />
        <div className="MiddleSection">
          <Paragraph
            title="Dedicated to becoming a T-type talent"
            text="T-type means that someone has a wide range of technologies and is specialized in a certain field. After learning iOS development for a period of time, I began to try to learn web-side development and some other technologies."
            titleStyle={{color: 'black'}}
            textStyle={{color: 'black'}} /> 
          <div className="LogoGroup">
            <img src={require('../images/logo_swift.png')}/>
            <img src={require('../images/logo_nodejs.png')}/>
            <img src={require('../images/logo_sketch.png')}/>
            <img src={require('../images/logo_reactivex.png')}/>
            <img src={require('../images/logo_react.png')}/>
            <img src={require('../images/logo_vapor.png')}/>
            <img src={require('../images/logo_angular.png')}/>
          </div>
        </div>
        <Section 
          title="Programming from design"
          titleStyle={{color: 'white', textShadow: '0px 20px 40px #522E90'}}
          text="When I have any good ideas or thoughts in my mind, I am more used to opening Sketch instead of Xcode first. With the continuous design, the programming ideas have become clear gradually."
          textStyle={{color: 'white'}}
          backgroundImage="https://i.imgur.com/nBea4Bs.jpg"
          image="https://i.imgur.com/isyw1k2.png" />
        <div className="Spacing" />
        <Paragraph
            title="If you are interested"
            text="You can read more articles from my blog."/> 
        <Link to="/blog"><button className="puple">View Blog</button></Link>
        <div className="Spacing"/>
      </div>
    )
  }
}

export default IndexPage