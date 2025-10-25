import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useClerk, useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { KeyRound, Mail } from "lucide-react-native";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { signOut } = useClerk();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  // Helper function to handle session conflicts
  const handleSessionConflict = async () => {
    try {
      await signOut();
      // Wait a moment for the sign out to complete
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      // Ignore sign out errors - user might not be signed in
      console.log("Sign out completed or user not signed in");
    }
  };

  // Send OTP to email - Removed as these methods don't exist in current Clerk version
  // const onSendOtpPress = async () => {
  //   This functionality is not available in current Clerk setup
  // };

  // Verify OTP code - Removed as these methods don't exist in current Clerk version
  // const onVerifyOtpPress = async () => {
  //   This functionality is not available in current Clerk setup
  // };

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
    } catch (error: unknown) {
      const err = error as any;
      // Handle session already exists error
      if (err.errors?.[0]?.code === "session_exists" || 
          err.errors?.[0]?.message?.toLowerCase().includes("session")) {
        try {
          await handleSessionConflict();
          // Retry the sign-in after clearing session
          const retryAttempt = await signIn.create({
            identifier: emailAddress,
            password,
          });
          if (retryAttempt.status === "complete") {
            await setActive({ session: retryAttempt.createdSessionId });
            router.replace("/");
            return;
          }
        } catch (retryError: unknown) {
          const retryErr = retryError as any;
          setErrorMsg(retryErr.errors?.[0]?.message || "Sign in failed after retry.");
        }
      } else {
        setErrorMsg(err.errors?.[0]?.message || "Sign in failed.");
      }
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

      <PasswordInput
        variant="outline"
        icon={KeyRound}
        label="Password"
        placeholder="Enter password"
        placeholderTextColor="#888"
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

      {/* Forgot Password Link */}
      <View style={styles.forgotPasswordContainer}>
        <Link href="/forgot-password">
          <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
        </Link>
      </View>

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
  switchContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  forgotPasswordLink: {
    color: "#267BF4",
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    gap: 6,
  },
  link: {
    color: "#267BF4",
    marginLeft: 6,
    fontWeight: "500",
  },
});
