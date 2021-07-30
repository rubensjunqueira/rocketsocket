import { injectable } from 'tsyringe';

import { ChatRoom, ChatRoomType } from '../schemas/ChatRoom';

@injectable()
export class GetChatRoomByIdService {
	async execute(idChatRoom: string): Promise<ChatRoomType> {
		return ChatRoom.findOne({
			idChatRoom,
		}).populate('idUsers');
	}
}
