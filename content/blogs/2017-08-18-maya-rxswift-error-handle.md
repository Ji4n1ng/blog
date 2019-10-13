---
title: Moya + RxSwift 错误处理的问题
date: 2017-08-18 15:15:00
template: post
draft: false
slug: "/posts/maya-rxswift-error-handle/"
category: "Development"
tags:
   - "Swift"
   - "iOS"
background: https://s2.ax1x.com/2019/04/23/EEGIGF.jpg
---

## 前言

开发过程中的小总结.

<!--more-->

## Enum 包装 error

在看 RxSwift 社区推荐的开源 demo [ReallySimpleMVVMLoginExampleWithRxSwift](https://github.com/carlosypunto/ReallySimpleMVVMLoginExampleWithRxSwift) 时, 作者把错误包装在了 `Enum` 中, 当时确实没有理解作者为何这样做, 而不是直接 `throw`:

```swift
enum AutenticationStatus {
    case none
    case error(AutenticationError)
    case user(String)
}
```

## 直接 throw error

然而, 我在实际对 Moya 进行扩展的时候, 还是借鉴了 Moya 作者在 [Emergence](https://github.com/artsy/Emergence/blob/master/Emergence/Contexts/Networking/Observable%2BNetworking.swift) 里的做法, 将错误 `throw` 出去, 而不是 `return` 一个 enum case. Moya 作者是这样用的 :

```swift
enum ORMError : ErrorType {
    case ORMNoRepresentor
    case ORMNotSuccessfulHTTP
    case ORMNoData
    case ORMCouldNotMakeObjectError
}

extension Observable {

    // Returns a curried function that maps the object passed through
    // the observable chain into a class that conforms to Decodable
    func mapSuccessfulHTTPToObject<T: Decodable>(type: T.Type) -> Observable<T> {

        func resultFromJSON(object:[String: AnyObject], classType: T.Type) -> T? {
            return classType.init(json: object)
        }

        return map { representor in
            guard let response = representor as? Moya.Response else {
                throw ORMError.ORMNoRepresentor
            }

            // Allow successful HTTP codes
            guard ((200...209) ~= response.statusCode) else {
                if let json = try? NSJSONSerialization.JSONObjectWithData(response.data, options: .AllowFragments) as? [String: AnyObject] {
                    print("Got error message: \(json)")
                }
                throw ORMError.ORMNotSuccessfulHTTP
            }

            do {
                guard let json = try NSJSONSerialization.JSONObjectWithData(response.data, options: .AllowFragments) as? [String: AnyObject] else {
                    throw ORMError.ORMCouldNotMakeObjectError
                }
                return resultFromJSON(json, classType:type)!
            } catch {
                throw ORMError.ORMCouldNotMakeObjectError
            }
        }
    }
}
```

 我根据自己的业务需求写的代码如下: 

```swift
extension Observable {
    
    /// 处理网络响应并映射为 JSON
    /// - returns: Observable<JSON>
    func handleResponseMapJSON() -> Observable<JSON> {
        
        return self.map { representor in
            
            guard let response = representor as? 
                Moya.Response else {
                throw ORMError.ORMNoRepresentor
            }
            
            switch response.statusCode {
            case (200 ... 299):
                break
            case (400 ..< 500):
                let message: String = {
                    let json = JSON.init(data: response.data)
                    guard let msg = json["error"].string else { return "" }
                    return msg
                }()
                throw ORMError.ORMBizError(resultCode: "\(response.statusCode)", resultMsg: message)
            default:
                throw ORMError.ORMNotSuccessfulHTTP
            }
            
            guard let json = JSON.init(rawValue: response.data),
                json != JSON.null else {
                throw ORMError.ORMParseJSONError
            }
            
            return json
        }
    }
    
    /// JSON 映射为对象
    /// - returns: Observable<T>
    func jsonMapObject<T: Mappable>(type: T.Type) -> Observable<T> {
        
        return self.map { json in
            
            guard let json = json as? JSON,
                json != JSON.null,
                let dict = json.dictionaryObject else {
                    throw ORMError.ORMParseJSONError
            }
            
            guard let object = Mapper<T>().map(JSON: dict) else {
                throw ORMError.ORMCouldNotMakeObjectError
            }
            
            return object
        }
    }
    
    /// JSON 映射为对象数组
    /// - returns: Observable<[T]>
    func jsonMapArray<T: Mappable>(type: T.Type) -> Observable<[T]> {
        
        return self.map { json in
            
            guard let json = json as? JSON,
                let jsonArray = json.array else {
                    throw ORMError.ORMParseJSONError
            }
            
            let dictArray = jsonArray.map { $0.dictionaryObject! }
            
            return Mapper<T>().mapArray(JSONArray: dictArray)
        }
    }
    
}
```

## 出现的问题

但是在实际用的时候, 出现了一个问题. 比如说用户注册的时候, 点击一个按钮, 发送请求并跳转页面或者显示错误, 代码如下:

```swift
		signupButton.rx.tap
            .debug()
            .withLatestFrom(output.buttonIsEnabled)
            .filter { $0 }
            .flatMapLatest { [unowned self] _ -> Observable<AutenticationStatus> in
                self.viewModel.getCode(phone: self.phoneTextField.text!, password: self.passwordTextField.text!)
                    .trackActivity(self.viewModel.activityIndicator)
                    .observeOn(SerialDispatchQueueScheduler(qos: .userInteractive))
            }
            .observeOn(MainScheduler.instance)
            .subscribe(
                onNext: { [unowned self] status in
                    guard status == .code else { return }
                    self.performSegue(with: .verificationCode, sender: nil)
                },
                onError: { error in
                    log(error, .error)
                    self.noticeError(error.localizedDescription)
                })
            .addDisposableTo(disposeBag)

```

当时, 如果我先输入了一个错误, 再点击按钮就不起作用了. 当时我没反应过来, 就 `debug()` 了一下, 发现被 `dispose` 了, 我才反应过来, 来了一个 `error` 事件, 序列终止然后回收了. 

这就尴尬了, 错误处理看来设计的有问题, 还是要借鉴第一种思路, 用 `Enum` 封装一下. 

## 解决

大概搜了一下, 这篇[文章](http://www.alonemonkey.com/2017/03/31/rxswift-part-nine/)的作者, 也是遇到了类似的问题.

回想起来, Alamofire 也是这么干的, 响应的结果有 `.success` 和 `.failure` 两种情况.

还是要乖乖的定义一下 `Enum`

```swift
enum Result<T>{
    case success(T)
    case failure(Swift.Error)
}
```

那么文章的作者还提供了另外一种解决办法, 就是用 `RxSwiftExt` 里面的 `materialize`

> 它会把`Observable<T>`into`Observable<Event<T>>` , 通过下面两个方法分别获取值和错误:
>
> - elements() which returns Observable
> - errors() which returns Observable

自己设计代码最终被弃用还是有点心疼的, 不过也是为了写出更优雅的代码嘛.

>参考文章:
>
>[ReallySimpleMVVMLoginExampleWithRxSwift](https://github.com/carlosypunto/ReallySimpleMVVMLoginExampleWithRxSwift) 
>
>[Emergence](https://github.com/artsy/Emergence/blob/master/Emergence/Contexts/Networking/Observable%2BNetworking.swift)
>
>[RxSwift学习之旅 - 使用Result传递Error](http://www.alonemonkey.com/2017/03/31/rxswift-part-nine/)



