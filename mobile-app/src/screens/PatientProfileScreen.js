import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "../services/profileService";

export default function PatientProfileScreen() {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const profile = await getProfile();

      if (profile) {
        setFullName(profile.full_name || "");
        setAge(String(profile.age ?? ""));
        setWeightKg(String(profile.weight_kg ?? ""));
        setHeightCm(String(profile.height_cm ?? ""));
        setNotes(profile.notes || "");
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (err) {
      setError(err.message || "Unable to load profile.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setError("");
    setSuccess("");

    if (!fullName.trim() || !age || !weightKg || !heightCm) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setSaving(true);

      const profileData = {
        fullName: fullName.trim(),
        age: Number(age),
        weightKg: Number(weightKg),
        heightCm: Number(heightCm),
        notes: notes.trim(),
      };

      const savedProfile = hasProfile
        ? await updateProfile(profileData)
        : await createProfile(profileData);

      setFullName(savedProfile.full_name || "");
      setAge(String(savedProfile.age ?? ""));
      setWeightKg(String(savedProfile.weight_kg ?? ""));
      setHeightCm(String(savedProfile.height_cm ?? ""));
      setNotes(savedProfile.notes || "");

      setHasProfile(true);
      setSuccess(
        hasProfile
          ? "Patient profile updated successfully."
          : "Patient profile created successfully."
      );
    } catch (err) {
      setError(err.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Patient Profile</Text>

          <Text style={styles.subtitle}>
            Research and simulated-data profile
          </Text>

          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>Research Prototype</Text>
            <Text style={styles.noticeText}>
              This profile is used for academic research and simulated system
              behavior. It is not used for clinical diagnosis or real
              medication dosing.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Basic Information</Text>

          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            placeholderTextColor="#777"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Age *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter age"
            placeholderTextColor="#777"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>Weight (kg) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter weight"
            placeholderTextColor="#777"
            value={weightKg}
            onChangeText={setWeightKg}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Height (cm) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter height"
            placeholderTextColor="#777"
            value={heightCm}
            onChangeText={setHeightCm}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Research Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Optional research notes"
            placeholderTextColor="#777"
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {success ? (
            <Text style={styles.success}>{success}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {hasProfile ? "Update Profile" : "Save Profile"}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footer}>
            * Required fields
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  scrollContent: {
    padding: 28,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#5f6b76",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#17202a",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#5f6b76",
    marginBottom: 24,
  },
  notice: {
    backgroundColor: "#eef5f9",
    borderWidth: 1,
    borderColor: "#cbdde8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2471a3",
    marginBottom: 6,
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#52616b",
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#17202a",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34495e",
    marginBottom: 7,
  },
  input: {
    height: 52,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6dce2",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#17202a",
    marginBottom: 17,
  },
  notesInput: {
    height: 110,
    paddingTop: 14,
  },
  error: {
    color: "#c0392b",
    fontSize: 14,
    marginBottom: 14,
  },
  success: {
    color: "#247a4b",
    fontSize: 14,
    marginBottom: 14,
  },
  button: {
    height: 52,
    backgroundColor: "#2471a3",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  footer: {
    textAlign: "center",
    color: "#7b8794",
    fontSize: 12,
    marginTop: 18,
  },
});
