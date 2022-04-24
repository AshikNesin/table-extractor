# table-extractor

> Helps you extract data from tables PDF files like bank statements, invoices, etc.

## Dependency

It's a node wrapper for tabula-java. So make sure JVM is installed in your machine.

## Install

```sh
npm install table-extractor
```

## Usage

```js
import tableExtractor from "table-extractor";
// p → page
// a → area (top,left,bottom,right i.e. y1,x1,y2,x2)
tableExtractor("/tmp/bank-statement.pdf", [
  { p: 1, a: "427.284375,7.999774999999979,679.415625,586.637275" },
  { p: 2, a: "63.590625,7.999774999999979,607.271875,588.124775" },
]);
```

//=> 'csvString'

## API

### tableExtractor(filePaths, options)

#### filePath

Type: `string`

Path of the PDF file

#### options

Type: `object` | `array`

See the [tabula-java](https://github.com/tabulapdf/tabula-java#usage-examples) options.
