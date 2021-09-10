import IPinfoWrapper from "node-ipinfo";

const token = process.env.IPINFO_TOKEN!;
const ipinfoWrapper = new IPinfoWrapper(token);

ipinfoWrapper.lookupIp("1.1.1.1").then((response: any) => {
    console.log(response);
});

ipinfoWrapper.lookupASN("AS123").then((response: any) => {
    console.log(response);
});
