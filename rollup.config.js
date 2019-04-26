import pkg from './package.json';

const external = Object.keys(pkg.dependencies);

const modulesSupported = ['cjs', 'es'];

const defaultModule = 'cjs';

export default {
  input: 'src/index.js',
  external,
  output: [
    ...modulesSupported.map(module => ({
      file: `lib/${pkg.name}${module !== defaultModule ? `.${module}` : ''}.js`,
      format: module
    }))
  ]
};
