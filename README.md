# issue

[Click here to give me your opinion.](https://github.com/zhujixiang-yuxi/generator-taro-template)

# Installation

```
# install yo
$ npm install -g yo

# install a generator
$ npm i generator-taro-template -g
```

# Usage

```
$ yo taro-template
```

# Commit

```shell
$ yarn commit
# create CHANGELOG.md
$ yarn release
```

# Tips

> taro-template 只是基于Taro-cli的二次简单封装  **less + redux + Ts**
>
> 版本是1.3.25，如果你需要版本升级，请见[官方文档]([https://nervjs.github.io/taro/docs/GETTING-STARTED.html#%E6%9B%B4%E6%96%B0](https://nervjs.github.io/taro/docs/GETTING-STARTED.html#更新))

- request封装，解决token鉴权问题，如果你的请求没有携带token，request会拦截，然后自动去请求获取token，之后再处理这个请求，不会出现403错误。
- prettier代码风格
- angular风格的代码提交规范
- git hooks拦截提交
- 使用standard-version记录CHANGELOG

# Attention

这个模版是从我之前一个项目里抽取出来的，一些请求配置需要自己更改。

使用前你需要修改api的domain和request请求工具的初始化。

```js
// /config/index.js
defineConstants: {
  API_GATEWAY: {
    development: 'https://www.test.com',
    production: '',
  },
}
  
// /src/utils/request.js
// 比如获取token的请求是：
// POST  https://www.test.com/wxLogin  请求体: {authCode: 'wx.login换取的临时登录凭证'}
const httpConfig = {
	loginUrl: '/wxLogin',
	loginParamsName: 'authCode',
}
const http = new Http(httpConfig)
```

# Thank you for using it

