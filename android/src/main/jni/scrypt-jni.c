
#include <errno.h>
#include <stdlib.h>
#include <string.h>
#include <jni.h>
#include <android/log.h>

#include "libscrypt.h"

#define  LOG_TAG    "libscrypt_jni"
#define  LOGI(...)  __android_log_print(ANDROID_LOG_INFO,LOG_TAG,__VA_ARGS__)
#define  LOGE(...)  __android_log_print(ANDROID_LOG_ERROR,LOG_TAG,__VA_ARGS__)

static void throwException(JNIEnv* env, char *msg);

JNIEXPORT jbyteArray JNICALL
Java_com_sealdio_reactnativescrypt_ReactNativeScryptModule_scryptBridgeJNI( JNIEnv* env, jobject thiz,
	jbyteArray pass, jbyteArray salt, jint N, jint r, jint p, jint dkLen)
{
    char *msg_error;
    jbyte *passphrase = NULL;
    jbyte *parsedSalt = NULL;
    uint8_t *hashbuf = NULL;
    jbyteArray result = NULL;

    jint passLen = (*env)->GetArrayLength(env, pass);
    if((*env)->ExceptionOccurred(env)) {
        LOGE("Failed to get passphrase length.");
        goto END;
    }

    jint saltLen = (*env)->GetArrayLength(env, salt);
    if((*env)->ExceptionOccurred(env)) {
        LOGE("Failed to get salt length.");
        goto END;
    }

    passphrase = (*env)->GetByteArrayElements(env, pass, NULL);
    if((*env)->ExceptionOccurred(env)) {
        LOGE("Failed to get passphrase elements.");
        goto END;
    }

    parsedSalt = (*env)->GetByteArrayElements(env, salt, NULL);
    if((*env)->ExceptionOccurred(env)) {
        LOGE("Failed to get salt elements.");
        goto END;
    }

    hashbuf = malloc(sizeof(uint8_t) * dkLen);
    if (hashbuf == NULL) {
        msg_error = "Failed to malloc hashbuf.";
        LOGE("%s", msg_error);
        throwException(env, msg_error);
        goto END;
    }

    if (libscrypt_scrypt(passphrase, passLen, parsedSalt, saltLen, N, r, p, hashbuf, dkLen)) {
        switch (errno) {
            case EINVAL:
                msg_error = "N must be a power of 2 greater than 1.";
                break;
            case EFBIG:
            case ENOMEM:
                msg_error = "Insufficient memory available.";
                break;
            default:
                msg_error = "Memory allocation failed.";
        }
        throwException(env, msg_error);
        goto END;
    }

    result = (*env)->NewByteArray(env, dkLen);
    if((*env)->ExceptionOccurred(env)) {
        LOGE("Failed to allocate result buffer.");
        goto END;
    }

    (*env)->SetByteArrayRegion(env, result, 0, dkLen, (jbyte *) hashbuf);
    if((*env)->ExceptionOccurred(env)) {
        LOGE("Failed to set result buffer.");
        goto END;
    }

    END:
        if (passphrase) (*env)->ReleaseByteArrayElements(env, pass, passphrase, JNI_ABORT);
        if (parsedSalt) (*env)->ReleaseByteArrayElements(env, salt, parsedSalt, JNI_ABORT);
        if (hashbuf) free(hashbuf);

    return result;
}

static void
throwException(JNIEnv* env, char *msg) {
    jclass JC_Exception = (*env)->FindClass(env, "java/lang/Exception");
    (*env)->ThrowNew(env, JC_Exception, msg);
}
