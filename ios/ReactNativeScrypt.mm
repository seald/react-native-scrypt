#import "ReactNativeScrypt.h"
#import "libscrypt.h"

#include <stdbool.h>
#include <stdint.h>

@implementation ReactNativeScrypt

- (void)scrypt:(NSString *)passwd
          salt:(NSString *)salt
             N:(double)N
             r:(double)r
             p:(double)p
         dkLen:(double)dkLen
       resolve:(RCTPromiseResolveBlock)resolve
        reject:(RCTPromiseRejectBlock)reject
{
    int i;
    NSUInteger N_i = (NSUInteger)N;
    NSUInteger r_i = (NSUInteger)r;
    NSUInteger p_i = (NSUInteger)p;
    NSUInteger dkLen_i = (NSUInteger)dkLen;

    uint8_t hashbuf[dkLen_i];

    const char *chars_passwd = [passwd UTF8String];
    int j = 0;
    long len_passwd = passwd.length;
    uint8_t *passwd_buffer = (uint8_t *)malloc(sizeof(uint8_t) * len_passwd / 2);

    char byteChars[3] = {'\0','\0','\0'};
    unsigned long wholeByte;

    while (j < len_passwd) {
        byteChars[0] = chars_passwd[j++];
        byteChars[1] = chars_passwd[j++];
        wholeByte = strtoul(byteChars, NULL, 16);
        passwd_buffer[(j / 2) - 1] = wholeByte;
    }

    const char *chars_salt = [salt UTF8String];
    j = 0;
    long len_salt = salt.length;
    uint8_t *salt_buffer = (uint8_t *)malloc(sizeof(uint8_t) * len_salt / 2);

    while (j < len_salt) {
        byteChars[0] = chars_salt[j++];
        byteChars[1] = chars_salt[j++];
        wholeByte = strtoul(byteChars, NULL, 16);
        salt_buffer[(j / 2) - 1] = wholeByte;
    }

    @try {
        int success = libscrypt_scrypt((uint8_t *) passwd_buffer, len_passwd / 2, (uint8_t *) salt_buffer, len_salt / 2, N_i, r_i, p_i, hashbuf, dkLen_i);
        if (success != 0) {
            NSError *error = [NSError errorWithDomain:@"com.sealdio.scrypt" code:200 userInfo:@{@"Error reason": @"Error in scrypt"}];
            reject(@"SCRYPT_ERROR", @"Failure in scrypt", error);
            free(passwd_buffer);
            free(salt_buffer);
            return;
        }
    }
    @catch (NSException * e) {
        NSError *error = [NSError errorWithDomain:@"com.sealdio.scrypt" code:200 userInfo:@{@"Error reason": @"Error in scrypt"}];
        reject(@"SCRYPT_ERROR", @"Failure in scrypt", error);
        free(passwd_buffer);
        free(salt_buffer);
        return;
    }

    NSMutableString *hexResult = [NSMutableString stringWithCapacity:dkLen_i * 2];
    for(i = 0; i < dkLen_i; i++)
    {
        [hexResult appendFormat:@"%02x", hashbuf[i]];
    }
    NSString *result = [NSString stringWithString: hexResult];
    resolve(result);
    free(passwd_buffer);
    free(salt_buffer);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeReactNativeScryptSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"ReactNativeScrypt";
}

@end