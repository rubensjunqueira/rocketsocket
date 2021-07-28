import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { User } from './User';

type ChatRoomType = Document & {
	idUsers: typeof User[];
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
		default: uuid(),
	},
});

const ChatRoom = mongoose.model<ChatRoomType>('chatrooms', ChatRoomSchema);

export { ChatRoom };
