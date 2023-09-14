# Overview

Organize OpenRPC doc into files and directories and compile a complete OpenRPC document.

## Directory structure

```
📂 openrpc/  
├── 📂 components/  
|   └─── 📂 schemas/  
│        └─── 📄 jointPosition.json  
│───📄 info.json  
└───📂 methods/  
    └── 📂 tags/  
         └── 📂 motion/  
              └── 📄 getJointPosition.json  
```

## Example Info file
**./info.json**
```
{
    "version": "0.1.0",
    "title": "Motion Controller API"
}
```

## Example Schema File
**./components/schemas/jointPosition.json**
```
{
    "name": "getPosition",
    "description": "Get current joint positions",
    "params": [],
    "result": {
        "name": "jointPositions",
        "description": "updated joint positions",
        "schema": {
            "type": "array",
            "items": {
                "$ref": "#components/schemas/jointPosition"
            }
        }
    },
    "examples": [
        {
            "name": "getPosition",
            "params": [],
            "result": {
                "name": "jointPositions",
                "value": [
                    {
                        "jointIndex": 1,
                        "position": 393
                    },
                    {
                        "jointIndex": 5,
                        "position": 1829
                    }
                ]
            }
        }
    ]
}
```
## Example Method File
Note, by placing a method file inside a tags subdirectory, the name of the subdirectory will be assigned as a tag for the method.
**./methods/tags/motion/getJointPosition.json**
```
{
    "name": "getPosition",
    "description": "Get current joint positions",
    "params": [],
    "result": {
        "name": "jointPositions",
        "description": "updated joint positions",
        "schema": {
            "type": "array",
            "items": {
                "$ref": "#components/schemas/jointPosition"
            }
        }
    },
    "examples": [
        {
            "name": "getPosition",
            "params": [],
            "result": {
                "name": "jointPositions",
                "value": [
                    {
                        "jointIndex": 1,
                        "position": 393
                    },
                    {
                        "jointIndex": 5,
                        "position": 1829
                    }
                ]
            }
        }
    ]
}
```

## Install
```
npm install open-rpc-compiler --no-save
```

## Compile into a single openrpc.json document
```
open-rpc-compile > openrpc.json
```

## Example Output
```
{
  "openrpc": "1.2.4",
  "info": {
    "version": "0.1.0",
    "title": "Motion Controller API"
  },
  "methods": [
    {
      "name": "getPosition",
      "description": "Get current joint positions",
      "params": [],
      "result": {
        "name": "jointPositions",
        "description": "updated joint positions",
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#components/schemas/jointPosition"
          }
        }
      },
      "examples": [
        {
          "name": "getPosition",
          "params": [],
          "result": {
            "name": "jointPositions",
            "value": [
              {
                "jointIndex": 1,
                "position": 393
              },
              {
                "jointIndex": 5,
                "position": 1829
              }
            ]
          }
        }
      ],
      "tags": [
        {
          "name": "motion"
        }
      ]
    },
  ],
  "components": {
    "schemas": {
      "jointPosition": {
        "type": "object",
        "properties": {
          "jointIndex": {
            "type": "integer"
          },
          "position": {
            "type": "integer"
          }
        }
      }
    }
  }
}

```