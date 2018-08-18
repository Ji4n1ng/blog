import React from 'react'
import styled from 'styled-components'

const ParagraphGroup = styled.div`
    width: 100%;
`

const Title = styled.h2`
    color: black;
    text-align: center;
    margin: 0 auto;
    padding: 40px 20px;
    font-size: 45px;
    line-height: 1.2;
    font-weight: 600;

    @media (max-width: 640px) {
        font-size: 40px;
        padding: 20px;
    }

    @media (max-width: 400px) {
        font-size: 35px;
        padding: 20px;
    }
`

const Text = styled.p`
    color: black;
    max-width: 600px;
    margin: 0px auto;
    padding: 20px;
    text-align: center;
    font-size: 20px;
    line-height: 1.5;
    font-weight: 400;
`

const Paragraph = props => (
    <ParagraphGroup>
        <Title style={props.titleStyle}>{props.title}</Title>
        <Text style={props.textStyle}>{props.text}</Text>
    </ParagraphGroup>
)

export default Paragraph