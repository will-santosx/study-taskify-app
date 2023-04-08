import $ from "jquery";

interface Task {
    name: string;
    priority: string;
    time: string;
    status: string;
}

interface AllTasks {
    tasks: Task[];
}

const allTasks: AllTasks = {
    tasks: [],
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
            status: 'toDo',
        };
        addNewTask(newTask);
    }
});

function addNewTask(newTask: Task) {
    const toDoListContainer = $('#to-do-list .drop-zone');
    const taskPriority = $('.task-priority-option:checked').val();
    const taskPriorityName = $('.task-priority-option:checked').attr('data-text');
    const newTaskElement = $(`
        <div draggable="true" class="task-container">
            <div class="task-priority ${taskPriority}">
                <span>${taskPriorityName} prioridade</span>
            </div>
            <span class="task-title">${newTask.name}</span>
            <div class="task-info">
                <span id="task-date-info">${newTask.time} |</span>
                <button class="task-button-edit"><i class="fa-solid fa-pencil"></i></button>
                <button class="task-button-delete"><i class="fa-regular fa-trash-can"></i></button>
            </div>
        </div>
    `);

    infoMessage('Tarefa adicionada: ' + newTask.name);

    newTaskElement.find('.task-button-delete').on('click', function() {
        const index = allTasks.tasks.indexOf(newTask);
        if (index > -1) {
            allTasks.tasks.splice(index, 1);
        }
        infoMessage('Tarefa removida: ' + newTask.name);
        newTaskElement.remove();
    });

    newTaskElement.find('.task-button-edit').on('click', function() {
        const newName = prompt('Digite o novo nome da tarefa:', newTask.name);
        if (newName !== null && newName !== '') {
            infoMessage(`A tarefa: '${newTask.name}', Agora se chama '${newName}'`);
            newTask.name = newName;
            newTaskElement.find('.task-title').text(newName);
        }
    });

    newTaskElement.appendTo(toDoListContainer);

    const dropZones = document.querySelectorAll('.drop-zone');

    newTaskElement.on('dragstart', function(e){
        $(e.target).addClass('dragging-task');

        dropZones.forEach(dropzone => {
            $(dropzone).addClass('on');
        });
    })

    newTaskElement.on('dragend', function(e){
        $(e.target).removeClass('dragging-task');
        dropZones.forEach(dropzone => {
            $(dropzone).removeClass('on');
        });
    })

    dropZones.forEach(dropzone => {
        $(dropzone).on('dragover', (e) => {
            e.preventDefault();
            const draggingTask = document.querySelector('.dragging-task');
            if (draggingTask) {
                if (draggingTask !== e.currentTarget) {
                    e.currentTarget.appendChild(draggingTask);
                }
            }
        })

        $(dropzone).on('drop', function handler(e) {
            let droppedZoneID = e.currentTarget.parentElement ? e.currentTarget.parentElement.id : null;
            e.preventDefault();
        
            if(droppedZoneID == 'progress-list') {
                newTask.status = 'inProgress';
            } else if(droppedZoneID == 'done-list'){
                newTask.status = 'done';
            } else if(droppedZoneID == 'to-do-list'){
                newTask.status = 'toDo';
            }
        
            $(dropzone).off('drop', handler);
        });
    });
    allTasks.tasks.push(newTask);
}

function infoMessage(message: string) {
    const popup = $('.info-popup');
    const messageInfo = $('#info-message');
    popup.fadeIn(2000).fadeOut(3000);
    popup.css('display', 'flex');
    messageInfo.text(message);
    
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

$('input[name="prioritys"]').change(function() {
    $('input[name="prioritys"]').not(this).prop('checked', false);
});