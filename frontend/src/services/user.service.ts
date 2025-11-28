import { axiosInstance } from "./axios.config";
import type { UserInfo } from "./auth.service";

class UserService {
    async getCurrentUser(): Promise<UserInfo> {
        return axiosInstance.get("/users/me");
    }

    async updateUser(userId: string, data: Partial<UserInfo>): Promise<UserInfo> {
        return axiosInstance.patch(`/users/${userId}`, data);
    }

    async deleteUser(userId: string): Promise<void> {
        return axiosInstance.delete(`/users/${userId}`);
    }
}

export const userService = new UserService();
