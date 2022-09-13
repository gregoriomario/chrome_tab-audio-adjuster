import { useId } from "react";

type SliderProps = {
	className?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value: number | string;
};

const Slider = ({ className = "", onChange, value }: SliderProps) => {
	const id = useId();
	return (
		<div className={className}>
			<label htmlFor={id} className="sr-only">
				Range
			</label>
			<input
				onChange={onChange}
				id={id}
				type="range"
				value={value}
				defaultValue="100"
				className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
			/>
		</div>
	);
};

export default Slider;
