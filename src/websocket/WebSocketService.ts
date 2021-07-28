import { container } from 'tsyringe';

import { io } from '../http';
import { CreateChatRoomService } from '../services/CreateChatRoomService';
import { CreateUserService } from '../services/CreateUserService';
import { GetAllUsersService } from '../services/GetAllUsersService';
import { GetChatRoomByUsersService } from '../services/GetChatRoomByUsersService';
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

		const userLogged = await getUserBySocketIdService.execute(socket.id);

		let room = await getChatRoomByUsersService.execute([
			userLogged.id,
			data.idUser,
		]);

		if (!room) {
			room = await createChatRoomService.execute([data.idUser, userLogged.id]);
		}

		callback(room);
	});
});
