{
  "compilerOptions": {
    "target": "ES5",
    "module": "commonjs",
    "moduleResolution": "node",
    "removeComments": true,
    "declaration": true,
    "outDir": "./dist/node",
    "declarationDir": "./dist/types/",
    "strict": true,
    "lib": [
      "esnext"
    ]
  },
  "include": ["src"],
  "exclude": [
    "@types",
    "node_modules",
    "**/*.spec.ts",
    "**/*.test.ts"
  ]
}
