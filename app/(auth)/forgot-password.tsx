import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { KeyRound, Mail } from "lucide-react-native";
import * as React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function ForgotPasswordPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [code, setCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [step, setStep] = React.useState<"email" | "code" | "password">(
    "email"
  );

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
        setStep("code");
      } else {
        setErrorMsg("Password reset not available for this account.");
      }
    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.message || "Failed to send reset email.");
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
        setStep("password");
      } else {
        setErrorMsg("Code verification failed. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.message || "Invalid reset code.");
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
      setErrorMsg(err?.errors?.[0]?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  // Reusable card wrapper to keep layout consistent across steps
  const CardWrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <LinearGradient colors={["#f6f8ff", "#f2f7fb"]} style={styles.gradient}>
      <View style={styles.pageWrap}>
        <View style={styles.card}>
          <View style={styles.logoWrap}>
            {/* If you use an SVG loader, swap this to your SVG. Otherwise keep PNG */}
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          {children}
        </View>
      </View>
    </LinearGradient>
  );

  // Step 1: Enter Email
  if (step === "email") {
    return (
      <CardWrap>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email and we'll send a reset code
        </Text>

        <View style={styles.form}>
          <Input
            variant="outline"
            label="Email"
            icon={Mail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="name@company.com"
            value={emailAddress}
            onChangeText={setEmailAddress}
            containerStyle={{ marginBottom: 12 }}
          />

          {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

          <Button
            onPress={sendResetEmail}
            disabled={loading || !emailAddress}
            variant="success"
            loading={loading}
            style={styles.primaryButton}
          >
            Send Reset Code
          </Button>

          <Link href="/sign-in" asChild>
            <Pressable style={{ marginTop: 12 }}>
              <Text style={styles.backLink}>← Back to Sign In</Text>
            </Pressable>
          </Link>
        </View>
      </CardWrap>
    );
  }

  // Step 2: Enter Code
  if (step === "code") {
    return (
      <CardWrap>
        <Text style={styles.title}>Enter Reset Code</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to {emailAddress}
        </Text>

        <View style={styles.form}>
          <Input
            variant="outline"
            label="Reset Code"
            placeholder="Enter 6-digit code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            containerStyle={{ marginBottom: 12 }}
          />

          {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

          <Button
            onPress={verifyCode}
            disabled={loading || code.length < 6}
            variant="success"
            loading={loading}
            style={styles.primaryButton}
          >
            Verify Code
          </Button>

          <Pressable
            onPress={() => setStep("email")}
            style={({ pressed }) => [
              { marginTop: 12 },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.backLink}>← Back to Email</Text>
          </Pressable>
        </View>
      </CardWrap>
    );
  }

  // Step 3: Set New Password
  return (
    <CardWrap>
      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.subtitle}>
        Create a new password for your account
      </Text>

      <View style={styles.form}>
        <Input
          variant="outline"
          icon={KeyRound}
          placeholder="Enter new password"
          showPasswordToggle
          value={newPassword}
          onChangeText={setNewPassword}
          containerStyle={{ marginBottom: 12 }}
        />

        <Input
          variant="outline"
          icon={KeyRound}
          placeholder="Confirm new password"
          showPasswordToggle
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          containerStyle={{ marginBottom: 6 }}
        />

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <Button
          onPress={resetPassword}
          disabled={loading || !newPassword || !confirmPassword}
          variant="success"
          loading={loading}
          style={styles.primaryButton}
        >
          Reset Password
        </Button>
      </View>
    </CardWrap>
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
  },
  backLink: {
    color: "#267BF4",
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
  },
});
