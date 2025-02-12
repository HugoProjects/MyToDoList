const path = require('path');

module.exports = {
  // Ponto de entrada do seu aplicativo
  entry: './src/main.ts', // Altere para o caminho do seu arquivo principal TypeScript

  // Configurações de output
  output: {
    filename: 'bundle.js', // Nome do arquivo de saída
    path: path.resolve(__dirname, 'scripts'), // Pasta de saída
  },

  // Configurações de resolução de módulos
  resolve: {
    extensions: ['.ts', '.js'], // Extensões de arquivo que o Webpack vai resolver
  },

  // Configurações do módulo (loaders)
  module: {
    rules: [
      {
        test: /\.ts$/, // Aplica o ts-loader a arquivos TypeScript
        use: 'ts-loader',
        exclude: /node_modules/, // Ignora a pasta node_modules
      },
    ],
  },

  // Modo de desenvolvimento (pode ser 'production' para otimizações)
  mode: 'development',
};