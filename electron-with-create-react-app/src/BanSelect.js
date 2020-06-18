import React, { Component } from 'react';

export default class BanSelect extends Component {

	constructor() {
		super();
		this.state = {
			champs: null
		}
	}

	componentDidMount() {
		const { champs, team } = this.props;
		let champOptions = champs.map((champ, i) => {
			return <option key={i}>{champ.replace(".jpg", "")}</option>;
		});
		const allChamps = [];
		for (let i = 1; i <= 5; i += 1) {
			const fullSelect = (
				<div key={i}>
					<label>{`Team ${team.toUpperCase()}'s Ban ${i}`}</label>
					<select onChange={(e) => {
						this.props.update(`ban${i}${team}`, e.target.value)
				}} value={this.props.allProps[`ban${i}${team}`]}>
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
