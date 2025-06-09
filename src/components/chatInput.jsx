import { useEffect, useRef, useState } from "react";

const ChatInput = ({ setIsTyping, handleSubmit, children }) => {
	const textareaRef = useRef(null);
	const [inputValue, setInputValue] = useState("");

	const adjustTextareaHeight = () => {
		const textarea = textareaRef.current;

		if (textarea) {
			// Reset height to auto to get the correct scrollHeight
			textarea.style.height = "auto";
			// Set the height to scrollHeight to expand
			textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
		}
	};
	useEffect(() => {
		adjustTextareaHeight();
	}, [inputValue]);

	return (

		<div className="p-3 border-t flex items-center bg-white ">
            {children}
        	<textarea
				ref={textareaRef}
				placeholder="Type a message..."
				className="flex-1 border rounded-lg px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-primary  resize-none overflow-y-auto min-h-[40px] max-h-[120px]"
				onClick={() => setIsTyping(true)}
				onChange={(e) => setInputValue(e.target.value)}
				value={inputValue}
				rows={1}
			/>
			<button
				className="bg-primary text-white px-5 py-2 rounded-lg font-semibold disabled:bg-slate-400"
				disabled={!inputValue}
				onClick={() => {
					handleSubmit(inputValue);
					setInputValue("");
				}}
			>
				Send
			</button>
		</div>
	);
};

export default ChatInput;
