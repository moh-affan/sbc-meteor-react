import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const MJabatan = new Mongo.Collection("jabatan");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("jabatan", function jabatanPublication() {
    return MJabatan.find({});
  });
}

Meteor.methods({
  "jabatan.insert"(nama) {
    check(nama, String);
    nama = s(nama)
      .trim()
      .capitalize()
      .value();
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    MJabatan.insert({
      nama,
      createdAt: new Date(),
      owner: this.userId
    });
  },
  "jabatan.remove"(jabatanId) {
    check(jabatanId, String);
    const jabatan = MJabatan.findOne(jabatanId);
    if (!this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    MJabatan.remove(jabatanId);
  }
});
