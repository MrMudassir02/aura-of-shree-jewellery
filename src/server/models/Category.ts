import mongoose, { Schema, type InferSchemaType, type Types } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    imageUrl: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

type CategoryFields = InferSchemaType<typeof categorySchema>;

export type CategoryDocument = CategoryFields & {
  _id: Types.ObjectId;
};

export const Category =
  mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
