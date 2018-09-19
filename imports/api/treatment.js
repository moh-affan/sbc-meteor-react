import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const MTreatment = new Mongo.Collection("treatment");

if (Meteor.isServer) {
    Meteor.publish("treatment", function produkPublication() {
        return MTreatment.find({});
    });
}

Meteor.methods({
    "treatment.insert"(id, nama, kategori, supplier, hargaJual, hargaBeli, diskon, penyusutan) {
        check(id, String);
        check(nama, String);
        check(penyusutan, Number);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        if (penyusutan === null || penyusutan === "")
            penyusutan = 0;
        MTreatment.insert({
            id,
            nama,
            kategori,
            supplier: supplier,
            hargaJual,
            hargaBeli,
            diskon: diskon,
            penyusutan: penyusutan,
            createdAt: new Date(),
            owner: this.userId,
            updater: this.userId
        });
    },
    "treatment.update"(
        _id,
        id,
        nama,
        kategori,
        supplier,
        hargaJual,
        hargaBeli,
        diskon,
        penyusutan
    ) {
        check(_id, String);
        check(id, String);
        check(nama, String);
        check(penyusutan, Number);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        if (penyusutan === null || penyusutan === "")
            penyusutan = 0;
        MTreatment.update(_id, {
            $set: {
                id: id,
                nama: nama,
                kategori: kategori,
                supplier: supplier,
                hargaJual: hargaJual,
                hargaBeli: hargaBeli,
                diskon: diskon,
                penyusutan: penyusutan,
                updater: this.userId,
                updatedAt: new Date()
            }
        });
    },
    "treatment.remove"(produkId) {
        check(produkId, String);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        MTreatment.remove(produkId);
    }
});
