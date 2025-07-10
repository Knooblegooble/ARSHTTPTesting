<!-- Start: Audio Files Manager Section -->
<section id="audio-section" class="py-5 gradient-bg text-center position-relative overflow-hidden">
  <div class="container">
    <h2 class="display-5 fw-bold text-white mb-4">Your Podcast Audio Files</h2>

    <!-- Upload MP3 Field -->
    <div class="input-group mb-3 shadow">
      <input type="file" id="fileInput" class="form-control" accept=".mp3" aria-label="Choose MP3 to upload">
      <button id="uploadBtn" class="btn btn-success fw-semibold">
        <i class="bi bi-upload"></i>&nbsp;Upload
      </button>
    </div>

    <!-- List of Uploaded Files -->
    <ul id="fileList" class="list-group mb-4 shadow-sm text-start"></ul>

    <!-- Audio Player -->
    <audio id="audioPlayer" class="mt-3 w-100" controls hidden></audio>
  </div>
</section>

<!-- Bootstrap Icons (if not already loaded) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<style>
  /* Reuse the same gradient + cube overlay */
  .gradient-bg {
    background: linear-gradient(135deg, #ff2c63 0%, #ff1e5a 25%, #c02c8f 50%, #8030bb 75%, #4045f4 100%);
  }
  .gradient-bg::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='80' height='92' viewBox='0 0 80 92' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='0.1' stroke-width='1'%3E%3Cpath d='M40 0l40 23v46L40 92 0 69V23z'/%3E%3Cpath d='M0 23l40 23 40-23'/%3E%3Cpath d='M40 92V69'/%3E%3Cpath d='M80 69L40 46 0 69'/%3E%3Cpath d='M80 23L40 46 0 23'/%3E%3C/g%3E%3C/svg%3E");
    background-size: 120px auto;
    pointer-events: none;
  }
  #fileList .list-group-item {
    background: rgba(255,255,255,0.9);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>

<script>
  const apiBase = ''; // leave empty for same-origin, or set to your API URL

  // Fetch and render the list of files
  async function refreshFileList() {
    const listEl = document.getElementById('fileList');
    listEl.innerHTML = '<li class="list-group-item">Loading...</li>';

    try {
      const res = await fetch(`${apiBase}/audio-files`);
      const files = await res.json();

      if (!Array.isArray(files) || files.length === 0) {
        listEl.innerHTML = '<li class="list-group-item">No files uploaded yet.</li>';
        return;
      }

      listEl.innerHTML = files.map(f => `
        <li class="list-group-item">
          <span>${f.fileName}</span>
          <div>
            <button class="btn btn-sm btn-primary me-2" data-play="${f.fileName}">
              <i class="bi bi-play-fill"></i>
            </button>
            <button class="btn btn-sm btn-danger" data-delete="${f.fileName}">
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>
        </li>
      `).join('');
    } catch (err) {
      listEl.innerHTML = `<li class="list-group-item text-danger">Error loading files</li>`;
      console.error(err);
    }
  }

  // Handle upload
  document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
      alert('Please select an MP3 to upload.');
      return;
    }

    const file = fileInput.files[0];
    if (file.type !== 'audio/mpeg') {
      alert('Only MP3 files are allowed.');
      return;
    }

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch(`${apiBase}/audio-files`, {
        method: 'POST',
        body: form
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      await refreshFileList();
      fileInput.value = '';
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  // Delegate play and delete buttons
  document.getElementById('fileList').addEventListener('click', async e => {
    const playFile = e.target.closest('[data-play]')?.dataset.play;
    const deleteFile = e.target.closest('[data-delete]')?.dataset.delete;

    if (playFile) {
      const player = document.getElementById('audioPlayer');
      player.src = `${apiBase}/audio-files/${encodeURIComponent(playFile)}`;
      player.hidden = false;
      await player.play();
    }

    if (deleteFile && confirm(`Delete "${deleteFile}"?`)) {
      try {
        const res = await fetch(`${apiBase}/audio-files/${encodeURIComponent(deleteFile)}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
        await refreshFileList();
        document.getElementById('audioPlayer').hidden = true;
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    }
  });

  // Initial load
  document.addEventListener('DOMContentLoaded', refreshFileList);
</script>
<!-- End: Audio Files Manager Section -->
