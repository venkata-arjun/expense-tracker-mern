import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    balance: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: ["cash", "bank", "card", "wallet", "upi", "other"],
      required: true,
    },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);
export default Account;
