import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { KeyRound, Mail } from "lucide-react-native";
import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ForgotPasswordPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [code, setCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [step, setStep] = React.useState<'email' | 'code' | 'password'>('email');

  // Step 1: Send reset email
  const sendResetEmail = async () => {
    if (!isLoaded || !emailAddress) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
      });
      
      const firstFactor = signInAttempt.supportedFirstFactors?.find(
        (factor) => factor.strategy === "reset_password_email_code"
      );
      
      if (firstFactor) {
        await signIn.prepareFirstFactor({
          strategy: "reset_password_email_code",
          emailAddressId: firstFactor.emailAddressId,
        });
        setStep('code');
      } else {
        setErrorMsg("Password reset not available for this account.");
      }
    } catch (err: any) {
      setErrorMsg(err.errors?.[0]?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const verifyCode = async () => {
    if (!isLoaded || !code) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code,
      });
      if (attempt.status === "needs_new_password") {
        setStep('password');
      } else {
        setErrorMsg("Code verification failed. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.errors?.[0]?.message || "Invalid reset code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set new password
  const resetPassword = async () => {
    if (!isLoaded || !newPassword || !confirmPassword) return;
    
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const attempt = await signIn.resetPassword({
        password: newPassword,
      });
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      } else {
        setErrorMsg("Password reset failed. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.errors?.[0]?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Enter Email
  if (step === 'email') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a reset code
        </Text>

        <Input
          variant="outline"
          label="Email"
          icon={Mail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Enter your email"
          placeholderTextColor="#888"
          value={emailAddress}
          onChangeText={setEmailAddress}
        />

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <Button
          onPress={sendResetEmail}
          disabled={loading || !emailAddress}
          variant="success"
          loading={loading}
        >
          Send Reset Code
        </Button>

        <Link href="/sign-in" asChild>
          <Pressable>
            <Text style={styles.backLink}>← Back to Sign In</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  // Step 2: Enter Code
  if (step === 'code') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Enter Reset Code</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to {emailAddress}
        </Text>

        <Input
          variant="outline"
          label="Reset Code"
          placeholder="Enter 6-digit code"
          placeholderTextColor="#888"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <Button
          onPress={verifyCode}
          disabled={loading || code.length < 6}
          variant="success"
          loading={loading}
        >
          Verify Code
        </Button>

        <Pressable onPress={() => setStep('email')}>
          <Text style={styles.backLink}>← Back to Email</Text>
        </Pressable>
      </View>
    );
  }

  // Step 3: Set New Password
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.subtitle}>
        Create a new password for your account
      </Text>

      <Input
        variant="outline"
        icon={KeyRound}
        // label="New Password"
        placeholder="Enter new password"
        placeholderTextColor="#888"
        showPasswordToggle
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Input
        variant="outline"
        icon={KeyRound}
        // label="Confirm Password"
        placeholder="Confirm new password"
        placeholderTextColor="#888"
        showPasswordToggle
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <Button
        onPress={resetPassword}
        disabled={loading || !newPassword || !confirmPassword}
        variant="success"
        loading={loading}
      >
        Reset Password
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#eee",
    gap: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  error: {
    color: "#B00020",
    textAlign: "center",
    marginBottom: 10,
  },
  backLink: {
    color: "#267BF4",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
