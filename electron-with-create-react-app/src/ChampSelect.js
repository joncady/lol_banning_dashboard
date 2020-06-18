import React, { Component } from 'react';

export default class ChampSelect extends Component {

	constructor() {
		super();
		this.state = {
			champs: null
		}
	}

	componentDidMount() {
		const { champs } = this.props;
		let champOptions = champs.map((champ, i) => {
			return <option key={i}>{champ.replace(".jpg", "")}</option>;
		});
		const allChamps = [];
		let start, end;
		if (this.props.team === "A") {
			start = 1;
			end = 5;
		} else {
			start = 6;
			end = 10;
		}
		for (let i = start; i <= end; i += 1) {
			const fullSelect = (
				<div key={i}>
					<label>Player {i}'s Champ</label>
					<select onChange={(e) => this.props.update("champ" + i, e.target.value)} value={this.props.allProps["champ" + i]}>
						{champOptions}
					</select>
				</div>
			);
			allChamps.push(fullSelect);
		}
		this.setState({
			champs: allChamps
		});
	}

	render() {
		return (
			<div>
				{this.state.champs}
			</div>
		);
	}

}
