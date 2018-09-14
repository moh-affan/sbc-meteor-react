import {Meteor} from "meteor/meteor";
import React, {Component} from "react";
import {withTracker} from "meteor/react-meteor-data";
import Header from "../containers/Header";
import Sidemenu from "../containers/Sidemenu";
import swal from "sweetalert";
import ReactTable from "react-table";
import "react-table/react-table.css";
import CreatableSelect from "react-select/lib/Creatable";
import Select from "react-select";

import {MProduk} from "../../api/produk";
import {MKategori} from "../../api/kategori";
import {MSupplier} from "../../api/supplier";
import {MDiskon} from "../../api/diskon";

class CellDelete extends Component {
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
                Meteor.call("produk.remove", this.props.produk._id);
                swal("Dihapus!", "Data berhasil dihapus!", "success");
            }
        });
    }

    render() {
        return (
            <span
                className="fa fa-trash-o center-block text-center"
                onClick={this.removeProduk.bind(this)}
            />
        );
    }
}

class CellEdit extends Component {
    constructor(props) {
        super(props);
    }

    showProduk() {
        if (typeof this.props.onEditCallback === "function") {
            this.props.onEditCallback(this.props.produk);
        }
    }

    render() {
        return (
            <span
                className="fa fa-pencil center-block text-center"
                onClick={this.showProduk.bind(this)}
            />
        );
    }
}

class DisplayData extends Component {
    constructor(props) {
        super(props);
        this.state = {kategori: null, supplier: null, diskon: null, idProduk: ""};
    }

    resetForm(event) {
        this.setState({
            kategori: null,
            supplier: null,
            diskon: null,
            idProduk: ""
        });
        try {
            event.target.id.value = "";
            event.target.nama.value = "";
            event.target.hargaJual.value = "";
            event.target.hargaBeli.value = "";
        } catch (ex) {
            //
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.kategori == null)
            swal({
                text: "Kategori harus diisi",
                dangerMode: true,
                timer: 1000
            });
        let target = event.target;
        if (target._id.value != "") {
            Meteor.call(
                "produk.update",
                this.state.idProduk,
                target.id.value,
                target.nama.value,
                this.state.kategori.label,
                this.state.supplier ? this.state.supplier.obj : null,
                target.hargaJual.value,
                target.hargaBeli.value,
                this.state.diskon ? this.state.diskon.obj : null
            );
        } else {
            Meteor.call(
                "produk.insert",
                target.id.value,
                target.nama.value,
                this.state.kategori.label,
                this.state.supplier ? this.state.supplier.obj : null,
                target.hargaJual.value,
                target.hargaBeli.value,
                this.state.diskon ? this.state.diskon.obj : null
            );
        }
        // target.reset();
        this.resetForm(event);
    }

    handleKategoriChange = (newValue, actionMeta) => {
        if (actionMeta.action == "select-option") {
            console.log(actionMeta);
        } else if (actionMeta.action == "create-option") {
            Meteor.call("kategori.insert", newValue.label);
        }
        newValue.label = s(newValue.label)
            .trim()
            .capitalize()
            .value();
        this.setState({
            kategori: newValue
        });
    };

    handleSupplierChange = (newValue, actionMeta) => {
        this.setState({
            supplier: newValue
        });
    };

    handleDiskonChange = (newValue, actionMeta) => {
        this.setState({
            diskon: newValue
        });
    };

    showDataProduk(produk) {
        this.setState({idProduk: produk._id});
        $("input[name=pid]").val(produk.id);
        $("input[name=nama]").val(produk.nama);
        this.setState({
            kategori: {value: produk.kategori, label: produk.kategori},
            supplier: {
                value: produk.supplier.nama,
                label: produk.supplier.nama,
                obj: produk.supplier
            },
            diskon: {
                value: produk.diskon.nama,
                label: produk.diskon.nama,
                obj: produk.diskon
            }
        });
        $("input[name=hargaJual]").val(produk.hargaJual);
        $("input[name=hargaBeli]").val(produk.hargaBeli);
    }

