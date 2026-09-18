export const up = (pgm) => {
  pgm.createTable("patient_profiles", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      notNull: true,
      unique: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    full_name: {
      type: "varchar(255)",
      notNull: true,
    },
    age: {
      type: "integer",
      notNull: true,
    },
    weight_kg: {
      type: "numeric(6,2)",
      notNull: true,
    },
    height_cm: {
      type: "numeric(6,2)",
      notNull: true,
    },
    notes: {
      type: "text",
      notNull: false,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.addConstraint("patient_profiles", "patient_profiles_age_check", {
    check: "age >= 0 AND age <= 150",
  });

  pgm.addConstraint(
    "patient_profiles",
    "patient_profiles_weight_check",
    {
      check: "weight_kg > 0 AND weight_kg <= 1000",
    }
  );

  pgm.addConstraint(
    "patient_profiles",
    "patient_profiles_height_check",
    {
      check: "height_cm > 0 AND height_cm <= 300",
    }
  );
};

export const down = (pgm) => {
  pgm.dropTable("patient_profiles");
};
