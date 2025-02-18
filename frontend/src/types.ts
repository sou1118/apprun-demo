export interface Todo {
	id: number;
	text: string;
	completed: boolean;
}

export interface CreateTodo {
	text: string;
}

export interface UpdateTodo {
	text?: string;
	completed?: boolean;
}
