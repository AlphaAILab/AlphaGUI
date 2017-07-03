var fs = require("fs");

uuid2name = {};
name2uuid = {};

function User(uuid) {
    this.uuid = uuid;
    this.opponent = null;
    this.status = "offline";
    this.socket = null;
    
    if (uuid2name[uuid] !== undefined) {
        this.name = uuid2name[uuid];
    } else {
        this.name = null;
    }
}

function _save() {
    if (this.name !== null && this.name.length >= 1) {
        uuid2name[this.uuid] = this.name;
        name2uuid[this.name] = this.uuid;
        //console.log(uuid2name);
        try {
            fs.writeFileSync("uuid2name.json", JSON.stringify(uuid2name));
            return true;
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
}

function load() {
    try {
        uuid2name = JSON.parse(fs.readFileSync("uuid2name.json"));
        name2uuid = {};
        for (var key in uuid2name) {
            name2uuid[uuid2name[key]] = key;
        }

        return true;
    } catch (e) {
        return false;
    }
}

function get_name(uuid) {
    return uuid2name[uuid];
}
function get_uuid(name) {
    return name2uuid[name];
}

User.prototype = {
    constructor: User,
    save: _save
}

module.exports = {
    load: load,
    get_name: get_name,
    get_uuid: get_uuid,
    User: User
}