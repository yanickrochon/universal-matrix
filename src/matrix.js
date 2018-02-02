/**
* Matrix class
*/
class Matrix {

  static zero(rows, cols) {
    if (arguments.length < 2) {
      cols = rows;
    }

    if (!isNumber(rows) || (rows <= 0)) {
      throw new TypeError('Invalid matrix rows ' + rows);
    } else if (!isNumber(cols) || (cols <= 0)) {
      throw new TypeError('Invalid matrix columns ' + cols);
    }

    const m = new Matrix([0]);

    m.rows = rows;
    m.columns = cols;
    m.data.length = rows * cols;
    m.data.fill(0);

    return m;
  }

  static identity(n) {
    const m = Matrix.zero(n);

    for (let i = 0; i < n; ++i) {
      m.data[(i * n) + i] = 1;
    }

    return m;
  }

  static randomize(m, min, max) {
    if (!(m instanceof Matrix)) {
      throw new TypeError('Must be a matrix');
    }

    if (arguments.length === 1) {
      max = 1;
      min = 0;
    } else if (arguments.length === 2) {
      max = min;
      min = 0;
    }

    if (min > max) {
      max = [min, max = min][0];
    }

    for (let i = 0, len = m.data.length, multiplier = max - min; i < len; ++i) {
      m.data[i] = (Math.random() * multiplier) + min;
    }

    return m;
  }

  static determinant(m) {
    if (!(m instanceof Matrix)) {
      throw new TypeError('Must be a matrix');
    } else if (m.rows !== m.columns) {
      throw new Error('Not a square matrix');
    } else if (m.rows < 2) {
      throw new Error('Not a valid matrix');
    }

    if (m.rows > 2) {
      const subMatrix = m.clone().removeRow(0);
      let d = 0;

      for (let col = 0, mul = 1; col < m.columns; ++col, mul = mul * -1) {
          d = d + (m.data[col] * Matrix.determinant(subMatrix.clone().removeColumn(col)) * mul);
      }

      return d;
    } else {
      return (m.data[0] * m.data[3]) - (m.data[1] * m.data[2]);
    }
  }


  constructor(...rows) {
    if (!rows.length) {
      throw new Error('Matrix has no rows');
    }

    if ((rows.length === 1) && (rows[0] instanceof Matrix)) {
      this.rows = rows[0].rows;
      this.columns = rows[0].columns;
      this.data = rows[0].data.slice();
    } else if (Array.isArray(rows[0])) {
      this.rows = rows.length;
      this.columns = rows[0].length;

      if ((this.rows === 0) || (this.columns === 0)) {
        throw new Error('Matrix cannot be empty');
      } else if (this.rows > 1) {
        this.data = rows.reduce((data, row, rowIndex) => {
          if (!Array.isArray(row)) {
            throw new TypeError('Invalid data row ' + rowIndex);
          } else if (row.length !== this.columns) {
            throw new Error('Invalid number of columns in row ' + rowIndex);
          }
          data.push(...row);
          return data;
        });
      } else {
        this.data = rows[0];
      }
    } else {
      throw new TypeError('Invalid matrix data argument');
    }
  }


  get(row, col) {
    if (!isNumber(row) || (row < 0 || row >= this.rows)) {
      throw new TypeError('Invalid row ' + row);
    } else if (!isNumber(col) || (col < 0 || col >= this.columns)) {
      throw new TypeError('Invalid column ' + col);
    }

    return this.data[row * this.columns + col];
  }

  getRow(row) {
    if (!isNumber(row) || (row < 0 || row >= this.rows)) {
      throw new TypeError('Invalid row ' + row);
    }

    const index = row * this.columns;

    return this.data.slice(index, index + this.columns);
  }

  getColumn(col) {
    if (!isNumber(col) || (col < 0 || col >= this.columns)) {
      throw new TypeError('Invalid column ' + col);
    }

    const data = [];
    const rows = this.rows;
    const cols = this.columns;

    for (let i = 0, len = rows; i < len; ++i) {
      data[i] = this.data[i * cols + col];
    }

    return data;
  }

  set(row, col, val) {
    if (!isNumber(row) || (row < 0 || row >= this.rows)) {
      throw new TypeError('Invalid row ' + row);
    } else if (!isNumber(col) || (col < 0 || col >= this.columns)) {
      throw new TypeError('Invalid column ' + col);
    } else if (!isNumber(val)) {
      throw new TypeError('Invalid value for ' + row + "," + col);
    }

    this.data[row * this.columns + col] = val;

    return this;
  }

  setRow(row, data) {
    if (!isNumber(row) || (row < 0 || row >= this.rows)) {
      throw new TypeError('Invalid row ' + row);
    } else if (!Array.isArray(data) || data.some(value => !isNumber(value))) {
      throw new TypeError('Invalid row data');
    } else if (data.length < this.columns) {
      throw new Error('Insufficient row data length');
    }

    const index = row * this.columns;

    this.data.splice(index, index + this.columns, ...data);

    return this;
  }

  setColumn(col, data) {
    if (!isNumber(col) || (col < 0 || col >= this.columns)) {
      throw new TypeError('Invalid column ' + col);
    } else if (!Array.isArray(data) || data.some(value => !isNumber(value))) {
      throw new TypeError('Invalid column data');
    } else if (data.length < this.rows) {
      throw new Error('Insufficient column data length');
    }

    const rows = this.rows;
    const cols = this.columns;

    for (let i = 0, len = rows; i < len; ++i) {
      this.data[i * cols + col] = data[i];
    }

    return this;
  }

