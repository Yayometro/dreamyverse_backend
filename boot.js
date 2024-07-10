require('@babel/register')({
    extensions: ['.ts', '.js'],
    presets: ['@babel/preset-env', '@babel/preset-typescript'],
    plugins: ['@babel/plugin-transform-runtime'],
  });
  require('./src/index.ts');
  
  
  /*
A veces, el uso de babel-node con nodemon puede requerir que ajustes cómo se invocan los scripts. Aunque tu script actual debería funcionar, una alternativa es modificar el script de inicio para usar un archivo de arranque intermedio que use require en lugar de import
Cambia tu package:
"start": "nodemon boot.js"

  */