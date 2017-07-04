var io = require("socket.io-client");

function Remote (uuid) {
    this.s = io("http://localhost:23333");
    this.uuid = uuid;
    //this.online = false;
}

/*
function _ping() {
    if (this.online === false) return;    
    this.s.emit("ping", {
        uuid: this.uuid,
        uuid: this.page
    });

    this.ping_timer = setTimeout(this._ping, 3000);
}

function _onpage(page) {
    if (this.online === false) return;
    this.page = page;
    
    clearTimeout(this.ping_timer);
    this._ping();
}
*/


function _login (uuid, others, callback) {
    this.s.emit("login", uuid, others);

    this.online = true;
    this.ping_timer = setTimeout(this._ping, 3000);
}

function _logout (uuid, others, callback) {
    this.online = false;
    clearTimeout(this.ping_timer);

    this.s.emit("logout", uuid, others);
}


Remote.prototype = {
    constructor: Remote,
    login: _login,
    logout: _logout,
    onpage: _onpage,
    _ping: _ping
}

