# Matrix

[![CircleCI](https://circleci.com/gh/yanickrochon/universal-matrix.svg?style=svg)](https://circleci.com/gh/yanickrochon/universal-matrix)


## Installation

```
$ npm i universal-matrix --save
```


## Usage

```js
import Matrix from 'universal-matrix';

const matrix = new Matrix([1, 2, 3], [4, 5, 6], [7, 8, 9]);
```

```js
const Matrix = require('universal-matrix');

const matrix = new Matrix([1, 2, 3], [4, 5, 6], [7, 8, 9]);
```


## API

All methods are chainable and work directly on the matrix data (except for `clone`).


### *[static]* Matrix.identity(n)

Create an identity matrix of size `n * n`.

#### Arguments
* **n** *{Number}* : the size of the identity matrix

#### Return
* *{Matrix}* : an identity matrix of size `n`.

#### Example
```js
const matrix = Matrix.identity(3);
// 1  0  0
// 0  1  0
// 0  0  1
```


### *[static]* Matrix.determinant(matrix)

Return the matrix determinant. The given matrix must be square, and contain at
least 2 rows.

#### Arguments
* **matrix** *{Matrix}* : the matrix to calculate the determinant for

#### Return
* *{Number}* : the determinant

#### Example
```js
const matrix = new Matrix([6, 1, 1], [4, -2, 5], [2, 8, 7]);

Matrix.determinant(matrix);
//  -306
```


### *[static]* Matrix.inverse(matrix)

Return the inverse matrix. The given matrix must be square, and contain at
least 2 rows.

#### Arguments
* **matrix** *{Matrix}* : the matrix to get the inverse from

#### Return
* *{Matrix}* : the inverse matrix

#### Example
```js
const matrix = new Matrix([3, 0, 2], [2, 0, -2], [0, 1, 1]);

const inverse = Matrix.inverse(matrix);
//  0.2   0.2   0
// -0.2   0.3   1
//  0.2  -0.3   0
```


### *[constructor]* Matrix(...rows)

Create a new matrix with the given row values. Every row must be of same
size, otherwise an error will be thrown.

#### Arguments
* **...rows** *{Array}* : a list of arrays identifying each rows of the Matrix

#### Example
```js
const matrix = new Matrix([1, 2, 3], [4, 5, 6], [7, 8, 9]);
// 1  2  3
// 4  5  6
// 7  8  9
```


### matrix.add(n|matrix)

Add a scalar value `n` to every matrix element, or add two matrices together.
For matrix additions, both must have the same number of `rows` and `columns`.

#### Arguments
* **n** *{Number}* | **matrix** *{Matrix}* : a scalar or matrix to add to the current matrix elements

#### Return
* *{Matrix}* : matrix instance for method chaining

#### Example
```js
const matrix = new Matrix([-6, 2], [4, 0]);

matrix.add(-3);
// -9  -1
//  1  -3

matrix.add(new Matrix([0, 1], [-1, 0]));
// -9   0
//  0  -3
```


### matrix.multiply(n|matrix)

Multiply with a given scalar `n` or a specified matrix. For matrix multiplication,
both rows and columns from each matrices must be compatible.

#### Arguments
* **n** *{Number}* | **matrix** *{Matrix}* : a scalar or matrix to multiply to the current matrix elements

#### Return
* *{Matrix}* : matrix instance for method chaining

#### Example
```js
const matrix = new Matrix([2, 3, 4], [1, 0, 0]);

matrix.multiply(3);
// 6  9  12
// 3  0   0

matrix.multiply(new Matrix([0, 1000], [1, 100], [0, 10]));
// 9  7020
// 0  3000
```


### matrix.mergeRows(removeRow, addToRow)

Take one row and merge (add) it to another row. All rows are zero-based, meaning
that the first row is at position `0`, and the last row is at position `rows - 1`

#### Arguments
* **removeRow** *{Number}* : the row to remove from the matrix
* **addToRow** *{Number}* : the row to add the removed row to

#### Return
* *{Matrix}* : matrix instance for method chaining

#### Example
```js
const a = new Matrix([1, 2, 3], [0, 1, -6], [8, 2, 1]);

// merge the second row into the third row
a.mergeRows(1, 2);
//  1  2  3
//  8  3 -5

a.mergeRows(1, 0);
//  9  5 -2
```


### matrix.multiplyRow(row, multiplier)

Multiply only a single row by a scalar.

#### Arguments
* **row** *{Number}* : the row to multiply
* **n** *{Number}* : the scalar value to multiply the row with

#### Return
* *{Matrix}* : matrix instance for method chaining

#### Example
```js
const matrix = new Matrix([1, 2, 3], [0, 0, 7]);

matrix.multiplyRow(1, 1 / 7);
//  1  2  3
//  0  0  1
```


### matrix.removeRow(row)

Delete an entire row from the Matrix.

#### Arguments
* **row** *{Number}* : the row to remove

#### Return
* *{Matrix}* : matrix instance for method chaining

#### Example
```js
const matrix = new Matrix([1, 2, 3], [4, 5, 6], [7, 8, 9]);

matrix.removeRow(0);
//  4  5  6
//  7  8  9
```


### matrix.removeColumn(col)

Delete an entire column from the Matrix.

#### Arguments
* **col** *{Number}* : the column to remove

#### Return
* *{Matrix}* : matrix instance for method chaining

#### Example
```js
const matrix = new Matrix([1, 2, 3], [4, 5, 6], [7, 8, 9]);

matrix.removeColumn(1);
//  1  3
//  4  6
//  7  9
```


### matrix.transpose()

Transpose the matrix side ways, swaping rows and columns.

#### Return
* *{Matrix}* : matrix instance for method chaining

#### Example
```js
const matrix = new Matrix([1, 2, 3], [4, 5, 6]);

matrix.transpose();
//  1  4
//  2  5
//  3  6
```


### matrix.clone()

Because all matrix operations operate directly on the data, some cases may
require working on a different instance to preserve original data.

#### Return
* *{Matrix}* : matrix instance for method chaining

#### Example
```js
const matrix = new Matrix([1, 2, 3], [4, 5, 6]);
const copy = matrix.clone();

copy.multiply(-3);
//  -3  -6  -9
// -12 -15 -18

matrix.add(1);
//   2   3   4
//   5   6   7
```


## License

MIT
