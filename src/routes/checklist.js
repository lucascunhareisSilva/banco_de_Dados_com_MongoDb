const express = require('express');

const router = express.Router();

const Checklist = require('../models/checklists');


//buscando por task
router.get('/', async (req,res)=> {
	try{
		let checklists = await Checklist.find({});
		res.status(200).render('checklists/index',{checklists:checklists});

	}catch(error){
		//res.status(500).json(erro);
		res.status(500).render('pages/error',{error:'Errro ao exibir as Listas'});
	}
});
//nova rota para form 
router.get('/new', async(req,res)=>{
	try{
		let checklist = new Checklist();
		res.status(200).render('checklists/new',{checklist:checklist});
	}catch(error){
		res.status(500).render('pages/error',{error:'Erro ao carregar o formulario'})
	}
});

//editar dados pelo formulario
router.get('/:id/edit',async(req,res)=>{
	try{
		let checklist = await Checklist.findById(req.params.id);
		res.status(200).render('checklists/edit',{checklist:checklist})
	}catch(error){
		res.status(500).render('pages/error',{error:"Erro ao exibir edição de Listas de tarefas"});
	}
});


//adicionando por task pelo form 
router.post('/', async (req,res)=>{
	let {name} = req.body.checklist;
	let checklist = new Checklist({name});

	try{
	await checklist.save();
	res.redirect('/checklists');
	}catch(error){
		res.status(422).render('checklists/new',{checklist:{...checklist, error}})
	}
});


//buscando por task por ID
router.get('/:id', async (req,res)=>{
	try{
		let checklist = await Checklist.findById(req.params.id).populate('tasks');
		res.status(200).render('checklists/show',{checklist:checklist});
	}catch(error){ 
		res.status(500).render('pages/error',{error:'Errro ao exibir as Listas'});
	}
});

//atualizando dados a partir do ID
router.put('/:id',async (req,res)=>{
	let {name} = req.body.checklist;
	let checklist = await Checklist.findById(req.params.id);


	try{
		await checklist.updateOne({name});
		res.redirect('/checklists');
	}catch(error){
		let errors =  error.errors;
		res.status(422).render('checklists/edit',{checklist:{...checklist,errors}})

	}
});
//deletando dados a partir do ID e tambem pelo formulario
router.delete('/:id', async (req,res)=>{
	try{
		let checklist = await Checklist.findByIdAndDelete(req.params.id);
		res.redirect('/checklists');
	}catch(error){
	res.status(500).render('pages/error',{error:'Erro ao deletar a lista de tarefas'});

	}
})
module.exports = router;