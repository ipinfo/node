let IPinfo = require("node-ipinfo");

let token = process.env.IPINFO_TOKEN
let ipinfo = new IPinfo(token);

ipinfo.lookupIp("1.1.1.1").then((response) => {
    console.log(response);
});

ipinfo.lookupASN("AS123").then((response) => {
    console.log(response);
});
