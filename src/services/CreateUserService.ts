import { injectable } from 'tsyringe';

import { User, UserType } from '../schemas/User';
import { validateAvatarUrl } from '../utils/ValidateAvatarUrl';

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

		let avatarUrl = '';

		if (!validateAvatarUrl(avatar_url))
			avatarUrl = `https://ui-avatars.com/api/?background=random&name=${name}`;
		else avatarUrl = avatar_url;

		if (userAlreadyexists) {
			const user = await User.findOneAndUpdate(
				{
					_id: userAlreadyexists.id,
				},
				{
					$set: { name, socket_id, avatar_url: avatarUrl },
				}
			);
			return user;
		}

		const user = await User.create({
			email,
			socket_id,
			name,
			avatar_url: avatarUrl,
		});

		return user;
	}
}
