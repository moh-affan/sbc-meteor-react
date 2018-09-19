import {Meteor} from "meteor/meteor";
import React, {Component} from "react";
import {withTracker} from "meteor/react-meteor-data";
import Header from "../../containers/Header";
import Sidemenu from "../../containers/Sidemenu";
import swal from "sweetalert";
import "react-table/react-table.css";
import Select from "react-select";

import {MProduk} from "../../../api/produk";
import {MSupplier} from "../../../api/supplier";
import {MDiskon} from "../../../api/diskon";


class DisplayData extends Component {
    constructor(props) {
        super(props);
        this.state = {produk: null, supplier: null, diskon: null};
    }

    resetForm(event) {
        this.setState({
            produk: null,
            supplier: null,
            diskon: null,
        });
        try {
            event.target.pid.value = "";
            event.target.nama.value = "";
            event.target.hargaJual.value = "";
            event.target.hargaBeli.value = "";
        } catch (ex) {
            //
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.supplier == null)
            swal({
                text: "Supplier harus diisi",
                dangerMode: true,
                timer: 1000
            });
        let target = event.target;
        if (this.state.idProduk !== "") {
            Meteor.call(
                "produk.update",
                this.state.idProduk,
                target.pid.value,
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
                target.pid.value,
                target.nama.value,
                this.state.kategori.label,
                this.state.supplier ? this.state.supplier.obj : null,
                target.hargaJual.value,
                target.hargaBeli.value,
                this.state.diskon ? this.state.diskon.obj : null
            );
        }
        this.resetForm(event);
    }

    handleSupplierChange = (newValue, actionMeta) => {
        this.setState({
            supplier: newValue
        });
    };
    handleProdukChange = (newValue, actionMeta) => {
        this.setState({
            produk: newValue
        });
    };

    handleDiskonChange = (newValue, actionMeta) => {
        this.setState({
            diskon: newValue
        });
    };

    render() {
        return (
            <aside className="right-side">
                <section className="content-header">
                    <h1>
                        Pembelian Produk
                        <small>Transaksi</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li>
                            <a href="#">
                                <i className="fa fa-th"/> Home
                            </a>
                        </li>
                        <li>Transaksi</li>
                        <li className="active">Pembelian Produk</li>
                    </ol>
                </section>

                <section className="content">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="alert-place"/>

                            <div className="box box-primary">
                                <div className="box-header">
                                    <h3 className="box-title">Pembelian Produk</h3>
                                </div>
                                <div className="box-body">
                                    <form
                                        className="form form-pembelian-produk"
                                        role="form"
                                        onSubmit={this.handleSubmit.bind(this)}>
                                        <div className="col-md-6">
                                            <div className="form-horizontal">
                                                <div className="form-group-sm">
                                                    <label htmlFor='pegawai'
                                                           className='col-md-4 control-label'>Petugas</label>
                                                    <div className="col-md-6">
                                                        <p className="form-control disabled"
                                                           id="pegawai">Nama Petugas Disini</p>
                                                        <input type="hidden" name="_id" ref="_id" value=""/>
                                                        <input type="hidden" name="pegawai" ref="pegawai" value=""/>
                                                    </div>
                                                </div>
                                                <div className="form-group-sm">
                                                    <label htmlFor='tgl'
                                                           className='col-md-4 control-label'>Tanggal</label>
                                                    <div className="col-md-6">
                                                        <p className="form-control realtime disabled">Tanggal Realtime
                                                            di
                                                            sini</p>
                                                        <input type="hidden" name="tgl" ref="tgl" value=""/>
                                                    </div>
                                                </div>
                                                <div className="form-group-sm">
                                                    <label htmlFor='supplier'
                                                           className='col-md-4 control-label'>Supplier</label>
                                                    <div className="col-md-6">
                                                        <Select
                                                            required
                                                            isClearable
                                                            placeholder="Masukkan Supplier"
                                                            value={this.state.supplier}
                                                            onChange={this.handleSupplierChange}
                                                            options={this.props.supplier}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-horizontal">
                                                <div className="form-group-sm">
                                                    <label htmlFor='id' className='col-md-4 control-label'>No
                                                        Transaksi</label>
                                                    <div className="col-md-6">
                                                        <p className="form-control disabled"
                                                           id="id">{this.props.last_id}</p>
                                                        <input type="hidden" name="id" ref="id"
                                                               value={this.props.last_id}/>
                                                    </div>
                                                </div>
                                                <div className="form-group-sm">
                                                    <label htmlFor='no_nota' className='col-md-4 control-label'>No Nota
                                                        Pembelian</label>
                                                    <div className="col-md-6">
                                                        <input
                                                            type="text"
                                                            name="no_nota"
                                                            ref="no_nota"
                                                            className="form-control"
                                                            placeholder="Isi jika ada"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div style={{padding: "10px 0",marginBottom: 10}}>
                                                <div className="form-inline">
                                                    <div className="form-group-sm">
                                                        <label htmlFor='produk' className="col-md-2 control-label text-right">Produk</label>
                                                        <div className="col-md-6">
                                                            <Select
                                                                required
                                                                isClearable
                                                                placeholder="Masukkan Produk"
                                                                value={this.state.produk}
                                                                onChange={this.handleProdukChange}
                                                                options={this.props.produk}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group-sm">
                                                        <label htmlFor='jumlah' className="col-md-1 control-label">Jumlah</label>
                                                        <div className="col-md-1">
                                                            <input
                                                                type="number"
                                                                name="jumlah"
                                                                ref="jumlah"
                                                                className="form-control"
                                                                value="0"
                                                                required
                                                                style={{width:100}}
                                                            />
                                                        </div>
                                                        <div className="col-md-1">
                                                            <button type="submit" className="btn btn-primary pull-right">
                                                                <span className="fa fa-plus"/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="clearfix"/>
                                        </div>
                                        <br/>
                                        <div className="col-md-12">&nbsp;</div>
                                        <div className="col-md-3">&nbsp;</div>
                                        <div className="col-md-6">
                                            <table className="table table-bordered table-hover datatable">
                                                <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Produk</th>
                                                    <th>Jumlah</th>
                                                    <th className="hidden-print">Hapus</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                                <tfoot>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Produk</th>
                                                    <th>Jumlah</th>
                                                    <th className="hidden-print">Hapus</th>
                                                </tr>
                                                <tr>
                                                    <th colSpan="4" className="text-right">
                                                        <img className="ajax-loader hide"
                                                             src="{{asset('img/ajax-loader.gif')}}" width="30"/>
                                                        <button className="btn btn-success simpan"
                                                                type="button">Simpan
                                                        </button>
                                                    </th>
                                                </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                        <div className="col-md-3">&nbsp;</div>
                                    </form>
                                    <div className="clearfix"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </aside>
        );
    }
}

class PembelianProduk extends Component {
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
    Meteor.subscribe("supplier");
    Meteor.subscribe("diskon");
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
    const produks = MProduk.find().fetch();
    const selectForProduks = produks.map((j, i) => ({
        value: j.nama,
        label: j.nama+" | "+j.id,
        obj: j
    }));

    return {
        produk: selectForProduks,
        supplier: selectForSups,
        diskon: selectForDiskons,
        currentUser: Meteor.user()
    };
})(PembelianProduk);
