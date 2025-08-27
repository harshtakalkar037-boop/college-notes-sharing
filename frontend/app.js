const form = document.getElementById("uploadForm");
const notesList = document.getElementById("notesList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  await fetch("http://localhost:5000/upload", {
    method: "POST",
    body: formData
  });

  form.reset();
  loadNotes();
});

async function loadNotes() {
  const res = await fetch("http://localhost:5000/notes");
  const notes = await res.json();
  notesList.innerHTML = "";
  notes.forEach(note => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="http://localhost:5000/uploads/${note.filename}" target="_blank">${note.title}</a>`;
    notesList.appendChild(li);
  });
}

loadNotes();