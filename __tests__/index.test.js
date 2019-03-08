import fs from 'fs';
import path from 'path';
import gendiff from '../src';

describe('Calculate difference between two files', () => {
  const findFixture = name => path.join(__dirname, '__fixtures__', name);

  const runTests = (firstFileName, secondFileName, expectedFileName, format = 'graphical') => {
    describe(`with ${format} output format`, () => {
      test.each(['.json', '.yml', '.ini'])(
        'with extensions of %s', (i) => {
          const firstFilePath = findFixture(`${firstFileName}${i}`);
          const secondFilePath = findFixture(`${secondFileName}${i}`);
          const expected = fs.readFileSync(findFixture(`${expectedFileName}`), 'utf-8');
          expect(gendiff(firstFilePath, secondFilePath, format)).toBe(expected);
        },
      );

      test.each([
        ['.json', '.yml'],
        ['.yml', '.json'],
        ['.json', '.ini'],
        ['.ini', '.json'],
        ['.yml', '.ini'],
        ['.ini', '.yml'],
      ])(
        'with extensions of %s and %s',
        (ex1, ex2) => {
          const firstFilePath = findFixture(`${firstFileName}${ex1}`);
          const secondFilePath = findFixture(`${secondFileName}${ex2}`);
          const expected = fs.readFileSync(findFixture(`${expectedFileName}`), 'utf-8');
          expect(gendiff(firstFilePath, secondFilePath, format)).toBe(expected);
        },
      );
    });
  };

  runTests('before', 'after', 'expected');
  runTests('before-recursive', 'after-recursive', 'expected-recursive');
  runTests('before', 'after', 'expected-plain', 'plain');
  runTests('before-recursive', 'after-recursive', 'expected-recursive-plain', 'plain');
});
