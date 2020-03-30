Vue.component('task', {
  template: '#template-task',
  props: ['task'],
  methods: {
    toggleTask: function(task) {
      task.completed = true;
      this.$http.patch('http://localhost:5000/api/tasks/' + task._id);
    },
    deleteTask: function( task){
      vm.tasks.splice(vm.tasks.indexOf(task),1);
      this.$http.delete('http://localhost:5000/api/tasks/' + task._id)
    },
    editTask: function(task){
      task.editing = true;
    },
    updateTask: function(task){
      this.$http.patch('http://localhost:5000/api/tasks/' + task._id, task)
      task.editing = false;
    },
    storeTask: function(task){
      this.$http.post('http://localhost:5000/api/tasks/', task).then(function() {
        task.editing = false;
        vm.fetchTasks();
      })
    }
  }
});

var vm = new Vue({
  el: '#app',
  data: {
    tasks: []
  },
  methods: {
    addTask: function(){
      var newTask = {
        "todo": "",
        "createdAt": "",
        "completed": false,
        "editing": true
      };
      vm.tasks.push(newTask);
    },
    fetchTasks: function() {
      this.$http.get('http://localhost:5000/api/tasks')
            .then(function(response) {
              var tasksReady = response.data.map(function (task) {
              task.editing = false;
              return task
              })
              this.tasks = tasksReady
            })
    }
  },
  mounted: function(){
      this.fetchTasks()
  }
});
