
document.addEventListener("DOMContentLoaded", function () {
  const tanggalEl = document.getElementById("tanggal");
  const waktuEl = document.getElementById("waktu");
  const hariDipilih = document.getElementById("hari-dipilih");
  const inputTask = document.getElementById("input-task");
  const inputJam = document.getElementById("input-jam");
  const tambahBtn = document.getElementById("tambah-btn");
  const todoList = document.getElementById("todo-list");
  const prevBtn = document.getElementById("sebelumnya");
  const nextBtn = document.getElementById("selanjutnya");

  let currentDate = new Date();

  function formatTanggal(date) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  }

  function formatKey(date) {
    return date.toISOString().split("T")[0];
  }

  function updateWaktu() {
    const now = new Date();
    waktuEl.textContent = now.toLocaleTimeString("id-ID");
    tanggalEl.textContent = formatTanggal(now);
  }

  function tampilkanhariDipilih() {
    const today = new Date();
    const selisih = currentDate.setHours(0,0,0,0) - today.setHours(0,0,0,0);
    if (selisih === 0) {
      hariDipilih.textContent = "Hari Ini";
    } else {
      hariDipilih.textContent = formatTanggal(currentDate);
    }
  }

  function ambilJadwal() {
    const key = formatKey(currentDate);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
// Simpan jadwal
  function simpanJadwal(todo) {
    const key = formatKey(currentDate);
    localStorage.setItem(key, JSON.stringify(todo));
  }

  function tampilkanTodo() {
    todoList.innerHTML = "";
    const todo = ambilJadwal();
    todo.forEach((item, index) => {
      const li = document.createElement("li");
      if (item.selesai) li.classList.add("completed");

      const span = document.createElement("span");
      span.textContent = `${item.jam || "--:--"} - ${item.teks}`;
      span.style.cursor = "pointer";
      span.onclick = () => toggleSelesai(index);

      const hapusBtn = document.createElement("button");
      hapusBtn.textContent = "X";
      hapusBtn.onclick = () => hapusJadwal(index);

      li.appendChild(span);
      li.appendChild(hapusBtn);
      todoList.appendChild(li);
    });
  }

  function tambahJadwal() {
    const teks = inputTask.value.trim();
    const jam = inputJam.value;
    if (teks === "") return;

    const todo = ambilJadwal();
    todo.push({ teks, jam, selesai: false });
    simpanJadwal(todo);
    inputTask.value = "";
    inputJam.value = "";
    tampilkanTodo();
  }

  function toggleSelesai(index) {
    const todo = ambilJadwal();
    todo[index].selesai = !todo[index].selesai;
    simpanJadwal(todo);
    tampilkanTodo();
  }

  function hapusJadwal(index) {
    const todo = ambilJadwal();
    todo.splice(index, 1);
    simpanJadwal(todo);
    tampilkanTodo();
  }

  function gantiHari(offset) {
    currentDate.setDate(currentDate.getDate() + offset);
    tampilkanhariDipilih();
    tampilkanTodo();
  }

  tambahBtn.addEventListener("click", tambahJadwal);
  prevBtn.addEventListener("click", () => gantiHari(-1));
  nextBtn.addEventListener("click", () => gantiHari(1));
  inputTask.addEventListener("keypress", (e) => {
    if (e.key === "Enter") tambahJadwal();
  });
  setInterval(updateWaktu, 1000);
  updateWaktu();
  tampilkanhariDipilih();
  tampilkanTodo();
});
