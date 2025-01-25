const express = require('express');

const checklistsDependentRoute = express.Router();

const Checklist = require('../models/checklists');
const Task = require('../models/task');
const simpleRouter = express.Router();

//buscando sub tarefas na Tarefa principal
checklistsDependentRoute.get('/:id/tasks/new', async(req,res)=>{
	try{
		let task = new  Task();
		res.status(200).render('tasks/new',{checklistId:req.params.id,task:task});
	}catch(error){
		console.error(error)
		res.status(422).render('/pages/error',{errors:'Erro ao carregar o formulário'});
	}
});

//removendo sub tarefas dentro da Tarefa principal
simpleRouter.delete('/:id', async(req,res)=>{
	try{
		let task = await Task.findByIdAndDelete(req.params.id);
		let checklist = await Checklist.findById(task.checklist);
		let taskToRemove = checklist.tasks.indexOf(task._id);
		checklist.tasks.splice(taskToRemove,1);
		checklist.save();
		res.redirect(`/checklists/${checklist._id}`);
	}catch(error){

		res.status(422).render('/pages/error',{errors:'Erro ao remover uma tarefa'});
	}
})


//adicionando sub tarefas na Tarefa principal
checklistsDependentRoute.post('/:id/tasks', async(req,res)=>{
	let {name} = req.body.task;
	let task = new Task({name:name, checklist:req.params.id});
	try{
		await task.save();
		let checklist = await Checklist.findById(req.params.id);
		checklist.tasks.push(task);
		await checklist.save();
		res.redirect(`/checklists/${req.params.id}`);

	}catch(error){
		let errors = error.errors;
		console.log(errors);
		res.status(422).render('tasks/new',{task:{...task,errors}, checklistId:req.params.id});
	}
});

//atualizando paginas sem precisar de redirecionar para pagina atual
simpleRouter.put('/:id', async(req,res)=>{
	let task = await Task.findById(req.params.id);
	try{
		task.set(req.body.task);
		await task.save();
		res.status(200).json({task});
	}catch(error){
		let errors = error.errors;
		res.status(422).json({task:{...errors}});

	}
})



//exportando routas
module.exports = {
	checklistDependent:checklistsDependentRoute,
	simple:simpleRouter
}
