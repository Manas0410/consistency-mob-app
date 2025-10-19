import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP } from "@/components/ui/input-otp";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { KeyRound, Mail, User } from "lucide-react-native";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState(""); // NEW FIELD
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
    setLoading(true);
    try {
      await signUp.create({ emailAddress, password, username }); // ADD USERNAME HERE
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
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
    } catch (err) {
      let message = "Verification failed. Try again.";
      if (err.errors && err.errors.length) {
        message = err.errors[0].message;
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // OTP Verification UI
  if (pendingVerification) {
    const success = "#10B981";
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify your email</Text>

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
        >
          Verify
        </Button>
      </View>
    );
  }

  // Initial Sign-Up Form UI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Input
        variant="outline"
        label="Username"
        icon={User}
        autoCapitalize="none"
        value={username}
        placeholder="Enter username"
        placeholderTextColor="#888"
        onChangeText={setUsername}
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
      />
      <Input
        placeholder="Enter Password"
        variant="outline"
        icon={KeyRound}
        label="Password"
        placeholderTextColor="#888"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      <Button
        onPress={onSignUpPress}
        disabled={loading || !emailAddress || !password || !username}
        variant="success"
        loading={loading}
      >
        Continue
      </Button>
      <View style={styles.footer}>
        <Text>Have an account?</Text>
        <Link href="/sign-in">
          <Text style={styles.link}>Sign in</Text>
        </Link>
      </View>
    </View>
  );
}

// Styles remain unchanged
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
    marginBottom: 18,
    textAlign: "center",
    color: "#222",
  },

  error: {
    color: "#C00",
    marginBottom: 10,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: "#267BF4",
    marginLeft: 4,
    fontWeight: "500",
  },
});
