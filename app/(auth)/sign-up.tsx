import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as React from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('') // NEW FIELD
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState('')

  // Handle sign-up submission
  const onSignUpPress = async () => {
    setErrorMsg('')
    if (!isLoaded) return

    if (!username.trim()) {
      setErrorMsg('Username is required.')
      return
    }
    setLoading(true)
    try {
      await signUp.create({ emailAddress, password, username }) // ADD USERNAME HERE
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err) {
      let message = 'Something went wrong. Try again.'
      if (err.errors && err.errors.length) {
        message = err.errors[0].message
      }
      setErrorMsg(message)
    } finally {
      setLoading(false)
    }
  }

  // Handle verification code submission
  const onVerifyPress = async () => {
    setErrorMsg('')
    if (!isLoaded) return

    setLoading(true)
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/') // Navigate to home
      } else {
        setErrorMsg('Verification incomplete, additional steps may be needed.')
      }
    } catch (err) {
      let message = 'Verification failed. Try again.'
      if (err.errors && err.errors.length) {
        message = err.errors[0].message
      }
      setErrorMsg(message)
    } finally {
      setLoading(false)
    }
  }

  // OTP Verification UI
  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify your email</Text>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor="#888"
          onChangeText={setCode}
          keyboardType="number-pad"
        />
        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
        <Button title={loading ? 'Verifying...' : 'Verify'} onPress={onVerifyPress} disabled={loading} />
      </View>
    )
  }

  // Initial Sign-Up Form UI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={username}
        placeholder="Enter username"
        placeholderTextColor="#888"
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#888"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#888"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      <Button title={loading ? 'Submitting...' : 'Continue'} onPress={onSignUpPress} disabled={loading} />
      <View style={styles.footer}>
        <Text>Have an account?</Text>
        <Link href="/sign-in"><Text style={styles.link}>Sign in</Text></Link>
      </View>
    </View>
  )
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 18,
    textAlign: 'center',
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 7,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  error: {
    color: '#C00',
    marginBottom: 10,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    color: '#267BF4',
    marginLeft: 4,
    fontWeight: '500',
  },
});
