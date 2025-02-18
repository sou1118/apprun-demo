import type { CreateTodo, Todo, UpdateTodo } from "./types";

const API_URL = "/api";

const defaultFetchOptions: RequestInit = {
	credentials: "include",
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	mode: "cors",
};

export const api = {
	async getAllTodos(): Promise<Todo[]> {
		const response = await fetch(`${API_URL}/todos`, defaultFetchOptions);
		if (!response.ok) {
			throw new Error("Failed to fetch todos");
		}
		return response.json();
	},

	async createTodo(text: string): Promise<Todo> {
		const response = await fetch(`${API_URL}/todos`, {
			...defaultFetchOptions,
			method: "POST",
			body: JSON.stringify({ text } as CreateTodo),
		});
		if (!response.ok) {
			throw new Error("Failed to create todo");
		}
		return response.json();
	},

	async updateTodo(id: number, updates: UpdateTodo): Promise<Todo> {
		const response = await fetch(`${API_URL}/todos/${id}`, {
			...defaultFetchOptions,
			method: "PATCH",
			body: JSON.stringify(updates),
		});
		if (!response.ok) {
			throw new Error("Failed to update todo");
		}
		return response.json();
	},

	async deleteTodo(id: number): Promise<void> {
		const response = await fetch(`${API_URL}/todos/${id}`, {
			...defaultFetchOptions,
			method: "DELETE",
		});
		if (!response.ok) {
			throw new Error("Failed to delete todo");
		}
	},
};

export default api;
