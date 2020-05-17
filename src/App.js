import React from 'react';
import './styles/App.scss';
import {FactoryList} from "./components/FactoryList";
import {FactoryContainer} from "./components/FactoryContainer";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFactory: null
        };
    }

    render() {
        return (
            <div className="app">
                <h1 className="title">Avorion Economic Planner</h1>
                <div className="content">
                    <FactoryList onSelect={selectedFactory => this.setState({selectedFactory})}/>
                    {this.state.selectedFactory && (
                        <FactoryContainer selectedFactory={this.state.selectedFactory}
    onSelect={selectedFactory => this.setState({selectedFactory})}
    />)}
                </div>
                <div className="footer">
                    <a href="https://www.avorion.net/" target="_new">Avorion Home</a> |
                    <a href="https://avorion.gamepedia.com/Avorion_Wiki/" target="_new">Avorion Wiki</a> |
                    <a href="https://github.com/Omnicrola/avorion-econ/" target="_new">GitHub Source</a></div>
            </div>
        );
    }
}

export default App;
