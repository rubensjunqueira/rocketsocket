import { injectable } from 'tsyringe';

import { User, UserType } from '../schemas/User';

@injectable()
export class GetAllUsersService {
	async execute(): Promise<UserType[]> {
		return User.find({});
	}
}
