import React, {Component} from "react";

export default class CellEdit extends Component {
    constructor(props) {
        super(props);
    }

    showProduk() {
        if (typeof this.props.onEditCallback === "function") {
            this.props.onEditCallback(this.props.data);
        }
    }

    render() {
        return (
            <div className="label label-primary">
                <span
                    className="fa fa-pencil center-block text-center"
                    onClick={this.showProduk.bind(this)}
                />
            </div>
        );
    }
}