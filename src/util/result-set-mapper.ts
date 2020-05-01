import { User } from "../models/user";
import { UserSchema } from "./schemas";

export function mapUserResultSet(resultSet: UserSchema): User {

	if (!resultSet) {
		return {} as User;
	}

	return new User (
		resultSet.id,
		resultSet.username,
		resultSet.password,
		resultSet.first_name,
		resultSet.last_name,
		resultSet.email,
		resultSet.role_name
	);
}