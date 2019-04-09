# QA

### node-gyp安装问题

有一个 `npm install @cryptape/cita-sdk --save`操作，提示

```
npm ERR! code ELiFECYCLE
npm ERR! errno 1
npm ERR! scrypt@6.0.3 install: `node-gyp rebuild`
npm ERR! Exit status 1
```

是因为[scrypt](https://github.com/barrysteyn/node-scrypt) 有c、c++代码，需要本地编译，
node的本地编译又依赖node-gyp

#### win系统
编译c、c++太复杂，不推荐使用win，请使用ubunut

#### ubunut等Linux系统

1. 先安装本地编译的工具链

执行 `sudo apt install -y build-essential`，会安装 `make gcc` 等工具

2. 安装node-gyp

执行 `npm install node-gyp -g`，
再执行 `npm install @cryptape/cita-sdk --save`

#### Mac os系统

执行 `npm install node-gyp -g`，
再执行 `npm install @cryptape/cita-sdk --save`

如果提示

```
ld: malformed file
/Library/Developer/CommandLineTools/SDKs/MacOSX10.14.sdk/usr/lib/libSystem.tbd:4:18:
error: unknown enumerated scalar
platform:        zippered
                 ^~~~~~~~
file '/Library/Developer/CommandLineTools/SDKs/MacOSX10.14.sdk/usr/lib/libSystem.tbd'
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

请先升级XCode到10.2，再执行以上步骤 😥

---

参考：

[go-31159](https://github.com/golang/go/issues/31159)
