import mongoose, { Schema, type InferSchemaType } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    price: { type: Number, required: true, min: 0, default: 999 },
    compareAtPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 10 },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    images: [{
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    }],
    isActive: { type: Boolean, default: true, index: true },
    status: {
      type: String,
      enum: ["ACTIVE", "DRAFT", "ARCHIVED"],
      default: "ACTIVE",
      index: true,
    },
    isSample: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ status: 1, category: 1, createdAt: -1 });

export type ProductDocument = InferSchemaType<typeof productSchema>;
export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
