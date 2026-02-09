import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
    productId: string;
    name: string;
    price: number;
    image: string;
    selectedSize: string;
    selectedColor: string;
    quantity: number;
}

export interface IUserCart extends Document {
    userId: mongoose.Types.ObjectId;
    items: ICartItem[];
    updatedAt: Date;
}

const CartItemSchema = new Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    selectedSize: { type: String, required: true },
    selectedColor: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const UserCartSchema = new Schema<IUserCart>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    items: [CartItemSchema],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update timestamp on save
UserCartSchema.pre('save', function () {
    this.updatedAt = new Date();
});

const UserCart = mongoose.model<IUserCart>('UserCart', UserCartSchema);

export default UserCart;
