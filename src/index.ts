#!/usr/bin/env node

declare const __dirname: string;

import * as fs from 'fs';
import * as path from 'path';

type OpenRPC = Record<string, any>

let doc: OpenRPC = {
  openrpc: '1.2.4',
};

function addInfo(doc: OpenRPC, jsonPath: string) {
  const fileContent = fs.readFileSync(jsonPath)
  const info = JSON.parse(fileContent.toString())
  doc["info"] = info
  return doc 
}

function addMethod(doc: OpenRPC, jsonPath: string, tag?: string) {
  const fileContent = fs.readFileSync(jsonPath)
  const method = JSON.parse(fileContent.toString())
  if (tag) {
    method["tags"] = [tag]
  }
  doc["methods"].push(method)
  return doc 
}

function addMethods(doc: OpenRPC, methodsDirectoryPath: string, tag?: string) {
  doc["methods"] = []

  try {
    const files = fs.readdirSync(methodsDirectoryPath)

    files.forEach(fileName => {
      const fullPath = path.join(methodsDirectoryPath, fileName);
      console.log(fullPath)

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

  doc["components"]["schemas"][name] = schema
  return doc 
}

function addSchemas(doc: OpenRPC, schemasDirectoryPath: string) {
  doc["components"] = []
  doc["components"]["schemas"] = []

  try {
    const files = fs.readdirSync(schemasDirectoryPath)

    files.forEach(fileName => {
      const fullPath = path.join(schemasDirectoryPath, fileName);
      console.log(fullPath)

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

const infoPath = path.join(__dirname, 'info.json')
doc = addInfo(doc, infoPath)

const methodsPath = path.join(__dirname, 'methods')
doc = addMethods(doc, methodsPath)

const schemasPath = path.join(__dirname, 'components', 'schemas')
doc = addSchemas(doc, schemasPath)


console.dir(doc, {depth: null});