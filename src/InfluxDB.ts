import { Point } from "@influxdata/influxdb-client";
import getInfluxDBClient from "./client/client";

export type WriteDataType = {
  tag: { [key: string]: string };
  timestamp?: string | number | Date | undefined;
  data: { [key: string]: string };
}[];

export default class InfluxLib {
  private url: string;
  private token: string;
  private organization: string;
  private bucket: string;
  private client: any;

  constructor(
    url: string,
    token: string,
    organization: string,
    bucket: string
  ) {
    if (!url || !token || !organization || !bucket) {
      throw new Error("Invalid InfluxDB config.");
    }

    this.url = url;
    this.token = token;
    this.organization = organization;
    this.bucket = bucket;

    this.client = getInfluxDBClient(this.url, this.token);
  }

  write(
    measurement: string,
    data: WriteDataType,
    default_tags?: {
      [key: string]: string;
    }
  ) {
    const writeApi = this.client.getWriteApi(this.organization, this.bucket);

    if (default_tags) {
      /**
       * Apply default tags to all data points (everything) inserted.
       **/
      writeApi.useDefaultTags({ ...default_tags });
    }

    for (const datum of data) {
      const data_point = new Point(measurement);

      for (const [mKey, mValue] of Object.entries(datum)) {
        //process tag
        if (mKey === "tag") {
          for (const [key, value] of Object.entries(datum["tag"])) {
            data_point.tag(key, value);
          }
        }

        //process timestamp
        if (mKey === "timestamp") {
          data_point.timestamp(datum["timestamp"]);
        }

        //remaining data
        //  @TODO: Tmplement the following features later
        /**
         * floatField()
         * booleanField()
         * intField()
         * stringField()
         */
        if (mKey === "data") {
          for (const [key, value] of Object.entries(datum["data"])) {
            data_point.stringField(key, value);
          }
        }
      }

      /**
       * Write data_point to database.
       **/
      writeApi.writePoint(data_point);
    }

    /**
     * Close writeApi.
     **/
    writeApi.close().then(() => {
      console.log("WRITE FINISHED");
    });
  }

  read(
    measurement: string,
    fields: string[],
    searchStartTime: string,
    searchEndTime?: string
  ) {
    /**
     * Create a Flux query for your InfluxDB bucket. Store the query as a string variable.
     **/
    let fluxQuery = `from(bucket:"${this.bucket}") `;

    // search with time range.
    if (searchStartTime && searchEndTime) {
      fluxQuery += `|> range(start: ${searchStartTime}, stop: ${searchEndTime}) `;
    } else if (searchStartTime) {
      fluxQuery += `|> range(start: ${searchStartTime}) `;
    } else if (searchEndTime) {
      fluxQuery += `|> range(stop: ${searchEndTime}) `;
    }

    // filter fields
    let fieldsFilterQuery = "";
    if (fields.length) {
      for (const field of fields) {
        if (field[0] === "!") {
          fieldsFilterQuery += ` and r._field != "${field.substring(1)}"`;
        } else {
          fieldsFilterQuery += ` and r._field == "${field}"`;
        }
      }
    }

    fluxQuery += `|> filter(fn: (r) => r._measurement == "${measurement}" ${fieldsFilterQuery})`;

    return this.readWithFluxQuery(fluxQuery);
  }

  readWithFluxQuery(fluxQuery: string) {
    const queryApi = this.client.getQueryApi(this.organization);

    return queryApi
      .collectRows(
        fluxQuery /*, you can specify a row mapper as a second arg */
      )
      .then((data: any) => {
        let collected_row: string[] = [];
        data.forEach((datum: any) => collected_row.push(datum));

        return {
          success: true,
          data: collected_row,
        };
      })
      .catch((error: any) => {
        return {
          success: false,
          message: error.message,
          data: [],
        };
      });
  }
}
