# simple-influx

### Configuration

```js
import InfluxLib, { WriteDataType } from "./index";

let influx = new InfluxLib(
  "http://localhost:8086",
  "", // token
  "", // organization
  "" //bucket
);
```

# Features

## write()

```js
influx.write(
    measurement: string,
    data: WriteDataType,
    default_tags? : { [key: string]: string } | undefined
    ): void
```

#### Parameters

#### measurement: string

- InfluxDB measurement.

#### data: WriteDataType

- Data to be saved.

#### default_tags: { [key: string]: string } | undefined `Optional`

- Default tags for all data points (everything) inserted.

## read()

```js
influx.read(
    measurement: string,
    fields: string[],
    searchStartTime: string,
    searchEndTime?: string | undefined
    ): any
```

#### Parameters

#### measurement: string

- InfluxDB measurement.

#### fields: string[]

- Fields to be used to filter the row. Rows without fields will be excluded. Can add a ! before fieldname to exclude rows with field. example: ['user', '!email'] => only includes rows containing users field but not containing email field.

#### searchStartTime: string

- Start time for data. Accepts all values accepted by InfluxDb client.

#### searchEndTime: string `Optional`

- End time for data. Accepts all values accepted by InfluxDb client.

## readWithFluxQuery()

```js
influx.readWithFluxQuery(
   fluxQuery: string
    ): any
```

#### Parameters

#### fluxQuery: string

- FluxQuery String.
