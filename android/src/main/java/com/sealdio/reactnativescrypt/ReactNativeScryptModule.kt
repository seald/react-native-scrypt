package com.sealdio.reactnativescrypt

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise

class ReactNativeScryptModule(reactContext: ReactApplicationContext) :
  NativeReactNativeScryptSpec(reactContext) {

  companion object {
    const val NAME = NativeReactNativeScryptSpec.NAME

    init {
      System.loadLibrary("scrypt_jni")
    }

    private val HEX = charArrayOf('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f')
  }

  private external fun scryptBridgeJNI(pass: ByteArray, salt: ByteArray, N: Int, r: Int, p: Int, dkLen: Int): ByteArray

  override fun scrypt(passwd: String, salt: String, N: Double, r: Double, p: Double, dkLen: Double, promise: Promise) {
    try {
      val passwordBytes = hexStringToByteArray(passwd)
      val saltBytes = hexStringToByteArray(salt)
      val result = scryptBridgeJNI(passwordBytes, saltBytes, N.toInt(), r.toInt(), p.toInt(), dkLen.toInt())
      promise.resolve(hexify(result))
    } catch (e: Exception) {
      promise.reject("SCRYPT_ERROR", "Failure in scrypt", e)
    }
  }

  private fun hexify(input: ByteArray): String {
    val result = CharArray(input.size * 2)
    for (i in input.indices) {
      val v = input[i].toInt() and 0xFF
      result[i * 2] = HEX[v ushr 4]
      result[i * 2 + 1] = HEX[v and 0x0F]
    }
    return String(result)
  }

  private fun hexStringToByteArray(s: String): ByteArray {
    val len = s.length
    val data = ByteArray(len / 2)
    var i = 0
    while (i < len) {
      data[i / 2] = ((Character.digit(s[i], 16) shl 4) + Character.digit(s[i + 1], 16)).toByte()
      i += 2
    }
    return data
  }
}