import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const MSupplier = new Mongo.Collection("supplier");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("supplier", function supplierPublication() {
    return MSupplier.find({});
  });
}

Meteor.methods({
  "supplier.insert"(id, nama, telp, alamat) {
    check(id, String);
    check(nama, String);
    check(telp, String);
    check(alamat, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    MSupplier.insert({
      id,
      nama,
      telp,
      alamat,
      createdAt: new Date(),
      owner: this.userId,
      updater: this.userId
      // username: Meteor.users.findOne(this.userId).username
    });
  },
  "supplier.update"(_id, id, nama, telp, alamat) {
    check(_id, String);
    check(id, String);
    check(nama, String);
    check(telp, String);
    check(alamat, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    MSupplier.update(_id, {
      $set: {
        id: id,
        nama: nama,
        telp: telp,
        alamat: alamat,
        updater: this.userId,
        updatedAt: new Date()
      }
    });
  },
  "supplier.remove"(supplierId) {
    check(supplierId, String);
    const supplier = MSupplier.findOne(supplierId);
    if (!this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    MSupplier.remove(supplierId);
  }
});
