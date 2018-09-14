import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const MPegawai = new Mongo.Collection("pegawai");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("pegawai", function pegawaiPublication() {
    return MPegawai.find({});
  });
}

Meteor.methods({
  "pegawai.insert"(id, nama, jabatan, telp, alamat) {
    check(id, String);
    check(nama, String);
    check(jabatan, String);
    check(telp, String);
    check(alamat, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    MPegawai.insert({
      id,
      nama,
      jabatan,
      telp,
      alamat,
      createdAt: new Date(),
      owner: this.userId,
      updater: this.userId
      // username: Meteor.users.findOne(this.userId).username
    });
  },
  "pegawai.update"(_id, id, nama, jabatan, telp, alamat) {
    check(_id, String);
    check(id, String);
    check(nama, String);
    check(jabatan, String);
    check(telp, String);
    check(alamat, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    MPegawai.update(_id, {
      $set: {
        id: id,
        nama: nama,
        jabatan: jabatan,
        telp: telp,
        alamat: alamat,
        updater: this.userId
      }
    });
  },
  "pegawai.remove"(pegawaiId) {
    check(pegawaiId, String);
    const pegawai = MPegawai.findOne(pegawaiId);
    if (!this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    MPegawai.remove(pegawaiId);
  }
});
