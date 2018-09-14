---
title: NotificationCenter Protocol 以及伪 ViewModel 实战
date: 2017-07-01 13:57:00
background: https://i.imgur.com/aygYilY.jpg
categories: iOS
tags:
    - Swift
    - iOS
---

## 前言

开发过程中的小总结.

<!--more-->

## NotificationCenter Protocol

NotificationCenter Protocol 乍一看很别扭, 这明明是两种设计模式. 实际上, 这里是将 **观察者模式** 和 **代理模式** 融合到了一起, 将观察者模式代理化了. 

**为什么要这样做?**

### 保证观察对象的一致性

哪些类是观察者, 可以通过协议一目了然. 避免之前多种多样的发送通知的方式.

### 避免通知名称冲突

如果随意起名, 可能会导致两个不同的观察对象拥有相同的通知名, 后期容易通知混乱, 难以维护.

### 避免使用字符串作为通知名称

这是比较 `Hard Code` 的方式, 在开发过程中难以用 Xcode 自动补齐.

那么, 如何进行改造 NotificationCenter, 国外这篇[博客](https://medium.com/swift-programming/swift-nsnotificationcenter-protocol-c527e67d93a1#.4zto25k8j)写的非常好, 而且 SwiftGG 也翻译了[这篇文章](http://swift.gg/2017/04/13/swift-nsnotificationcenter-protocol/), 我就不再写一遍了, 大家可以看一看作者的 [playground](https://github.com/andyyhope/Blog_NSNotificationCenterProtocol/).

代码如下：

```swift
// MARK: - Protocol

public protocol Notifier {
    associatedtype Notification: RawRepresentable
}

public extension Notifier where Notification.RawValue == String {
    
    // MARK: - Static Computed Variables
    
    private static func nameFor(notification: Notification) -> String {
        return "\(self).\(notification.rawValue)"
    }
    
    
    // MARK: - Instance Methods
    
    // Pot
    
    func postNotification(notification: Notification, object: AnyObject? = nil) {
        Self.postNotification(notification, object: object)
    }
    
    func postNotification(notification: Notification, object: AnyObject? = nil, userInfo: [String : AnyObject]? = nil) {
        Self.postNotification(notification, object: object, userInfo: userInfo)
    }
    
    
    // MARK: - Static Function
    
    // Post
    
    static func postNotification(_ notification: Notification, object: AnyObject? = nil, userInfo: [String : AnyObject]? = nil) {
        let name = nameFor(notification: notification)
        
        NotificationCenter.default
            .post(name: NSNotification.Name(rawValue: name), object: object, userInfo: userInfo)
    }
    
    // Add
    
    static func addObserver(observer: AnyObject, selector: Selector, notification: Notification) {
        let name = nameFor(notification: notification)
        
        NotificationCenter.default
            .addObserver(observer, selector: selector, name: NSNotification.Name(rawValue: name), object: nil)
    }
    
    // Remove
    
    static func removeObserver(observer: AnyObject, notification: Notification, object: AnyObject? = nil) {
        let name = nameFor(notification: notification)
        
        NotificationCenter.default
            .removeObserver(observer, name: NSNotification.Name(rawValue: name), object: object)
    }
}
```

使用示例：

```swift

// MARK: - Example

class Barista : Notifier {
    enum Notification : String {
        case makeCoffee
    }
}

extension Selector {
    static let makeCoffeeNotification = #selector(Customer.drink(notification:))
}

class Customer {
    @objc func drink(notification: NSNotification) {
        print("Mmm... Coffee")
    }
}


let customer = Customer()

Barista.addObserver(observer: customer, selector: .makeCoffeeNotification, notification: .makeCoffee)

Barista.postNotification(.makeCoffee)
// prints: Mmm... Coffee

Barista.removeObserver(observer: customer, notification: .makeCoffee)

```

## NotificationCenter Protocol 实战

一个很简单的例子. 用户在侧滑菜单处, 点击进入登录页面, 登录成功后, 登录页面自行 dismiss, 并利用 token 获取用户信息, 信息获取后, 自动刷新侧滑菜单的 UI.

![Imgur](https://i.imgur.com/IgALBmn.jpg)

简单的分析一下: 

* 如果你只是在 LoginViewController(登录) 里利用 Alamofire 发送请求, 得到数据后, 再次请求用户信息, 并 dismiss 页面, 那么 LeftViewController(侧滑菜单) 无法知道用户信息何时已获取并刷新 UI. 所以, 最好是用 NotificationCenter 来做.
* 跨界面传数据有很多种方式, 我考虑的做法是, 将 User 相关的数据抽象出一个单例来管理. 好处不仅在于, 方便请求数据, 存储数据等, 还要实现上面博客所说的 `Notifier` 协议, 向它的订阅者推送通知.

**Show me the code:**

每个业务操作对应了两种通知类型, `didXXX` 成功通知和 `didXXXFailure` 失败通知, 如下: 

``` swift
// UserManager.swift
public class UserManager: Notifier {
    
    public static let shared: UserManager = UserManager()
    
    public enum Notification : String {
        case didGetMessage
        case didGetMessageFailure
        case didSignup
        case didSignupFailure
        case didLogin
        case didLoginFailure
        case didGetUserInfo
        case didGetUserInfoFailure
        ...
    }
}
```

对于一种规范的后台接口, 处理响应数据的代码会有很多重复. 比如, 网络问题发送失败通知, JSON解析不对发送失败通知, 状态码不对发送失败通知, 打印失败/成功的日志, 成功操作后推送成功通知等等. 所以我把重复的操作用统一的方法 `handleResult` 来做, 如下:

``` swift
// UserManager.swift
    private func handleResult(_ action: Action, _ response: DataResponse<Any>, completionHandler: (JSON) -> ()) {
        switch response.result {
        case .success:
            guard let value = response.result.value else {
                log("response.result.value is nil", .error)
                return
            }
            let json = JSON(value)
            guard let status = json["code"].int else { return }
            guard status == 0 else {
                log(json, .error)
                
                let (_, failureNoti) = actionDict[action]!
                UserManager.postNotification(failureNoti)
                
                return
            }
            let (successNoti, _) = actionDict[action]!
            completionHandler(json)
            UserManager.postNotification(successNoti)
            return
        case .failure(let error):
            log(error, .error)
            let (_, failureNoti) = actionDict[action]!
            UserManager.postNotification(failureNoti)
            return
        }
    }
```

那么这个 Action 是我自己定义的, 如下:

```swift
// UserManager.swift
    private enum Action {
        case getMessage
        case signUp
        case logIn
        case getUserInfo
        case getAvatar
    }
    
    private let actionDict: [Action: (Notification, Notification)] =
        [.getMessage: (.didGetMessage, .didGetMessageFailure),
         .signUp: (.didSignup, .didSignupFailure),
         .logIn: (.didLogin, .didLoginFailure),
         .getUserInfo: (.didGetUserInfo, .didGetUserInfoFailure),
         .getAvatar: (.didGetUserAvatar, .didGetUserAvatarFailure)]
```

定义完之后, 请求以及对响应数据的操作变得相当简洁. 例如, 注册时, 将 `Action` 对应的 `.signUp`, 响应数据 `response` 和操作闭包传给 `handleResult` 即可. 不管成功与否, 由 `handleResult` 来推送相应的通知, 并处理 json 数据. 例如: 

```swift
// UserManager.swift
    func signup(username: String, password: String, name: String, email: String, photo: String) {
        Alamofire.request(Router.signUp(username, password, name, email, photo)).responseJSON { response in
            self.handleResult(.signUp, response, completionHandler: { (json) in
                log(json, .json)
            })
        }
    }
    
    func login(username: String, password: String) {
        Alamofire.request(Router.logIn(username, password)).responseJSON { response in
            self.handleResult(.logIn, response, completionHandler: { (json) in
                log(json, .json)
                
                self.token = json["result"].string!
                log(self.token, .json)
                
                self.isLogIn = true
            })
        }
    }
```

这样的话, `UserManager` 作为单例, 管理着整个应用与 User 相关的数据和操作. 其他 ViewController 在注册 `UserManager` 的通知后, 只需要调用其方法, 等待通知就行了.

在相应的 ViewController 里面注册和取消通知, 如下: 

```swift
// LoginViewController.swift
override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        UserManager.addObserver(observer: self, selector: .userDidLogin, notification: .didLogin)
        UserManager.addObserver(observer: self, selector: .userDidLoginFailure, notification: .didLoginFailure)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        UserManager.removeObserver(observer: self, notification: .didLogin)
        UserManager.removeObserver(observer: self, notification: .didLoginFailure)
    }
```

上面的方法已经对 Selector 进行了扩展. 这样做在使用的时候更简洁, 同样是该作者的一篇关于 Selector 语法糖的文章 [Swift: Selector Syntax Sugar](https://medium.com/swift-programming/swift-selector-syntax-sugar-81c8a8b10df3), 扩展如下:

```swift
extension Selector {
    // Notifier Action
    static let userDidLogin = #selector(LoginViewController.userDidLogin(notification:))
    static let userDidLoginFailure = #selector(LoginViewController.userDidLoginFailure(notification:))
}
```

ViewController 收到通知后, 对 View 进行改变, 例如:

```swift
// LoginViewController.swift
    func userDidLogin(notification: NSNotification) {
        loginButton.isActive = false
        self.noticeSuccess("登录成功")
        DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(1), execute: {
            self.dismiss(animated: true, completion: nil)
        })
    }
    
    func userDidLoginFailure(notification: NSNotification) {
        loginButton.isActive = false
        self.noticeError("登录失败")
    }
```

## 回顾

当时写的时候, 没有接触过 **MVVM** 的概念, 自己完全为了业务逻辑抽象出来一层瞎写的. 然而后来发现, 有那么一点 **ViewModel** 的味道. 

对于 MVVM, 在 ViewController 里面调用 ViewModel 的方法, ViewModel 来和 Model 通信, 通过 block 回调或者 ReactiveCocoa 来改变 ViewController 里的 View. 

对于本实例, 在 ViewController 里面调用 UserManager 的方法, UserManager 负责发网络请求获取数据 Model, 通过观察者模式来通知 ViewController 改变 View. 

毕竟 ReactiveCocoa 是用观察者模式来实现 ViewModel 的 View 绑定.

这么做, 其实是为了给 ViewController 瘦身, 避免 MVC 的 "Massive View Controller" 缺点. 

## 有待改进的地方

* `didXXXFailure` 失败通知无法获知失败原因. 可以用通知中的 `userInfo` 来传递.
* 太麻烦. 写这么一个逻辑, 要在好几个文件里同时添加代码, 后期嫌麻烦. 可以将 `didXXX` 和 `didXXXFailure` 合成一个, 用 `userInfo` 来传递是否有错误.
* 或者不这么做了, 用 MVVM 来做, 用 Moya + RxSwift 来做.

> 参考文章:
> [SwiftGG](http://swift.gg/2017/04/13/swift-nsnotificationcenter-protocol/)





