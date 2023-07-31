
let notesData = [
    { id: 1, name:'Shopping list', time: '25/07/2023 10:30', content: 'Tomatoes, bread', category: 'Task', dates: '25/07/2023' },
    { id: 2, name:'The theory of evolution', time: '25/07/2023 11:15', content: 'The evolution ensures the existence', category: 'Random Thought', dates: '29/07/2023' },
    { id: 3, name:'New feature', time: '25/07/2023 13:45', content: 'Implement new', category: 'Idea', dates: '29/07/2023' },
    { id: 4, name: 'William Gaddins', time: '25/07/2023 13:45', content: 'Power does not contain', category: 'Quote', dates: '29/07/2023' },
    { id: 5, name:'Books', time: '25/07/2023 13:45', content: 'The lean Startup', category: 'Task', dates: '29/07/2023' },
];
notesData = notesData.map((note) => ({ ...note, archived: false }));
// Function to render the notes table
function renderNotesTable() {
    const tableBody = document.getElementById('notesTableBody');
    tableBody.innerHTML = '';

    for (const note of notesData) {
        const tr = document.createElement('tr');
        tr.id = `noteRow-${note.id}`;
        tr.style.display = note.archived ? 'none' : 'table-row';
        tr.innerHTML = `
            <td contenteditable="true" data-field="name">${note.name}</td>
            <td>${note.time}</td>
            <td>
                <div class="col">
                <select class="form-control gray-bg" onchange="updateNoteData(this, ${note.id}, 'category')">
                <option value="Task" ${note.category === 'Task' ? 'selected' : ''}>Task</option>
                <option value="Random Thought" ${note.category === 'Random Thought' ? 'selected' : ''}>Random Thought</option>
                <option value="Idea" ${note.category === 'Idea' ? 'selected' : ''}>Idea</option>
                <option value="Quote" ${note.category === 'Quote' ? 'selected' : ''}>Quote</option>
                </select>
                </div>
            </td>
            <td contenteditable="true" data-field="content">${note.content}</td>
            <td contenteditable="true" data-field="dates">${note.dates}</td>
            <td>
                <button class="btn btn-sm mr-1" onclick="editNote(${note.id})">
                    <span class="emoji">📝</span>
                </button>
                <button class="btn btn-sm" onclick="deleteNote(${note.id})">
                    <span class="emoji">🗑️</span>
                </button>
                <button class="btn btn-sm" onclick="archiveNote(${note.id})" data-archived="${note.archived}">
                  <span class="emoji">${note.archived ? '📚' : '📨'}</span>
                </button>
                
            </td>
        `;
        tableBody.appendChild(tr);
        // Add event listener to contenteditable fields
        const nameField = tr.querySelector('[data-field="name"]');
        const contentField = tr.querySelector('[data-field="content"]');
        const datesField = tr.querySelector('[data-field="dates"]');
        saveNotesToLocalStorage();
        nameField.addEventListener('keyup', (event) => updateNoteData(event, note.id, 'name'));
        contentField.addEventListener('keyup', (event) => updateNoteData(event, note.id, 'content'));
        datesField.addEventListener('keyup', (event) => updateNoteData(event, note.id, 'dates'));
    }
}

function renderSummaryTable() {
    const summaryTableBody = document.getElementById('summaryTableBody');
    summaryTableBody.innerHTML = '';

    const categories = ['Task', 'Random Thought', 'Idea', 'Quote'];

    for (const category of categories) {
        const activeNotesCount = notesData.filter((note) => note.category === category && !note.archived).length;
        const archivedNotesCount = notesData.filter((note) => note.category === category && note.archived).length;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${category}</td>
            <td>${activeNotesCount}</td>
            <td>${archivedNotesCount}</td>
        `;
        summaryTableBody.appendChild(tr);
    }
}
// Function to save the edited notes data to localStorage
function saveNotesToLocalStorage() {
    try {
        localStorage.setItem('notesData', JSON.stringify(notesData));
    } catch (error) {
        console.log('Error while saving data to LocalStorage:', error);
    }
}
// Function to load the notes data from localStorage on page load
function loadNotesFromLocalStorage() {
    const savedNotesData = localStorage.getItem('notesData');
    if (savedNotesData) {
        notesData = JSON.parse(savedNotesData);
    }
}

function editNote(noteId) {
    const note = notesData.find((note) => note.id === noteId);
    if (!note) {
        return;
    }

    const updatedName = prompt('Edit Name:', note.name);
    if (updatedName !== null) {
            const updatedContent = prompt('Edit Content:', note.content);
            if (updatedContent !== null) {              
                    note.name = updatedName;
                    note.content = updatedContent;
                    renderNotesTable();
                    renderSummaryTable();
                    saveNotesToLocalStorage();
                }
            }
        }

// Function to update the notesData array when contenteditable fields are edited
function updateNoteData(event, noteId, field) {
    const value = event.target.innerText;
    const note = notesData.find((note) => note.id === noteId);

    if (note) {
        note[field] = value;
        saveNotesToLocalStorage();
    }
}

// Function to add a new note
function addNote() {
    
    const newNote = {
        id: notesData.length + 1,
        name: 'New Note',
        time: new Date().toLocaleString(),
        content: '',
        category: 'Task',
        dates: '',
        archived: false,
    };
    notesData.push(newNote);

    renderNotesTable();
    renderSummaryTable();

    // Save the changes to localStorage
    saveNotesToLocalStorage();
    
    const newNoteRow = document.getElementById(`noteRow-${newNote.id}`);
    if (newNoteRow) {
        const nameField = newNoteRow.querySelector('[data-field="name"]');
        const contentField = newNoteRow.querySelector('[data-field="content"]');
        const datesField = newNoteRow.querySelector('[data-field="dates"]');

        nameField.addEventListener('keyup', (event) => updateNoteData(event, newNote.id, 'name'));
        contentField.addEventListener('keyup', (event) => updateNoteData(event, newNote.id, 'content'));
        datesField.addEventListener('keyup', (event) => updateNoteData(event, newNote.id, 'dates'));
    }
}

function deleteNote(noteId) {
    notesData = notesData.filter((note) => note.id !== noteId);

    renderNotesTable();
    renderSummaryTable();

    saveNotesToLocalStorage();
}

function archiveNote(noteId) {
    const note = notesData.find((note) => note.id === noteId);
    if (note) {
        note.archived = !note.archived;

        const row = document.getElementById(`noteRow-${noteId}`);
        if (row) {
            row.style.display = note.archived ? 'none' : 'table-row';
        }
    }
    renderNotesTable();
    renderSummaryTable();
    saveNotesToLocalStorage();
}

// Add event listener to the addNoteForm
document.getElementById('addNoteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    addNote();
});

// Load notes data from localStorage on page load
loadNotesFromLocalStorage();

// Initial render
renderNotesTable();
renderSummaryTable();
