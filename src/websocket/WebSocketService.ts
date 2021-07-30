/* eslint-disable no-underscore-dangle */
import { container } from 'tsyringe';

import { io } from '../http';
import { CreateChatRoomService } from '../services/CreateChatRoomService';
import { CreateMessageService } from '../services/CreateMessageService';
import { CreateUserService } from '../services/CreateUserService';
import { GetAllUsersService } from '../services/GetAllUsersService';
import { GetChatRoomByIdService } from '../services/GetChatRoomByIdService';
import { GetChatRoomByUsersService } from '../services/GetChatRoomByUsersService';
import { GetMessagesByChatRoomService } from '../services/GetMessagesByChatRoomService';
import { GetUserBySocketIdService } from '../services/GetUserBySocketIdService';

io.on('connect', (socket) => {
	socket.emit('chat_iniciado', {
		message: 'Seu chat foi iniciado!',
	});

	socket.on('start', async (params) => {
		const { name, email, avatar_url } = params;

		const createUserService = container.resolve(CreateUserService);

		const createUser = await createUserService.execute({
			name,
			email,
			avatar_url,
			socket_id: socket.id,
		});
		socket.broadcast.emit('new_users', createUser);
	});

	socket.on('get_users', async (callback) => {
		const getAllUsersService = container.resolve(GetAllUsersService);

		const users = await getAllUsersService.execute();

		callback(users);
	});

	socket.on('start_chat', async (data, callback) => {
		const createChatRoomService = container.resolve(CreateChatRoomService);
		const getUserBySocketIdService = container.resolve(
			GetUserBySocketIdService
		);
		const getChatRoomByUsersService = container.resolve(
			GetChatRoomByUsersService
		);
		const getMessagesByChatRoomService = container.resolve(
			GetMessagesByChatRoomService
		);

		const userLogged = await getUserBySocketIdService.execute(socket.id);

		let room = await getChatRoomByUsersService.execute([
			userLogged.id,
			data.idUser,
		]);

		if (!room) {
			room = await createChatRoomService.execute([data.idUser, userLogged.id]);
		}

		socket.join(room.idChatRoom);

		const messages = await getMessagesByChatRoomService.execute(
			room.idChatRoom
		);

		callback({ room, messages });
	});

	socket.on('message', async (data) => {
		const { message, idChatRoom } = data;

		const getUserBySocketIdService = container.resolve(
			GetUserBySocketIdService
		);
		const createMessageService = container.resolve(CreateMessageService);
		const getChatRoomByIdService = container.resolve(GetChatRoomByIdService);

		const user = await getUserBySocketIdService.execute(socket.id);

		const createdMessage = await createMessageService.execute({
			to: user._id,
			text: message,
			roomId: idChatRoom,
		});

		if (createdMessage) {
			io.to(idChatRoom).emit('message', {
				message: createdMessage,
				user,
			});

			const chatRoom = await getChatRoomByIdService.execute(idChatRoom);

			const userFrom = chatRoom.idUsers.find(
				(x) => String(x._id) !== String(user._id)
			);

			io.to(userFrom.socket_id).emit('notification', {
				newMessage: true,
				roomId: idChatRoom,
				from: user,
			});
		}
	});
});
