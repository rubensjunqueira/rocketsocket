import { ObjectId } from 'mongoose';

import { ChatRoom, ChatRoomType } from '../schemas/ChatRoom';

export class GetChatRoomByUsersService {
	async execute(idUsers: ObjectId[]): Promise<ChatRoomType> {
		const room = await ChatRoom.findOne({
			idUsers: {
				$all: idUsers,
			},
		});

		return room;
	}
}
