import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import io from 'socket.io-client';
import PlayerNames from './PlayerNames';
import ChampSelect from './ChampSelect';
import Flow from './Flow';
import './App.css';
import { gameStates } from './states';
import BanSelect from './BanSelect';

const electron = window.require('electron');
const fs = electron.remote.require('fs');

const path = 'assets/squares';

let socket;

class App extends Component {

	constructor() {
		super();
		this.state = {
			champs: null,
			showOptions: false,
			panelType: "manual",
			phaseCounter: 1
		}
	}

	componentDidMount() {
		socket = io('http://localhost:8080');
		let champs = fs.readdirSync("./" + path);
		let { name, cycles, type, perTeam } = gameStates[`phase${this.state.phaseCounter}`];
		this.setState({
			champs: champs,
			phaseName: name,
			cycles: cycles,
			currentCycle: 1,
			team: 'A',
			type: type,
			perTeam: perTeam
		})
	}

	setUpperState = (key, value) => {
		this.setState({
			[key]: value
		});
	};

	update = () => {
		const playerData = new Array(10);
		const champData = new Array(10);
		const banData = new Array(10);
		for (let i = 0; i < 10; i += 1) {
			const { [`player${i + 1}`]: player } = this.state;
			playerData[i] = player || '';
			const { [`champ${i + 1}`]: champ } = this.state;
			champData[i] = champ || '';
		}
		for (let i = 0; i < 5; i++) {
			const { [`ban${i + 1}a`]: teamA, [`ban${i + 1}b`]: teamB } = this.state
			banData[i] = teamA || "";
			banData[i + 5] = teamB || "";
		}
		socket.emit('update', {
			playerData,
			champData,
			banData
		});
	};

	start = () => {
		socket.emit('start');
	}

	renderChoice = () => {
		return (
			<div>
				<div>
					<h4>Welcome to the LoL Banning App for Streaming!</h4>
					<p>Start by choosing how you would like to set the bans.</p>
				</div>
				<div style={{ display: 'flex', padding: '1rem' }}>
					<div style={{ padding: '1rem' }}>
						<Button style={{ margin: '1rem' }} color="primary" onClick={() => {
							this.start();
							this.setState({ panelType: "flow", showOptions: false });
						}}>Auto Flow</Button>
						<p>
							This option will advance through each part while providing the option to choose a character through a grid of all champs.
							The countdown will automatically start when this option is chosen
						</p>
					</div>
					<div style={{ padding: '1rem' }}>
						<Button style={{ margin: '1rem' }} color="danger" onClick={() => this.setState({ panelType: "manual", showOptions: false })}>Manual</Button>
						<p>This option will allow the user to edit past choices and manually go through the banning process.</p>
					</div>
				</div>
			</div>
		);
	}

	swapPanel = () => {
		let { panelType } = this.state;
		this.setState({
			panelType: panelType === "manual" ? "flow" : "manual"
		});
	}

	increaseState = () => {
		let { cycles, currentCycle, team, phaseCounter } = this.state;
		currentCycle += 1;
		if (currentCycle > cycles) {
			phaseCounter += 1;
			let newPhase = gameStates[`phase${phaseCounter}`];
			let name = newPhase.name;
			let type = newPhase.type;
			let perTeam = newPhase.perTeam;
			socket.emit('increase', phaseCounter);
			this.setState({
				currentCycle: 1,
				phaseCounter: phaseCounter,
				phaseName: name,
				team: team === 'A' ? 'B' : 'A',
				type: type,
				perTeam: perTeam
			});
		} else {
			socket.emit('next');
			this.setState({
				currentCycle: currentCycle,
				team: team === 'A' ? 'B' : 'A',
			});
		}
		this.update();
	}

	reset = () => {
		const playerData = new Array(10);
		const champData = new Array(10);
		const banData = new Array(10);
		let updateObject = {};
		for (let i = 0; i < 10; i++) {
			updateObject[`player${i}`] = "";
		}
		for (let i = 0; i < 10; i++) {
			updateObject[`champ${i + 1}`] = "";
		}
		for (let i = 0; i < 5; i++) {
			updateObject[`ban${i + 1}a`] = "";
			updateObject[`ban${i + 1}b`] = "";
		}
		this.setState({
			...updateObject	
		});
		socket.emit('update', {
			playerData,
			champData,
			banData
		});
	}

	render() {
		const { champs, showOptions, panelType, phaseCounter, currentCycle, phaseName, team, type, perTeam } = this.state;
		let phase;
		let whereStart = team === "B" ? 6 : 1;
		let offset = phaseCounter > 2 ? 3 : 0;
		let teamB = team === "B" ? -1 : 0;
		let counter = Math.floor(currentCycle / 2);
		if (type === "ban") {
			phase = "ban" + (1 + offset + counter + teamB) + team.toLowerCase();
		} else if (type === "champ") {
			phase = "champ" + (whereStart + offset + counter + teamB);
		} else {
			phase = "finalize";
		}
		return (
			<div>
				{champs &&
					<div id="dashboard">
						<h2>Drafting Dashboard</h2>
						{showOptions
							?
							this.renderChoice()
							:
							<main>
								<div style={{ margin: '1rem', border: 'black solid 2px', padding: '1rem', borderRadius: '4px' }}>
									<h5 style={{ fontWeight: 'bold' }}>Control panel</h5>
									<div style={{ display: 'flex', justifyContent: 'space-around' }}>
										<div>
											<Button style={{ margin: '0.5rem' }} type="button" onClick={this.start}>Start</Button>
											<Button style={{ margin: '0.5rem' }} onClick={this.increaseState}>Next</Button>
											<Button style={{ margin: '0.5rem' }} type="button" onClick={this.update}>Update</Button>
										</div>
										<div>
											<Button onClick={this.swapPanel}>Swap Types</Button>
										</div>
										<div>
											<Button color="danger" onClick={this.reset}>Reset</Button>
										</div>
									</div>
								</div>
								<h3 style={{ padding: '1rem' }}>{phaseName}, Team {team}</h3>
								{panelType === "manual"
									?
									<Row>
										<Col sm="6">
											<Row>
												<Col>
													<h5>Team A Players</h5>
													<PlayerNames update={this.setUpperState} allProps={this.state} team="A" />
												</Col>
												<Col>
													<h5>Team A Characters</h5>
													<ChampSelect update={this.setUpperState} allProps={this.state} champs={champs} team="A" />
													<h5>Team A Bans</h5>
													<BanSelect update={this.setUpperState} allProps={this.state} champs={champs} team="a"></BanSelect>
												</Col>
											</Row>
										</Col>
										<Col sm="6">
											<Row>
												<Col>
													<h5>Team B Players</h5>
													<PlayerNames update={this.setUpperState} allProps={this.props} team="B" />
												</Col>
												<Col>
													<h5>Team B Characters</h5>
													<ChampSelect update={this.setUpperState} allProps={this.state} champs={champs} team="B" />
													<h5>Team B Bans</h5>
													<BanSelect update={this.setUpperState} allProps={this.state} champs={champs} team="b"></BanSelect>
												</Col>
											</Row>
										</Col>
									</Row>
									:
									<Flow update={this.setUpperState} phase={phase} champs={champs}></Flow>
								}
							</main>
						}
					</div>
				}
			</div>
		);
	}
}
export default App;
