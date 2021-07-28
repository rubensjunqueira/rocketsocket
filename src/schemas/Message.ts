import mongoose, { Document, Schema } from 'mongoose';

export type MessageType = Document & {
	to: string;
	text: string;
	created_at: Date;
	roomId: string;
};

const MessageSchema = new Schema({
	to: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	text: String,
	created_at: {
		type: Date,
		default: Date.now(),
	},
	roomId: {
		type: String,
		ref: 'rooms',
	},
});

const Message = mongoose.model<MessageType>('messages', MessageSchema);

export { Message };
