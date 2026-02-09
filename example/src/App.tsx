import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  ActivityIndicator,
} from 'react-native';
import scrypt from '@seald-io/react-native-scrypt';
import testVectors from './test_vectors';

type TestResult = {
  name: string;
  passed: boolean;
  error?: string;
};

export default function App() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  async function runTests() {
    setRunning(true);
    setDone(false);
    const testResults: TestResult[] = [];

    for (let i = 0; i < testVectors.length; i++) {
      const v = testVectors[i]!;

      // Test with hex encoding
      try {
        const result = await scrypt(
          v.password.toString('hex'),
          v.salt.toString('hex'),
          v.N,
          v.r,
          v.p,
          v.dkLen,
          'hex'
        );
        const passed = result === v.expected.toString('hex');
        testResults.push({
          name: `Vector #${i} (hex)`,
          passed,
          error: passed ? undefined : `Got: ${result}`,
        });
      } catch (e: any) {
        testResults.push({
          name: `Vector #${i} (hex)`,
          passed: false,
          error: e.message,
        });
      }

      // Test with base64 encoding
      try {
        const result = await scrypt(
          v.password.toString('base64'),
          v.salt.toString('base64'),
          v.N,
          v.r,
          v.p,
          v.dkLen,
          'base64'
        );
        const passed = result === v.expected.toString('base64');
        testResults.push({
          name: `Vector #${i} (base64)`,
          passed,
          error: passed ? undefined : `Got: ${result}`,
        });
      } catch (e: any) {
        testResults.push({
          name: `Vector #${i} (base64)`,
          passed: false,
          error: e.message,
        });
      }

      // Test with buffer encoding
      try {
        const result = await scrypt(
          v.password,
          v.salt,
          v.N,
          v.r,
          v.p,
          v.dkLen,
          'buffer'
        );
        const passed = result.equals(v.expected);
        testResults.push({
          name: `Vector #${i} (buffer)`,
          passed,
          error: passed ? undefined : `Got: ${result.toString('hex')}`,
        });
      } catch (e: any) {
        testResults.push({
          name: `Vector #${i} (buffer)`,
          passed: false,
          error: e.message,
        });
      }

      setResults([...testResults]);
    }

    setRunning(false);
    setDone(true);
  }

  const totalTests = testVectors.length * 3;
  const passed = results.filter((r) => r.passed).length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Scrypt Test Vectors</Text>
      {running ? (
        <ActivityIndicator style={styles.spinner} />
      ) : (
        <Button title="Start Tests" onPress={runTests} />
      )}
      {results.length > 0 && (
        <>
          <Text style={passed === results.length ? styles.pass : styles.fail}>
            {passed}/{totalTests} passed
            {done
              ? passed === totalTests
                ? ' - ALL PASSED'
                : ' - SOME FAILED'
              : ' - running...'}
          </Text>
          {results
            .filter((r) => !r.passed)
            .map((r, idx) => (
              <View key={idx} style={styles.row}>
                <Text style={styles.fail}>[FAIL] {r.name}</Text>
                {r.error && <Text style={styles.detail}>{r.error}</Text>}
              </View>
            ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  spinner: {
    marginTop: 16,
  },
  row: {
    marginVertical: 4,
  },
  pass: {
    color: 'green',
    fontSize: 16,
    marginTop: 16,
  },
  fail: {
    color: 'red',
    fontSize: 16,
    marginTop: 16,
  },
  detail: {
    color: '#666',
    fontSize: 12,
    marginLeft: 16,
  },
});
