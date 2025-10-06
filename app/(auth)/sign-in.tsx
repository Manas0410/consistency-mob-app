import * as React from 'react'
import { Text, TextInput, Button, View, StyleSheet } from 'react-native'
import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [otpCode, setOtpCode] = React.useState('')
  const [isOtpMode, setIsOtpMode] = React.useState(false)
  const [isOtpSent, setIsOtpSent] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState('')

  // Send OTP to email
  const onSendOtpPress = async () => {
    if (!isLoaded || !emailAddress) return
    setLoading(true)
    setErrorMsg('')
    try {
      // Create sign-in attempt with email only, no password
      await signIn.create({
        identifier: emailAddress,
      })
      // Send OTP code to email
      await signIn.prepareEmailAddressVerification({ strategy: 'email_code' })
      setIsOtpSent(true)
    } catch (err) {
      setErrorMsg(err.errors?.[0]?.message || 'Failed to send OTP.')
    } finally {
      setLoading(false)
    }
  }

  // Verify OTP code
  const onVerifyOtpPress = async () => {
    if (!isLoaded || !otpCode) return
    setLoading(true)
    setErrorMsg('')
    try {
      const attempt = await signIn.attemptEmailAddressVerification({ code: otpCode })
      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId })
        router.replace('/')
      } else {
        setErrorMsg('Verification incomplete. Please try again.')
      }
    } catch (err) {
      setErrorMsg(err.errors?.[0]?.message || 'OTP verification failed.')
    } finally {
      setLoading(false)
    }
  }

  // Sign in with email and password
  const onSignInPasswordPress = async () => {
    if (!isLoaded || !emailAddress || !password) return
    setLoading(true)
    setErrorMsg('')
    try {
      const attempt = await signIn.create({
        identifier: emailAddress,
        password,
      })
      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId })
        router.replace('/')
      } else {
        setErrorMsg('Sign in incomplete. Please check your credentials.')
      }
    } catch (err) {
      setErrorMsg(err.errors?.[0]?.message || 'Sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Enter email"
        placeholderTextColor="#888"
        value={emailAddress}
        onChangeText={setEmailAddress}
      />

      {isOtpMode ? (
        <>
          {isOtpSent ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP code"
                placeholderTextColor="#888"
                keyboardType="number-pad"
                value={otpCode}
                onChangeText={setOtpCode}
              />
              {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
              <Button
                title={loading ? 'Verifying...' : 'Verify OTP'}
                onPress={onVerifyOtpPress}
                disabled={loading}
              />
            </>
          ) : (
            <>
              {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
              <Button
                title={loading ? 'Sending OTP...' : 'Send OTP'}
                onPress={onSendOtpPress}
                disabled={loading || !emailAddress}
              />
            </>
          )}

          <View style={styles.switchContainer}>
            <Text>Or sign in with password</Text>
            <Button title="Use Password" onPress={() => {
              setIsOtpMode(false)
              setIsOtpSent(false)
              setErrorMsg('')
              setOtpCode('')
            }} />
          </View>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
          <Button
            title={loading ? 'Signing in...' : 'Sign In'}
            onPress={onSignInPasswordPress}
            disabled={loading || !emailAddress || !password}
          />
          <View style={styles.switchContainer}>
            <Text>Or sign in with OTP</Text>
            <Button title="Use OTP" onPress={() => {
              setIsOtpMode(true)
              setErrorMsg('')
              setPassword('')
            }} />
          </View>
        </>
      )}

      <View style={styles.footer}>
        <Text>Don't have an account?</Text>
        <Link href="/sign-up"><Text style={styles.link}>Sign up</Text></Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  error: {
    color: '#B00020',
    textAlign: 'center',
    marginBottom: 10,
  },
  switchContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
    gap: 6,
  },
  link: {
    color: '#267BF4',
    marginLeft: 6,
    fontWeight: '500',
  },
})
