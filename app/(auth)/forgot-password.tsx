import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP } from "@/components/ui/input-otp";
import { PasswordInput } from "@/components/ui/password-input";
import { useClerk, useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { ArrowLeft, KeyRound, Mail } from "lucide-react-native";
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ForgotPasswordStep = 'request' | 'verify' | 'reset' | 'success';

export default function ForgotPasswordPage() {
  const { signIn, isLoaded } = useSignIn();
  const { signOut } = useClerk();
  const router = useRouter();

  const [currentStep, setCurrentStep] = React.useState<ForgotPasswordStep>('request');
  const [emailAddress, setEmailAddress] = React.useState("");
  const [code, setCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
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

  // Step 1: Request password reset
  const handleRequestReset = async () => {
    if (!isLoaded || !emailAddress.trim()) return;
    
    setLoading(true);
    setErrorMsg("");
    
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setCurrentStep('verify');
    } catch (err: any) {
      // Handle session already exists error
      if (err.errors?.[0]?.code === "session_exists" || 
          err.errors?.[0]?.message?.toLowerCase().includes("session")) {
        try {
          await handleSessionConflict();
          // Retry the request after clearing session
          await signIn.create({
            strategy: "reset_password_email_code",
            identifier: emailAddress,
          });
          setCurrentStep('verify');
          return;
        } catch (retryErr: any) {
          setErrorMsg(retryErr.errors?.[0]?.message || "Failed to send reset email after retry.");
        }
      } else {
        setErrorMsg(err.errors?.[0]?.message || "Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify reset code
  const handleVerifyCode = async () => {
    if (!isLoaded || !code.trim()) return;
    
    setLoading(true);
    setErrorMsg("");
    
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code,
      });
      
      if (result.status === "needs_new_password") {
        setCurrentStep('reset');
      } else {
        setErrorMsg("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.errors?.[0]?.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async () => {
    if (!isLoaded || !newPassword.trim()) return;
    
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords don't match. Please try again.");
      return;
    }
    
    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");
    
    try {
      const result = await signIn.resetPassword({
        password: newPassword,
      });
      
      if (result.status === "complete") {
        setCurrentStep('success');
      } else {
        setErrorMsg("Failed to reset password. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.errors?.[0]?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    router.replace("/sign-in");
  };

  const renderRequestStep = () => (
    <>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you a code to reset your password.
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
        onPress={handleRequestReset}
        disabled={loading || !emailAddress.trim()}
        variant="success"
        loading={loading}
      >
        Send Reset Code
      </Button>
    </>
  );

  const renderVerifyStep = () => (
    <>
      <Text style={styles.title}>Check Your Email</Text>
      <Text style={styles.subtitle}>
        We've sent a 6-digit code to {emailAddress}. Enter it below to continue.
      </Text>

      <InputOTP
        length={6}
        value={code}
        onChangeText={setCode}
        slotStyle={{
          height: 40,
          width: 40,
          borderColor: "#10B981",
          backgroundColor: "#10B981" + "10",
          borderRadius: 8,
        }}
      />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <Button
        onPress={handleVerifyCode}
        disabled={loading || code.length < 6}
        variant="success"
        loading={loading}
      >
        Verify Code
      </Button>

      <TouchableOpacity 
        onPress={() => setCurrentStep('request')}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Didn't receive the code? Try again</Text>
      </TouchableOpacity>
    </>
  );

  const renderResetStep = () => (
    <>
      <Text style={styles.title}>Reset Your Password</Text>
      <Text style={styles.subtitle}>
        Create a new password for your account.
      </Text>

      <PasswordInput
        variant="outline"
        icon={KeyRound}
        label="New Password"
        placeholder="Enter new password"
        placeholderTextColor="#888"
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <PasswordInput
        variant="outline"
        icon={KeyRound}
        label="Confirm Password"
        placeholder="Confirm new password"
        placeholderTextColor="#888"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <Button
        onPress={handleResetPassword}
        disabled={loading || !newPassword.trim() || !confirmPassword.trim()}
        variant="success"
        loading={loading}
      >
        Reset Password
      </Button>
    </>
  );

  const renderSuccessStep = () => (
    <>
      <Text style={styles.title}>Password Reset!</Text>
      <Text style={styles.subtitle}>
        Your password has been successfully reset. You can now sign in with your new password.
      </Text>

      <Button
        onPress={handleBackToSignIn}
        variant="success"
      >
        Back to Sign In
      </Button>
    </>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'request':
        return renderRequestStep();
      case 'verify':
        return renderVerifyStep();
      case 'reset':
        return renderResetStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderRequestStep();
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button - only show if not on success step */}
      {currentStep !== 'success' && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackToSignIn}>
          <ArrowLeft size={24} color="#267BF4" />
        </TouchableOpacity>
      )}

      {renderStepContent()}

      {/* Footer - only show on request step */}
      {currentStep === 'request' && (
        <View style={styles.footer}>
          <Text>Remember your password?</Text>
          <Link href="/sign-in">
            <Text style={styles.link}>Sign in</Text>
          </Link>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#eee",
    gap: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 8,
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
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  error: {
    color: "#B00020",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
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
  linkButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  linkText: {
    color: "#267BF4",
    fontSize: 14,
    fontWeight: "500",
  },
});
