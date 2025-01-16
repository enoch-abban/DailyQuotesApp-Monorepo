import { ObjectId } from "mongodb";

const filterHelper = (function () {

  const transformID = (input: any): any => {

    if (Array.isArray(input)) {
      return input.map(item => transformID(item));
    }

    if (input instanceof ObjectId) {
      return input;
    }

    const transformedObject: any = {};

    for (const key in input) {
      if (typeof input[key] === 'object' && '$toObjectId' in input[key]) {
        transformedObject[key] = new ObjectId(`${input[key]['$toObjectId']}`);
      } else if (typeof input[key] === 'object') {
        transformedObject[key] = transformID(input[key]);
      } else {
        transformedObject[key] = input[key];
      }
    }

    return transformedObject;
  }

  const objectIdConverter = (input: any): Record<string, any> => {
    if (Array.isArray(input)) {
      return input.map((item) => objectIdConverter(item));
    }

    if (input instanceof ObjectId) {
      return input;
    }

    const transformObject: any = {}

    for (const key in input) {
      console.log('-----objwct key', input[key])
      if (input[key] == null) {
        transformObject[key] = null
      } else if (input[key] != null && typeof input[key] === 'object' && '$$_id' in input[key]) {
        transformObject[key] = new ObjectId(input[key]['$$_id']);
      } else if (typeof input[key] === 'object') {
        transformObject[key] = objectIdConverter(input[key])
      } else {
        transformObject[key] = input[key];
      }
    }

    return transformObject;
  }

  const processQueryFilterToMongo = (input: any): any => {
    // Handle the case where input is an array
    if (Array.isArray(input)) {
      return input.map((item) => processQueryFilterToMongo(item));
    }
  
    // Handle the case where input is an ObjectId instance
    if (input instanceof ObjectId) {
      return input;
    }
  
    // Ensure input is an object before proceeding
    if (typeof input !== 'object' || input === null) {
      return input; // Return input as-is if it's not an object or is null
    }
  
    // Initialize the transformed object
    const transformedObject: Record<string, any> = {};
  
    // Iterate over the object's keys
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const value = input[key];
  
        if (value === null) {
          // Assign null if value is null
          transformedObject[key] = null;
        } else if (typeof value === 'object' && value !== null && '$$_id' in value) {
          // Convert objects with a `$$_id` field to ObjectId
          transformedObject[key] = new ObjectId(value['$$_id']);
        } else if (typeof value === 'object') {
          // Recursively process nested objects
          transformedObject[key] = processQueryFilterToMongo(value);
        } else {
          // Assign the value directly for primitives
          transformedObject[key] = value;
        }
      }
    }
  
    return transformedObject;
  };
  

  return {
    transformID,
    objectIdConverter,
    processQueryFilterToMongo
  }

})()

export default filterHelper;