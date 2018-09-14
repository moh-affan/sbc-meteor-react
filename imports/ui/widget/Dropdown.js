import React, {Component} from 'react';

export default class Dropdown extends Component {
    constructor(props) {
        super(props);
    }

    renderOptions() {
        let data = this.props.items;
        // console.log(data);
        return data.map((item, i) => {
            return <option key={i} value={item.id}>{item.nama}</option>
        });
    }

    render() {
        return (
            <select name={this.props.name} ref={this.props.name} className={this.props.className}>
                <option>{this.props.placeholder}</option>
                {this.renderOptions()}
            </select>
        );
    }
}