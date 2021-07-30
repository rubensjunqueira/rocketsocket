import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { User, UserType } from './User';

export type ChatRoomType = Document & {
	idUsers: UserType[];
	idChatRoom: string;
};

const ChatRoomSchema = new Schema({
	idUsers: [
		{
			type: Schema.Types.ObjectId,
			ref: User,
		},
	],
	idChatRoom: {
		type: String,
		default: uuid,
	},
});

const ChatRoom = mongoose.model<ChatRoomType>('chatrooms', ChatRoomSchema);

export { ChatRoom };
