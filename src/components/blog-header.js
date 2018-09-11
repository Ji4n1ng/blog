import React from 'react'
import styled from 'styled-components'
import { Parallax } from 'react-scroll-parallax';

const BlogHeaderBase = styled.div`
    position: relative;
    height: 400px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.20);
`

const BackgroundMask = styled.div`
    position: absolute;
    width: 100%;
    height: 400px;
    overflow: hidden;
`

const Background = styled.div`
    background: url(${props => props.image});
    width: 100%;
    height: 700px;
    background-size: cover;
    background-position: center;
`

const BlogHeaderGroup = styled.div`
    position: relative;
    max-width: 1000px;
    margin: auto;
    padding: 20px 20px 20px 20px;
`

const Title = styled.p`
    display: block;
    position: relative;
    top: 100px;
    color: white;
    font-size: 50px;
    font-weight: 600;
    text-shadow: 0px 10px 20px #2747A9;

    @media (max-width: 400px) {
        font-size: 40px;
    }
`

const Subtitle = styled.p`
    display: inline-block;
    position: relative;
    top: 50px;
    color: white;
    font-size: 28px;
    font-weight: 400;
    text-shadow: 0px 10px 20px #2747A9;

    @media (max-width: 400px) {
        font-size: 22px;
        padding-top: 30px;
    }
`

const BlogHeader = props => (
    <BlogHeaderBase>
        <BackgroundMask> 
                <Background image={props.backgroundImage} />
        </BackgroundMask>
        <BlogHeaderGroup>
            <Title>{props.title}</Title>
            <Subtitle>{props.subtitle}</Subtitle>
        </BlogHeaderGroup>
    </BlogHeaderBase>
)

export default BlogHeader