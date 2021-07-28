import { injectable } from 'tsyringe';

import { User, UserType } from '../schemas/User';

interface ICreateUserDTO {
	email: string;
	socket_id: string;
	avatar_url: string;
	name: string;
}

@injectable()
export class CreateUserService {
	async execute({
		name,
		avatar_url,
		socket_id,
		email,
	}: ICreateUserDTO): Promise<UserType> {
		const userAlreadyexists = await User.findOne({ email });

		if (userAlreadyexists) {
			const user = await User.findOneAndUpdate(
				{
					_id: userAlreadyexists.id,
				},
				{
					$set: { name, socket_id, avatar_url },
				}
			);
			return user;
		}

		const user = await User.create({ email, socket_id, name, avatar_url });

		return user;
	}
}
