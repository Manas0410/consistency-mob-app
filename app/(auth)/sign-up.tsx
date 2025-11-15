import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP } from "@/components/ui/input-otp";
import { useSignUp } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { KeyRound, Mail, User } from "lucide-react-native";
import * as React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  // Handle sign-up submission
  const onSignUpPress = async () => {
    setErrorMsg("");
    if (!isLoaded) return;

    if (!username.trim()) {
      setErrorMsg("Username is required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      // include username in sign up
      await signUp.create({ emailAddress, password, username });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      let message = "Something went wrong. Try again.";
      if (err.errors && err.errors.length) {
        message = err.errors[0].message;
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle verification code submission
  const onVerifyPress = async () => {
    setErrorMsg("");
    if (!isLoaded) return;

    setLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/"); // Navigate to home
      } else {
        setErrorMsg("Verification incomplete, additional steps may be needed.");
      }
    } catch (err: any) {
      let message = "Verification failed. Try again.";
      if (err.errors && err.errors.length) {
        message = err.errors[0].message;
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // If we are waiting for verification
  if (pendingVerification) {
    const success = "#10B981";
    return (
      <LinearGradient colors={["#f6f8ff", "#f2f7fb"]} style={styles.gradient}>
        <View style={styles.pageWrap}>
          <View style={styles.card}>
            <View style={styles.logoWrap}>
              {/* Use PNG if you don't have react-native-svg set up */}
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>
              Enter the verification code we sent to your email
            </Text>

            <View style={styles.form}>
              <InputOTP
                length={6}
                value={code}
                onChangeText={setCode}
                slotStyle={{
                  height: 40,
                  width: 40,
                  borderColor: success,
                  backgroundColor: success + "10",
                  borderRadius: 8,
                }}
              />

              {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

              <Button
                variant="success"
                onPress={onVerifyPress}
                disabled={loading || code.length < 6}
                loading={loading}
                style={styles.primaryButton}
              >
                Verify
              </Button>

              <Pressable
                onPress={() => {
                  // allow user to go back to edit email / details
                  setPendingVerification(false);
                  setCode("");
                }}
                style={({ pressed }) => [
                  styles.ghostButton,
                  { marginTop: 10 },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.ghostText}>Edit details</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  }

  // Initial Sign-Up Form UI
  return (
    <LinearGradient colors={["#f6f8ff", "#f2f7fb"]} style={styles.gradient}>
      <View style={styles.pageWrap}>
        <View style={styles.card}>
          <View style={styles.logoWrap}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join us — create your account in seconds
          </Text>

          <View style={styles.form}>
            <Input
              variant="outline"
              label="Username"
              icon={User}
              autoCapitalize="none"
              value={username}
              placeholder="Enter username"
              placeholderTextColor="#888"
              onChangeText={setUsername}
              containerStyle={{ marginBottom: 12 }}
            />

            <Input
              variant="outline"
              label="Email"
              icon={Mail}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              placeholderTextColor="#888"
              onChangeText={setEmailAddress}
              keyboardType="email-address"
              containerStyle={{ marginBottom: 12 }}
            />

            <Input
              placeholder="Enter Password"
              variant="outline"
              icon={KeyRound}
              label="Password"
              placeholderTextColor="#888"
              showPasswordToggle
              value={password}
              onChangeText={setPassword}
              containerStyle={{ marginBottom: 12 }}
            />

            <Input
              placeholder="Confirm Password"
              variant="outline"
              icon={KeyRound}
              label="Confirm Password"
              placeholderTextColor="#888"
              showPasswordToggle
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              containerStyle={{ marginBottom: 6 }}
            />

            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

            <Button
              onPress={onSignUpPress}
              disabled={
                loading ||
                !emailAddress ||
                !password ||
                !confirmPassword ||
                !username
              }
              variant="default"
              loading={loading}
              style={styles.primaryButton}
            >
              Continue
            </Button>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Have an account?</Text>
              <Link href="/sign-in">
                <Pressable>
                  <Text style={styles.link}>Sign in</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  pageWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    // Android elevation
    elevation: 6,
  },
  logoWrap: {
    alignSelf: "center",
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -60,
    marginBottom: 6,
    // subtle outline so it pops from gradient
    borderWidth: 1,
    borderColor: "rgba(34,34,34,0.04)",
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
  },
  form: {
    marginTop: 6,
  },
  error: {
    color: "#B00020",
    textAlign: "center",
    marginBottom: 8,
    fontSize: 13,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 12,
    width: "100%",
    backgroundColor: "#177AD5",
  },
  actionsRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ghostButton: {
    paddingVertical: 8,
  },
  ghostText: {
    color: "#6b7280",
    fontSize: 13,
  },
  forgotText: {
    color: "#2563EB",
    textDecorationLine: "underline",
    fontSize: 13,
  },
  footer: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  footerText: {
    color: "#6b7280",
  },
  link: {
    color: "#2563EB",
    fontWeight: "600",
    marginLeft: 6,
  },
});
