import React, { Component } from 'react';
import { Row } from 'reactstrap';

const path = 'assets/squares';

export default class Flow extends Component {

    constructor() {
        super();
        this.state = {
            selectedElement: null
        }
    }

    setHighlighted = (element) => {
        let lastEl = this.state.selectedElement;
        if (lastEl) {
            lastEl.classList.remove("selected");
        }
        element.classList.add("selected");
        this.setState({
            selectedElement: element
        });
    }

    renderChamps = () => {
        let { champs, update, phase } = this.props;
        let champMap = champs.map((champ) => {
            return (
                <div className="champ" key={champ} onClick={(e) => {
                    this.setHighlighted(e.target);
                    update(phase, champ.replace(".jpg", ""));
                }}>
                    <img src={`./${path}/${champ}`} alt={champ}></img>
                </div>
            );
        });
        return (
            <Row>
                {champMap}
            </Row>
        );
    }

    render() {
        return (
            <div>
                {this.renderChamps()}
            </div>
        );
    }

}