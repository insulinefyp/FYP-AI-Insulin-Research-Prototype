import React from "react";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../context/AuthContext";

export default function HomeScreen({ onOpenProfile }) {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>

        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Authentication</Text>

          <Text style={styles.cardText}>
            Your authenticated session is active.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={onOpenProfile}
        >
          <Text style={styles.profileButtonText}>Patient Profile</Text>
        </TouchableOpacity>

        <Text style={styles.prototype}>
          AI-Assisted Medication Delivery Research Prototype
        </Text>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },

  container: {
    flex: 1,
    padding: 28,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#17202a",
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    color: "#7b8794",
    marginBottom: 4,
  },

  email: {
    fontSize: 18,
    fontWeight: "600",
    color: "#17202a",
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e0e5ea",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  cardText: {
    color: "#5f6b76",
    fontSize: 15,
  },

  profileButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#17202a",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  profileButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  prototype: {
    textAlign: "center",
    color: "#7b8794",
    fontSize: 12,
    marginTop: 28,
  },

  logoutButton: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c0392b",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  logoutText: {
    color: "#c0392b",
    fontSize: 16,
    fontWeight: "600",
  },
});
