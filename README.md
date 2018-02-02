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


### *[static]* Matrix.zero(rows[, cols])

Create a zero matrix of size `rows * cols`, or a square matrix of size `rows * rows`.

#### Arguments
* **rows** *{Number}* : the number or rows
* **cols** *{Number}* (optional) : the number of columns (equals to rows if not specified)

#### Return
* *{Matrix}* : a zero matrix of size `rows * columns`.

#### Example
```js
const square = Matrix.zero(3);
// 0  0  0
// 0  0  0
// 0  0  0

const matrix = Matrix.zero(2, 4);
// 0  0  0  0
// 0  0  0  0
```


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


### *[static]* Matrix.randomize(matrix[[, min][, max]])

Randomize the given matrix data.

#### Arguments
* **matrix** *{Matrix}* : the matrix to randomize
* **min** *{Number}* (optional) : the minimum value *(default `0`)*
* **max** *{Number}* (optional) : the maximum value *(default `1`)*

#### Return
* *{Matrix}* : matrix instance for method chaining

#### Example
```js
const matrices = [
  // random matrix of size 3 x 3, with values between [0, 1[
  Matrix.randomize(Matrix.zero(3)),

  // random matrix of size 3 x 3, with values between [0, 10[
  Matrix.randomize(Matrix.zero(3), 10),

  // random matrix of size 3 x 3, with values between [-3, 5[
  Matrix.randomize(Matrix.zero(3), -3, 5),
];
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

matrix.rows;
// 3

matrix.columns;
// 3

matrix.data;
// [1, 2, 3, 4, 5, 6, 7, 8, 9];
```


### matrix.get(row, col)

Get the value from the matrix. The rows and columns are 0-based.

#### arguments
* **row** *{Number}* : the row from `0` to `matrix.rows - 1`
* **col** *{Number}* : the column from `0` to `matrix.columns - 1`

#### Return
* *{Number}* : the matrix value

#### Example
```js
const matrix = new Matrix([1, 2, 3], [4, 5, 6], [7, 8, 9]);

matrix.get(2, 0);
// 7
```


### matrix.getRow(row)

Get the entire row from the matrix. The rows are 0-based.

#### arguments
* **row** *{Number}* : the row from `0` to `matrix.rows - 1`

#### Return
* *{Array}* : the matrix row

#### Example
```js
const matrix = new Matrix([1, 2, 3], [4, 5, 6], [7, 8, 9]);

matrix.getRow(2);
// [7  8  9]
```


### matrix.getColumn(col)

Get the entire column from the matrix. The columns are 0-based.

#### arguments
* **col** *{Number}* : the col from `0` to `matrix.columns - 1`

#### Return
* *{Array}* : the matrix column

#### Example
```js
const matrix = new Matrix([1, 2, 3], [4, 5, 6], [7, 8, 9]);

matrix.getColumn(2);
// [3, 6, 9]
```


### matrix.set(row, col, value)

Set the value of the matrix. The rows and columns are 0-based.

#### arguments
* **row** *{Number}* : the row from `0` to `matrix.rows - 1`
* **col** *{Number}* : the column from `0` to `matrix.columns - 1`
* **value** *{Number}* : the value to set

#### Return
* *{Matrix}* : matrix instance for method chaining

#### Example
```js
const matrix = new Matrix([1, 2, 3], [4, 5, 6], [7, 8, 9]);

matrix.set(2, 1, -88);
//  1   2   3
//  4   5   6
//  7 -88   9
```


### matrix.setRow(row, data)

Set the entire row of the matrix. The rows are 0-based.

#### arguments
* **row** *{Number}* : the row from `0` to `matrix.rows - 1`
* **data** *{Array}* : an array of data having the same length as `matrix.columns`

#### Return
* *{Matrix}* : matrix instance for method chaining

#### Example
```js
const matrix = new Matrix([1, 2, 3], [4, 5, 6], [7, 8, 9]);

matrix.setRow(2, [-9, -8, -7]);
//  1   2   3
//  4   5   6
// -9  -8  -7
```


### matrix.setColumn(col, data)

Set the entire column of the matrix. The columns are 0-based.

#### arguments
* **col** *{Number}* : the col from `0` to `matrix.columns - 1`
* **data** *{Array}* : an array of data having the same length as `matrix.rows`

#### Return
* *{Matrix}* : matrix instance for method chaining

#### Example
```js
const matrix = new Matrix([1, 2, 3], [4, 5, 6], [7, 8, 9]);

matrix.setColumn(2, [11, 12, 13]);
//  1   2  11
//  4   5  12
//  7   8  13
```


### matrix.apply(fn)

Apply a given function to the given values of the matrix. The function will
receive three (3) arguments:

* **val** *{Number}* : the matrix value to apply the function to
* **row** *{Number}* : the current row in the Matrix
* **col** *{Number}* : the current column in the matrix

#### Arguments
* **fn** *{Function}* : the function to call on each value

#### Return
* *{Matrix}* : matrix instance for method chaining

#### Example
```js
const matrix = new Matrix([1, 2], [3, 4]);

// matrix.apply(function (val) { return val * 2; });
matrix.apply(val => val * 2);
// 2  4
// 6  8
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


### matrix.inverse()

Return the inverse matrix. The matrix must be square, and contain at
least 2 rows.

#### Return
* *{Matrix}* : matrix instance for method chaining

#### Example
```js
const matrix = new Matrix([3, 0, 2], [2, 0, -2], [0, 1, 1]);

matrix.inverse();
//  0.2   0.2   0
// -0.2   0.3   1
//  0.2  -0.3   0

matrix.inverse();
//  3  0  2
//  2  0 -2
//  0  1  1
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
