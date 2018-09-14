import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const MKategori = new Mongo.Collection("kategori");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("kategori", function kategoriPublication() {
    return MKategori.find({});
  });
}

Meteor.methods({
  "kategori.insert"(nama) {
    check(nama, String);
    nama = s(nama)
      .trim()
      .capitalize()
      .value();
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    MKategori.insert({
      nama,
      createdAt: new Date(),
      owner: this.userId
    });
  },
  "kategori.remove"(kategoriId) {
    check(kategoriId, String);
    const kategori = MKategori.findOne(kategoriId);
    if (!this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    MKategori.remove(kategoriId);
  }
});
