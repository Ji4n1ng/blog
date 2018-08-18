import React from 'react'
import Link from 'gatsby-link'
import Paragraph from '../components/paragraph';
import Section from '../components/section';
import { Parallax } from 'react-scroll-parallax';

class IndexPage extends React.Component {

  render() {
    // var translateY = function (a, b) { return { transform: `translateY(${a * b}px)` } };
    // const heroBackgroundStyle = translateY(this.state.heroYOffset, 0.23)
    // const heroTitleStyle = translateY(this.state.heroYOffset, 0.2)
    // const section1BackgroundStyle = translateY(this.state.section1YOffset, 0.23)
    // const section2BackgroundStyle = translateY(this.state.section2YOffset, 0.23)

    return (
      <div className="Wrapper">
        <div className="Hero">
          <div className="background">
            <Parallax offsetYMax={20} offsetYMin={-20} slowerScrollRate>
              <img src={require('../images/background1.jpg')} height="800px"/>
            </Parallax>
          </div>
          <div className="HeroGroup">
            <h1>I constantly challenge<br/>myself to solve problems<br/><strong>from scratch.</strong></h1>
          </div>
          <img className="hand" src={require('../images/iphonex_hand.png')} />
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
          <button className="puple">contact@jianing.wang</button>
        </div>
        <Section 
          title="Starting with iOS development"
          titleStyle={{color: 'white', textShadow: '0px 20px 40px #613EF1'}}
          text="My programming career started with iOS development. The first thing I learned was the Swift language. I highly recommend you to use Swift as your first language."
          textStyle={{color: 'white'}}
          backgroundImage={require('../images/background2.jpg')}
          image={require('../images/macbook.png')} />
        <div className="MiddleSection">
          <Paragraph
            title="Dedicated to becoming a T-type talent"
            text="T-type means that someone has a wide range of technologies and is specialized in a certain field. After learning iOS development for a period of time, I began to try to learn web-side development and some other technologies."
            titleStyle={{color: 'black'}}
            textStyle={{color: 'black'}} /> 
          <div className="LogoGroup">
            <img src={require('../images/logo_swift.png')} />
            <img src={require('../images/logo_nodejs.png')} />
            <img src={require('../images/logo_sketch.png')} />
            <img src={require('../images/logo_reactivex.png')} />
            <img src={require('../images/logo_react.png')} />
            <img src={require('../images/logo_vapor.png')} />
            <img src={require('../images/logo_angular.png')} />
          </div>
        </div>
        <Section 
          title="Programming should start with design"
          titleStyle={{color: 'white', textShadow: '0px 20px 40px #522E90'}}
          text="When I have any good ideas or thoughts in my mind, I am more used to opening Sketch instead of Xcode first. With the continuous design, the programming ideas have become clear gradually."
          textStyle={{color: 'white'}}
          backgroundImage={require('../images/background3.jpg')}
          image={require('../images/imac.png')} />
        <Paragraph
            title="If you are interested"
            text="You can read more articles from my blog."/> 
        <button className="puple">View Blog</button>
        <div className="Spacing"/>
      </div>
    )
  }
}

export default IndexPage