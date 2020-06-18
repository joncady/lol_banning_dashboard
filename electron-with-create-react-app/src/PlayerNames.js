import React from 'react';

const playerNames = (props) => {
	const inputOptions = [];
	let start, end;
	if (props.team === "A") {
		start = 1;
		end = 5;
	} else {
		start = 6;
		end = 10;
	}
	for (let i = start; i <= end; i += 1) {
		const option = (
			<div key={i}>
				<label>Player {i} Name</label>
				<input onChange={(e) => props.update("player" + i, e.target.value)} value={props.allProps["player" + i]}></input>
			</div>
		);
		inputOptions.push(option);
	}
	return inputOptions
}

export default playerNames;
