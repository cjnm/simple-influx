import { InfluxDB } from "@influxdata/influxdb-client";

export default function getClient(url: string, token: string) {
  return new InfluxDB({ url, token });
}
