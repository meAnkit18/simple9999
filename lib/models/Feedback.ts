
import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
    email: string;
    message: string;
    createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema);
