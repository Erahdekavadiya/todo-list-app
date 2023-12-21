<!-- TodoList.vue -->
<template>
  <v-container v-if="isLoggedIn">
    <v-row>
      <v-col cols="12" class="mb-3">
        <v-text-field v-model="newTodoText" label="New Task" append-icon="mdi-plus-circle" @click:append="addTodo" clear-icon="mdi-close-circle" clearable filled></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :search="search"
      :items="filteredTodos"
      item-key="id"
      v-model="selectedItems"
      class="elevation-1"
      show-select
    >
      <template v-slot:top>
        <v-text-field v-model="search" label="Search Task" outlined prepend-icon="mdi-magnify"></v-text-field>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <v-chip :color="getStatusColor(item.status)"><v-icon class="me-2">{{ getStatusIcon(item.status) }}</v-icon>{{ item.status }}</v-chip>
      </template>
    </v-data-table>
    <v-row align="center" class="mt-3" v-if="selectedItems.length>0">
        <v-col cols="auto">
            <v-subheader>
            Action with selected 
            </v-subheader>
        </v-col>

        <v-col cols="auto">
            <v-select
                v-model="actionSelect"
                :items="actionSelectItems"
            ></v-select>
        </v-col>
        <v-col cols="auto">
            <v-btn @click="actionApply()" color="primary">Apply</v-btn>
        </v-col>
    </v-row>
  </v-container>  
</template>

<script>
import IndexedDBService from '@/services/IndexedDBService';
export default {
  props:['isLoggedIn'],
  data() {
    return {
      search: '',
      newTodoText: '',
      todos: [],
      actionSelect: null,
      actionSelectItems: ['Mark Completed','Mark Pending','Delete'],
      headers: [
        { title: 'Task', value: 'text', sortable: true },
        { title: 'Status', value: 'status', sortable: true },
      ],
      selectedItems: [],
    };
  },
  methods: {    
    getStatusColor(status) {
      return status === 'Completed' ? 'success' : 'warning';
    },
    getStatusIcon(status) {
      return status === 'Completed' ? 'mdi-clock-check-outline' : 'mdi-clock-alert-outline';
    },
    actionApply(){
        console.log(this.actionSelect);
        if(this.actionSelect == "Mark Completed"){
            this.updateStatus("Completed");
        }
        if(this.actionSelect == "Mark Pending"){
            this.updateStatus("Pending");
        }
        if(this.actionSelect == "Delete"){
            this.deleteSelected();
        }
    },
    fetchTodosFromIndexedDB() {
      IndexedDBService.getTodos()
        .then((todos) => {
          this.todos = todos;
        })
        .catch((error) => {
          this.$emit('childMethodTrigger', {text:error,status:true});
        });
    },
    addTodo() {
      if (this.newTodoText.trim() !== '') {
        const newTodo = { text: this.newTodoText, status: 'Pending' };
        IndexedDBService.addTodo(newTodo)
          .then((addedTodo) => {
            this.fetchTodosFromIndexedDB();
            this.newTodoText = '';
          })
          .catch((error) => {
            this.$emit('childMethodTrigger', {text:error,status:true});
          });
      } else {
        this.$emit('childMethodTrigger', {text:"Please add text first!",status:true});
      }
    },
    updateStatus(newStatus) {
      this.selectedItems.forEach((item) => {
        var updateItem = this.todos.filter(e=>e.id==item)[0];
        IndexedDBService.updateTodo(updateItem.id, newStatus)
          .then(() => {
            // Handle successful status update
            this.fetchTodosFromIndexedDB();
          })
          .catch((error) => {
            console.log(error);
            this.$emit('childMethodTrigger', {text:error,status:true});
          });
      });
    },
    deleteSelected() {
      this.selectedItems.forEach((item) => {
        var deleteItem = this.todos.filter(e=>e.id==item)[0];
        IndexedDBService.deleteTodo(deleteItem.id)
          .then(() => {
            this.fetchTodosFromIndexedDB();
          })
          .catch((error) => {
            this.$emit('childMethodTrigger', {text:"Don't deleting todos. Try again!",status:true});
          });
      });
    },
  },
  created() {
    if(this.isLoggedIn){
        this.fetchTodosFromIndexedDB()
    }
  },
  computed: {
    filteredTodos() {
      return this.todos.filter(todo =>
        todo.text.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
};
</script>

<style scoped>
.completed {
  text-decoration: line-through;
}
</style>
