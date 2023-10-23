const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "Please provide username"],
      // match: ["regex here so as to remove space between name"],
      minLength: 3,
      maxLength: 50,
      unique: true,
    },
    firstName: {
      type: String,
      minLength: 1,
      maxLength: 15,
    },
    lastName: {
      type: String,
      minLength: 1,
      maxLength: 15,
    },
    email: {
      type: String,
      require: [true, "Pease Provide email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email.",
      ],
      unique: true,
    },
    password: {
      type: String,
      require: [true, "Please provide you password"],
      minLength: 6
      // match: [
      //   "^(?=.*[A-Za-z](?=.*d) [A-Za-zd]{8,}$)",
      //   "Password must contain minimum eight character, at least one letter and one number",
      // ],
    },

    profile: {
      type: String,
      default: "",
    },

    coverPicture: {
      type: String,
      default: "",
    },

    followers: {
      type: Array,
      default: [],
    },

    following: {
      type: Array,
      default: [],
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      max: 70,
    },

    city: {
      type: String,
      max: 50,
    },

    from: {
      type: String,
      max: 50,
    },

    relation: {
      type: Number,
      stands: [1, 2, 3],
    },
  },

  { timestamps: true }
);

// used by the register route to encrypt password automatically
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// used by the login route to compare password after password is provided
userSchema.methods.comparePassword = async function (candidatePassword) {
  const matchTrue = await bcrypt.compare(candidatePassword, this.password);
  return matchTrue;
};

module.exports = mongoose.model("user", userSchema);