    render() {
        const columns = [
            {Header: "ID", accessor: "id"},
            {Header: "Nama", accessor: "nama"},
            {Header: "Kategori", accessor: "kategori"},
            {Header: "Supplier", accessor: "supplier.nama"},
            {Header: "Harga Jual", accessor: "hargaJual"},
            {Header: "Harga Beli", accessor: "hargaBeli"},
            {Header: "Diskon", accessor: "diskon.nama"},
            {
                Header: "Hapus",
                filterable: false,
                sortable: false,
                Cell: props => <CellDelete produk={props.original}/>,
                minWidth: 50
            },
            {
                Header: "Edit",
                filterable: false,
                sortable: false,
                Cell: props => (
                    <CellEdit
                        produk={props.original}
                        onEditCallback={this.showDataProduk.bind(this)}
                    />
                ),
                minWidth: 50
            }
        ];

        return (
            <aside className="right-side">
                <section className="content-header">
                    <h1>
                        Produk
                        <small>Data Master</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li>
                            <a href="#">
                                <i className="fa fa-th"/> Home
                            </a>
                        </li>
                        <li>Data Master</li>
                        <li className="active">Produk</li>
                    </ol>
                </section>

                <section className="content">
                    <div className="row">
                        <div className="col-md-7">
                            <div className="alert-place"/>
                            <div className="box box-primary">
                                <div className="box-header">
                                    <h3 className="box-title">Data Produk</h3>
                                    <div className="pull-right box-tools"/>
                                </div>
                                <div className="box-body table-responsive">
                                    <ReactTable
                                        data={this.props.produk}
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
                                    <h3 className="box-title">Input Data Produk</h3>
                                    <div className="pull-right box-tools"/>
                                </div>
                                <div className="box-body">
                                    <form
                                        className="form form-produk"
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
                                            <label>Kategori</label>
                                            <CreatableSelect
                                                isClearable
                                                required
                                                placeholder="Masukkan Kategori"
                                                value={this.state.kategori}
                                                onChange={this.handleKategoriChange}
                                                options={this.props.kategori}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Supplier</label>
                                            <Select
                                                required
                                                isClearable
                                                placeholder="Masukkan Supplier"
                                                value={this.state.supplier}
                                                onChange={this.handleSupplierChange}
                                                options={this.props.supplier}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Harga Jual</label>
                                            <input
                                                type="number"
                                                name="hargaJual"
                                                ref="hargaJual"
                                                className="form-control"
                                                placeholder="Masukkan Harga Jual"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Harga Beli</label>
                                            <input
                                                type="number"
                                                name="hargaBeli"
                                                ref="hargaBeli"
                                                className="form-control"
                                                placeholder="Masukkan Harga Beli"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Diskon</label>
                                            <Select
                                                required
                                                isClearable
                                                placeholder="Masukkan Diskon"
                                                value={this.state.diskon}
                                                onChange={this.handleDiskonChange}
                                                options={this.props.diskon}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary btn-block">
                                            S I M P A N
                                        </button>
                                        <button
                                            type="reset"
                                            className="btn btn-warning btn-block"
                                            onClick={this.resetForm.bind(this)}
                                        >
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

class Produk extends Component {
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
                    <DisplayData
                        produk={this.props.produk}
                        kategori={this.props.kategori}
                        supplier={this.props.supplier}
                        diskon={this.props.diskon}
                    />
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe("produk");
    Meteor.subscribe("kategori");
    Meteor.subscribe("supplier");
    Meteor.subscribe("diskon");
    const kats = MKategori.find().fetch();
    const selectForKats = kats.map((j, i) => ({
        value: j.nama,
        label: j.nama,
        obj: j
    }));
    const sups = MSupplier.find().fetch();
    const selectForSups = sups.map((j, i) => ({
        value: j.nama,
        label: j.nama,
        obj: j
    }));
    const diskons = MDiskon.find().fetch();
    const selectForDiskons = diskons.map((j, i) => ({
        value: j.nama,
        label: j.nama,
        obj: j
    }));
    return {
        produk: MProduk.find({}, {sort: {createdAt: -1}}).fetch(),
        kategori: selectForKats,
        supplier: selectForSups,
        diskon: selectForDiskons,
        currentUser: Meteor.user()
    };
})(Produk);
