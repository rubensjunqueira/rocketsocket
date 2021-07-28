import { injectable } from 'tsyringe';

import { User, UserType } from '../schemas/User';

@injectable()
export class GetUserBySocketIdService {
	async execute(socket_id: string): Promise<UserType> {
		return User.findOne({ socket_id });
	}
}
