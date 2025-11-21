import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Colors } from "@/constants/theme";
import { usePallet } from "@/hooks/use-pallet";
import { useColor } from "@/hooks/useColor";
import { useSignIn } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { KeyRound, Mail } from "lucide-react-native";
import * as React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const colors = Colors.light; // Always use light theme
  const pallet = usePallet();
  const textColor = useColor({}, "text");
  const textMutedColor = useColor({}, "textMuted");
  const iconColor = useColor({}, "icon");
  const backgroundCardColor = useColor({}, "background");

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
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
      });

      const firstFactor = signInAttempt.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      );

      if (firstFactor) {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: firstFactor.emailAddressId,
        });
        setIsOtpSent(true);
        setIsOtpMode(true);
      } else {
        setErrorMsg("Email verification not available.");
      }
    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.message || "Failed to send OTP.");
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
      setErrorMsg(err?.errors?.[0]?.message || "OTP verification failed.");
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
      setErrorMsg(err?.errors?.[0]?.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#f6f8ff", "#f2f7fb"]} style={styles.gradient}>
      <View style={styles.pageWrap}>
        <View style={[styles.card, { backgroundColor: backgroundCardColor }]}>
          <View
            style={[styles.logoWrap, { backgroundColor: backgroundCardColor }]}
          >
            {/* If you have an SVG loader, keep your svg. Otherwise convert to PNG:
                require("../../assets/images/logo.png") */}
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={[styles.title, { color: textColor }]}>Welcome back</Text>
          <Text
            style={[styles.subtitle, { color: textMutedColor || iconColor }]}
          >
            Sign in to continue to your account
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

            {!isOtpMode && (
              <Input
                variant="outline"
                icon={KeyRound}
                label="Password"
                placeholder="Enter password"
                showPasswordToggle
                value={password}
                onChangeText={setPassword}
                containerStyle={{ marginBottom: 6 }}
              />
            )}

            {isOtpMode && (
              <Input
                variant="outline"
                label="Enter OTP"
                placeholder="1234"
                value={otpCode}
                onChangeText={setOtpCode}
                keyboardType="number-pad"
                containerStyle={{ marginBottom: 6 }}
              />
            )}

            {errorMsg ? (
              <Text style={[styles.error, { color: colors.red || "#B00020" }]}>
                {errorMsg}
              </Text>
            ) : null}

            {/* Primary action */}
            {!isOtpMode ? (
              <Button
                onPress={onSignInPasswordPress}
                disabled={loading || !emailAddress || !password}
                variant="default"
                loading={loading}
                style={styles.primaryButton}
              >
                Sign In
              </Button>
            ) : (
              <Button
                onPress={onVerifyOtpPress}
                disabled={loading || !otpCode}
                variant="default"
                loading={loading}
                style={styles.primaryButton}
              >
                Verify OTP
              </Button>
            )}

            {/* Secondary / OTP actions row */}
            <View style={styles.actionsRow}>
              <Pressable
                onPress={() => {
                  if (isOtpMode) {
                    // back to password mode
                    setIsOtpMode(false);
                    setOtpCode("");
                  } else {
                    // trigger send otp
                    onSendOtpPress();
                  }
                }}
                style={({ pressed }) => [
                  styles.ghostButton,
                  pressed && { opacity: 0.7 },
                ]}
                disabled={loading || !emailAddress}
              >
                <Text
                  style={[
                    styles.ghostText,
                    { color: textMutedColor || iconColor },
                  ]}
                >
                  {isOtpMode ? "Use password instead" : "Send OTP to email"}
                </Text>
              </Pressable>

              <Link href="/forgot-password" asChild>
                <Pressable>
                  <Text style={[styles.forgotText, { color: pallet.shade1 }]}>
                    Forgot password?
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>

          <View style={styles.footer}>
            <Text
              style={[
                styles.footerText,
                { color: textMutedColor || iconColor },
              ]}
            >
              Don't have an account?
            </Text>
            <Link href="/sign-up">
              <Text style={[styles.link, { color: pallet.shade1 }]}>
                Create account
              </Text>
            </Link>
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: -60,
    marginBottom: 6,
    // subtle outline so it pops from gradient
    borderWidth: 1,
    borderColor: "rgba(34,34,34,0.04)",
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 16,
  },
  form: {
    marginTop: 6,
  },
  error: {
    textAlign: "center",
    marginBottom: 8,
    fontSize: 13,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 12,
    // make the button full width
    width: "100%",
    // backgroundColor will be set by Button component using palette
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
    fontSize: 13,
  },
  forgotText: {
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
    // Color set dynamically
  },
  link: {
    fontWeight: "600",
    marginLeft: 6,
  },
});
