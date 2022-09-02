
# @seald-io/react-native-scrypt

Non blocking and fast scrypt implementation for React Native.

## Introduction

[scrypt](http://www.tarsnap.com/scrypt.html) is a password-based key derivation function designed to make it costly to perform hardware attacks on the derived keys. While there exist scrypt implementations written in javascript they are extremely slow and impractical for use in mobile apps.

This plugin is for use with React Native and allows your application to use scrypt on iOS/Android devices using native C code, achieving orders of magnitude faster calculation. It is based on [libscrypt](https://github.com/technion/libscrypt).

## Getting started

`$ npm install @seald-io/react-native-scrypt --save`

### Mostly automatic installation

`$ react-native link @seald-io/react-native-scrypt`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `@seald-io/react-native-scrypt` and add `RNScrypt.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNScrypt.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.crypho.scrypt.RNScryptPackage;` to the imports at the top of the file
  - Add `new RNScryptPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':@seald-io/react-native-scrypt'
  	project(':@seald-io/react-native-scrypt').projectDir = new File(rootProject.projectDir, 	'../node_modules/@seald-io/react-native-scrypt/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':@seald-io/react-native-scrypt')
  	```

## Usage
```javascript
import scrypt from '@seald-io/react-native-scrypt';

// With 'legacy' encoding (default): passwd must be a string, salt must be an array of bytes integers
// With 'hex' encoding: passwd and salt must be string encoded in hexadecimal
// With 'base64' encoding: passwd and salt must be string encoded in base64
// With 'buffer' encoding: passwd and salt must be Buffers (in the sense of [`buffer`](https://github.com/feross/buffer/) package)
// see example/App.js


const result = await scrypt(passwd, salt[, N=16384, r=8, p=1, dkLen=64, encoding='legacy'])
```
