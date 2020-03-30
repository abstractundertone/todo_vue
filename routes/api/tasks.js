const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get tasks
router.get('/', async (req, res) => {
  const tasks = await loadTasksCollection();
  res.send(await tasks.find({}).toArray());
})

//Add tasks
router.post('/', async (req, res) => {
  const tasks = await loadTasksCollection();
  await tasks.insertOne({
    todo: req.body.todo,
    completed: false,
    createdAt: new Date().toString().substr(0,24)
  });
  res.status(201).send();
})

//Update task status or content
router.patch('/:id', async (req, res) =>{
  const tasks = await loadTasksCollection();
  console.log(req.body.todo)
  if(req.body.todo != null) {
    await tasks.updateOne(
      {_id: new mongodb.ObjectID(req.params.id)},
      { $set: {"todo": req.body.todo,
               "createdAt": new Date().toString().substr(0,24) + ' *'
               }
      }
    )
  } else {
    await tasks.updateOne(
      {_id: new mongodb.ObjectID(req.params.id)},
      { $set: {"completed" : true }}
    );
  }

  res.status(200).send();
})

//Delete tasks
router.delete('/:id', async (req, res) => {
  const tasks = await loadTasksCollection();
  await tasks.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
  res.status(200).send();
  
})

//Connect to db
async function loadTasksCollection() {
  const client = await mongodb.MongoClient.connect('mongodb://localhost:27017/vue_todo_demo', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

  return client.db('vue_todo_demo').collection('tasks');
}

module.exports = router;
