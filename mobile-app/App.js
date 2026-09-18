import React, { useState } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import { AuthProvider, useAuth } from "./src/context/AuthContext";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import PatientProfileScreen from "./src/screens/PatientProfileScreen";

function AppContent() {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState("home");

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (screen === "profile") {
    return (
      <PatientProfileScreen
        onBack={() => setScreen("home")}
      />
    );
  }

  return (
    <HomeScreen
      onOpenProfile={() => setScreen("profile")}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
