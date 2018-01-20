const assert = require('assert');
const Matrix = require('../src/matrix');


describe('Testing Matrix', () => {

  describe('Testing matrix creation', () => {
    it('should create simple matrix', () => {
      const matrix = new Matrix([1, 2, 3], [4, 5, 6]);

      assert.deepStrictEqual( matrix.data, [ 1, 2, 3, 4, 5, 6 ] );
    });

    it('should fail with no or empty arguments', () => {
      assert.throws(() => new Matrix());

      [
        void 0, null, '', 0, []
      ].forEach(data => assert.throws(() => new Matrix(data)));
    });

    it('should fail if inconsistent row length', () => {
      assert.throws(() => new Matrix([1, 2, 3], [4, 5], [7, 8, 9]));
    });

    it('should fail if invalid row within rows', () => {
      assert.throws(() => new Matrix([1, 2, 3], null, [7, 8, 9]));
    });
  });


  describe('Testing matrix addition', () => {
    it('should pass scalar addition', () => {
      const a = new Matrix([1, 3, 1], [1, 0, 0]);
      const r = a.add(5);

      assert.strictEqual( r.rows, a.rows );
      assert.strictEqual( r.columns, a.columns );
      assert.deepStrictEqual( r.data, [6, 8, 6, 6, 5, 5] );
    });

    it('should pass matrix addition', () => {
      const a = new Matrix([1, 3, 1], [1, 0, 0]);
      const b = new Matrix([0, 0, 5], [7, 5, 0]);
      const r = a.add(b);

      assert.strictEqual( r.rows, a.rows );
      assert.strictEqual( r.columns, a.columns );
      assert.deepStrictEqual( r.data, [1, 3, 6, 8, 5, 0] );
    });

    it('should fail with invalid argument', () => {
      const a = new Matrix([1, 2, 3], [4, 5, 6]);

      [
        void 0, null, NaN, Infinity,
        '', 'test', [], {}, /./, new Date()
      ].forEach(b => assert.throws(() => a.add(b)));
    });

    it('should fail with incompatible matrix', () => {
      const a = new Matrix([1, 2, 3], [4, 5, 6]);

      [
        new Matrix([1, 2], [3, 4])
      ].forEach(b => assert.throws(() => a.add(b)));
    });
  });


  describe('Testing multiplication', () => {
    it('should pass scalar multiplication', () => {
      const a = new Matrix([1, 8, -3], [4, -2, 5]);
      const r = a.multiply(2);

      assert.strictEqual( r.rows, a.rows );
      assert.strictEqual( r.columns, a.columns );
      assert.deepStrictEqual( r.data, [2, 16, -6, 8, -4, 10] );
    });

    it('should pass matrix multiplication', () => {
      const a = new Matrix([2, 3, 4], [1, 0, 0]);
      const b = new Matrix([0, 1000], [1, 100], [0, 10]);
      const r = a.multiply(b);

      assert.strictEqual( r.rows, a.rows );
      assert.strictEqual( r.columns, a.rows );
      assert.deepStrictEqual( r.data, [3, 2340, 0, 1000] );
    });

    it('should fail with invalid argument', () => {
      const a = new Matrix([1, 2, 3], [4, 5, 6]);

      [
        void 0, null, NaN, Infinity,
        '', 'test', [], {}, /./, new Date()
      ].forEach(b => assert.throws(() => a.multiply(b)));
    });

    it('should fail with incompatible matrix', () => {
      const a = new Matrix([1, 2, 3], [4, 5, 6]);

      [
        new Matrix([1, 2], [3, 4]),
        new Matrix([1, 2, 4], [4, 5, 6]),
        new Matrix([1, 2, 4], [4, 5, 6], [7, 8, 9])
      ].forEach(b => assert.throws(() => a.multiply(b)));
    });
  });


  it('should transpose', () => {
    const matrix = new Matrix([1, 2, 3], [0, -6, 7]);
    const trans = matrix.clone().transpose();

    assert.deepStrictEqual( matrix.data, [ 1, 2, 3, 0, -6, 7 ] );
    assert.strictEqual( matrix.rows, trans.columns );
    assert.strictEqual( matrix.columns, trans.rows );
    assert.deepStrictEqual( trans.data, [ 1, 0, 2, -6, 3, 7 ] );
  });


  describe('Row Operations', () => {

    it('should merge two rows', () => {
      const a = new Matrix([1, 2, 3], [0, 1, -6], [8, 2, 1]);
      const r1 = a.clone().mergeRows(1, 2);
      const r2 = a.clone().mergeRows(2, 0);

      assert.strictEqual( r1.rows, 2 );
      assert.strictEqual( r1.columns, a.columns );
      assert.deepStrictEqual( r1.data, [ 1, 2, 3, 8, 3, -5 ] );

      assert.strictEqual( r2.columns, a.columns );
      assert.deepStrictEqual( r2.data, [ 9, 4, 4, 0, 1, -6 ] );
    });

    it('should fail merging rows', () => {
      const a = new Matrix([1, 2, 3], [0, 1, -6], [8, 2, 1]);

      [
        void 0, null, NaN, Infinity, '', 'test',
        [], {}, /./, new Date()
      ].forEach(row => {
        assert.throws(() => a.mergeRows(row, 0));
        assert.throws(() => a.mergeRows(0, row));
        assert.throws(() => a.mergeRows(row, row));
      });
    });

    it('should multiply row', () => {
      const a = new Matrix([1, 2, 3], [0, 1, -6], [8, 2, 1]);
      const r = a.clone().multiplyRow(1, 5);

      assert.strictEqual( r.columns, a.columns );
      assert.strictEqual( r.rows, a.rows );
      assert.deepStrictEqual( r.data, [1, 2, 3, 0, 5, -30, 8, 2, 1] );
    });

    it('should fail row multiplication', () => {
      const a = new Matrix([1, 2, 3], [0, 1, -6], [8, 2, 1]);

      [
        void 0, null, NaN, Infinity, '', 'test',
        [], {}, /./, new Date()
      ].forEach(row => assert.throws(() => a.multiplyRow(row, 1)));

      [
        0,  // cannot multiply by 0
        void 0, null, NaN, Infinity, '', 'test',
        [], {}, /./, new Date()
      ].forEach(multiplier =>  assert.throws(() => a.multiplyRow(0, multiplier)));
    });

  });


  describe('Testing removing row', () => {
    it('should remove rows', () => {
      const a = new Matrix([10, -2, 7], [-9, 1, 0], [4, 0, 3]);

      const r0 = a.clone().removeRow(0);
      assert.strictEqual(r0.rows, 2);
      assert.deepStrictEqual(r0.data, [-9, 1, 0, 4, 0, 3]);

      const r1 = a.clone().removeRow(1);
      assert.strictEqual(r1.rows, 2);
      assert.deepStrictEqual(r1.data, [10, -2, 7, 4, 0, 3]);

      const r2 = a.clone().removeRow(2);
      assert.strictEqual(r2.rows, 2);
      assert.deepStrictEqual(r2.data, [10, -2, 7, -9, 1, 0]);
    });

    it('should fail removing row', () => {
      const a = new Matrix([1, 2, 3], [4, 5, 6], [7, 8, 9]);

      [
        void 0, null, NaN, Infinity, '', 'test',
        [], {}, /./, new Date(),
        -2, -1, 3, 4
      ].forEach(row => assert.throws(() => a.removeRow(row)));
    });
  });


  describe('Testing removing column', () => {
    it('should remove columns', () => {
      const a = new Matrix([10, -2, 7], [-9, 1, 0], [4, 0, 3]);

      const r0 = a.clone().removeColumn(0);
      assert.strictEqual(r0.columns, 2);
      assert.deepStrictEqual(r0.data, [-2, 7, 1, 0, 0, 3]);

      const r1 = a.clone().removeColumn(1);
      assert.strictEqual(r1.columns, 2);
      assert.deepStrictEqual(r1.data, [10, 7, -9, 0, 4, 3]);

      const r2 = a.clone().removeColumn(2);
      assert.strictEqual(r2.columns, 2);
      assert.deepStrictEqual(r2.data, [10, -2, -9, 1, 4, 0]);
    });

    it('should fail removing column', () => {
      const a = new Matrix([1, 2, 3], [4, 5, 6], [7, 8, 9]);

      [
        void 0, null, NaN, Infinity, '', 'test',
        [], {}, /./, new Date(),
        -2, -1, 3, 4
      ].forEach(column => assert.throws(() => a.removeColumn(column)));
    });
  });


  describe('Testing identity matrix', () => {

    it('should create identity matrix', () => {
      const a1 = Matrix.identity(1);
      assert.strictEqual( a1.rows, 1 );
      assert.strictEqual( a1.columns, 1 );
      assert.deepStrictEqual( a1.data, [1] );

      const a2 = Matrix.identity(2);
      assert.strictEqual( a2.rows, 2 );
      assert.strictEqual( a2.columns, 2 );
      assert.deepStrictEqual( a2.data, [1, 0, 0, 1] );

      const a3 = Matrix.identity(3);
      assert.strictEqual( a3.rows, 3 );
      assert.strictEqual( a3.columns, 3 );
      assert.deepStrictEqual( a3.data, [1, 0, 0, 0, 1, 0, 0, 0, 1] );
    });

    it('should fail at creating identity matrix', () => {
      [
        void 0, null, NaN, Infinity, '', 'test',
        [], {}, /./, new Date(),
        -2, -1, 0
      ].forEach(n => assert.throws(() => Matrix.identity(n)));
    });
  });


  describe('Testing determinant of a matrix', () => {

    it('should calculate for a 2x2 matrix', () => {
      const matrix = new Matrix([3, 8], [4, 6]);
      const d = Matrix.determinant(matrix);

      assert.strictEqual(d, -14);
    });

    it('should calculate for a 3x3 matrix', () => {
      const matrix = new Matrix([6, 1, 1], [4, -2, 5], [2, 8, 7]);
      const d = Matrix.determinant(matrix);

      assert.strictEqual(d, -306);
    });

    it('should calculate for a 5x5 matrix', () => {
      const matrix = new Matrix([2, 0, -3, -4, 7], [1, 1, 0, 5, -2], [3, 2, 0, -7, 1], [3, 6, 4, 0, 0], [-1, 1, -1, 0, 6]);
      const d = Matrix.determinant(matrix);

      assert.strictEqual(d, 1044);
    });

    it('should fail for invalid matrix values', () => {
      [
        void 0, null, NaN, Infinity, 0, 1,
        '', 'test', new Date(), /./, () => {}, [], {},
        new Matrix([1]), new Matrix([1, 2]), new Matrix([1], [2])
      ].forEach(m => assert.throws(() => Matrix.determinant(m)));
    });

  });


  describe('Testing inverse matrix', () => {
    it('should find inverse for 2x2', () => {
      const a = new Matrix([4, 7], [2, 6]);
      const a1 = Matrix.inverse(a);
      const expected = [0.6, -0.7, -0.2, 0.4];

      a1.data.forEach((v, i) => assert.ok( Math.abs(v - expected[i]) < 0.0001 ));
    });

    it('should find inverse for 3x3', () => {
      const a = new Matrix([3, 0, 2], [2, 0, -2], [0, 1, 1]);
      const a1 = Matrix.inverse(a);
      const expected = [0.2, 0.2, 0, -0.2, 0.3, 1, 0.2, -0.3, 0];

      a1.data.forEach((v, i) => assert.ok( Math.abs(v - expected[i]) < 0.0001 ));
    });

    it('should find inverse for 5x5', () => {
      const a = new Matrix( [3, 0, 0, 0, 0], [2, -6, 0, 0, 0], [17, 14, 2, 0, 0], [22, -2, 15, 8, 0], [43, 12, 1, -1, 5] );
      const a1 = Matrix.inverse(a);
      const expected = [    1 /  3,     0,         0,      0,      0,
                            1 /  9,    -1 / 6,     0,      0,      0,
                          -65 / 18,     7 / 6,     1 / 2,  0,      0,
                          847 / 144, -107 / 48,  -15 / 16, 1 / 8,  0,
                         -889 / 720,  -67 / 240, -23 / 80, 1 / 40, 1 / 5 ];

      a1.data.forEach((v, i) => assert.ok( Math.abs(v - expected[i]) < 0.0001 ));
    })

    it('should be reciprocal', () => {
      const a = new Matrix([0, -2, 8], [-0.3, 1, 0], [0, 0, 1]);
      const a1 = Matrix.inverse(a);
      const a2 = Matrix.inverse(a1);

      a2.data.forEach((v, i) => assert.ok( Math.abs(v - a.data[i]) < 0.0001 ));
    });

    it('should return undefined when determinant is 0', () => {
      const a = new Matrix([2, 1], [6, 3]);
      const a1 = Matrix.inverse(a);

      assert.strictEqual( a1, undefined );
    });
  });

});
