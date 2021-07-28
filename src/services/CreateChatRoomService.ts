import { ChatRoom, ChatRoomType } from '../schemas/ChatRoom';

export class CreateChatRoomService {
	async execute(idUsers: string[]): Promise<ChatRoomType> {
		const room = await ChatRoom.create({
			idUsers,
		});

		return room;
	}
}
