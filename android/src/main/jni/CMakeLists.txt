cmake_minimum_required(VERSION 3.22)
project(scrypt_jni)

set(LIBSCRYPT_DIR ${CMAKE_SOURCE_DIR}/../../../../libscrypt)

add_library(scrypt_jni SHARED
    scrypt-jni.c
    ${LIBSCRYPT_DIR}/b64.c
    ${LIBSCRYPT_DIR}/crypto_scrypt-hexconvert.c
    ${LIBSCRYPT_DIR}/sha256.c
    ${LIBSCRYPT_DIR}/crypto-mcf.c
    ${LIBSCRYPT_DIR}/crypto_scrypt-nosse.c
    ${LIBSCRYPT_DIR}/slowequals.c
    ${LIBSCRYPT_DIR}/crypto_scrypt-check.c
    ${LIBSCRYPT_DIR}/crypto-scrypt-saltgen.c
    ${LIBSCRYPT_DIR}/crypto_scrypt-hash.c
    ${LIBSCRYPT_DIR}/main.c
)

target_include_directories(scrypt_jni PRIVATE ${LIBSCRYPT_DIR})
target_link_libraries(scrypt_jni log)
target_compile_options(scrypt_jni PRIVATE -std=c99)