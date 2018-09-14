import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import { Parallax } from 'react-scroll-parallax';
// import './blog-cell.css'

const CellWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 60px auto 0 auto;
    max-width: 1040px;
    align-items: stretch;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.20);

    @media (max-width: 1100px) {
        margin: 60px 10px;
    }
`

const CellTop = styled.div`
    display: flex;
    width: 100%;
    max-width: 1040px;
    height: 250px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: url(${props => props.image});
    background-size: cover;
    background-position: center;
    overflow: hidden;
    align-items: flex-end;
`

const CellTopGroup = styled.div`
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    padding: 0px 20px 20px 20px;

    @media (max-width: 400px) {
        padding: 0 10px 20px 10px;
    }
`

const CellBottom = styled.div`
    max-width: 960px;
    margin: 0 auto;
    padding: 0px 20px 20px 20px;

    @media (max-width: 400px) {
        padding: 0 10px 20px 10px;
    }
`

const Title = styled.p`
    display: block;
    margin: 0;
    color: white;
    font-size: 32px;
    font-weight: 500;
    text-align: left;
    text-shadow: 0px 10px 20px rgba(0, 0, 0, 0.20);
    padding-bottom: 10px;

    @media (max-width: 640px) {
        font-size: 28px;
    }

    @media (max-width: 400px) {
        font-size: 24px;
    }
`

const Subtitle = styled.p`
    display: block;
    margin: 0;
    color: white;
    font-size: 24px;
    font-weight: 400;
    text-align: left;
    text-shadow: 0px 10px 20px rgba(0, 0, 0, 0.20);

    @media (max-width: 640px) {
        font-size: 20px;
    }

    @media (max-width: 400px) {
        font-size: 16px;
    }
`

const Text = styled.p`
    display: block;
    margin: 0;
    color: #272727;
    font-size: 18px;
    padding-top: 30px;
    text-align: left;
    font-weight: 400;

    @media (max-width: 640px) {
        font-size: 15px;
    }

    @media (max-width: 400px) {
        font-size: 12px;
    }
`

const BlogCell = props => (
    <CellWrapper>
        <Link to={props.link}>
            <CellTop image={props.background}>
                <CellTopGroup>
                    <Title>{props.title}</Title>
                    <Subtitle>{props.subtitle}</Subtitle>
                </CellTopGroup>
            </CellTop>
        </Link>
        <CellBottom>
            <Text>{props.text}</Text>
        </CellBottom>
    </CellWrapper>
)

export default BlogCell