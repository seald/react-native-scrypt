import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  scrypt(passwd: string, salt: string, N: number, r: number, p: number, dkLen: number): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ReactNativeScrypt');