---
title: RxSwift 利用双向绑定实现 ControlProperty 可观察程序性更改
date: 2017-09-04 11:00:00
categories: iOS
background: https://i.imgur.com/oJ9o9jO.jpg
tags:
    - RxSwift
    - iOS
    - Swift
---

## 前言

在写一个 ReSwift 和 RxSwift 示例程序碰上了一个小问题.

<!--more-->

## 问题

举个例子, 当你点击屏幕上的一个 Switch 时,

```swift
mySwitch.rx_value.subscribeNext { (next) in
    print(next)
}.addDisposableTo(disposeBag)
```

控制台会打印 `bool`, 然而当你用程序去改变 switch 的值时, 并不会打印,

```swift
mySwitch.on = true //Nothing visible in my debugger
```

可以参见 Github 上的 [issues](https://github.com/ReactiveX/RxSwift/issues/551) 和 [issues](https://github.com/ReactiveX/RxSwift/issues/690)

## 我遇见的问题

我在写 [ReSwift-RxSwift-Login-Example](https://github.com/JianingWang/ReSwift-RxSwift-Login-Example), 为了更好的让大家直观的体验 ReSwift 和 RxSwift 对表单实时验证的效果, 做了一个自动输入的按钮, 效果如下图:

![Imgur](https://i.imgur.com/AdvlFjT.gif)

我首先将 `UITextField.rx.text` 绑定到 `State`, 然而用程序去改变 `rx.text` 时, 全局的 `state` 并不会改变.

## 原因

不管是 `UISwitch.rx.value` 还是 `UITextField.rx.value` 这种 `ControlProperty` 并不会观察 *程序性改变*.

解决的办法是利用双向绑定, 将 `ControlProperty` 和一个 `Variable` 绑定.

```swift
let switchValue = Variable(false)
(mySwitch.rx_value <-> switchValue)
    .addDisposableTo(disposeBag)
switchValue.asObservable()
    .subscribeNext { (next) in
        print(next)
  }
  .addDisposableTo(disposeBag)

switchValue.value = true 
```

## 解决办法

针对我的需求, 我解决方案是将 `Variable` 负责 dispatch action, 来改变全局的 `State`, 然后 `Variable` 和 `UITextField.rx.text` 双向绑定, 当快速输入按钮被点击时, 改变 `Variable.value` 就可以实现这个效果了, 代码如下:

```swift
let phoneValue = Variable("")
        let passwordValue = Variable("")
        
        (phoneTextField.rx.text.orEmpty <-> phoneValue)
            .addDisposableTo(disposeBag)
        (passwordTextField.rx.text.orEmpty <-> passwordValue)
            .addDisposableTo(disposeBag)
        
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
        
        fastInputButton.rx.tap
            .subscribe(onNext: {
                stringToObservable(Config.Test.phone, interval: 0.1)
                    .scan("") { $0 + $1 }
                    .subscribe(onNext: {
                        phoneValue.value = $0
                    })
                    .disposed(by: self.disposeBag)
                stringToObservable(Config.Test.password, interval: 0.1)
                    .scan("") { $0 + $1 }
                    .subscribe(onNext: {
                        passwordValue.value = $0
                    })
                    .disposed(by: self.disposeBag)
            })
            .disposed(by: disposeBag)
```

## 双向绑定的实现

可以看一下这些实现, [how to make bidirectional binding between view and viewmodel use RxSwift #606](https://github.com/ReactiveX/RxSwift/issues/606) 和 [Two way binding in RxSwift](https://stackoverflow.com/questions/37496074/two-way-binding-in-rxswift)

实现如下:

```swift
infix operator <->

/// Bidirectional binding
/// - note: see [link](https://github.com/ReactiveX/RxSwift/issues/606)
/// - returns: Disposable
func <-> <T>(property: ControlProperty<T>, variable: Variable<T>) -> Disposable {
    let bindToUIDisposable = variable.asObservable()
        .bind(to: property)
    let bindToVariable = property
        .subscribe(onNext: { n in
            variable.value = n
        }, onCompleted:  {
            bindToUIDisposable.dispose()
        })
    
    return Disposables.create(bindToUIDisposable, bindToVariable)
}
```

利用了 `Variable` 属于 `Subject` 的特性, 既能被订阅, 也能观察别人. 将 `Variable` 绑定到 `ControlProperty`, 再订阅 `ControlProperty`, 将改变赋给 `Variable.value`.

## 总结

一点小技巧. 另, 示例程序链接为 [ReSwift-RxSwift-Login-Example](https://github.com/JianingWang/ReSwift-RxSwift-Login-Example).

