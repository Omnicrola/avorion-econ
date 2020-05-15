import React from 'react';

export class FactoryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    filterList(factoryName) {
        if (!this.state.filter) {
            return true;
        }
        return factoryName.toLowerCase().includes(this.state.filter);
    }

    sortByName(a, b) {
        return a.name.toLowerCase() > b.name.toLowerCase();
    }

    render() {
        return (<div className="factory-list">
            <input type="text" className="search" placeholder="search..."
                   onChange={e => this.setState({filter: e.target.value})}/>
            {this.props.factories
                .filter(f => this.filterList(f.name))
                .sort(this.sortByName)
                .map(f => (
                    <div key={f.id} className="factory-row" onClick={() => this.props.onSelect(f)}>{f.name}</div>))}
        </div>);
    }
}