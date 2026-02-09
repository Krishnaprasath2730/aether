import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlistItem {
    productId: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

export interface IUserWishlist extends Document {
    userId: mongoose.Types.ObjectId;
    items: IWishlistItem[];
    updatedAt: Date;
}

const WishlistItemSchema = new Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
}, { _id: false });

const UserWishlistSchema = new Schema<IUserWishlist>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    items: [WishlistItemSchema],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update timestamp on save
UserWishlistSchema.pre('save', function () {
    this.updatedAt = new Date();
});

const UserWishlist = mongoose.model<IUserWishlist>('UserWishlist', UserWishlistSchema);

export default UserWishlist;
