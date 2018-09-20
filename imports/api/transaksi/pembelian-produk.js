import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const MPembelianProduk = new Mongo.Collection("pembelianProduk");

if (Meteor.isServer) {
    Meteor.publish("pembelianProduk", function pembelianProdukPublication() {
        return MPembelianProduk.find({});
    });
}

Meteor.methods({
    "pembelianProduk.insert"(id, tgl, noNota, supplier, keterangan, total, detailProduk) {
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        MPembelianProduk.insert({
            id, tgl, noNota, supplier, keterangan, total, detailProduk,
            createdAt: new Date(),
            owner: this.userId,
            updater: this.userId
        });
    },
    "pembelianProduk.update"(_id, tgl, noNota, supplier, keterangan, total, detailProduk) {
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        MPembelianProduk.update(_id, {
            $set: {
                tgl: tgl,
                noNota: noNota,
                supplier: supplier,
                keterangan: keterangan,
                total: total,
                detailProduk: detailProduk,
                updater: this.userId,
                updatedAt: new Date()
            }
        });
    },
    "pembelianProduk.remove"(pembelianProdukId) {
        check(pembelianProdukId, String);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        MPembelianProduk.remove(pembelianProdukId);
    }
});
