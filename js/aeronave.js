// =========================
// FUNCIONES EXISTENTES
// =========================

async function fetchAeronaves() {
  const response = await fetch("/api/aeronaves");
  return await response.json();
}

async function deleteAeronave(id) {
  console.log(`Eliminando aeronave con id: ${id}`);
  await fetch(`/api/aeronaves/${id}`, {
    method: "DELETE"
  });
  displayAeronaves(); // refresca tabla después de borrar
}

async function editAeronave(id) {
  console.log(`Editando aeronave con id: ${id}`);
  const response = await fetch(`/api/aeronaves/${id}`);
  const aeronave = await response.json();
  console.log("Datos de la aeronave:", aeronave);
}

async function displayAeronaves() {
  const aeronaves = await fetchAeronaves();
  const tableBody = document.querySelector("#aeronave-table tbody");
  tableBody.innerHTML = "";

  aeronaves.forEach(aeronave => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${aeronave.id}</td>
      <td>${aeronave.matricula}</td>
      <td>${aeronave.modelo}</td>
      <td>${aeronave.marca}</td>
      <td>${aeronave.ano}</td>
      <td>${aeronave.horas_vuelo || 0}</td>
      <td>
        <button class="btn btn-edit" data-id="${aeronave.id}">Editar</button>
        <button class="btn btn-delete" data-id="${aeronave.id}">Eliminar</button>
        <button class="btn btn-horas" data-id="${aeronave.id}">+Horas</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Eventos para los botones
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      deleteAeronave(id);
    });
  });

  document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      editAeronave(id);
    });
  });

  document.querySelectorAll(".btn-horas").forEach(btn => {
    btn.addEventListener("click", async e => {
      const id = e.target.dataset.id;
      const horas = prompt("Ingrese horas de vuelo a sumar:");
      if (horas) {
        await addHoras(id, parseInt(horas));
        displayAeronaves();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", displayAeronaves);

// =========================
// NUEVAS FUNCIONES
// =========================

// Sumar horas a la aeronave y calcular próximo mantenimiento
async function addHoras(id, horas) {
  const res = await fetch(`/api/aeronaves/${id}/addHoras`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ horas })
  });
  const data = await res.json();
  console.log("Horas actualizadas:", data);
  alert(`Horas: ${data.horas_vuelo}, Próx Mantenimiento: ${data.proximo_mantenimiento}`);
}

// Firmar ítem en una orden de trabajo
async function signItem(itemId, user) {
  const res = await fetch(`/api/ordenes/items/${itemId}/sign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firmado_por: user })
  });
  const data = await res.json();
  console.log("Item firmado:", data);
}
// Exportar funciones para uso en otros módulos
export {
  fetchAeronaves,
  deleteAeronave,
  editAeronave,
  displayAeronaves,
  addHoras,
  signItem
};
