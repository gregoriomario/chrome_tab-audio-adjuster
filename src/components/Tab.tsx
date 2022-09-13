import React from "react";
import Globe from "../assets/globe90.png";

type TabProps = {
	className?: string;
	title: string;
	icon?: string;
};

const Tab = ({ title, icon, className = "" }: TabProps) => {
	return (
		<div className={className}>
			<div className="flex gap-x-3 text-sm items-center">
				<img src={icon || Globe} className="w-6 h-6"></img>
				<p className="truncate">{title}</p>
			</div>
		</div>
	);
};

export default Tab;
