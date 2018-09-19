import {Meteor} from "meteor/meteor";
import React, {Component} from "react";
import {withTracker} from "meteor/react-meteor-data";
import Header from "../containers/Header";
import Sidemenu from "../containers/Sidemenu";
import swal from "sweetalert";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "react-datepicker/dist/react-datepicker.css";

import {MJatah} from "../../api/jatah";

class CellDelete extends Component {
    constructor(props) {
        super(props);
    }

    removeJatah() {
        swal({
            title: "Are you sure?",
            text: "Apa Anda yakin ingin menghapus ?",
            icon: "warning",
            dangerMode: true
        }).then(willDelete => {
            if (willDelete) {
                Meteor.call("jatah.remove", this.props.jatah._id);
                swal("Dihapus!", "Data berhasil dihapus!", "success");
            }
        });
    }

    render() {
        return (
            <span
                className="fa fa-trash-o center-block text-center"
                onClick={this.removeJatah.bind(this)}
            />
        );
    }
}

class CellEdit extends Component {
    constructor(props) {
        super(props);
    }

    showJatah() {
        $("input[name=_id]").val(this.props.jatah._id);
        $("input[name=nominal]").val(this.props.jatah.nominal);
        $("input[name=keterangan]").val(this.props.jatah.keterangan);
    }

    render() {
        return (
            <span
                className="fa fa-pencil center-block text-center"
                onClick={this.showJatah.bind(this)}
            />
        );
    }
}

class DisplayData extends Component {
    constructor(props) {
        super(props);
    }

    resetForm(target) {
        target._id.value = "";
        target.nominal.value = "";
        target.keterangan.value = "";
    }

    handleSubmit(event) {
        event.preventDefault();
        let target = event.target;
        if (target._id.value !== "") {
            Meteor.call(
                "jatah.update",
                target._id.value,
                Number.parseInt(target.nominal.value),
                target.keterangan.value
            );
        } else {
            Meteor.call(
                "jatah.insert",
                Number.parseInt(target.nominal.value),
                target.keterangan.value
            );
        }
        this.resetForm(target);
    }

    render() {
        const columns = [
            {
                Header: "No.",
                filterable: false,
                id: "row",
                Cell: (row) => {
                    return <span className="text-center">{row.index + 1}</span>
                },
                minWidth: 50
            },
            {Header: "Nominal", accessor: "nominal"},
            {Header: "Keterangan", accessor: "keterangan"},
            {
                Header: "Hapus",
                filterable: false,
                sortable: false,
                Cell: props => <CellDelete jatah={props.original}/>,
                minWidth: 50
            },
            {
                Header: "Edit",
                filterable: false,
                sortable: false,
                Cell: props => <CellEdit jatah={props.original}/>,
                minWidth: 50
            }
        ];
        return (
            <aside className="right-side">
                <section className="content-header">
                    <h1>
                        Jatah
                        <small>Data Master</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li>
                            <a href="#">
                                <i className="fa fa-th"/> Home
                            </a>
                        </li>
                        <li>Data Master</li>
                        <li className="active">Jatah</li>
                    </ol>
                </section>

                <section className="content">
                    <div className="row">
                        <div className="col-md-7">
                            <div className="alert-place"/>
                            <div className="box box-primary">
                                <div className="box-header">
                                    <h3 className="box-title">Data Jatah</h3>
                                    <div className="pull-right box-tools"/>
                                </div>
                                <div className="box-body table-responsive">
                                    <ReactTable
                                        data={this.props.jatah}
                                        columns={columns}
                                        previousText="Sebelumnya"
                                        nextText="Selanjutnya"
                                        loadingText="Sedang memuat...."
                                        noDataText="Tidak ada data"
                                        pageText="Halaman"
                                        ofText="dari"
                                        rowsText="baris"
                                        filterable={true}
                                        defaultFilterMethod={(filter, row, column) => {
                                            const id = filter.pivotId || filter.id;
                                            return row[id] !== undefined
                                                ? String(row[id]).includes(filter.value)
                                                : true;
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="alert-place"/>
                            <div className="box box-success">
                                <div className="box-header">
                                    <h3 className="box-title">Input Data Jatah</h3>
                                    <div className="pull-right box-tools"/>
                                </div>
                                <div className="box-body">
                                    <form
                                        className="form form-jatah"
                                        role="form"
                                        onSubmit={this.handleSubmit.bind(this)}
                                    >
                                        <div className="form-group">
                                            <label>Nominal</label>
                                            <input
                                                type="number"
                                                name="nominal"
                                                ref="nominal"
                                                className="form-control"
                                                placeholder="Masukkan Nominal"
                                                required
                                            />
                                            <input type="hidden" name="_id" ref="_id" value=""/>
                                        </div>
                                        <div className="form-group">
                                            <label>Keterangan</label>
                                            <input
                                                type="text"
                                                name="keterangan"
                                                ref="keterangan"
                                                className="form-control"
                                                placeholder="Masukkan Keterangan"
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary btn-block">
                                            S I M P A N
                                        </button>
                                        <button type="reset" className="btn btn-warning btn-block">
                                            KOSONGKAN FORM
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </aside>
        );
    }
}

class Jatah extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var pengguna = "Pengguna";
        if (this.props.currentUser) {
            pengguna = this.props.currentUser.profile.nama;
        }

        return (
            <div className="body">
                <Header nama={pengguna}/>
                <div className="wrapper row-offcanvas row-offcanvas-left">
                    <Sidemenu activeMenu="data-master" nama={pengguna}/>
                    <DisplayData jatah={this.props.jatah}/>
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe("jatah");

    return {
        jatah: MJatah.find({}, {sort: {createdAt: -1}}).fetch(),
        currentUser: Meteor.user()
    };
})(Jatah);
