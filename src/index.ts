#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

const OPENRPC_VERSION = '1.2.4';

type OpenRPC = Record<string, any>

let doc: OpenRPC = {
  openrpc: OPENRPC_VERSION,
};

function addInfo(doc: OpenRPC, jsonPath: string) {
  const fileContent = fs.readFileSync(jsonPath)
  const info = JSON.parse(fileContent.toString())
  doc["info"] = info
  return doc 
}

function addMethod(doc: OpenRPC, jsonPath: string, tag?: string) {
  if (!("methods" in doc)) {
    doc["methods"] = []
  }
  const fileContent = fs.readFileSync(jsonPath)
  const method = JSON.parse(fileContent.toString())
  if (tag) {
    method["tags"] = [{"name": tag}]
  }
  doc["methods"].push(method)
  return doc 
}

function addMethods(doc: OpenRPC, methodsDirectoryPath: string, tag?: string) {
  try {
    const files = fs.readdirSync(methodsDirectoryPath)

    files.forEach(fileName => {
      const fullPath = path.join(methodsDirectoryPath, fileName);

      const stats = fs.statSync(fullPath)

      if (stats.isFile()) {
        doc = addMethod(doc, fullPath, tag)
      } else {
        doc = addMethods(doc, fullPath, fileName)
      }
    })
  } catch (err) {
    console.error("Error:", err);
  }

  return doc;
}

function addSchema(doc: OpenRPC, name: string, jsonPath: string) {
  const fileContent = fs.readFileSync(jsonPath)
  const schema = JSON.parse(fileContent.toString())

  if (!("components" in doc)) {
    doc["components"] = {"schemas": {}}
  }

  doc["components"]["schemas"][name] = schema
  return doc;
}

function addSchemas(doc: OpenRPC, schemasDirectoryPath: string) {

  try {
    const files = fs.readdirSync(schemasDirectoryPath)

    files.forEach(fileName => {
      const fullPath = path.join(schemasDirectoryPath, fileName);

      const stats = fs.statSync(fullPath)

      if (stats.isFile() && path.extname(fileName) == ".json") {
        const name = path.basename(fileName, '.json')
        doc = addSchema(doc, name, fullPath)
      }
    })
  } catch (err) {
    console.error("Error:", err);
  }

  return doc;

}

const cwd = process.cwd();
const infoPath = path.join(cwd, 'info.json')
doc = addInfo(doc, infoPath)

const methodsPath = path.join(cwd, 'methods')
doc = addMethods(doc, methodsPath)

const schemasPath = path.join(cwd, 'components', 'schemas')
doc = addSchemas(doc, schemasPath)

console.log(JSON.stringify(doc, null, 2));
