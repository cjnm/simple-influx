import InfluxLib, { WriteDataType } from "./index";

let influx = new InfluxLib(
  "http://localhost:8086",
  "==", // token
  "", // organization
  "" //bucket
);

let data: WriteDataType = [
  {
    tag: {
      server: "server1x",
    },
    data: {
      cpu: "27%",
      memory: "80%",
    },
  },
  {
    tag: {
      server: "server1x",
    },
    data: {
      cpu: "28%",
      memory: "80%",
    },
  },
];

influx.write("server_metrix", data);

influx.read("server_metrix", ["!memory", "cpu"], "-1h");
