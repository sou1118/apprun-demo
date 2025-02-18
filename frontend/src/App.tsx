import {
	type Component,
	For,
	Show,
	createEffect,
	createSignal,
} from "solid-js";
import { api } from "./api";
import { TodoInput } from "./components/TodoInput";
import { TodoItem } from "./components/TodoItem";
import type { Todo } from "./types";

const App: Component = () => {
	const [todos, setTodos] = createSignal<Todo[]>([]);
	const [loading, setLoading] = createSignal(true);
	const [error, setError] = createSignal<string | null>(null);

	createEffect(async () => {
		try {
			const fetchedTodos = await api.getAllTodos();
			setTodos(fetchedTodos);
			setError(null);
		} catch (err) {
			setError("Todoの読み込みに失敗しました");
			console.error("Failed to fetch todos:", err);
		} finally {
			setLoading(false);
		}
	});

	const handleAdd = async (text: string) => {
		try {
			const newTodo = await api.createTodo(text);
			setTodos((prev) => [...prev, newTodo]);
			setError(null);
		} catch (err) {
			setError("Todoの作成に失敗しました");
			console.error("Failed to create todo:", err);
		}
	};

	const handleToggle = async (id: number) => {
		try {
			const todo = todos().find((t) => t.id === id);
			if (todo) {
				const updatedTodo = await api.updateTodo(id, {
					completed: !todo.completed,
				});
				setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));
				setError(null);
			}
		} catch (err) {
			setError("Todoの更新に失敗しました");
			console.error("Failed to update todo:", err);
		}
	};

	const handleDelete = async (id: number) => {
		try {
			await api.deleteTodo(id);
			setTodos((prev) => prev.filter((t) => t.id !== id));
			setError(null);
		} catch (err) {
			setError("Todoの削除に失敗しました");
			console.error("Failed to delete todo:", err);
		}
	};

	return (
		<div class="max-w-2xl mx-auto p-4 font-sans">
			<h1 class="text-2xl font-bold mb-4">Todoリスト</h1>

			<Show when={error()}>
				<div class="mb-4 p-3 bg-red-100 text-red-700 rounded">{error()}</div>
			</Show>

			<TodoInput onAdd={handleAdd} />

			<Show
				when={!loading()}
				fallback={
					<div class="text-center p-4 text-gray-500">
						<div class="i-line-md:loading-twotone-loop·text-2xl·inline-block" />
						<span class="ml-2">読み込み中...</span>
					</div>
				}
			>
				<div class="border border-gray-200 rounded overflow-hidden">
					<For
						each={todos()}
						fallback={
							<div class="p-4 text-center text-gray-500">
								タスクがありません
							</div>
						}
					>
						{(todo) => (
							<TodoItem
								todo={todo}
								onToggle={handleToggle}
								onDelete={handleDelete}
							/>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
};

export default App;
