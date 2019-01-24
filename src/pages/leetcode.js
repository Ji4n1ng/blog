import React from 'react'
import BlogHeader from '../components/blog-header'
import '../templates/blog-post.css'

class LeetCodePage extends React.Component {
  render() {
    return (
      <div className="LeetCode">
        <BlogHeader
          title="LeetCode"
          subtitle=""
          backgroundImage="https://i.imgur.com/Goy2m6Y.jpg" />
        <div className='MarkDownWrapper'>
          <div className="markdown-body"><h2><a id="LeetCode_0"></a>LeetCode</h2>
            <p>关于 Yao 和 Jianing 的 LeetCode 刷题记录。</p>
            <p>要求如下：</p>
            <ul>
              <li>每两天一道</li>
              <li>题解提交到 GitHub，如有必要，请在代码中添加注释</li>
              <li>刷题情况记录在此网站，同时记录算法性能得分</li>
            </ul>
            <p>Solution 的开源地址：</p>
            <ul>
              <li>Jianing：<a href="https://github.com/Ji4n1ng/my-leetcode-solutions">https://github.com/Ji4n1ng/my-leetcode-solutions</a></li>
              <li>Yao：<a href="https://github.com/Sixdes/LeetCode-solution">https://github.com/Sixdes/LeetCode-solution</a></li>
            </ul>
            <h2><a id="_9"></a>统计</h2>
            <table class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Time</th>
                  <th>Yao</th>
                  <th>Jianing</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><a href="https://leetcode.com/problems/trapping-rain-water/">42</a></td>
                  <td>Trapping Rain Water</td>
                  <td>Hard</td>
                  <td>2019.01.16-17</td>
                  <td>√ 0.91</td>
                  <td>√ 0.97</td>
                </tr>
                <tr>
                  <td><a href="https://leetcode.com/problems/rotate-image/">48</a></td>
                  <td>Rotate Image</td>
                  <td>Medium</td>
                  <td>2019.01.18-19</td>
                  <td>√ 98.95</td>
                  <td>√ 15.91</td>
                </tr>
                <tr>
                  <td><a href="https://leetcode.com/problems/plus-one/">66</a></td>
                  <td>Plus One</td>
                  <td>Easy</td>
                  <td>2019.01.20-21</td>
                  <td>√ 100</td>
                  <td>√ 93.51</td>
                </tr>
                <tr>
                  <td><a href="https://leetcode.com/problems/climbing-stairs/">70</a></td>
                  <td>Climbing Stairs</td>
                  <td>Easy</td>
                  <td>2019.01.22-23</td>
                  <td>√ 100</td>
                  <td>√ 100</td>
                </tr>
                <tr>
                  <td><a href="https://leetcode.com/problems/set-matrix-zeroes/">73</a></td>
                  <td>Set Matrix Zeroes</td>
                  <td>Medium</td>
                  <td>2019.01.24-25</td>
                  <td> </td>
                  <td>√ 99.97</td>
                </tr>
                <tr>
                  <td><a href="https://leetcode.com/problems/gas-station/">134</a></td>
                  <td>Gas Station</td>
                  <td>Medium</td>
                  <td>2019.01.26-27</td>
                  <td> </td>
                  <td> </td>
                </tr>
                <tr>
                  <td><a href="https://leetcode.com/problems/candy/">135</a></td>
                  <td>Candy</td>
                  <td>Hard</td>
                  <td>2019.01.28-29</td>
                  <td> </td>
                  <td> </td>
                </tr>
                <tr>
                  <td><a href="https://leetcode.com/problems/single-number/">136</a></td>
                  <td>Single Number</td>
                  <td>Easy</td>
                  <td>2019.01.30-31</td>
                  <td> </td>
                  <td> </td>
                </tr>
                <tr>
                  <td><a href="https://leetcode.com/problems/single-number-ii/">137</a></td>
                  <td>Single Number II</td>
                  <td>Medium</td>
                  <td>2019.02.01-02</td>
                  <td> </td>
                  <td> </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default LeetCodePage
