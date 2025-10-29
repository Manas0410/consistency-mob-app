import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { KeyRound, Mail } from "lucide-react-native";
import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [isOtpMode, setIsOtpMode] = React.useState(false);
  const [isOtpSent, setIsOtpSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  // Send OTP to email
  const onSendOtpPress = async () => {
    if (!isLoaded || !emailAddress) return;
    setLoading(true);
    setErrorMsg("");
    try {
      // Create sign-in attempt with email only, no password
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
      });
      
      // Find email code factor
      const firstFactor = signInAttempt.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      );
      
      if (firstFactor) {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: firstFactor.emailAddressId,
        });
        setIsOtpSent(true);
      } else {
        setErrorMsg("Email verification not available.");
      }
    } catch (err: any) {
      setErrorMsg(err.errors?.[0]?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP code
  const onVerifyOtpPress = async () => {
    if (!isLoaded || !otpCode) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: otpCode,
      });
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      } else {
        setErrorMsg("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.errors?.[0]?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const onSignInPasswordPress = async () => {
    if (!isLoaded || !emailAddress || !password) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const attempt = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      } else {
        setErrorMsg("Sign in incomplete. Please check your credentials.");
      }
    } catch (err: any) {
      setErrorMsg(err.errors?.[0]?.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <Input
        variant="outline"
        label="Email"
        icon={Mail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Enter email"
        placeholderTextColor="#888"
        value={emailAddress}
        onChangeText={setEmailAddress}
      />

      <Input
        variant="outline"
        icon={KeyRound}
        label="Password"
        placeholder="Enter password"
        placeholderTextColor="#888"
        showPasswordToggle
        value={password}
        onChangeText={setPassword}
      />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      
      <Button
        onPress={onSignInPasswordPress}
        disabled={loading || !emailAddress || !password}
        variant="success"
        loading={loading}
      >
        Sign In
      </Button>

      <Link href="/forgot-password" asChild>
        <Pressable>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </Pressable>
      </Link>

      <View style={styles.footer}>
        <Text>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text style={styles.link}>Sign up</Text>
        </Link>
      </View>
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
    marginBottom: 20,
    textAlign: "center",
    color: "#222",
  },

  error: {
    color: "#B00020",
    textAlign: "center",
    marginBottom: 10,
  },
  forgotPassword: {
    color: "#267BF4",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  switchContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "center",
    gap: 6,
  },
  link: {
    color: "#267BF4",
    marginLeft: 6,
    fontWeight: "500",
  },
});
