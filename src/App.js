import React from 'react';
import './styles/App.scss';
import {FactoryList} from "./components/FactoryList";
import factories from './data/factories.json';
import goods from './data/goods.json';
import {TechTree} from "./components/TechTree";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            factories: factories,
            goods: goods,
            selectedFactory: null
        };
    }

    render() {
        return (
            <div className="app">
                <h1 className="title">Avorion Economic Planner</h1>
                <div className="content">
                    <FactoryList factories={this.state.factories}
                                 onSelect={selectedFactory => this.setState({selectedFactory})}></FactoryList>
                    {this.state.selectedFactory && (<TechTree selectedFactory={this.state.selectedFactory}></TechTree>)}
                </div>
            </div>
        );
    }
}

export default App;
