const BASE_URL = 'http://localhost:8080/api';
const API_URL = `${BASE_URL}/auth`;

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserData {
    name?: string;
    email?: string;
}

export interface OTPVerifyData {
    email: string;
    otp: string;
}

export interface OTPResendData {
    email: string;
}

export interface RegisterResponse {
    message: string;
    userId: string;
    email: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: 'user' | 'admin';
        walletBalance: number;
    };
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    walletBalance: number;
    profilePhoto?: string;
    createdAt: string;
}

class ApiService {
    private getAuthHeaders(token?: string): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const authToken = token || localStorage.getItem('authToken');
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        return headers;
    }

    // Register new user (CREATE) - Now returns RegisterResponse
    async register(data: RegisterData): Promise<RegisterResponse> {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Registration failed');
        }

        return result;
    }

    // Verify OTP
    async verifyOTP(data: OTPVerifyData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/verify-otp`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'OTP verification failed');
        }

        return result;
    }

    // Resend OTP
    async resendOTP(data: OTPResendData): Promise<{ message: string }> {
        const response = await fetch(`${API_URL}/resend-otp`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to resend OTP');
        }

        return result;
    }

    // Login user
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Login failed');
        }

        return result;
    }

    // Create order (backend API call)
    async createOrder(orderData: {
        items: any[];
        totalAmount: number;
        shippingAddress: any;
        paymentMethod: string;
    }, token: string): Promise<{
        order: any;
        newWalletBalance?: number;
        scratchCard?: {
            id: string;
            orderAmount: number;
            expiresAt: string;
        } | null;
    }> {
        const response = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: this.getAuthHeaders(token),
            body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Order creation failed');
        }

        return result;
    }

    // Get order history (READ)
    async getCurrentUser(token: string): Promise<{ user: User }> {
        const response = await fetch(`${API_URL}/me`, {
            headers: this.getAuthHeaders(token),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to get user');
        }

        return result;
    }

    // Get user by ID (READ)
    async getUserById(id: string, token: string): Promise<{ user: User }> {
        const response = await fetch(`${API_URL}/users/${id}`, {
            headers: this.getAuthHeaders(token),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to get user');
        }

        return result;
    }

    // Get all users (READ)
    async getAllUsers(token: string): Promise<{ users: User[]; total: number }> {
        const response = await fetch(`${API_URL}/users`, {
            headers: this.getAuthHeaders(token),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to get users');
        }

        return result;
    }

    // Update user (UPDATE)
    async updateUser(id: string, data: UpdateUserData, token: string): Promise<{ message: string; user: User }> {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(token),
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to update user');
        }

        return result;
    }

    // Delete user (DELETE)
    async deleteUser(id: string, token: string): Promise<{ message: string }> {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(token),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to delete user');
        }

        return result;
    }

    // Get login history
    async getLoginHistory(token: string): Promise<{ history: any[]; total: number }> {
        const response = await fetch(`${API_URL}/login-history`, {
            headers: this.getAuthHeaders(token),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to get login history');
        }

        return result;
    }

    // --- Wallet Methods ---

    async getWallet(token: string): Promise<{ balance: number; transactions: any[] }> {
        const response = await fetch(`${BASE_URL}/wallet`, {
            headers: this.getAuthHeaders(token),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to get wallet');
        }

        return result;
    }

    async addFunds(amount: number, token: string): Promise<{ message: string; balance: number; transaction: any }> {
        const response = await fetch(`${BASE_URL}/wallet/add-funds`, {
            method: 'POST',
            headers: this.getAuthHeaders(token),
            body: JSON.stringify({ amount }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to add funds');
        }

        return result;
    }

    async transferFunds(recipientEmail: string, amount: number, token: string): Promise<{ message: string; balance: number; transaction: any }> {
        const response = await fetch(`${BASE_URL}/wallet/transfer`, {
            method: 'POST',
            headers: this.getAuthHeaders(token),
            body: JSON.stringify({ recipientEmail, amount }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Transfer failed');
        }

        return result;
    }

    // --- Admin Methods ---

    async getAllTransactions(token: string): Promise<{ transactions: any[]; total: number }> {
        const response = await fetch(`${BASE_URL}/admin/transactions`, {
            headers: this.getAuthHeaders(token),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to get transactions');
        }

        return result;
    }

    async getSystemStats(token: string): Promise<{ totalUsers: number; totalTransactions: number; totalFunds: number }> {
        const response = await fetch(`${BASE_URL}/admin/stats`, {
            headers: this.getAuthHeaders(token),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to get system stats');
        }

        return result;
    }

    // Upload profile photo
    async uploadProfilePhoto(profilePhoto: string, token: string): Promise<{ profilePhoto: string }> {
        const response = await fetch(`${BASE_URL}/user/profile-photo`, {
            method: 'POST',
            headers: this.getAuthHeaders(token),
            body: JSON.stringify({ profilePhoto }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to upload profile photo');
        }

        return result;
    }

    // Delete profile photo
    async deleteProfilePhoto(token: string): Promise<{ message: string }> {
        const response = await fetch(`${BASE_URL}/user/profile-photo`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(token),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to delete profile photo');
        }

        return result;
    }
}

export const apiService = new ApiService();
export default apiService;
