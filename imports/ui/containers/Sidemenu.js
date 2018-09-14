import React, {Component} from 'react';

export default class Sidemenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="left-side sidebar-offcanvas">
                <section className="sidebar">
                    <div className="user-panel">
                        <div className="pull-left image">
                            <img src="/images/avatar3.png" className="img-circle" alt="User Image" />
                        </div>
                        <div className="pull-left info">
                            <p>Halo, {this.props.nama}</p>

                            <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
                        </div>
                    </div>
                    <div className="progress xs">
                        <div className="progress-bar progress-bar-light-blue" style={{ width: 100 + '%' }}></div>
                    </div>
                    <br />
                    <ul className="sidebar-menu">
                        <li className="dashboard">
                            <a href="/">
                                <i className="fa fa-dashboard"></i> <span>Dashboard</span>
                            </a>
                        </li>
                        <li className="treeview data-master">
                            <a href="#">
                                <i className="fa fa-th"></i>
                                <span>Data Master</span>
                                <i className="fa fa-angle-left pull-right"></i>
                            </a>
                            <ul className="treeview-menu">
                                <li className="pegawai"><a href="/pegawai"><i className="fa fa-angle-double-right"></i>Pegawai</a>
                                </li>
                                <li className="jabatan hidden"><a href="/jabatan"><i className="fa fa-angle-double-right"></i> Jabatan</a>
                                </li>
                                <li className="pelanggan"><a href="/pelanggan"><i className="fa fa-angle-double-right"></i>
                                    Pelanggan</a></li>
                                <li className="supplier"><a href="/supplier"><i className="fa fa-angle-double-right"></i>
                                    Supplier</a></li>
                                <li className="kategori hidden"><a href="/kategori"><i className="fa fa-angle-double-right"></i>
                                    Kategori</a></li>
                                <li className="diskon"><a href="/diskon"><i className="fa fa-angle-double-right"></i>
                                    Diskon</a></li>
                                <li className="produk"><a href="/produk"><i className="fa fa-angle-double-right"></i>
                                    Produk</a></li>
                                <li className="treatment"><a href="/treatment"><i className="fa fa-angle-double-right"></i>
                                    Treatment</a></li>
                                <li className="penyusutan"><a href="/penyusutan"><i className="fa fa-angle-double-right"></i>
                                    Penyusutan</a></li>
                                <li className="jatah"><a href="/jatah"><i className="fa fa-angle-double-right"></i> Jatah</a>
                                </li>
                            </ul>
                        </li>
                        <li className="treeview">
                            <a href="#">
                                <i className="ion ion-bag"></i>
                                <span>Transaksi</span>
                                <i className="fa fa-angle-left pull-right"></i>
                            </a>
                            <ul className="treeview-menu">
                                <li><a href="/transaksi/pembelian-produk"><i
                                    className="fa fa-angle-double-right"></i> Pembelian Produk</a></li>
                                <li><a href="/transaksi/penjualan-produk"><i
                                    className="fa fa-angle-double-right"></i> Penjualan Produk</a></li>
                                <li><a href="/transaksi/jatah-bon-produk"><i
                                    className="fa fa-angle-double-right"></i> Jatah Bon Produk</a></li>
                                <li><a href="/transaksi/pembelian-treatment"><i
                                    className="fa fa-angle-double-right"></i> Pembelian Treatment</a></li>
                                <li><a href="/transaksi/penjualan-treatment"><i
                                    className="fa fa-angle-double-right"></i> Penjualan Treatment</a></li>
                                <li><a href="/transaksi/jatah-bon-treatment"><i
                                    className="fa fa-angle-double-right"></i> Jatah Bon Treatment</a></li>
                            </ul>
                        </li>
                        <li className="treeview">
                            <a href="#">
                                <i className="fa fa-bar-chart-o"></i> <span>Laporan</span>
                                <i className="fa fa-angle-left pull-right"></i>
                            </a>
                            <ul className="treeview-menu">
                                <li><a href="/laporan/pembelian-produk"><i className="fa fa-angle-double-right"></i> Pembelian Produk</a></li>
                                <li><a href="/laporan/penjualan-produk"><i className="fa fa-angle-double-right"></i> Penjualan Produk</a></li>
                                <li><a href="/laporan/jatahbon-produk"><i className="fa fa-angle-double-right"></i> Bon Jatah Produk</a></li>
                                <li><a href="/laporan/pembelian-treatment"><i className="fa fa-angle-double-right"></i> Pembelian Treatment</a></li>
                                <li><a href="/laporan/penjualan-treatment"><i className="fa fa-angle-double-right"></i> Penjualan Treatment</a></li>
                                <li><a href="/laporan/jatahbon-treatment"><i className="fa fa-angle-double-right"></i> Bon Jatah Treatment</a></li>
                                <li><a href="/laporan/penyusutan-treatment"><i className="fa fa-angle-double-right"></i> Penyusutan Traetment</a></li>
                                <li><a href="/laporan/stok-produk"><i className="fa fa-angle-double-right"></i> Stok Produk</a></li>
                                <li><a href="/laporan/stok-treatment"><i className="fa fa-angle-double-right"></i> Stok Treatment</a></li>
                                <li><a href="/laporan/pendapatan-produk"><i className="fa fa-angle-double-right"></i> Pendapatan Produk</a></li>
                                <li><a href="/laporan/pendapatan-treatment"><i className="fa fa-angle-double-right"></i> Pendapatan Treatment</a></li>
                            </ul>
                        </li>
                        <li className="treeview">
                            <a href="#">
                                <i className="fa fa-dropbox"></i> <span>Stok</span>
                                <i className="fa fa-angle-left pull-right"></i>
                            </a>
                            <ul className="treeview-menu">
                                <li><a href="/stok/produk"><i className="fa fa-angle-double-right"></i> Produk</a></li>
                                <li><a href="/stok/treatment"><i className="fa fa-angle-double-right"></i> Treatment</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="/pengguna">
                                <i className="fa fa-users"></i> <span>User</span>
                            </a>
                        </li>
                    </ul>
                </section>
            </div>
        );
    }
}