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

import {MTreatment} from "../../api/treatment";
import {MKategori} from "../../api/kategori";
import {MSupplier} from "../../api/supplier";
import {MDiskon} from "../../api/diskon";

class CellDelete extends Component {
    constructor(props) {
        super(props);
    }

    removeTreatment() {
        swal({
            title: "Are you sure?",
            text: "Apa Anda yakin ingin menghapus ?",
            icon: "warning",
            dangerMode: true
        }).then(willDelete => {
            if (willDelete) {
                Meteor.call("treatment.remove", this.props.treatment._id);
                swal("Dihapus!", "Data berhasil dihapus!", "success");
            }
        });
    }

    render() {
        return (
            <span
                className="fa fa-trash-o center-block text-center"
                onClick={this.removeTreatment.bind(this)}
            />
        );
    }
}

class CellEdit extends Component {
    constructor(props) {
        super(props);
    }

    showTreatment() {
        if (typeof this.props.onEditCallback === "function") {
            this.props.onEditCallback(this.props.treatment);
        }
    }

    render() {
        return (
            <span
                className="fa fa-pencil center-block text-center"
                onClick={this.showTreatment.bind(this)}
            />
        );
    }
}

class DisplayData extends Component {
    constructor(props) {
        super(props);
        this.state = {kategori: null, supplier: null, diskon: null, idTreatment: ""};
    }

    resetForm(event) {
        this.setState({
            kategori: null,
            supplier: null,
            diskon: null,
            idTreatment: ""
        });
        try {
            event.target.pid.value = "";
            event.target.nama.value = "";
            event.target.hargaJual.value = "";
            event.target.hargaBeli.value = "";
            event.target.penyusutan.value = "";
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
        if (this.state.supplier == null)
            swal({
                text: "Supplier harus diisi",
                dangerMode: true,
                timer: 1000
            });
        let target = event.target;
        if (this.state.idTreatment !== "") {
            Meteor.call(
                "treatment.update",
                this.state.idTreatment,
                target.pid.value,
                target.nama.value,
                this.state.kategori.label,
                this.state.supplier ? this.state.supplier.obj : null,
                target.hargaJual.value,
                target.hargaBeli.value,
                this.state.diskon ? this.state.diskon.obj : null,
                Number.parseInt(target.penyusutan.value)
            );
        } else {
            Meteor.call(
                "treatment.insert",
                target.pid.value,
                target.nama.value,
                this.state.kategori.label,
                this.state.supplier ? this.state.supplier.obj : null,
                target.hargaJual.value,
                target.hargaBeli.value,
                this.state.diskon ? this.state.diskon.obj : null,
                Number.parseInt(target.penyusutan.value)
            );
        }
        // target.reset();
        this.resetForm(event);
    }

    handleKategoriChange = (newValue, actionMeta) => {
        if (actionMeta.action === "select-option") {
            console.log(actionMeta);
        } else if (actionMeta.action === "create-option") {
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

    showDataTreatment(treatment) {
        this.setState({idTreatment: treatment._id});
        $("input[name=pid]").val(treatment.id);
        $("input[name=nama]").val(treatment.nama);
        this.setState({
            kategori: {value: treatment.kategori, label: treatment.kategori},
            supplier: {
                value: treatment.supplier.nama,
                label: treatment.supplier.nama,
                obj: treatment.supplier
            },
            diskon: treatment.diskon !== null ? {
                value: treatment.diskon.nama,
                label: treatment.diskon.nama,
                obj: treatment.diskon
            } : null
        });
        $("input[name=hargaJual]").val(treatment.hargaJual);
        $("input[name=hargaBeli]").val(treatment.hargaBeli);
        $("input[name=penyusutan]").val(treatment.penyusutan);
    }

    render() {
        const columns = [
            {
                Header: <span
                    className="fa fa-trash-o center-block text-center text-danger"
                />,
                filterable: false,
                sortable: false,
                Cell: props => <CellDelete treatment={props.original}/>,
                minWidth: 30
            },
            {
                Header: <span
                    className="fa fa-pencil center-block text-center text-primary"
                />,
                filterable: false,
                sortable: false,
                Cell: props => (
                    <CellEdit
                        treatment={props.original}
                        onEditCallback={this.showDataTreatment.bind(this)}
                    />
                ),
                minWidth: 30
            },
            {Header: "ID", accessor: "id"},
            {Header: "Nama", accessor: "nama"},
            {Header: "Kategori", accessor: "kategori"},
            {Header: "Supplier", accessor: "supplier.nama"},
            {Header: "Harga Jual", accessor: "hargaJual"},
            {Header: "Harga Beli", accessor: "hargaBeli"},
            {Header: "Penyusutan", accessor: "penyusutan"},
            {Header: "Diskon", accessor: "diskon.nama"}
        ];

        return (
            <aside className="right-side">
                <section className="content-header">
                    <h1>
                        Treatment
                        <small>Data Master</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li>
                            <a href="#">
                                <i className="fa fa-th"/> Home
                            </a>
                        </li>
                        <li>Data Master</li>
                        <li className="active">Treatment</li>
                    </ol>
                </section>

                <section className="content">
                    <div className="row">
                        <div className="col-md-7">
                            <div className="alert-place"/>
                            <div className="box box-primary">
                                <div className="box-header">
                                    <h3 className="box-title">Data Treatment</h3>
                                    <div className="pull-right box-tools"/>
                                </div>
                                <div className="box-body table-responsive">
                                    <ReactTable
                                        data={this.props.treatment}
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
                                    <h3 className="box-title">Input Data Treatment</h3>
                                    <div className="pull-right box-tools"/>
                                </div>
                                <div className="box-body">
                                    <form
                                        className="form form-treatment"
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
                                            <label>Penyusutan</label>
                                            <input
                                                type="number"
                                                name="penyusutan"
                                                ref="penyusutan"
                                                className="form-control"
                                                placeholder="Masukkan Penyusutan"
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

class Treatment extends Component {
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
                        treatment={this.props.treatment}
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
    Meteor.subscribe("treatment");
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
        treatment: MTreatment.find({}, {sort: {createdAt: -1}}).fetch(),
        kategori: selectForKats,
        supplier: selectForSups,
        diskon: selectForDiskons,
        currentUser: Meteor.user()
    };
})(Treatment);
