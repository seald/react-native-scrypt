
# @seald-io/react-native-scrypt

Non blocking and fast scrypt implementation for React Native.

## Introduction

[scrypt](http://www.tarsnap.com/scrypt.html) is a password-based key derivation function designed to make it costly to perform hardware attacks on the derived keys. While there exist scrypt implementations written in javascript they are extremely slow and impractical for use in mobile apps.

This plugin is for use with React Native and allows your application to use scrypt on iOS/Android devices using native C code, achieving orders of magnitude faster calculation. It is based on [libscrypt](https://github.com/technion/libscrypt).

Supports both the Old and New (Turbo Modules) React Native architectures.

## Getting started

```sh
npm install @seald-io/react-native-scrypt
# or
yarn add @seald-io/react-native-scrypt
```

### iOS

```sh
cd ios && pod install
```

### Android

No additional steps required. The native library is built automatically via CMake.

## Usage

```typescript
import scrypt from '@seald-io/react-native-scrypt';
import { Buffer } from 'buffer';

// With 'hex' encoding (default): passwd and salt must be hex-encoded strings
const hexResult = await scrypt(passwd, salt, N, r, p, dkLen, 'hex');

// With 'base64' encoding: passwd and salt must be base64-encoded strings
const base64Result = await scrypt(passwd, salt, N, r, p, dkLen, 'base64');

// With 'buffer' encoding: passwd and salt must be Buffers
const bufferResult = await scrypt(passwd, salt, N, r, p, dkLen, 'buffer');
```

### Parameters

| Parameter  | Type               | Default | Description                          |
|------------|--------------------|---------|--------------------------------------|
| `passwd`   | `string \| Buffer` |         | Password                             |
| `salt`     | `string \| Buffer` |         | Salt                                 |
| `N`        | `number`           | 16384   | CPU/memory cost parameter            |
| `r`        | `number`           | 8       | Block size parameter                 |
| `p`        | `number`           | 1       | Parallelization parameter            |
| `dkLen`    | `number`           | 64      | Derived key length in bytes          |
| `encoding` | `string`           | `'hex'` | `'hex'`, `'base64'`, or `'buffer'`   |

## Migrating from v1.x

- The `'legacy'` encoding has been removed. Use `'hex'`, `'base64'`, or `'buffer'` instead.
- Manual linking (`react-native link`) is no longer needed. The library uses autolinking.
- Minimum supported versions: Android SDK 24+, iOS 13+.

## License

MIT
