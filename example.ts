import InfluxLib, { WriteDataType } from "./index";

async function go() {
  let influx = new InfluxLib(
    "http://...:8086",
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

  // influx.write("server_metrix", data);

  console.log(await influx.read("server_metrix", ["!memory", "cpu"], "-1h"));
}

go();
