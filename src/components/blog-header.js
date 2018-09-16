import React from 'react'
import styled from 'styled-components'

const BlogHeaderBase = styled.div`
    display: flex;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.20);
    width: 100%;
    background: url(${props => props.image});
    background-size: cover;
    background-position: center;
    overflow: hidden;
`

const BlogHeaderGroup = styled.div`
    display: flex;
    align-items: flex-end;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    height: 400px;
`

const HeaderTitleGroup = styled.div`
    width: 100%;
    max-width: 1000px;
    margin: 0;
    padding: 0px 20px 40px 20px;

    @media (max-width: 400px) {
        padding: 0 10px 40px 10px;
    }
`

const Title = styled.p`
    display: block;
    color: white;
    font-size: 50px;
    margin: 0;
    padding-bottom: 20px;
    font-weight: 600;
    text-shadow: 0px 10px 20px rgba(0, 0, 0, 0.20);
    text-align: left;

    @media (max-width: 640px) {
        font-size: 40px;
    }

    @media (max-width: 400px) {
        font-size: 30px;
    }
`

const Subtitle = styled.p`
    display: block;
    margin: 0;
    color: white;
    font-size: 28px;
    font-weight: 400;
    text-shadow: 0px 10px 20px rgba(0, 0, 0, 0.20);

    @media (max-width: 640px) {
        font-size: 24px;
    }

    @media (max-width: 400px) {
        font-size: 20px;
    }
`

const BlogHeader = props => (
    <BlogHeaderBase image={props.backgroundImage}>
        <BlogHeaderGroup>
            <HeaderTitleGroup>
                <Title>{props.title}</Title>
                <Subtitle>{props.subtitle}</Subtitle>
            </HeaderTitleGroup>
        </BlogHeaderGroup>
    </BlogHeaderBase>
)

export default BlogHeader