import React from 'react'
import styled from 'styled-components'

const FooterGroup = styled.div`
    background: #F1F3F5;
    padding: 50px 0;
    display: grid;
    grid-gap: 20px;
`

const Title = styled.p`
    font-size: 24px;
    font-weight: 600;
    color: #8196A4;
    max-width: 500px;
    margin: 0 auto;
    text-align: center;

    @media (max-width: 640px) {
        font-size: 22px;
    }

    @media (max-width: 400px) {
        font-size: 20px;
    }
`

const Button = styled.button`
    background-image: linear-gradient(to bottom right, #65D1F9, #2457F5);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
    border-radius: 30px;
    color: white;
    border: none;
    padding: 13px 25px;
    font-weight: 600;
    font-size: 24px;
    justify-self: center;
    transition: 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);

    &:hover {
        box-shadow: 0 20px 40px rgba(0,0,0, 0.15);
        transform: translateY(-3px);
    }

    @media (max-width: 640px) {
        font-size: 22px;
    }

    @media (max-width: 400px) {
        font-size: 20px;
    }
`

const Text = styled.p`
    font-size: 20px;
    color: #8196A4;
    max-width: 500px;
    margin: 0 auto;
    text-align: center;

    @media (max-width: 640px) {
        font-size: 18px;
    }

    @media (max-width: 400px) {
        font-size: 16px;
    }
`

const Copyright = styled.div`
    color: rgba(0, 0, 0, 0.3);
    font-size: 15px;
    max-width: 400px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;

    @media (max-width: 640px) {
        font-size: 13px;
    }

    @media (max-width: 400px) {
        font-size: 11px;
    }
`

const Footer = ({data, children}) => (
    <FooterGroup>
      <Title>You can contact me on Twitter @Ji4n1ng</Title>
      <a style={{margin: '0 auto'}} className="" href="http://www.twitter.com/ji4n1ng/"><Button><img src={require('../images/icon-twitter.svg')} width="20px"/>&nbsp;&nbsp;Twitter</Button></a>
      <Text>{children}</Text>
      <Copyright>All background images are from DesignCode. iOS app and this website are made entirely by @Ji4n1ng. © 2018</Copyright>
    </FooterGroup>
)

export default Footer