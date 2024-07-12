Argument Validator
===============

Simple JavaScript Argument Validator.

[![Build Status](https://travis-ci.org/Deividy/argument-validator.png?branch=master)](https://travis-ci.org/Deividy/argument-validator)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://github.com/Deividy/argument-validator)
[![npm](https://img.shields.io/npm/l/express.svg)](https://github.com/Deividy/argument-validator)

[![NPM](https://nodei.co/npm/argument-validator.png?mini=true)](https://nodei.co/npm/argument-validator)


## Fail First
Argument Validator main principle is ***Fail First***, we don't want to send wrong values through all our code.
Although, we don't want to throw an exception to everything we get from user input, but we do want to validate(and throw first) when we receive something unexpected in our core functions.

***Sugar*** - We expose the `is*` and `has*` functions, it can be handy.

***Note***  - By default all validations check also for null/empty, e.g. `ArgumentValidator.array([])` will throw because is an empty array, to  validate only type use `type()` or the `*OrEmpty()` functions, e.g. `ArgumentValidator.arrayOrEmpty([])`

---
## About

We all know that JavaScript has no type checking, also we know that's not a good practice to `throw` errors with Node.JS, because it's async and we don't want to take down our app, do some global handler or something fancy. but...

Inside our core, when we receive an argument the most part of time we expect that argument is in such type, so we can perform methods of that type (`substring`/`slice`/`toFixed`...) and if it's not in correct type it will throw an ugly `TypeError` exception, if it's in a nested function will be a rabbit hole try to figure out where that value come at first.

A lot of languages has this kind of checking internally, but we're talking about ***JavaScript*** here. :)

Imagine this cenario;
```javascript

function Rabbit (name) {
  this.name = name;
}

function Hole (rabbit) {
  this.rabbit = rabbit;
}

Hole.prototype.firstRabbitLetter = function () {
  return this.rabbit.name.substring(0, 1);
};

var h = new Hole(new Rabbit());
console.log(h.firstRabbitLetter());

```

With that code, we'll have this stack trace in Node.JS:
```
argument-validator/argument-validator.js:145
        return this.rabbit.name.substring(0, 1);
                                ^
TypeError: Cannot call method 'substring' of undefined
    at Hole.firstRabbitLetter (argument-validator/argument-validator.js:145:33)
    at Object.<anonymous> (argument-validator/argument-validator.js:149:19)
    at Object.<anonymous> (argument-validator/argument-validator.js:150:4)
    at Module._compile (module.js:456:26)
    at Object.Module._extensions..js (module.js:474:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Function.Module.runMain (module.js:497:10)
    at startup (node.js:119:16)
    at node.js:906:3
```

We know that our rabbit inside a `Hole` class has an undefined name, and the method `firstRabbitLetter` is trying to get it's first letter, but...

How it get there without a rabbit name? Did we pass an undefined name in the constructor or it lost the name property a long the way? Where is the declaration of `new Hole()` and `new Rabbit()` ?

Our stack trace doesn't give us that, so the way to figure out would be something like put a breakpoint in `firstRabbitLetter` and dig it.

Wouldn't be better if we throw first at the `new Rabbit()`, so we don't need to go that deep?

Try that:
```javascript

function Rabbit (name) {
  ArgumentValidator.string(name, 'name');
  this.name = name;
}
/* .... */
function Hole(rabbit) {
  ArgumentValidator.instanceOf(Rabbit, rabbit, 'rabbit');
  this.rabbit = rabbit;
}
/* .... */
```

Stack trace:
```
argument-validator/argument-validator.js:6
        throw new Error(msg);
              ^
Error: Invalid string value: undefined
Argument name: name
    at error (argument-validator/argument-validator.js:6:15)
    at Object.string (argument-validator/argument-validator.js:16:24)
    at new Rabbit (argument-validator/argument-validator.js:137:11)
    at Object.<anonymous> (argument-validator/argument-validator.js:149:22)
    at Object.<anonymous> (argument-validator/argument-validator.js:151:4)
    at Module._compile (module.js:456:26)
    at Object.Module._extensions..js (module.js:474:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Function.Module.runMain (module.js:497:10)
```

In that case it's not making a huge difference, but at least we have sure that our `undefined` is coming from Rabbit constructor. In more nested cenarios it will make more difference, that small example is only for you have a feeling of what we're talking about here.

***Bonus*** - Using this practice let your code more readable, everyone who reads the code will know exactly what arguments it expects.

## Get it

npm:
```
npm install argument-validator
```

bower:
```
bower install argument-validator
```

unix:
```
wget https://raw.githubusercontent.com/Deividy/argument-validator/master/argument-validator.js
```

---
## Methods
- [notNull / isNotNull](#notnull--isnotnull)
- [instanceOf / isInstanceOf](#instanceof--isinstanceof)
- [type / isType](#type--istype)
- [boolean / isBoolean](#boolean--isboolean)
- [stringOrEmpty / isStringOrEmpty](#stringorempty--isstringorempty)
- [string / isString](#string--isstring)
- [number / isNumber](#number--isnumber)
- [arrayOrEmpty / isArrayOrEmpty](#arrayorempty--isarrayorempty)
- [array / isArray](#array--isarray)
- [arrayOfNumbers / isArrayOfNumbers](#arrayofnumbers--isarrayofnumbers)
- [arrayOfObjects / isArrayOfObjects](#arrayofobjects--isarrayofobjects)
- [objectOrEmpty / isObjectOrEmpty](#objectorempty--isobjectorempty)
- [object / isObject](#object--isobject)
- [function / isFunction](#function--isfunction)
- [json / isJson](#json--isjson)
- [jsonString / isJsonString](#jsonstring--isjsonstring)
- [keys / hasKeys](#keys--haskeys)
- [keysWithNumber / hasKeysWithNumber](#keyswithnumber--haskeyswithnumber)
- [numberKeys / hasNumberKeys](#numberkeys--hasnumberkeys)
- [keysWithString / hasKeysWithString](#keyswithstring--haskeyswithstring)
- [stringKeys / hasStringKeys](#stringkeys--hasstringkeys)
- [keysWithObject / hasKeysWithObject](#keyswithobject--haskeyswithobject)
- [objectKeys / hasObjectKeys](#objectkeys--hasobjectkeys)
- [keysWithStringOrEmpty / hasKeysWithStringOrEmpty](#keyswithstringorempty--haskeyswithstringorempty)
- [stringOrEmptyKeys / hasStringOrEmptyKeys](#stringoremptykeys--hasstringoremptykeys)
- [keysWithObjectOrEmpty / hasKeysWithObjectOrEmpty](#keyswithobjectorempty--haskeyswithobjectorempty)
- [objectOrEmptyKeys / hasObjectOrEmptyKeys](#objectoremptykeys--hasobjectoremptykeys)

---

### notNull / isNotNull
```javascript
ArgumentValidator.notNull(value, optionalArgumentName);
ArgumentValidator.isNotNull(value);
```

### instanceOf / isInstanceOf
```javascript
ArgumentValidator.instanceOf(Class, value, optionalArgumentName);
ArgumentValidator.isInstanceOf(Class, value);
```

### type / isType
```javascript
ArgumentValidator.type(type, value, optionalArgumentName);
ArgumentValidator.isType(type, value);
```

### boolean / isBoolean
```javascript
ArgumentValidator.boolean(value, optionalArgumentName);
ArgumentValidator.isBoolean(value);
```

### stringOrEmpty / isStringOrEmpty
```javascript
ArgumentValidator.stringOrEmpty(value, optionalArgumentName);
ArgumentValidator.isStringOrEmpty(value);
```

### string / isString
```javascript
ArgumentValidator.string(value, optionalArgumentName);
ArgumentValidator.isString(value);
```

Validate agains type, simple call to `Object.prototype.toString` and check `if "[object " + type + "]"`.

```javascript
(function () {
    ArgumentValidator.type('Date', new Date());
}).should.not.throw();

(function () {
    ArgumentValidator.type('Date', '223');
}).should.throw();
```

```javascript
ArgumentValidator.isType('Date', new Date()).should.be.true;
ArgumentValidator.isType('Date', '[object Date]').should.be.false;
ArgumentValidator.isType('Number', 123).should.be.true;
ArgumentValidator.isType('Number', '123').should.be.false;
```

### number / isNumber
```javascript
ArgumentValidator.number(value, optionalArgumentName);
ArgumentValidator.isNumber(value);
```

Validate against type `Number`, against `isInfinite` and `isNaN`.

```javascript
(function () {
    ArgumentValidator.number(5);
    ArgumentValidator.number(4/'2');
    ArgumentValidator.number(12.5235134);
}).should.not.throw();

(function () { ArgumentValidator.number('5'); }).should.throw();
(function () { ArgumentValidator.number(1/0); }).should.throw();
(function () { ArgumentValidator.number(1/'A'); }).should.throw();
```

```javascript
ArgumentValidator.isNumber(5).should.be.true;
ArgumentValidator.isNumber(12.5235134).should.be.true;
ArgumentValidator.isNumber(4 / '2').should.be.true;
ArgumentValidator.isNumber('4' / 2).should.be.true;
ArgumentValidator.isNumber('5').should.be.false;
ArgumentValidator.isNumber(1/0).should.be.false;
```

### arrayOrEmpty / isArrayOrEmpty
```javascript
ArgumentValidator.arrayOrEmpty(value, optionalArgumentName);
ArgumentValidator.isArrayOrEmpty(value);
```

### array / isArray
```javascript
ArgumentValidator.array(value, optionalArgumentName);
ArgumentValidator.isArray(value);
```

### arrayOfNumbers / isArrayOfNumbers
```javascript
ArgumentValidator.arrayOfNumbers(value, optionalArgumentName);
ArgumentValidator.isArrayOfNumbers(value);
```

### arrayOfObjects / isArrayOfObjects
```javascript
ArgumentValidator.arrayOfObjects(value, optionalArgumentName);
ArgumentValidator.isArrayOfObjects(value);
```

### objectOrEmpty / isObjectOrEmpty
```javascript
ArgumentValidator.objectOrEmpty(value, optionalArgumentName);
ArgumentValidator.isObjectOrEmpty(value);
```

### object / isObject
```javascript
ArgumentValidator.object(value, optionalArgumentName);
ArgumentValidator.isObject(value);
```

### function / isFunction
```javascript
ArgumentValidator.function(value, optionalArgumentName);
ArgumentValidator.isFunction(value);
```

### json / isJson
```javascript
ArgumentValidator.json(value, optionalArgumentName);
ArgumentValidator.isJson(value);
```

### jsonString / isJsonString
```javascript
ArgumentValidator.jsonString(value, optionalArgumentName);
ArgumentValidator.isJsonString(value);
```

### keys / hasKeys
```javascript
ArgumentValidator.keys(value, [ keys ], optionalArgumentName);
ArgumentValidator.hasKeys(value, [ keys ]);
```

### keysWithNumber / hasKeysWithNumber
```javascript
ArgumentValidator.keysWithNumber(value, [ keys ], optionalArgumentName);
ArgumentValidator.hasKeysWithNumber(value, [ keys ]);
```

### numberKeys / hasNumberKeys
```javascript
ArgumentValidator.numberKeys(value, [ keys ], optionalArgumentName);
ArgumentValidator.hasNumberKeys(value, [ keys ]);
```

### keysWithString / hasKeysWithString
```javascript
ArgumentValidator.keysWithString(value, [ keys ], optionalArgumentName);
ArgumentValidator.hasKeysWithString(value, [ keys ]);
```

### stringKeys / hasStringKeys
```javascript
ArgumentValidator.stringKeys(value, [ keys ], optionalArgumentName);
ArgumentValidator.hasStringKeys(value, [ keys ]);
```

### keysWithObject / hasKeysWithObject
```javascript
ArgumentValidator.keysWithObject(value, [ keys ], optionalArgumentName);
ArgumentValidator.hasKeysWithObject(value, [ keys ]);
```

### objectKeys / hasObjectKeys
```javascript
ArgumentValidator.objectKeys(value, [ keys ], optionalArgumentName);
ArgumentValidator.hasObjectKeys(value, [ keys ]);
```



### keysWithStringOrEmpty / hasKeysWithStringOrEmpty
```javascript
ArgumentValidator.keysWithStringOrEmpty(value, [ keys ], optionalArgumentName);
ArgumentValidator.hasKeysWithStringOrEmpty(value, [ keys ]);
```

### stringOrEmptyKeys / hasStringOrEmptyKeys
```javascript
ArgumentValidator.stringOrEmptyKeys(value, [ keys ], optionalArgumentName);
ArgumentValidator.hasStringOrEmptyKeys(value, [ keys ]);
```

### keysWithObjectOrEmpty / hasKeysWithObjectOrEmpty
```javascript
ArgumentValidator.keysWithObjectOrEmpty(value, [ keys ], optionalArgumentName);
ArgumentValidator.hasKeysWithObjectOrEmpty(value, [ keys ]);
```

### objectOrEmptyKeys / hasObjectOrEmptyKeys
```javascript
ArgumentValidator.objectOrEmptyKeys(value, [ keys ], optionalArgumentName);
ArgumentValidator.hasObjectOrEmptyKeys(value, [ keys ]);
```

---
## More?
Please check `specs/` to more examples or read the full code, it's really small.

If you have any suggestion, please don't be shy, [fork us](https://github.com/Deividy/argument-validator/fork) or [open an issue](https://github.com/Deividy/argument-validator/issues).

