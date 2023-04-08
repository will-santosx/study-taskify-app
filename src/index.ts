import $ from "jquery";

interface Task {
    name: string;
    priority: string;
    time: string;
}

interface AllTasks {
    toDo: Task[];
    inProgress: Task[];
    done: Task[];
}

const allTasks: AllTasks = {
    toDo: [],
    inProgress: [],
    done: []
};

const newTaskForm = $('#new-task-form');
const newTaskInputName = $('#input-name-new-task');

newTaskForm.on('submit', function(e) {
    e.preventDefault();



    let taskName = newTaskInputName.val();
    if (typeof taskName === 'string') {
        let newTask: Task = {
            name: taskName,
            priority: 'low',
            time: `${formatNumbers(new Date().getDate())}/${(formatNumbers(new Date().getMonth() + 1))} - ${formatNumbers(new Date().getHours())}:${formatNumbers(new Date().getMinutes())}`,
        };
        addNewTask(newTask);
    }
});

function addNewTask(newTask: Task) {
    const toDoListContainer = $('#to-do-list')
    const newTaskElement = $(`
        <div draggable="true" class="task-container">
            <div class="task-priority low">
                <span>Baixa prioridade</span>
            </div>
            <span class="task-title">${newTask.name}</span>
            <div class="task-info">
                <span id="task-date-info">${newTask.time} |</span>
                <button class="task-button-edit"><i class="fa-solid fa-pencil"></i></button>
                <button class="task-button-delete"><i class="fa-regular fa-trash-can"></i></button>
            </div>
        </div>
    `);

    newTaskElement.find('.task-button-delete').on('click', function() {
        const index = allTasks.toDo.indexOf(newTask);
        if (index > -1) {
            allTasks.toDo.splice(index, 1);
        }
        console.log(allTasks);
        newTaskElement.remove();
    });

    newTaskElement.find('.task-button-edit').on('click', function() {
        const newName = prompt('Digite o novo nome da tarefa:', newTask.name);
        if (newName !== null) {
            newTask.name = newName;
            newTaskElement.find('.task-title').text(newName);
        }
        console.log(allTasks);
    });

    newTaskElement.appendTo(toDoListContainer);

    allTasks.toDo.push(newTask);
    console.log(allTasks);
}


function formatNumbers(date: number) {
    let result;
    if (date < 10) {
        result = `0${date}`;
    } else {
        result = date;
    }
    return result;
}
