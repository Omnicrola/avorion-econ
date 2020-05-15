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
                    <FactoryList onSelect={selectedFactory => this.setState({selectedFactory})}></FactoryList>
                    {this.state.selectedFactory && (
                        <FactoryContainer selectedFactory={this.state.selectedFactory}
                                          onSelect={selectedFactory => this.setState({selectedFactory})}
                        ></FactoryContainer>)}
                </div>
            </div>
        );
    }
}

export default App;
