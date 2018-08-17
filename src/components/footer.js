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
`

const Text = styled.p`
    font-size: 20px;
    color: #8196A4;
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
`

const Copyright = styled.div`
    color: rgba(0, 0, 0, 0.3);
    font-size: 15px;
    max-width: 400px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
`

const Footer = ({data, children}) => (
    <FooterGroup>
      <Title>You can contact me on Twitter @Ji4n1ng</Title>
      <Button><img src={require('../images/icon-twitter.svg')} width="20px"/>&nbsp;&nbsp;Twitter</Button>
      <Text>{children}</Text>
      <Copyright>{data.site.siteMetadata.copyright}</Copyright>
    </FooterGroup>
)

export default Footer