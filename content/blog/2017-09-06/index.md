---
title: iOS 单向数据流架构之 ReSwift
date: 2017-09-06 12:00:00
categories: iOS
background: https://s2.ax1x.com/2019/04/23/EEGJvd.jpg
tags:
    - 架构
    - ReactorKit
    - ReSwift
    - iOS
    - Swift
---

## 前言

系列文章第二篇, 关于 ReSwift 的介绍, 以及 ReSwift 和 ReactorKit 对比.

<!--more-->

## ReSwift 简介

相比于 ReactorKit, ReSwift 就更知名一些了, 4000+ star.

ReSwift 把程序里的三个重要概念分离出来:

* **State**: 整个应用的状态存储在了数据结构中. 这样可以避免复杂的状态管理代码, 更利于 debug
* **Views**: 当 state 改变的时候, view 会更新.
* **State Changes**: 通过 actions 来执行状态变更. Actions 是一些描述一个状态变化的数据. 通过严格限制状态可以被变更的方式, 你的应用程序变得更容易理解, 并且更容易与其他协作者合作.

![blog-ud-04](https://s2.ax1x.com/2019/04/23/EAx7TS.jpg)

### The Store

**The Store** 通过简单数据结构的形式存储了整个应用的状态. 这些状态只能通过分发的 Actions 来修改. 当 store 里的 state 更改时, store 会通知所有的观察者.

### Actions

**Actions** 是一种描述状态变化的声明方式. Actions 不包含任何代码, 它们传递给 store 并转发到reducer. Reducer 将会处理 action, 实现状态变更.

### Reducers

**Reducers** 是一个纯函数, 基于当前 action 和 state, 创建一个新的 state.

### 示例

- [CounterExample](https://github.com/ReSwift/CounterExample): A very simple counter app implemented with ReSwift.
- [CounterExample-Navigation-TimeTravel](https://github.com/ReSwift/CounterExample-Navigation-TimeTravel): This example builds on the simple CounterExample app, adding time travel with [ReSwiftRecorder](https://github.com/ReSwift/ReSwift-Recorder) and routing with [ReSwiftRouter](https://github.com/ReSwift/ReSwift-Router).
- [GitHubBrowserExample](https://github.com/ReSwift/GitHubBrowserExample): A real world example, involving authentication, network requests and navigation. Still WIP but should be the best resource for starting to adapt `ReSwift` in your own app.
- [Meet](https://github.com/Ben-G/Meet): A real world application being built with ReSwift - currently still very early on. It is not up to date with the latest version of ReSwift, but is the best project for demonstrating time travel.

推荐看前三个.

### 为什么选用 ReSwift

前篇文章提到过, 因为 MVC 没有提供 **状态管理** 的解决方案, **因为每个开发人员都使用他们个人喜欢的 状态传播 过程**, 导致口径不统一, 不但会导致程序在 **状态管理和传播** 方面产生很高的复杂性, 还会导致写出后期难以理解和维护的代码.

ReSwift 通过对编写程序的方式施加严格的限制来解决这些问题. 通过检查应用程序 `state data structure(状态数据结构)`, `action` 和 `reducer` 来减少了程序员错误的空间, 并易于写出方便理解的代码.

## ReSwift vs ReatorKit

两者都是单向流数据架构, 而且都易于理解. 整个的数据流动方式比较相似, 不同点也和 Redux 与 Flux 的区别一样, 就是 state 是集中式管理还是分布式管理.

### 从 RxSwift 结合性来看

两者对比, 能看出来, ReactorKit 天生和 RxSwift 是一对. 

对于 ReSwift 来说, RxSwift 并不是必需.

如果对于 RxSwift 有非常的执念, ReactorKit 使用起来更加顺手和优雅. (不知怎的, 我觉得如果把 ReactorKit 程序里的 Reactor 替换为 ViewModel, 好像也挺和谐的...)

### 从社区完善程度来看

ReSwift 的知名度和使用人数肯定要超过 ReactorKit. ReSwift 也相对成熟, ReSwift 配备了两个框架, [ReSwift-Router](https://github.com/ReSwift/ReSwift-Router) 和 [ReSwift-Recorder](https://github.com/ReSwift/ReSwift-Recorder).

* ReSwift-Router 是一个路由框架 , 不过这个框架目前仍旧处于开发状态, 其 API 并不稳定. 在官方的 demo 里, [GitHubBrowserExample](https://github.com/ReSwift/GitHubBrowserExample), 经常会出现 `fatalError("Route not supported!")`, ` fatalError("Router could not proceed.")`等话. 
* ReSwift-Recorder 是神奇的框架, 如其名, 跟一个录像机似的, 可以记录和回放 actions, ReSwift 的介绍里的 GIF 就是它的效果, 拖动进度条来控制 actions. 对于开发或者演示都特别有帮助. 感觉是个脑洞作品.

当然了, 这都是辅助工具, 不管怎样, 总比 ReactorKit 没有其他工具要好.

### 从官方示例来看

我个人先看的 ReactorKit, 后看了 ReSwift, 前者的示例做的真好, ReSwift 虽然人多, 但也没见着示例做的多好.

### 从数据流的传递方式上来看

ReactorKit 截取 [RxTodo](https://github.com/devxoul/RxTodo) 部分代码. 

```swift
    // MARK: Binding
    
    func bind(reactor: TaskListViewReactor) {
        // Action
        self.rx.viewDidLoad
            .map { Reactor.Action.refresh }
            .bind(to: reactor.action)
            .disposed(by: self.disposeBag)
        
        self.editButtonItem.rx.tap
            .map { Reactor.Action.toggleEditing }
            .bind(to: reactor.action)
            .disposed(by: self.disposeBag)
        
        self.tableView.rx.itemSelected
            .filterNot(reactor.state.map { $0.isEditing })
            .map { indexPath in .toggleTaskDone(indexPath) }
            .bind(to: reactor.action)
            .disposed(by: self.disposeBag)
        
        self.tableView.rx.itemDeleted
            .map(Reactor.Action.deleteTask)
            .bind(to: reactor.action)
            .disposed(by: self.disposeBag)
        ...
    }
```

在将 view 层绑定到 reactor 时, 既然 view 已经知道分发哪一个 `action: .map { Reactor.Action.refresh }`, 但却会重复出现 `.bind(to: reactor.action)`. 显式地声明一下我绑定到了 view 对应的 reactor 上. 当然了, 在作者文档里有写过, 全局状态可以用任何形式来存储, 可以是一个 reactor, 存在一种可能是我绑定到全局 reactor 还是 view 对应的 reactor. 但是总感觉这句话应该隐藏起来, 默认绑定的就是 view 对应的 reactor, 当绑定到全局 reactor 等情况时, 才显式地声明一下区别. 为了简洁, 默认的绑定应当隐藏. 但作者的实现是通过 RxSwift, 也正是受其影响, 需要显式地绑定和销毁.

那么 ReSwift, 就相当简洁了, 最简单的就是点击一个按钮, 直接让全局的 store 分发一个 action. 集中式的好处, 不需要指定让哪一个来管理.

```swift
    @IBAction func authenticateWithGitHub() {
        store.dispatch(authenticateUser)
    }
```

### 结论

还是看个人喜好, 两者写出来的程序都特别易懂. 背后的思路也都是通过严格限制状态可以被变更的方式, 让一个人写不同模块的方式, 或者不同人写不同模块的方式都是大致的, 便于后期理解与维护. 

不过对于喜欢 Rx 的同学来说, ReSwift 并不是必须, ReactorKit 和其更搭配.

## 最后

两者的介绍已经结束, 欢迎交流. 最后一篇附上 ReSwift 和 RxSwift 的登录小 demo.

