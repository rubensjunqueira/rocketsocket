import { injectable } from 'tsyringe';

import { Message, MessageType } from '../schemas/Message';

@injectable()
export class GetMessagesByChatRoomService {
	async execute(roomId: string): Promise<MessageType[]> {
		return Message.find({
			roomId,
		}).populate('to');
	}
}
