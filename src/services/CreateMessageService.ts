import { injectable } from 'tsyringe';

import { Message, MessageType } from '../schemas/Message';

interface ICreateMessage {
	to: string;
	text: string;
	roomId: string;
}

@injectable()
export class CreateMessageService {
	async execute({
		roomId,
		text,
		to,
	}: ICreateMessage): Promise<null | MessageType> {
		if (!text) return null;

		const message = await Message.create({
			roomId,
			to,
			text,
		});

		return message;
	}
}
