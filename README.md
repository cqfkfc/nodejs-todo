# nodejs-todo

 ## To install
 `npm install`

 ## Examples
 `node .\todo-finder.js \test\test_example --case-sensitive true --count true`

```json
[
  { filepath: 'somedir\\somemodule\\somefile.js', value: 1 },
  { filepath: 'somefile.js', value: 1 }
]
```

`node .\todo-finder.js \test\test_example --case-sensitive false --count false`

```json
[
  'somedir\\somemodule\\somefile.js',
  'somedir\\somemodule\\someotherfile.js',
  'somedir2\\anotherdir\\index.js',
  'somedir2\\anotherdir\\yet_another_dir\\index.js',
  'somedir2\\index.js',
  'somedir3\\another_file.js',
  'somefile.js'
]
```

`node .\todo-finder.js \test\test_example --case-sensitive false --count true`

```json
[
  { filepath: 'somedir\\somemodule\\somefile.js', value: 2 },
  { filepath: 'somedir\\somemodule\\someotherfile.js', value: 1 },
  { filepath: 'somedir2\\anotherdir\\index.js', value: 1 },
  {
    filepath: 'somedir2\\anotherdir\\yet_another_dir\\index.js',
    value: 1
  },
  { filepath: 'somedir2\\index.js', value: 1 },
  { filepath: 'somedir3\\another_file.js', value: 1 },
  { filepath: 'somefile.js', value: 2 }
]
```

`node .\todo-finder.js \test\test_example --case-sensitive true --count false`

```json
[ 'somedir\\somemodule\\somefile.js', 'somefile.js' ]
```



 ##  run tests

 `npm test`

 Tests can be found at https://github.com/cqfkfc/nodejs-todo/blob/main/test/test.js
