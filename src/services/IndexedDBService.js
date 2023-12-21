// IndexedDBService.js
const DB_NAME = 'todoDB - Er A H Dekavadiya';
const STORE_NAME = 'todos';

const IndexedDBService = {
  openDatabase() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, 1);

      request.onerror = (event) => {
        reject(`IndexedDB error: ${event.target.error}`);
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        
        // Sample data
        const todos = [
            { id: 1, text: 'Buy groceries', status: 'Pending' },
            { id: 2, text: 'Walk the dog', status: 'Completed' },
            { id: 3, text: 'Finish homework', status: 'Pending' },
            { id: 4, text: 'Call mom', status: 'Pending' },
            { id: 5, text: 'Prepare presentation', status: 'Pending' },
            { id: 6, text: 'Read a book', status: 'Completed' },
            { id: 7, text: 'Go to the gym', status: 'Pending' },
            { id: 8, text: 'Pay bills', status: 'Completed' },
            { id: 9, text: 'Clean the house', status: 'Pending' },
            { id: 10, text: 'Learn Vue.js', status: 'Completed' },
            { id: 11, text: 'Cook dinner', status: 'Pending' },
            { id: 12, text: 'Write blog post', status: 'Pending' },
            { id: 13, text: 'Practice guitar', status: 'Pending' },
            { id: 14, text: 'Watch a movie', status: 'Pending' },
            { id: 15, text: 'Plan vacation', status: 'Pending' },
            { id: 16, text: 'Visit the dentist', status: 'Pending' },
            { id: 17, text: 'Organize files', status: 'Pending' },
            { id: 18, text: 'Do laundry', status: 'Completed' },
            { id: 19, text: 'Buy birthday gift', status: 'Pending' },
            { id: 20, text: 'Attend meeting', status: 'Pending' },
            { id: 21, text: 'Read news', status: 'Completed' },
            { id: 22, text: 'Exercise', status: 'Completed' },
            { id: 23, text: 'Practice meditation', status: 'Pending' },
            { id: 24, text: 'Water the plants', status: 'Completed' },
            { id: 25, text: 'Write thank you notes', status: 'Pending' },
            { id: 26, text: 'Study for exam', status: 'Pending' },
            { id: 27, text: 'Do yoga', status: 'Completed' },
            { id: 28, text: 'Take out trash', status: 'Pending' },
            { id: 29, text: 'Fix broken shelf', status: 'Pending' },
            { id: 30, text: 'Learn a new recipe', status: 'Pending' },
            { id: 31, text: 'Create to-do app', status: 'Pending' },
            { id: 32, text: 'Volunteer at shelter', status: 'Pending' },
            { id: 33, text: 'Visit grandparents', status: 'Pending' },
            { id: 34, text: 'Paint the fence', status: 'Pending' },
            { id: 35, text: 'Check emails', status: 'Pending' },
            { id: 36, text: 'Shop for clothes', status: 'Pending' },
            { id: 37, text: 'Fix leaking faucet', status: 'Pending' },
            { id: 38, text: 'Learn a new language', status: 'Pending' },
            { id: 39, text: 'Go for a run', status: 'Completed' },
            { id: 40, text: 'Buy new phone', status: 'Pending' },
            { id: 41, text: 'Attend webinar', status: 'Pending' },
            { id: 42, text: 'Read tech articles', status: 'Pending' },
            { id: 43, text: 'Create music playlist', status: 'Pending' },
            { id: 44, text: 'Solve crossword puzzle', status: 'Pending' },
            { id: 45, text: 'Practice drawing', status: 'Pending' },
            { id: 46, text: 'Learn photography', status: 'Pending' },
            { id: 47, text: 'Write poetry', status: 'Pending' },
            { id: 48, text: 'Plant a tree', status: 'Pending' },
            { id: 49, text: 'Create budget plan', status: 'Pending' },
            { id: 50, text: 'Visit the library', status: 'Pending' }
        ];
        todos.forEach(e=>{
            this.addTodo(e);
        })
      };
    });
  },

  getTodos() {
    return this.openDatabase().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.getAll();

        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        request.onerror = (event) => {
          reject(`Error fetching todos: ${event.target.error}`);
        };
      });
    });
  },

  addTodo(todo) {
    return this.openDatabase().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.add(todo);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = (event) => {
          reject(`Error adding todo: ${event.target.error}`);
        };
      });
    });
  },

  updateTodo(todoId, newStatus) {
    return this.openDatabase().then((db) => {
        return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        
        const request = objectStore.get(todoId);
        
        request.onsuccess = (event) => {
            const todo = event.target.result;
            
            if (todo) {
            todo.status = newStatus;
            const updateRequest = objectStore.put(todo);
            
            updateRequest.onsuccess = () => {
                resolve();
            };
            
            updateRequest.onerror = () => {
                reject('Error updating todo status');
            };
            } else {
            reject('Todo not found');
            }
        };
        
        request.onerror = () => {
            reject('Error fetching todo');
        };
        });
    });
  },

  deleteTodo(todoId) {
    return this.openDatabase().then((db) => {
        return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        
        const deleteRequest = objectStore.delete(todoId);
        
        deleteRequest.onsuccess = () => {
            resolve();
        };
        
        deleteRequest.onerror = () => {
            reject('Error deleting todo');
        };
        });
    });
  },
};

export default IndexedDBService;
