import { type Component, createSignal } from "solid-js";

interface TodoInputProps {
	onAdd: (text: string) => void;
}

export const TodoInput: Component<TodoInputProps> = (props) => {
	const [text, setText] = createSignal("");

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		const currentText = text().trim();
		if (currentText) {
			props.onAdd(currentText);
			setText("");
		}
	};

	return (
		<form onSubmit={handleSubmit} class="flex gap-2 mb-4">
			<input
				type="text"
				value={text()}
				onInput={(e) => setText(e.currentTarget.value)}
				placeholder="新しいタスクを入力..."
				class="flex-1 px-3 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			/>
			<button
				type="submit"
				class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
				disabled={!text().trim()}
			>
				追加
			</button>
		</form>
	);
};
