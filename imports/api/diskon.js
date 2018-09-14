import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const MDiskon = new Mongo.Collection("diskon");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("diskon", function diskonPublication() {
    return MDiskon.find({});
  });
}

Meteor.methods({
  "diskon.insert"(id, nama, tglAwal, tglAkhir, jmlDiskon) {
    check(id, String);
    check(nama, String);
    check(tglAkhir, String);
    check(tglAwal, String);
    check(jmlDiskon, Number);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    MDiskon.insert({
      id,
      nama,
      tglAwal,
      tglAkhir,
      jmlDiskon,
      createdAt: new Date(),
      owner: this.userId,
      updater: this.userId
      // username: Meteor.users.findOne(this.userId).username
    });
  },
  "diskon.update"(_id, id, nama, tglAwal, tglAkhir, jmlDiskon) {
    check(_id, String);
    check(id, String);
    check(nama, String);
    check(tglAkhir, String);
    check(tglAwal, String);
    check(jmlDiskon, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    MDiskon.update(_id, {
      $set: {
        id: id,
        nama: nama,
        tglAkhir: tglAkhir,
        tglAwal: tglAwal,
        jmlDiskon: jmlDiskon,
        updater: this.userId,
        updatedAt: new Date()
      }
    });
  },
  "diskon.remove"(diskonId) {
    check(diskonId, String);
    const diskon = MDiskon.findOne(diskonId);
    if (!this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    MDiskon.remove(diskonId);
  }
});
