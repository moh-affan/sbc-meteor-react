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

import {MDiskon} from "../../api/diskon";

class CellDelete extends Component {
  constructor(props) {
    super(props);
  }
  removeDiskon() {
    swal({
      title: "Are you sure?",
      text: "Apa Anda yakin ingin menghapus ?",
      icon: "warning",
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        Meteor.call("diskon.remove", this.props.diskon._id);
        swal("Dihapus!", "Data berhasil dihapus!", "success");
      }
    });
  }
  render() {
    return (
      <span
        className="fa fa-trash-o center-block text-center"
        onClick={this.removeDiskon.bind(this)}
      />
    );
  }
}

class CellEdit extends Component {
  constructor(props) {
    super(props);
  }
  showDiskon() {
    $("input[name=_id]").val(this.props.diskon._id);
    $("input[name=id]").val(this.props.diskon.id);
    $("input[name=nama]").val(this.props.diskon.nama);
    $("input[name=tglAwal]").val(this.props.diskon.tglAwal);
    $("input[name=tglAkhir]").val(this.props.diskon.tglAkhir);
    $("input[name=jmlDiskon]").val(this.props.diskon.jmlDiskon);
  }
  render() {
    return (
      <span
        className="fa fa-pencil center-block text-center"
        onClick={this.showDiskon.bind(this)}
      />
    );
  }
}

class DisplayData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tglAwal: moment(),
      tglAkhir: moment()
    };
    this.handleTglAwalChange = this.handleTglAwalChange.bind(this);
    this.handleTglAkhirChange = this.handleTglAkhirChange.bind(this);
  }

  renderDiskon() {
    return this.props.diskon.map(p => {
      return <RowData key={p.id} diskon={p} />;
    });
  }

  resetForm(target) {
    target._id.value = "";
    target.id.value = "";
    target.nama.value = "";
    target.tglAwal.value = "";
    target.tglAkhir.value = "";
    target.jmlDiskon.value = "";
  }

  handleTglAwalChange(arg) {
    this.setState({
      tglAwal: arg
    });
  }

  handleTglAkhirChange(arg) {
    this.setState({
      tglAkhir: arg
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let target = event.target;
    if (target._id.value != "") {
      Meteor.call(
        "diskon.update",
        target._id.value,
        target.id.value,
        target.nama.value,
        target.tglAwal.value,
        target.tglAkhir.value,
        Number.parseInt(target.jmlDiskon.value)
      );
    } else {
      Meteor.call(
        "diskon.insert",
        target.id.value,
        target.nama.value,
        target.tglAwal.value,
        target.tglAkhir.value,
        Number.parseInt(target.jmlDiskon.value)
      );
    }
    // target.reset();
    this.resetForm(target);
  }

  render() {
    const columns = [
      { Header: "ID", accessor: "id" },
      { Header: "Nama", accessor: "nama" },
      { Header: "Tanggal Awal", accessor: "tglAwal" },
      { Header: "Tanggal Akhir", accessor: "tglAkhir" },
      { Header: "Jumlah Diskon", accessor: "jmlDiskon" },
      {
        Header: "Hapus",
        filterable: false,
        sortable: false,
        Cell: props => <CellDelete diskon={props.original} />,
        minWidth: 50
      },
      {
        Header: "Edit",
        filterable: false,
        sortable: false,
        Cell: props => <CellEdit diskon={props.original} />,
        minWidth: 50
      }
    ];
    return (
      <aside className="right-side">
        <section className="content-header">
          <h1>
            Diskon<small>Data Master</small>
          </h1>
          <ol className="breadcrumb">
            <li>
              <a href="#">
                <i className="fa fa-th" /> Home
              </a>
            </li>
            <li>Data Master</li>
            <li className="active">Diskon</li>
          </ol>
        </section>

        <section className="content">
          <div className="row">
            <div className="col-md-7">
              <div className="alert-place" />
              <div className="box box-primary">
                <div className="box-header">
                  <h3 className="box-title">Data Diskon</h3>
                  <div className="pull-right box-tools" />
                </div>
                <div className="box-body table-responsive">
                  <ReactTable
                    data={this.props.diskon}
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
              <div className="alert-place" />
              <div className="box box-success">
                <div className="box-header">
                  <h3 className="box-title">Input Data Diskon</h3>
                  <div className="pull-right box-tools" />
                </div>
                <div className="box-body">
                  <form
                    className="form form-diskon"
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
                      <input type="hidden" name="_id" ref="_id" value="" />
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
                      <label>Tanggal Awal</label>
                      <DatePicker
                        name="tglAwal"
                        className="form-control"
                        locale="ID-id"
                        showYearDropdown
                        showMonthDropdown
                        isClearable={false}
                        dropdownMode="select"
                        onChange={this.handleTglAwalChange}
                        dateFormat="DD-MM-YYYY"
                        selected={this.state.tglAwal}
                      />
                    </div>
                    <div className="form-group">
                      <label>Tanggal Akhir</label>
                      <DatePicker
                        name="tglAkhir"
                        className="form-control"
                        locale="ID-id"
                        showYearDropdown
                        showMonthDropdown
                        isClearable={false}
                        dropdownMode="select"
                        onChange={this.handleTglAkhirChange}
                        dateFormat="DD-MM-YYYY"
                        selected={this.state.tglAkhir}
                      />
                    </div>
                    <div className="form-group">
                      <label>Jumlah Diskon</label>
                      <input
                        type="number"
                        name="jmlDiskon"
                        ref="jmlDiskon"
                        className="form-control"
                        placeholder="Masukkan Jumlah Diskon"
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

class Diskon extends Component {
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
        <Header nama={pengguna} />
        <div className="wrapper row-offcanvas row-offcanvas-left">
          <Sidemenu activeMenu="data-master" nama={pengguna} />
          <DisplayData diskon={this.props.diskon} />
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe("diskon");

  return {
    diskon: MDiskon.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user()
  };
})(Diskon);
