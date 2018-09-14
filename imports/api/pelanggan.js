import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const MPelanggan = new Mongo.Collection("pelanggan");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("pelanggan", function pelangganPublication() {
    return MPelanggan.find({});
  });
}

Meteor.methods({
  "pelanggan.insert"(id, nama, telp, alamat, tglLahir) {
    check(id, String);
    check(nama, String);
    check(tglLahir, String);
    check(telp, String);
    check(alamat, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    MPelanggan.insert({
      id,
      nama,
      telp,
      alamat,
      tglLahir,
      createdAt: new Date(),
      owner: this.userId,
      updater: this.userId
      // username: Meteor.users.findOne(this.userId).username
    });
  },
  "pelanggan.update"(_id, id, nama, telp, alamat, tglLahir) {
    check(_id, String);
    check(id, String);
    check(nama, String);
    check(tglLahir, String);
    check(telp, String);
    check(alamat, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    MPelanggan.update(_id, {
      $set: {
        id: id,
        nama: nama,
        tglLahir: tglLahir,
        telp: telp,
        alamat: alamat,
        updater: this.userId,
        updatedAt: new Date()
      }
    });
  },
  "pelanggan.remove"(pelangganId) {
    check(pelangganId, String);
    const pelanggan = MPelanggan.findOne(pelangganId);
    if (!this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    MPelanggan.remove(pelangganId);
  }
});
