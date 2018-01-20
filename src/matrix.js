/**
* Matrix class
*/
class Matrix {

  static identity(n) {
    if (!isNumber(n) || (n <= 0)) {
      throw new TypeError('Invalid identity matrix of size ' + n);
    }

    const a = new Matrix([0]);

    a.rows = n;
    a.columns = n;
    a.data.length = n * n;
    a.data.fill(0);
    for (let i = 0; i < n; ++i) {
      a.data[(i * n) + i] = 1;
    }

    return a;
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

  static inverse(m) {
    const d = Matrix.determinant(m);
    let tmp;

    if (d === 0) {
      return undefined;   // no inverse matrix
    }

    m = m.clone();

    if (m.rows === 2) {
      tmp = m.data[0];
      m.data[0] = m.data[3];
      m.data[3] = tmp;
      m.data[1] = -m.data[1];
      m.data[2] = -m.data[2];

      return m.multiply(1 / d);
    } else {
      const mirrorMatrix = m.clone();
      const rows = m.rows;
      const columns = m.columns;

      for (let index, modifier, row = 0; row < rows; ++row) {
        for (let col = 0; col < columns; ++col) {
          index = row * columns + col
          modifier = (col + (row % 2)) % 2 ? -1 : 1;

          mirrorMatrix.data[index] = Matrix.determinant(m.clone().removeRow(row).removeColumn(col)) * modifier;
        }
      }

      mirrorMatrix.transpose();

      return mirrorMatrix.multiply(1 / Matrix.determinant(m));
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
      }

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
      throw new TypeError('Invalid matrix data argument');
    }
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

  clone() {
    return new Matrix(this);
  }

}


module.exports = Matrix;



function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