  apply(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('Apply to a non function argument');
    }

    const cols = this.columns;
    const data = this.data;

    for (let i = 0, len = data.length, col, row; i < len; ++i) {
      data[i] = fn(data[i], (i / cols) | 0, i % cols, data);
    }

    return this;
  }

  add(n) {
    if (isNumber(n)) {
      for (let i = 0, len = this.data.length; i < len; ++i) {
        this.data[i] = this.data[i] + n;
      }
    } else if (n instanceof Matrix) {
      if ((n.columns !== this.columns) || (n.rows !== this.rows)) {
        throw new TypeError('Incompatible addition matrix');
      }

      for (let i = 0, len = this.data.length; i < len; ++i) {
        this.data[i] = this.data[i] + n.data[i];
      }
    } else {
      throw new TypeError('Invalid addition argument');
    }

    return this;
  }

  multiply(n) {
    if (isNumber(n)) {
      for (let i = 0, len = this.data.length; i < len; ++i) {
        this.data[i] = this.data[i] * n;
      }
    } else if (n instanceof Matrix) {
      const columns = this.columns;
      const rows = this.rows;
      const data = this.data.slice();

      if ((n.rows !== columns) || (n.columns !== rows)) {
        throw new TypeError('Incompatible multiplication matrix');
      }

      this.columns = rows;
      this.rows = rows;
      this.data.length = rows * rows;

      for (let row = 0, col, sum; row < rows; ++row) {
        for (col = 0; col < rows; ++col) {
          sum = 0;

          for (let i = 0; i < columns; ++i) {
            sum = sum + (data[(row * columns) + i] * n.data[(i * rows) + col]);
          }

          this.data[(row * rows) + col] = sum;
        }
      }
    } else {
      throw new TypeError('Invalid multiplication argument');
    }

    return this;
  }

  mergeRows(removeRow, addToRow) {
    if (!isNumber(removeRow) || (removeRow < 0) || (removeRow >= this.rows)) {
      throw new TypeError('Invalid row to remove ' + removeRow);
    } else if (!isNumber(addToRow) || (addToRow < 0) || (addToRow >= this.rows)) {
      throw new TypeError('Invalid row to add to ' + addToRow);
    }

    const row = this.data.splice(removeRow * this.columns, this.columns);

    if (addToRow > removeRow) {
      addToRow = addToRow - 1;
    }

    this.rows = this.rows - 1;
    addToRow = addToRow * this.columns;

    for (let col = 0; col < this.columns; ++col) {
      this.data[addToRow + col] = this.data[addToRow + col] + row[col];
    }

    return this;
  }

  multiplyRow(row, n) {
    if (!isNumber(row) || (row < 0 || row >= this.rows)) {
      throw new TypeError('Invalid row ' + row);
    } else if (!isNumber(n)) {
      throw new TypeError('Invalid multiplication argument');
    } else if (n === 0) {
      throw new TypeError('Invalid multiplier ' + n);
    }

    for (let col = 0, cols = this.columns; col < cols; ++col) {
      this.data[(row * cols) + col] = this.data[(row * cols) + col] * n;
    }

    return this;
  }

  removeRow(row) {
    if (!isNumber(row) || (row < 0 || row >= this.rows)) {
      throw new TypeError('Invalid row ' + row);
    }
    const cols = this.columns;
    const index = row * cols;

    this.data.splice(index, cols);
    this.rows = this.rows - 1;

    return this;
  }

  removeColumn(col) {
    if (!isNumber(col) || (col < 0 || col >= this.columns)) {
      throw new TypeError('Invalid column ' + col);
    }

    const cols = this.columns;

    this.data = this.data.filter(function (v, i) { return (i % cols) !== col; });
    this.columns = cols - 1;

    return this;
  }

  transpose() {
    const rows = this.rows;;
    const columns = this.columns;
    const data = this.data.slice();

    this.columns = rows;
    this.rows = columns;

    for (let row = 0; row < rows; ++row) {
      for (let col = 0; col < columns; ++col) {
        this.data[(col * rows) + row] = data[(row * columns) + col];
      }
    }

    return this;
  }

  inverse(m) {
    const d = Matrix.determinant(this);

    if (d === 0) {
      return undefined;   // no inverse matrix
    }

    if (this.rows === 2) {
      const tmp = this.data[0];
      this.data[0] = this.data[3];
      this.data[3] = tmp;
      this.data[1] = -this.data[1];
      this.data[2] = -this.data[2];
    } else {
      const rows = this.rows;
      const columns = this.columns;
      const data = [];

      for (let index, modifier, row = 0; row < rows; ++row) {
        for (let col = 0; col < columns; ++col) {
          index = row * columns + col
          modifier = (col + (row % 2)) % 2 ? -1 : 1;

          data[index] = Matrix.determinant(this.clone().removeRow(row).removeColumn(col)) * modifier;
        }
      }

      this.data = data;
      this.transpose();
    }

    return this.multiply(1 / d);
  }

  clone() {
    return new Matrix(this);
  }

}


module.exports = Matrix;



function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
