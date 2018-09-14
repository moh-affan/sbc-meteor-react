import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";
import {MSupplier} from "./supplier";

export const MProduk = new Mongo.Collection("produk");

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish("produk", function produkPublication() {
        return MProduk.find({});
    });
}

Meteor.methods({
    "produk.insert"(id, nama, kategori, supplier, hargaJual, hargaBeli, diskon) {
        check(id, String);
        check(nama, String);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        MProduk.insert({
            id,
            nama,
            kategori,
            supplier: supplier | {nama: "Tanpa Supplier"},
            hargaJual,
            hargaBeli,
            diskon: diskon | {nama: "Tanpa Diskon"},
            createdAt: new Date(),
            owner: this.userId,
            updater: this.userId
            // username: Meteor.users.findOne(this.userId).username
        });
    },
    "produk.update"(
        _id,
        id,
        nama,
        kategori,
        supplier,
        hargaJual,
        hargaBeli,
        diskon
    ) {
        check(_id, String);
        check(id, String);
        check(nama, String);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        MProduk.update(_id, {
            $set: {
                id: id,
                nama: nama,
                kategori: kategori,
                supplier: supplier,
                hargaJual: hargaJual,
                hargaBeli: hargaBeli,
                diskon: diskon,
                updater: this.userId,
                updatedAt: new Date()
            }
        });
    },
    "produk.remove"(produkId) {
        check(produkId, String);
        const produk = MProduk.findOne(produkId);
        if (!this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error("not-authorized");
        }
        MProduk.remove(produkId);
    }
});
