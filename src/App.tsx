import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Slider from "./components/Slider";
import Tab from "./components/Tab";

type Volumes = {
	[x: number]: number;
};

function App() {
	const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
	const [volumes, setVolumes] = useState<Volumes>({});

	const getAllTabs = () => {
		chrome.tabs.query({}, (res) => {
			setTabs(res.filter((tab) => tab.audible));
		});
	};

	const execute = async (id: number, volume: number) => {
		setVolumes((prev) => ({ ...prev, [id]: volume }));
		await chrome.storage.sync.set({ volumes: { [id]: volume } });
		let tab = await chrome.tabs.query({});
		const ids = tab.map((t) => t.id);

		if (ids.includes(id)) {
			await chrome.scripting.executeScript({
				target: { tabId: id },
				func: setVolume,
				args: [volume / 100],
			});
		}
	};

	function setVolume(vol: number) {
		document.querySelectorAll("video").forEach((e) => (e.volume = vol));
		document.querySelectorAll("audio").forEach((e) => (e.volume = vol));
	}

	const getVolumes = useCallback(async () => {
		chrome.storage.sync.get("volumes").then(async (res) => {
			setVolumes(res?.volumes ?? {});
			if (res.volumes) {
				await Promise.all(
					Object.entries(res.volumes).map(async ([id, vol]) => {
						await execute(parseInt(id), Number(vol));
					})
				);
			}
		});
	}, []);

	const handleDelete = async () => {
		await chrome.storage.sync.clear();
	};

	useEffect(() => {
		getAllTabs();
		getVolumes();
	}, []);

	return (
		<div className="font-poppins w-[300px] rounded-md text-slate-700">
			<h1 className="text-lg text-left uppercase font-bold">Volume Adjuster</h1>
			<hr className="my-3"></hr>

			{tabs.length != 0 ? (
				tabs.map((tab) => (
					<div className="grid grid-flow-row gap-y-3">
						<div className="grid grid-cols-2 items-center my-3">
							<Tab
								className="pr-6"
								title={tab.title || ""}
								icon={tab.favIconUrl}
							/>
							<Slider
								className="pl-6 mt-1"
								value={volumes[tab.id as number] || "100"}
								onChange={async (e) =>
									tab.id &&
									(await execute(tab.id, e.currentTarget.valueAsNumber))
								}
							/>
						</div>
					</div>
				))
			) : (
				<p className="text-sm italic text-slate-500">No Sound Detected</p>
			)}
		</div>
	);
}

export default App;
