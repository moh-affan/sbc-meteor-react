import {Meteor} from "meteor/meteor";
import React, {Component} from "react";
import {withTracker} from "meteor/react-meteor-data";
import Header from "../containers/Header";
import Sidemenu from "../containers/Sidemenu";
import swal from "sweetalert";
import ReactTable from "react-table";
import "react-table/react-table.css";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {MPelanggan} from "../../api/pelanggan";

class CellDelete extends Component {
    constructor(props) {
        super(props);
    }

    removePelanggan() {
        swal({
            title: "Are you sure?",
            text: "Apa Anda yakin ingin menghapus ?",
            icon: "warning",
            dangerMode: true
        }).then(willDelete => {
            if (willDelete) {
                Meteor.call("pelanggan.remove", this.props.pelanggan._id);
                swal("Dihapus!", "Data berhasil dihapus!", "success");
            }
        });
    }

    render() {
        return (
            <span
                className="fa fa-trash-o center-block text-center"
                onClick={this.removePelanggan.bind(this)}
            />
        );
    }
}

class CellEdit extends Component {
    constructor(props) {
        super(props);
    }

    showPelanggan() {
        $("input[name=_id]").val(this.props.pelanggan._id);
        $("input[name=id]").val(this.props.pelanggan.id);
        $("input[name=nama]").val(this.props.pelanggan.nama);
        $("input[name=tglLahir]").val(this.props.pelanggan.tglLahir);
        $("input[name=telp]").val(this.props.pelanggan.telp);
        $("input[name=alamat]").val(this.props.pelanggan.alamat);
    }

    render() {
        return (
            <span
                className="fa fa-pencil center-block text-center"
                onClick={this.showPelanggan.bind(this)}
            />
        );
    }
}

class DisplayData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment()
        };
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    renderPelanggan() {
        return this.props.pelanggan.map(p => {
            return <RowData key={p.id} pelanggan={p}/>;
        });
    }

    resetForm(target) {
        target._id.value = "";
        target.id.value = "";
        target.nama.value = "";
        target.tglLahir.value = "";
        target.telp.value = "";
        target.alamat.value = "";
    }

    handleDateChange(arg) {
        this.setState({
            startDate: arg
        });
        console.log(arg.toString());
        // $("input[name=tglLahir]").val(arg.toString());
    }

    handleSubmit(event) {
        event.preventDefault();
        let target = event.target;
        if (target._id.value != "") {
            Meteor.call(
                "pelanggan.update",
                target._id.value,
                target.id.value,
                target.nama.value,
                target.telp.value,
                target.alamat.value,
                target.tglLahir.value
            );
        } else {
            Meteor.call(
                "pelanggan.insert",
                target.id.value,
                target.nama.value,
                target.telp.value,
                target.alamat.value,
                target.tglLahir.value
            );
        }
        // target.reset();
        this.resetForm(target);
    }

    render() {
        const columns = [
            {Header: "ID", accessor: "id"},
            {Header: "Nama", accessor: "nama"},
            {Header: "Telepon", accessor: "telp"},
            {Header: "Alamat", accessor: "alamat"},
            {Header: "Tanggal Lahir", accessor: "tglLahir"},
            {
                Header: "Hapus",
                filterable: false,
                sortable: false,
                Cell: props => <CellDelete pelanggan={props.original}/>,
                minWidth: 50
            },
            {
                Header: "Edit",
                filterable: false,
                sortable: false,
                Cell: props => <CellEdit pelanggan={props.original}/>,
                minWidth: 50
            }
        ];
        return (
            <aside className="right-side">
                <section className="content-header">
                    <h1>
                        Pelanggan
                        <small>Data Master</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li>
                            <a href="#">
                                <i className="fa fa-th"/> Home
                            </a>
                        </li>
                        <li>Data Master</li>
                        <li className="active">Pelanggan</li>
                    </ol>
                </section>

                <section className="content">
                    <div className="row">
                        <div className="col-md-7">
                            <div className="alert-place"/>
                            <div className="box box-primary">
                                <div className="box-header">
                                    <h3 className="box-title">Data Pelanggan</h3>
                                    <div className="pull-right box-tools"/>
                                </div>
                                <div className="box-body table-responsive">
                                    <ReactTable
                                        data={this.props.pelanggan}
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
                                    // resolveData = {data => data.map(row => row)}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="alert-place"/>
                            <div className="box box-success">
                                <div className="box-header">
                                    <h3 className="box-title">Input Data Pelanggan</h3>
                                    <div className="pull-right box-tools"/>
                                </div>
                                <div className="box-body">
                                    <form
                                        className="form form-pelanggan"
                                        role="form"
                                        onSubmit={this.handleSubmit.bind(this)}
                                    >
                                        <div className="form-group">
                                            <label>ID</label>
                                            <input
                                                type="text"
                                                name="id"
                                                ref="id"
                                                className="form-control"
                                                placeholder="Masukkan ID"
                                                required
                                            />
                                            <input type="hidden" name="_id" ref="_id" value=""/>
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
                                            <label>Tanggal Lahir</label>
                                            <DatePicker
                                                name="tglLahir"
                                                className="form-control"
                                                locale="ID-id"
                                                showYearDropdown
                                                showMonthDropdown
                                                isClearable={false}
                                                dropdownMode="select"
                                                onChange={this.handleDateChange}
                                                placeholderText="Tanggal lahir"
                                                dateFormat="DD-MM-YYYY"
                                                selected={this.state.startDate}
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

class Pelanggan extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var pengguna = "Pengguna";
        if (this.props.currentUser) {
            pengguna = this.props.currentUser.emails[0].address;
        }

        return (
            <div className="body">
                <Header nama={pengguna}/>
                <div className="wrapper row-offcanvas row-offcanvas-left">
                    <Sidemenu activeMenu="data-master" nama={pengguna}/>
                    <DisplayData pelanggan={this.props.pelanggan}/>
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe("pelanggan");

    return {
        pelanggan: MPelanggan.find({}, {sort: {createdAt: -1}}).fetch(),
        currentUser: Meteor.user()
    };
})(Pelanggan);
