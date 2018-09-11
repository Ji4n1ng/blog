---
title: iOS 单向数据流架构之 ReSwift-RxSwift-Login-Example
date: 2017-09-07 12:00:00
categories: iOS
background: https://i.imgur.com/Goy2m6Y.jpg
---

## 前言

系列文章第三篇, 通过一个简单的实战例子看一看 ReSwift 和 RxSwift 的搭配姿势.

<!--more-->

开源地址: [ReSwift-RxSwift-Login-Example](https://github.com/JianingWang/ReSwift-RxSwift-Login-Example)

## 程序

先来看一下效果图:

![blog-cp-02](http://on74pxnsk.bkt.clouddn.com/blog-cp-02.gif)

### State

我在设计 State 的时候, 考虑到之前写的 RxSwift 错误传递姿势的文章, 将一些状态包成了枚举, 至少有三种情况, 无状态, 成功和失败, 有些时候可能需要加上正在进行, 以显示等待动画.

```swift
enum LoggedInState {
    
    case notLoggedIn
    case loggingIn
    case loginFailed(ORMError)
    case loggedIn(Token)
    
    ...
}

struct AuthenticationState: StateType {
    
    var loggedInState: LoggedInState
    var phoneInput: String
    var passwordInput: String
    var phoneTextFieldBackground: UIColor
    var passwordTextFieldBackground: UIColor
    var loginButtonEnabled: Bool
    
    ...
}
```

### Actions

这个没什么好说的, 参考 ReSwift 作者的做法, 异步的 Action, 用一个方法来做的, 调用 Service 层来发出网络请求, 利用 Rx, 处理回调, 并重新分发 Action. 同步地直接返回一个 *登录中* 的状态.

```swift
func authenticateUser (state: State, store: Store<State>) -> Action? {
    
    let service = AuthenticationService()
    
    service.login(phone: state.authenticationState.phoneInput, password: state.authenticationState.passwordInput)
        .subscribe(onNext: { loggedInState in
            afterDelay(1) {
                store.dispatch(UpdateLoggedInState(loggedInState: loggedInState))
                if case .loggedIn = loggedInState {
                    store.dispatch(ReSwiftRouter.SetRouteAction([Config.Route.main]))
                }
            }
        }, onDisposed: {
            log("AuthenticationService Disposed")
        })
        .disposed(by: globalDisposeBag)
    
    return UpdateLoggedInState(loggedInState: .loggingIn)
}
```

### Reducer

这里只改状态就好.

```swift
func authenticationReducer(state: AuthenticationState?, action: Action) -> AuthenticationState {
    
    var state = state ?? AuthenticationState()
    
    switch action {
    case _ as ReSwiftInit:
        break
    case let action as UpdateLoggedInState:
        state.loggedInState = action.loggedInState
    ...
    }
}
```

### Services

我在这里放业务逻辑, 利用 Moya 和 RxSwift, 返回某个 State 的表示状态的 enum, 例如 AuthenticationState 的 LoggedInState, UserState 的 UserInfoState.

```swift
class AuthenticationService {
    
    private let provider = RxMoyaProvider<AuthenticationAPI>(plugins: [NetworkLoggerPlugin(verbose: true)])
    
    func login(phone: String, password: String) -> Observable<LoggedInState> {
        return provider.request(.login(phone, password))
            .handleResponseMapJSON()
            .map { result in
                switch result {
                case let .success(json):
                    guard let token = json.string else {
                        log("No Token", .error)
                        return .loginFailed(ORMError.ORMNoData)
                    }
                    return .loggedIn(token)
                case let .failure(error):
                    return .loginFailed(error)
                }
            }
    }
    
}
```

### Networking

Moya 的 Target 没什么好说的.

### Routes

使用了官方的 ReSwiftRouter, 记得之前有人说过, 更改了程序的路由结构, 相当于重构.

### 双向绑定

可以看之前的文章: [RxSwift 利用双向绑定实现 ControlProperty 可观察程序性更改](http://www.ningjia.wang/2017/09/04/RxSwift利用双向绑定实现ControlProperty可观察程序性更改/)

## ReSwift + RxSwift

重点问题是两者结合的姿势是什么.

ReSwift 已经决定了整个应用数据流向, RxSwift 肯定不能越俎代庖. 

我给 RxSwift 的定位是: 异步地, 响应式地向 store 发送用户的 action. 也就是用 Rx 把 view 层绑定到 *动作发射机* (打个比方).

举个例子, 让 Rx 代替了代理的作用. 比如, 我要实时监控两个 TextField 的输入, 来做实时表单验证, 通常使用 `UITextFieldDelegate` 来做实时获取用户输入, 我让 Rx 代替了它. 

```swift
        let _ = Observable.combineLatest(phoneValue.asObservable(), passwordValue.asObservable())
            .observeOn(MainScheduler.asyncInstance)
            .subscribe(onNext: {
                store.dispatch(
                    InputLoginInfo(
                        phoneInput: $0,
                        passwordInput: $1
                    )
                )
            })
            .disposed(by: disposeBag)
```

比用代理来做优雅简洁.

所以, 使用 Rx 的时候, 截止到 store 分发哪一个 action 这一步骤就行了, 不能再往下做了, 剩下的数据流方向是 Re 的任务.

```swift
        loginButton.rx.tap
            .subscribe(onNext: {
                store.dispatch(authenticateUser)
            })
            .disposed(by: disposeBag)
```

## 最后

一定要看一下源码: [ReSwift-RxSwift-Login-Example](https://github.com/JianingWang/ReSwift-RxSwift-Login-Example)

作为 ReSwift 和 RxSwift 的新人, 姿势问题处于摸索状态, 欢迎大家交流.



