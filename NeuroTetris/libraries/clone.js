// extends 'from' object with members from 'to'. If 'to' is null, a deep clone of 'from' is returned
// function deepclone(from, to) {
// 	if (from == null || typeof from != "object") return from;
// 	if (from.constructor != Object && from.constructor != Array) return from;
// 	if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
// 		from.constructor == String || from.constructor == Number || from.constructor == Boolean)
// 		return new from.constructor(from);

// 	to = to || new from.constructor();

// 	for (var name in from) {
// 		to[name] = typeof to[name] == "undefined" ? extend(from[name], null) : to[name];
// 	}

// 	return to;
// }

// class StructuredCloner {
// 	constructor() {
// 		this.pendingClones_ = new Map();
// 		this.nextKey_ = 0;

// 		const channel = new MessageChannel();
// 		this.inPort_ = channel.port1;
// 		this.outPort_ = channel.port2;

// 		this.outPort_.onmessage = ({
// 			data: {
// 				key,
// 				value
// 			}
// 		}) => {
// 			const resolve = this.pendingClones_.get(key);
// 			resolve(value);
// 			this.pendingClones_.delete(key);
// 		};
// 		this.outPort_.start();
// 	}

// 	cloneAsync(value) {
// 		return new Promise(resolve => {
// 			const key = this.nextKey_++;
// 			this.pendingClones_.set(key, resolve);
// 			this.inPort_.postMessage({
// 				key,
// 				value
// 			});
// 		});
// 	}
// }

// const structuredCloneAsync = window.structuredCloneAsync =
// 	StructuredCloner.prototype.cloneAsync.bind(new StructuredCloner);

// const main = async() => {
// 	const original = {
// 		date: new Date(),
// 		number: Math.random()
// 	};
// 	original.self = original;

// 	const clone = await structuredCloneAsync(original);

// 	// They're different objects:
// 	console.assert(original !== clone);
// 	console.assert(original.date !== clone.date);

// 	// They're cyclical:
// 	console.assert(original.self === original);
// 	console.assert(clone.self === clone);

// 	// They contain equivalent values:
// 	console.assert(original.number === clone.number);
// 	console.assert(Number(original.date) === Number(clone.date));

// 	console.log("Assertions complete for deep cloner.");
// };

// main();

// function deepclone(inObject) {
//  let outObject, value, key

//  if (typeof inObject !== "object" || inObject === null) {
//    return inObject // Return the value if inObject is not an object
//  }

//  // Create an array or object to hold the values
//  outObject = Array.isArray(inObject) ? [] : {}

//  for (key in inObject) {
//    value = inObject[key]

//    // Recursively (deep) copy for nested objects, including arrays
//    outObject[key] = deepclone(value)
//  }

//  return outObject
// }

// https://stackoverflow.com/questions/40291987/javascript-deep-clone-object-with-circular-references
// I am so thankful to trincot and the code I cannot understand but it works
function deepclone(obj, hash = new WeakMap()) {
	// Do not try to clone primitives or functions
	if (Object(obj) !== obj || obj instanceof Function) return obj;
	if (hash.has(obj)) return hash.get(obj); // Cyclic reference
	try { // Try to run constructor (without arguments, as we don't know them)
		var result = new obj.constructor();
	} catch (e) { // Constructor failed, create object without running the constructor
		result = Object.create(Object.getPrototypeOf(obj));
	}
	// Optional: support for some standard constructors (extend as desired)
	if (obj instanceof Map)
		Array.from(obj, ([key, val]) => result.set(deepclone(key, hash),
			deepclone(val, hash)));
	else if (obj instanceof Set)
		Array.from(obj, (key) => result.add(deepclone(key, hash)));
	// Register in hash    
	hash.set(obj, result);
	// Clone and assign enumerable own properties recursively
	return Object.assign(result, ...Object.keys(obj).map(
		key => ({
			[key]: deepclone(obj[key], hash)
		})));
}
// Sample data
// function A() {}

// function B() {}
// var a = new A();
// var b = new B();
// a.b = b;
// b.a = a;
// // Test it
// var c = deepClone(a);
// console.log('a' in c.b.a.b); // true

// let originalArray = [37, 3700, {
// 	hello: "world"
// }]
// console.log("Original array:", ...originalArray) // 37 3700 Object { hello: "world" }

// let shallowCopiedArray = originalArray.slice()
// let deepCopiedArray = deepCopyFunction(originalArray)

// originalArray[1] = 0 // Will affect the original only
// console.log(`originalArray[1] = 0 // Will affect the original only`)
// originalArray[2].hello = "moon" // Will affect the original and the shallow copy
// console.log(`originalArray[2].hello = "moon" // Will affect the original array and the shallow copy`)

// console.log("Original array:", ...originalArray) // 37 0 Object { hello: "moon" }
// console.log("Shallow copy:", ...shallowCopiedArray) // 37 3700 Object { hello: "moon" }
// console.log("Deep copy:", ...deepCopiedArray) // 37 3700 Object { hello: "world" }