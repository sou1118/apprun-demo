import type { Component } from "solid-js";
import type { Todo } from "../types";

interface TodoItemProps {
	todo: Todo;
	onToggle: (id: number) => void;
	onDelete: (id: number) => void;
}

export const TodoItem: Component<TodoItemProps> = (props) => {
	return (
		<div class="flex items-center gap-2 p-2 border-b border-gray-200">
			<input
				type="checkbox"
				checked={props.todo.completed}
				onChange={() => props.onToggle(props.todo.id)}
				class="w-4 h-4 cursor-pointer"
			/>
			<span
				class={`flex-1 ${
					props.todo.completed ? "line-through text-gray-500" : ""
				}`}
			>
				{props.todo.text}
			</span>
			<button
				type="button"
				onClick={() => props.onDelete(props.todo.id)}
				class="px-2 py-1 text-red-600 hover:bg-red-100 rounded transition-colors"
			>
				削除
			</button>
		</div>
	);
};
