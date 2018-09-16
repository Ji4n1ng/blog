import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import BlogHeader from '../components/blog-header'

const NotFoundBody = styled.div`
  display: flex;
  width: 100%
  height: 500px;
  background-color: #EFF3F6;
`

const TitleGroup = styled.div`
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    padding: 100px 20px 40px 20px;

    @media (max-width: 400px) {
        padding: 0 10px 40px 10px;
    }
`

const Title = styled.p`
    display: block;
    color: #8196A4;
    font-size: 50px;
    text-align: center;
    margin: 0 auto;
    padding-bottom: 20px;
    font-weight: 600;

    @media (max-width: 640px) {
        font-size: 40px;
    }

    @media (max-width: 400px) {
        font-size: 30px;
    }
`

const Subtitle = styled.p`
    display: block;
    margin: 0 auto;
    text-align: center;
    color: #8196A4;
    font-size: 28px;
    font-weight: 400;

    @media (max-width: 640px) {
        font-size: 24px;
    }

    @media (max-width: 400px) {
        font-size: 20px;
    }
`

const Button = styled.button`
    display: block;
    margin: 60px auto 20px auto;
    padding: 13px 25px;
    color: #fff;
    text-decoration: none;
    font-size: 20px;
    font-weight: 500;
    border-radius: 40px;
    transition: 1s cubic-bezier(0.2, 0.8, 0.2, 1);
    background-image: linear-gradient(to bottom right, #9C6FFF, #5334F5);

    &:hover {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
        transform: translateY(-3px);
    }

    @media (max-width: 640px) {
        font-size: 22px;
    }

    @media (max-width: 400px) {
        font-size: 20px;
    }
`

const NotFoundPage = () => (
  <div>
    <BlogHeader
      title="Jianing's Blog"
      subtitle="404 NOT FOUND"
      backgroundImage="https://i.imgur.com/Goy2m6Y.jpg" />
    <NotFoundBody>
      <TitleGroup>
        <Title>NOT FOUND</Title>
        <Subtitle>You just hit a route that doesn&#39;t exist... the sadness.</Subtitle>
        <Link to="/blog"><Button>Back to Home</Button></Link>
      </TitleGroup>
    </NotFoundBody>
  </div>
)

export default NotFoundPage
