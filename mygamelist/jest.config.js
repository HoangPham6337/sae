const config = {
  testEnvironment: "node", // Configure Jest pour un environnement Node.js
   transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest', // Si vous utilisez JSX ou ES6
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],

  collectCoverage: true,
  

  collectCoverageFrom: [
    "!src/**/*.test.{js,jsx}" // Exclure les fichiers de test
  ],
  
  coverageReporters: ["text", "lcov"], 
  
  verbose: true,

  };

  export default config;