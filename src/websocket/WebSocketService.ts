import { container } from 'tsyringe';

import { io } from '../http';
import { CreateUserService } from '../services/CreateUserService';
import { GetAllUsersService } from '../services/GetAllUsersService';

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
});
