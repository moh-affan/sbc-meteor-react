import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const MJatah = new Mongo.Collection("jatah");

if (Meteor.isServer) {
    Meteor.publish("jatah", function jatahPublication() {
        return MJatah.find({});
    });
}

Meteor.methods({
    "jatah.insert"(nominal, keterangan) {
        check(nominal, Number);
        check(keterangan, String);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        MJatah.insert({
            nominal,
            keterangan,
            createdAt: new Date(),
            owner: this.userId,
            updater: this.userId
        });
    },
    "jatah.update"(_id, nominal, keterangan) {
        check(nominal, Number);
        check(keterangan, String);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        MJatah.update(_id, {
            $set: {
                nominal: nominal,
                keterangan: keterangan,
                updatedAt: new Date()
            }
        });
    },
    "jatah.remove"(jatahId) {
        check(jatahId, String);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        MJatah.remove(jatahId);
    }
});
