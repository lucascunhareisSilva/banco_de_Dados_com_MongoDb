const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//Conectando ao MongoDb (supondo que o MongoDb esteja rodando localmente)
mongoose.connect('mongodb://localhost:27017/to-list').then(()=>{
	console.log('Conectado ao MongoDb!');
}).catch((err)=>{
	console.log("Erro ao conectar ao MongoDb",err);
});