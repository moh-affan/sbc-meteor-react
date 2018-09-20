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


class DeleteRow extends Component {
    constructor(props) {
        super(props);
    }

    onClickDelete(event) {
        let id = event.target.id;
        let idx = Number.parseInt(id.split('-', 2)[1]);
        if (typeof this.props.onDeleteCallback === "function") {
            this.props.onDeleteCallback(idx);
        }
    }

    render() {
        return (
            <div className="label label-warning" onClick={this.onClickDelete.bind(this)}>
                <span className="fa fa-trash-o"/>
            </div>
        )
    }
}

class DisplayRow extends Component {
    constructor(props) {
        super(props);
        this.state = {isJmlEditing: false};
        this.updateChart.bind(this);
    }

    toggleEditing() {
        this.setState({
            isJmlEditing: !this.state.isJmlEditing
        });
    }

    updateChart(event) {
        let id = event.target.id;
        let qty = Number.parseInt(event.target.textContent);
        let idx = Number.parseInt(id.split('-', 2)[1]);
        if (typeof this.props.onAfterEditCallback === "function") {
            this.props.onAfterEditCallback(idx, qty);
        }
        this.toggleEditing();
    }

    renderRow() {
        return this.props.data.map((itm, i) => {
            return (
                <tr key={i}>
                    <td>{itm.item.id}</td>
                    <td>{itm.item.nama}</td>
                    <td>{itm.item.hargaJual}</td>
                    {!this.state.isJmlEditing ?
                        <td onDoubleClick={this.toggleEditing.bind(this)}>{itm.qty}</td> : <td>
                            <div contentEditable="true" id={"index-" + i} className="form-control"
                                 onBlur={this.updateChart.bind(this)}>{itm.qty}</div>
                        </td>}
                    <td>{itm.item.hargaJual * itm.qty}</td>
                    <td><DeleteRow onDeleteCallback={this.props.onChartItemDelete}/></td>
                </tr>
            );
        });
    }

    renderNothing() {
        return (
            <tr>
                <td colSpan="4">
                    <span className="text-center">Tidak ada data</span>
                </td>
            </tr>
        )
    }

    isChartNotEmpty() {
        return Array.isArray(this.props.data) && this.props.data.length > 0
    }

    render() {
        return (
            <tbody>
            {this.isChartNotEmpty() ?
                this.renderRow() : this.renderNothing()}
            </tbody>
        )
    }
}

