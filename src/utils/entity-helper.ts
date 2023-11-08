export class EntityHelper {
  __entity?: string;

  constructor() {
    // Set the entity name when the entity is created
    this.__entity = this.constructor.name;
  }

  toJSON() {
    // Implement your own logic to convert the entity to plain object
    // You can manually create an object with the desired properties
    // or use a serialization library like class-transformer if needed.
    // Here, we'll provide a basic example that converts public properties to plain object.
    const plainObject: Record<string, any> = {};
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        plainObject[key] = this[key];
      }
    }
    return plainObject;
  }
}
