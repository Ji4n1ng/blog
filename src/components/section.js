import React from 'react'
import styled from 'styled-components'
import Paragraph from './paragraph'
import { Parallax } from 'react-scroll-parallax';

const SectionBase = styled.div`
    position: relative;
`

const BackgroundMask = styled.div`
    position: absolute;
    width: 100%;
    height: 600px;
    overflow: hidden;
`

const Background = styled.div`
    background: url(${props => props.image});
    width: 100%;
    height: 900px;
    background-size: cover;
    background-position: center;
`


const SectionGroup = styled.div`
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px 20px 20px 20px;
`

const Image = styled.img`
    display: block;
    margin: 60px auto 0 auto;
    width: 60%;
`


const Section = props => (
    <SectionBase>
        <BackgroundMask> 
            <Parallax offsetYMax={20} offsetYMin={-20} slowerScrollRate>
                <Background image={props.backgroundImage} />
            </Parallax>    
        </BackgroundMask>
        <SectionGroup style={props.titleStyle}>
            <Paragraph
                title={props.title}
                titleStyle={props.titleStyle}
                text={props.text}
                textStyle={props.textStyle}
                textStyle={{color: 'white'}} />
            <Image src={props.image}/>
        </SectionGroup>
    </SectionBase>
)

export default Section