class DisplayData extends Component {
    constructor(props) {
        super(props);
        let dt = new Date();
        let last_id = dt.getFullYear() + "" + (dt.getMonth() + 1) + "" + dt.getDate() + dt.getMilliseconds();
        this.state = {
            produk: null,
            supplier: null,
            selectProduk: [],
            last_id: last_id.toString(),
            tglTransaksi: new Date(),
            chart: [],
            qty: 0,
            total: 0,
            idTransaksi: ""
        };
        if (this.props.last_id != null)
            this.setState({
                last_id: this.props.last_id
            });
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                tglTransaksi: new Date()
            })
        }, 1000);
    }

    resetProdukInput() {
        this.setState({
            produk: null,
            qty: 0
        });
    }

    addToChart() {
        this.setState({
            chart: this.state.chart.concat([{item: this.state.produk.obj, qty: this.state.qty}])
        });
        this.resetProdukInput();
    }

    onAfterEdit(idx, qty) {
        this.state.chart[idx].qty = qty;
    }

    onChartItemDelete(idx) {
        swal({
            title: "Are you sure?",
            text: "Apa Anda yakin ingin menghapus item ini dari chart ?",
            icon: "warning",
            dangerMode: true
        }).then(willDelete => {
            if (willDelete) {
                this.state.chart.splice(idx, 1);
            }
        });
    }

    resetForm(event) {
        let dt = new Date();
        let last_id = dt.getFullYear() + "" + (dt.getMonth() + 1) + "" + dt.getDate() + dt.getMilliseconds();
        this.setState({
            produk: null,
            supplier: null,
            selectProduk: [],
            last_id: last_id.toString(),
            tglTransaksi: new Date(),
            chart: [],
            qty: 0,
            idTransaksi: ""
        });
        try {
            event.target.no_nota.value = "";
            $("#kembalian").val("");
            $("#bayar").val("");
        } catch (ex) {
            //
        }
    }

    handleJumlahChange(event) {
        this.setState({
            qty: Number.parseInt(event.target.value)
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.supplier == null)
            swal({
                text: "Supplier harus diisi",
                dangerMode: true,
                timer: 1000
            });
        if (this.state.chart.length <= 0)
            swal({
                text: "Tidak ada produk dalam daftar",
                dangerMode: true,
                timer: 1000
            });
        let target = event.target;
        if (this.state.idTransaksi !== "") {
            Meteor.call(
                "pembelianProduk.update",
                this.state.idTransaksi,
                this.state.tglTransaksi,
                target.no_nota.value,
                this.state.supplier ? this.state.supplier.obj : null,
                "-",
                this.calculateSummary(),
                this.state.chart
            );
        } else {
            Meteor.call(
                "pembelianProduk.insert",
                this.state.last_id,
                this.state.tglTransaksi,
                target.no_nota.value,
                this.state.supplier ? this.state.supplier.obj : null,
                "-",
                this.calculateSummary(),
                this.state.chart
            );
        }
        this.resetForm(event);
    }

    getProductsBySupplier(idSupplier) {
        let prod = MProduk.find({"supplier._id": idSupplier}).fetch();
        return prod.map((j, i) => ({
            value: j.nama,
            label: j.nama + " | " + j.id,
            obj: j
        }));
    }

    handleSupplierChange = (newValue, actionMeta) => {
        let prods = newValue !== null ? this.getProductsBySupplier(newValue.obj._id) : [];
        this.setState({
            supplier: newValue,
            selectProduk: prods
        });
    };
    handleProdukChange = (newValue, actionMeta) => {
        this.setState({
            produk: newValue
        });
    };

    calculateSummary() {
        var total = 0;
        this.state.chart.forEach(function (item, index) {
            total += (item.qty * item.item.hargaJual);
        });
        return total;
    }

    calculateReturn() {
        var inp = Number.parseInt($("#bayar").val());
        var ret = inp - this.calculateSummary();
        ret = ret < 0 ? 0 : ret;
        $("#kembalian").val(ret);
    }

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
                                                           id="pegawai">{this.props.pegawai.nama}</p>
                                                        <input type="hidden" name="_id" ref="_id" value=""/>
                                                        <input type="hidden" name="pegawai" ref="pegawai"
                                                               value={this.props.pegawai.id}/>
                                                    </div>
                                                </div>
                                                <div className="form-group-sm">
                                                    <label htmlFor='tgl'
                                                           className='col-md-4 control-label'>Tanggal</label>
                                                    <div className="col-md-6">
                                                        <p className="form-control realtime disabled">{this.state.tglTransaksi.toLocaleString()}</p>
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
                                                           id="id">{this.state.last_id}</p>
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
                                            <div style={{padding: "10px 0", marginBottom: 10}}>
                                                <div className="form-inline">
                                                    <div className="form-group-sm">
                                                        <label htmlFor='produk'
                                                               className="col-md-2 control-label text-right">Produk</label>
                                                        <div className="col-md-6">
                                                            <Select
                                                                required
                                                                isClearable
                                                                placeholder="Masukkan Produk"
                                                                value={this.state.produk}
                                                                onChange={this.handleProdukChange}
                                                                options={this.state.selectProduk}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group-sm">
                                                        <label htmlFor='jumlah'
                                                               className="col-md-1 control-label">Jumlah</label>
                                                        <div className="col-md-1">
                                                            <input
                                                                type="number"
                                                                name="jumlah"
                                                                className="form-control"
                                                                required
                                                                style={{width: 100}}
                                                                value={this.state.qty}
                                                                onChange={this.handleJumlahChange.bind(this)}
                                                            />
                                                        </div>
                                                        <div className="col-md-1">
                                                            <button type="button"
                                                                    className="btn btn-primary pull-right"
                                                                    onClick={this.addToChart.bind(this)}>
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
                                        <div className="col-md-1">&nbsp;</div>
                                        <div className="col-md-10">
                                            <table className="table table-bordered table-hover datatable">
                                                <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Produk</th>
                                                    <th>Harga</th>
                                                    <th>Jumlah</th>
                                                    <th>Subtotal</th>
                                                    <th className="hidden-print">Hapus</th>
                                                </tr>
                                                </thead>
                                                <DisplayRow data={this.state.chart}
                                                            onAfterEditCallback={this.onAfterEdit.bind(this)}
                                                            onChartItemDelete={this.onChartItemDelete.bind(this)}/>
                                                <tfoot>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Produk</th>
                                                    <th>Harga</th>
                                                    <th>Jumlah</th>
                                                    <th>Subtotal</th>
                                                    <th className="hidden-print">Hapus</th>
                                                </tr>
                                                <tr>
                                                    <th>&nbsp;</th>
                                                    <th><span
                                                        style={{textStyle: 'bold'}}>Total : Rp. {this.calculateSummary()}</span>
                                                    </th>
                                                    <th>
                                                        <label htmlFor='bayar' className='control-label'>Bayar :</label>
                                                        <input
                                                            onChange={this.calculateReturn.bind(this)}
                                                            type="text"
                                                            name="bayar"
                                                            id="bayar"
                                                            className="form-control"
                                                            style={{width: 100}}
                                                        />
                                                    </th>
                                                    <th>
                                                        <label htmlFor='kembalian' className='control-label'>Kembalian
                                                            :</label>
                                                        <input
                                                            readOnly={true}
                                                            type="text"
                                                            id="kembalian"
                                                            name="kembalian"
                                                            className="form-control"
                                                            style={{width: 100}}
                                                        />
                                                    </th>
                                                    <th colSpan="2" className="text-right">
                                                        <img className="ajax-loader hide"
                                                             src="/images/ajax-loader.gif" width="30"/>
                                                        <button className="btn btn-success simpan"
                                                                type="submit">Simpan
                                                        </button>
                                                    </th>
                                                </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                        <div className="col-md-1">&nbsp;</div>
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
        var pegawai = {};
        if (this.props.currentUser) {
            pengguna = this.props.currentUser.profile.nama;
            pegawai = this.props.currentUser.profile;
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
                        pegawai={pegawai}
                    />
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe("produk");
    Meteor.subscribe("supplier");
    const sups = MSupplier.find().fetch();
    const selectForSups = sups.map((j, i) => ({
        value: j.nama,
        label: j.nama,
        obj: j
    }));
    const produks = MProduk.find().fetch();
    const selectForProduks = produks.map((j, i) => ({
        value: j.nama,
        label: j.nama + " | " + j.id,
        obj: j
    }));

    return {
        produk: selectForProduks,
        supplier: selectForSups,
        currentUser: Meteor.user()
    };
})(PembelianProduk);