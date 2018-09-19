import {Meteor} from "meteor/meteor";
import React, {Component} from "react";
import {withTracker} from "meteor/react-meteor-data";
import Header from "../containers/Header";
import Sidemenu from "../containers/Sidemenu";
import swal from "sweetalert";
import ReactTable from "react-table";
import "react-table/react-table.css";
import CreatableSelect from "react-select/lib/Creatable";

import {MPegawai} from "../../api/pegawai";
import {MJabatan} from "../../api/jabatan";

class CellDelete extends Component {
    constructor(props) {
        super(props);
    }

    removePegawai() {
        swal({
            title: "Are you sure?",
            text: "Apa Anda yakin ingin menghapus ?",
            icon: "warning",
            dangerMode: true
        }).then(willDelete => {
            if (willDelete) {
                Meteor.call("pegawai.remove", this.props.pegawai._id);
                swal("Dihapus!", "Data berhasil dihapus!", "success");
            }
        });
    }

    render() {
        return (
            <span
                className="fa fa-trash-o center-block text-center"
                onClick={this.removePegawai.bind(this)}
            />
        );
    }
}

class CellEdit extends Component {
    constructor(props) {
        super(props);
    }

    showPegawai() {
        if (typeof this.props.onEditCallback == "function") {
            this.props.onEditCallback(this.props.pegawai);
        }
    }

    render() {
        return (
            <span
                className="fa fa-pencil center-block text-center"
                onClick={this.showPegawai.bind(this)}
            />
        );
    }
}

class DisplayData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jabatan: null,
            idPegawai: ""
        };
    }

    resetForm(target) {
        this.setState({idPegawai: ""});
        target.pid.value = "";
        target.nama.value = "";
        this.setState({
            jabatan: null
        });
        target.telp.value = "";
        target.alamat.value = "";
    }

    showDataPegawai(pegawai) {
        this.setState({idPegawai: pegawai._id});
        $("input[name=pid]").val(pegawai.id);
        $("input[name=nama]").val(pegawai.nama);
        this.setState({
            jabatan: {value: pegawai.jabatan, label: pegawai.jabatan}
        });
        $("input[name=telp]").val(pegawai.telp);
        $("input[name=alamat]").val(pegawai.alamat);
    }

    handleSubmit(event) {
        event.preventDefault();
        let target = event.target;
        if (this.state.idPegawai != "") {
            Meteor.call(
                "pegawai.update",
                this.state.idPegawai,
                target.pid.value,
                target.nama.value,
                this.state.jabatan.label,
                target.telp.value,
                target.alamat.value
            );
        } else {
            Meteor.call(
                "pegawai.insert",
                target.pid.value,
                target.nama.value,
                this.state.jabatan.label,
                target.telp.value,
                target.alamat.value
            );
        }
        this.resetForm(target);
    }

    handleChange = (newValue, actionMeta) => {
        if (actionMeta.action == "select-option") {
            console.log(actionMeta);
        } else if (actionMeta.action == "create-option") {
            Meteor.call("jabatan.insert", newValue.label);
        }
        newValue.label = s(newValue.label)
            .trim()
            .capitalize()
            .value();
        this.setState({
            jabatan: newValue
        });
    };

    render() {
        const columns = [
            {Header: "ID", accessor: "id"},
            {Header: "Nama", accessor: "nama"},
            {Header: "Jabatan", accessor: "jabatan"},
            {Header: "Telepon", accessor: "telp"},
            {Header: "Alamat", accessor: "alamat"},
            {
                Header: "Hapus",
                filterable: false,
                sortable: false,
                Cell: props => <CellDelete pegawai={props.original}/>,
                minWidth: 50
            },
            {
                Header: "Edit",
                filterable: false,
                sortable: false,
                Cell: props => (
                    <CellEdit
                        pegawai={props.original}
                        onEditCallback={this.showDataPegawai.bind(this)}
                    />
                ),
                minWidth: 50
            }
        ];
        // $("#react-select-2-input").attr("required", "required");
        const selectedJabatan = this.state.jabatan;
        return (
            <aside className="right-side">
                <section className="content-header">
                    <h1>
                        Pegawai
                        <small>Data Master</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li>
                            <a href="#">
                                <i className="fa fa-th"/> Home
                            </a>
                        </li>
                        <li>Data Master</li>
                        <li className="active">Pegawai</li>
                    </ol>
                </section>

                <section className="content">
                    <div className="row">
                        <div className="col-md-7">
                            <div className="alert-place"/>
                            <div className="box box-primary">
                                <div className="box-header">
                                    <h3 className="box-title">Data Pegawai</h3>
                                    <div className="pull-right box-tools"/>
                                </div>
                                <div className="box-body table-responsive">
                                    <ReactTable
                                        data={this.props.pegawai}
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
                                                ? String(row[id])
                                                    .toLowerCase()
                                                    .includes(filter.value.toLowerCase())
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
                                    <h3 className="box-title">Input Data Pegawai</h3>
                                    <div className="pull-right box-tools"/>
                                </div>
                                <div className="box-body">
                                    <form
                                        className="form form-pegawai"
                                        role="form"
                                        onSubmit={this.handleSubmit.bind(this)}
                                    >
                                        <div className="form-group">
                                            <label>ID</label>
                                            <input
                                                type="text"
                                                name="pid"
                                                ref="pid"
                                                className="form-control"
                                                placeholder="Masukkan ID"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nama</label>
                                            <input
                                                type="text"
                                                name="nama"
                                                ref="nama"
                                                className="form-control"
                                                placeholder="Masukkan Nama"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Jabatan</label>
                                            <CreatableSelect
                                                isClearable
                                                required
                                                placeholder="Masukkan Jabatan"
                                                onChange={this.handleChange}
                                                options={this.props.jabatan}
                                                value={selectedJabatan}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Telepon/HP</label>
                                            <input
                                                type="text"
                                                name="telp"
                                                ref="telp"
                                                className="form-control"
                                                placeholder="Masukkan No. Telepon/HP"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Alamat</label>
                                            <input
                                                type="text"
                                                name="alamat"
                                                ref="alamat"
                                                className="form-control"
                                                placeholder="Masukkan Alamat"
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

class Pegawai extends Component {
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
                    <DisplayData
                        pegawai={this.props.pegawai}
                        jabatan={this.props.jabatan}
                    />
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe("pegawai");
    Meteor.subscribe("jabatan");
    const jabs = MJabatan.find().fetch();
    const selectJabs = jabs.map((j, i) => ({
        value: j.nama,
        label: j.nama,
        obj: j
    }));
    return {
        pegawai: MPegawai.find({}, {sort: {createdAt: -1}}).fetch(),
        jabatan: selectJabs,
        currentUser: Meteor.user()
    };
})(Pegawai);
