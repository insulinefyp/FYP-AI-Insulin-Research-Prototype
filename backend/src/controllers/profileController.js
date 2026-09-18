const {
  getProfileByUserId,
  createProfile,
  updateProfile,
} = require("../services/profileService");

function validateProfile(profileData) {
  const {
    fullName,
    age,
    weightKg,
    heightCm,
    notes,
  } = profileData;

  if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
    return "Full name is required";
  }

  if (
    age === undefined ||
    age === null ||
    !Number.isInteger(Number(age)) ||
    Number(age) < 0 ||
    Number(age) > 150
  ) {
    return "Age must be a whole number between 0 and 150";
  }

  if (
    weightKg === undefined ||
    weightKg === null ||
    !Number.isFinite(Number(weightKg)) ||
    Number(weightKg) <= 0 ||
    Number(weightKg) > 1000
  ) {
    return "Weight must be between 0 and 1000 kg";
  }

  if (
    heightCm === undefined ||
    heightCm === null ||
    !Number.isFinite(Number(heightCm)) ||
    Number(heightCm) <= 0 ||
    Number(heightCm) > 300
  ) {
    return "Height must be between 0 and 300 cm";
  }

  if (notes !== undefined && notes !== null && typeof notes !== "string") {
    return "Notes must be text";
  }

  return null;
}

function normalizeProfileData(profileData) {
  return {
    fullName: profileData.fullName.trim(),
    age: Number(profileData.age),
    weightKg: Number(profileData.weightKg),
    heightCm: Number(profileData.heightCm),
    notes:
      profileData.notes === undefined || profileData.notes === null
        ? null
        : profileData.notes.trim(),
  };
}

async function getProfile(req, res) {
  try {
    const profile = await getProfileByUserId(req.user.sub);

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve profile",
    });
  }
}

async function create(req, res) {
  try {
    const validationError = validateProfile(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const existingProfile = await getProfileByUserId(req.user.sub);

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Patient profile already exists",
      });
    }

    const profile = await createProfile(
      req.user.sub,
      normalizeProfileData(req.body)
    );

    return res.status(201).json({
      success: true,
      message: "Patient profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("Create profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create profile",
    });
  }
}

async function update(req, res) {
  try {
    const validationError = validateProfile(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const existingProfile = await getProfileByUserId(req.user.sub);

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const profile = await updateProfile(
      req.user.sub,
      normalizeProfileData(req.body)
    );

    return res.status(200).json({
      success: true,
      message: "Patient profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  }
}

module.exports = {
  getProfile,
  create,
  update,
};
