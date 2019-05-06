---
title: iOS 单向数据流架构之 ReactorKit
date: 2017-09-05 12:00:00
categories: iOS
background: https://s2.ax1x.com/2019/04/23/EEG2bq.jpg
tags:
    - 架构
    - ReactorKit
    - RxSwift
    - iOS
    - Swift
---


## 前言

系列文章第一篇, 关于 iOS 单向数据流架构介绍, 以及 ReactorKit 一款 Flux 风格的单向数据流框架.

<!--more-->

## 架构就是为了统一口径

iOS 架构有传统的 MVC, 还有 MVVM, VIPER. 架构这个词很泛, 宽泛和泛滥的泛. 一来它的定义很宽泛. 二来, 关于架构的文章网上很泛滥, 这里只介绍两款受前端技术影响而产生的单向数据流架构 [ReSwift](https://github.com/ReSwift/ReSwift) 和 [ReactorKit](https://github.com/ReactorKit/ReactorKit).

我觉得, 在某个方面, **架构就是为了统一口径**. 在实际编程的切身体会, 以及看了 ReSwift 作者的介绍文章之后, 越发的这样觉得.

为什么这么说? 先来看看 ReSwift 作者对于 MVC 的见解.

### MVC 的问题

Model-View-Controller (MVC) 并不是一个全面的应用架构. 在典型的 Cocoa 应用程序中, `controller` 的复杂性很高，因为 MVC 并没有提供 **状态管理** 的解决方案, 这通常是应用程序开发中最复杂的问题.

建立在 MVC 上的应用程序通常会在 **状态管理和传播** 方面产生很高的复杂性. 我们需要使用回调闭包, 代理, KVO 和通知来传递我们应用程序中的消息, 并确保所有相关的 `view` 具有最新状态.

这种方法涉及很多手动步骤, 因此容易出错, 并且在复杂代码库中不能很好地扩展.

它也会导致写出难以理解的代码, 因为依赖关系可以隐藏在 `ViewController` 的内部. 最后, 会遇到不一致的代码，**因为每个开发人员都使用他们个人喜欢的 状态传播 过程**. 虽然可以通过 style guides 和 code review 来规避此问题，但你无法自动验证遵守这些准则.

### 我在 MVVM 架构中遇到问题

在学习了 RxSwift 之后决定尝试一下 MVVM 架构. 初来乍到, 总会遇到很多问题. 当时看了一些 [官方社区](http://community.rxswift.org) 推荐的 demo 以及一些其他的示例, 我发现 iOS 端的 MVVM 感觉一人一个写法 (虽然有点夸张). 但每种做法感觉总是不"全", 碰上新问题, 这个示例的做法就不适用或者不优雅了. 自己一直改来改去, 没有办法形成一个统一的约定. 结合多个示例的做法, 改来改去, 反而把问题弄得更加复杂.

所以亟待一个架构类的框架来统一口径.

## 关于单向数据流架构

[Flux](https://facebook.github.io/flux/) 和 [Redux](https://github.com/reactjs/redux) 是前端的两种架构. 两者的都是单向数据流的架构. 关于两者的介绍, 网上的文章太多, 非狭义前端人员就不多说了. [ReSwift](https://github.com/ReSwift/ReSwift) 是 Redux 版的实现, 而 [ReactorKit](https://github.com/ReactorKit/ReactorKit) 是一款 Flux 风格的框架.

## ReactorKit 简介

[ReactorKit](https://github.com/ReactorKit/ReactorKit) 并不"火", Github "也"只有 600 多的赞, 国内知之甚少, 更不用说实际应用了.

官方文档是这样写的: ReactorKit 结合了 Flux 和响应式编程. 

那么, 对于 ReactorKit 是否是严格符合 Flux 规范, 我就不得知了. 

![blog-ud-1](https://s2.ax1x.com/2019/04/23/EAxbFg.jpg)

### View

广义的 *View* 包含了基本的控件, ViewController, cell 等. View 层负责展示数据, 并把用户的输入绑定到 `action stream(操作流)`上, 以及把 view 的 `state(状态)` 绑定到每个 UI 组件上.

View 层没有业务逻辑. 只管怎么把自己的状态变化映射到 `action stream(操作流)` , 怎么把 `state stream(状态流)` 变化映射给自己. 连接两者的中间通路就是 `RxSwift`. 

当 `reactor` 的状态变化后, 会调用 `bind(reactor:)` 方法.

```swift
func bind(reactor: ProfileViewReactor) {
  // action (View -> Reactor)
  refreshButton.rx.tap.map { Reactor.Action.refresh }
    .bind(to: reactor.action)
    .disposed(by: self.disposeBag)

  // state (Reactor -> View)
  reactor.state.map { $0.isFollowing }
    .bind(to: followButton.rx.isSelected)
    .disposed(by: self.disposeBag)
}
```

### Reactor

Reactor 独立于 UI 层, 负责管理 view 的状态. 作者强调, Reactor 的最重要的角色是从 UI 层里分离出 *控制流*. 每个 view 有与之相关的 reactor 并且将所有的逻辑委托给 reactor. 这样做的好处是, reactor 对于 view 没有依赖性, 容易测试.

其实我觉得这个玩意可以对比 ViewModel 在 MVVM 里的角色. 

```swift
class ProfileViewReactor: Reactor {
  // represent user actions
  enum Action {
    case refreshFollowingStatus(Int)
    case follow(Int)
  }

  // represent state changes
  enum Mutation {
    case setFollowing(Bool)
  }

  // represents the current view state
  struct State {
    var isFollowing: Bool = false
  }

  let initialState: State = State()
}
```

Action 代表一个用户交互过程, 例如用户刷新了一下, 点击了 follow 按钮等. State 就是 view 的状态. `Mutation` 是两者的桥梁. 一个 Reactor 将 `action stream(操作流)` 转化为 `state stream(状态流)` 分为两步: `mutate()` and `reduce()`

![blog-ud-02](https://s2.ax1x.com/2019/04/23/EAxqYQ.jpg)

#### `mutate()`

`mutate()` 接受一个 Action 并生成一个 `Observable<Mutation>`.

```swift
func mutate(action: Action) -> Observable<Mutation>
```

每一个 `side effect(副作用)` 都放在这个方法里, 例如异步操作或者调用 API.

> 小插曲, 看 Ray 家的 RxSwift 一书时, 会频繁出现在视野里. `side effect` 到底是个啥, 应该怎么翻译?
> 应该翻译成 "副作用". 但是不要先入为主的以为就是贬义词. 关于这个, 我专门搜过, 可以看一下[知乎](https://www.zhihu.com/question/30779564)上的讨论.
> Side effects are any change to the state outside of the current scope.
> 举个例子 `Any time you modify data stored on disk or update the text of a label on screen, you cause side effects.`
> **副作用** 不是坏的东西, **编程的最终目的是产生副作用**. 你的程序执行以后, 世界需要发生改变, 如果你的程序运行完之后, 一点效果也没产生, 那么这就是一个无用的程序.

```swift
func mutate(action: Action) -> Observable<Mutation> {
  switch action {
  case let .refreshFollowingStatus(userID): // receive an action
    return UserAPI.isFollowing(userID) // create an API stream
      .map { (isFollowing: Bool) -> Mutation in
        return Mutation.setFollowing(isFollowing) // convert to Mutation stream
      }

  case let .follow(userID):
    return UserAPI.follow()
      .map { _ -> Mutation in
        return Mutation.setFollowing(true)
      }
  }
}
```

#### `reduce()`

`reduce()` 根据先前的旧 `State` 和一个 `Mutation` 来生成新的 `State`.

```swift
func reduce(state: State, mutation: Mutation) -> State
```

这个方法就是一个纯函数. 它应当同步地返回一个新 `State`. 这个方法不能有任何 `side effect(副作用)` 发生.

#### `transform()`

`transform()` 对每个 `stream(流)` 进行变换.

```swift
func transform(action: Observable<Action>) -> Observable<Action>
func transform(mutation: Observable<Mutation>) -> Observable<Mutation>
func transform(state: Observable<State>) -> Observable<State>
```

## ReactorKit 高级用法

### Service

既然前面都没有业务逻辑, 那么不难猜出, Service 层就是负责了实际的业务逻辑. Reactor 是 View 和 Service 的中间层. 工作流程是, Reactor 从 View 层接收到用户的操作, Reactor 调用 Service 的逻辑. Service 发出一个网络请求然后把网络响应返回给 Reactor. 然后 Reactor 根据响应创建一个 `mutation stream`.

```swift
protocol UserServiceType {
  func user(id: Int) -> Observable<User>
  func follow(id: Int) -> Observable<Void>
}

final class UserService: Service, UserServiceType {
  func user(id: Int) -> Observable<User> {
    return foo()
  }
  
  func follow(id: Int) -> Observable<Void> {
    return bar()
  }
}
```

### Global States

不同于 Redux, ReactorKit 并没有定义一个全局状态. 这意味着你可以使用任何东西来管理全局状态, 比如 `Variable`, `PublishSubject`, 甚至是一个 `Reactor`. ReactorKit 并不强制你有一个全局状态.

`Global state(全局状态)` 并没有 **Action → Mutation → State** 流. 所以你得使用 `transform(mutation:)` 把全局状态变换为一个 `mutation`. 假设我们有一个全局的 `Variable` 存储了当前登录的用户. 当 `currentUser` 变化时, 你需要发射一个 `Mutation.setUser(User?)` 事件.

```swift
var currentUser: Variable<User> // global state

func transform(mutation: Observable<Mutation>) -> Observable<Mutation> {
  return Observable.merge(mutation, currentUser.map(Mutation.setUser))
}
```

### View Communication

在多个 view 之间通信, 通常的做法是回调闭包或者代理模式. ReactorKit 的建议是用 [reacitve extensions](https://github.com/ReactiveX/RxSwift/blob/master/RxSwift/Reactive.swift). `ControlEvent` 最常用的例子是 `UIButton.rx.tap.` 关键是你把自定义 view 也看做 UIButton 或者 UILabel.

![blog-ud-03](https://s2.ax1x.com/2019/04/23/EAxLWj.jpg)

### Testing

ReactorKit 内置了测试功能. 你可以非常轻松地测试 view 和 reactor.

#### 测试什么

首先, 你得决定哪些需要测试.

* View
    * Action: 一个 action 是否被送到了合适的 reactor 那里.
    * State: 一个 view 的属性是否被新的 state 合理地改变了.
* Reactor
    * State: 一个 state 根据一个 action 做出了合适的改变.

#### View 测试

View 可以被 `stub(桩)` reactor 测试. 一个 Reactor 具有 `stub` 属性, 可以打印 action 日志和强制改变状态. 如果打开了 `stub` 功能, `mutate()` 和 `reduce()` 都不执行. 一个 `Stub` 拥有三个属性

```swift
var isEnabled: Bool { get set }
var state: Variable<Reactor.State> { get }
var action: ActionSubject<Reactor.Action> { get }
var actions: [Reactor.Action] { get } // recorded actions
```

下面是官方给的测试用例的示例:

```swift
func testAction_refresh() {
  // 1. prepare a stub reactor
  let reactor = MyReactor()
  reactor.stub.isEnabled = true

  // 2. prepare a view with a stub reactor
  let view = MyView()
  view.reactor = reactor

  // 3. send an user interaction programatically
  view.refreshControl.sendActions(for: .valueChanged)

  // 4. assert actions
  XCTAssertEqual(reactor.stub.actions.last, .refresh)
}

func testState_isLoading() {
  // 1. prepare a stub reactor
  let reactor = MyReactor()
  reactor.stub.isEnabled = true

  // 2. prepare a view with a stub reactor
  let view = MyView()
  view.reactor = reactor

  // 3. set a stub state
  reactor.stub.state.value = MyReactor.State(isLoading: true)

  // 4. assert view properties
  XCTAssertEqual(view.activityIndicator.isAnimating, true)
}
```

#### Reactor 测试

前面提到了, Reactor 独立于 View 层, 所以可以独立测试.

```swift
func testIsBookmarked() {
  let reactor = MyReactor()
  reactor.action.onNext(.toggleBookmarked)
  XCTAssertEqual(reactor.currentState.isBookmarked, true)
  reactor.action.onNext(.toggleBookmarked)
  XCTAssertEqual(reactor.currentState.isBookmarked, false)
}
```

有些时候, 一个单一的 action 可以改变一个 state 多次. 例如, 一个 `.refresh` 刷新操作, 会将 `state.isLoading` 设置为 `true`, 结束刷新之后又会设置为 `false`. 在这种情况下, 很难用 `currentState` 去测试 `state.isLoading`, 所以你需要用 [RxTest](https://github.com/ReactiveX/RxSwift) 或者 [RxExpect](https://github.com/devxoul/RxExpect). 这有一个简单的 RxExpect 测试用例:

```swift
func testIsLoading() {
  RxExpect("it should change isLoading") { test in
    let reactor = test.retain(MyReactor())
    test.input(reactor.action, [
      next(100, .refresh) // send .refresh at 100 scheduler time
    ])
    test.assert(reactor.state.map { $0.isLoading })
      .since(100) // values since 100 scheduler time
      .assert([
        true,  // just after .refresh
        false, // after refreshing
      ])
  }
}
```

### Conventions 约定俗成

ReactorKit 建议你在 view 的外面创建 reactor, 并把它传递给 view.

提倡的做法:

```swift
let view = MyView()
view.reactor = MyViewReactor(provider: provider)
```

不提倡的做法:

```swift
class MyView: UIView, View {
  init() {
    self.reactor = MyViewReactor()
  }
}
```

### 示例

- [Counter](https://github.com/ReactorKit/ReactorKit/tree/master/Examples/Counter): The most simple and basic example of ReactorKit
- [GitHub Search](https://github.com/ReactorKit/ReactorKit/tree/master/Examples/GitHubSearch): A simple application which provides a GitHub repository search
- [RxTodo](https://github.com/devxoul/RxTodo): iOS Todo Application using ReactorKit
- [Cleverbot](https://github.com/devxoul/Cleverbot): iOS Messaging Application using Cleverbot and ReactorKit
- [Drrrible](https://github.com/devxoul/Drrrible): Dribbble for iOS using ReactorKit ([App Store](https://itunes.apple.com/us/app/drrrible/id1229592223?mt=8))
- [Passcode](https://github.com/cruisediary/Passcode): Passcode for iOS RxSwift, ReactorKit and IGListKit example

官方推荐的几个程序都应该好好看看. 尤其是 RxTodo 和 Drrrible. 作者的程序代码简洁, 有着很好的 POP 思想, 不管是最后在实践中用不用 ReactorKit, 都值得一看. ( RxTodo 比 ReactorKit 的 star 都多, 好尴尬... 不过前者之前出名并不是因为用了 ReactorKit)

## 最后

ReactorKit 的介绍就到这里了. 关于 ReSwift 的文章在后一篇.

> ReactorKit 的作者是一个帅气的韩国小哥, 看简历貌似高中就辍学搞程序了. [GitHub](https://github.com/devxoul) 上很多项目, 之前最早看过应该是 [Then](https://github.com/devxoul/Then), 还有各种语法糖, 什么 elegant 啊, 什么 the most sexy way 啊, 看来韩国银总是喜欢优雅漂亮的东西啊...




