import {Component} from "react";
import swal from "sweetalert";
import {Meteor} from "meteor/meteor";
import React from "react";



export default class CellDelete extends Component {
    constructor(props) {
        super(props);
    }

    removeProduk() {
        swal({
            title: "Are you sure?",
            text: "Apa Anda yakin ingin menghapus ?",
            icon: "warning",
            dangerMode: true
        }).then(willDelete => {
            if (willDelete) {
                Meteor.call(this.props.model + ".remove", this.props.modelId);
                swal("Dihapus!", "Data berhasil dihapus!", "success");
            }
        });
    }

    render() {
        return (
            <div className="label label-danger">
                <span
                    className="fa fa-trash-o center-block text-center"
                    onClick={this.removeProduk.bind(this)}
                />
            </div>
        );
    }
}