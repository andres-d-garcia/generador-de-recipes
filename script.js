$(document).ready(function () {
  $('#editor-rp').summernote({ placeholder: 'Escribe aquí la receta...', tabsize: 2, height: 200 });
  $('#editor-indicaciones').summernote({ placeholder: 'Escribe aquí las indicaciones...', tabsize: 2, height: 200 });
});

function renderForExport() {
  document.getElementById('rp-rendered').innerHTML = $('#editor-rp').summernote('code');
  document.getElementById('indicaciones-rendered').innerHTML = $('#editor-indicaciones').summernote('code');
  document.getElementById('nombre-visual').style.display = 'inline';
  document.getElementById('fecha-visual').style.display = 'inline';
  document.getElementById('nombre').style.display = 'none';
  document.getElementById('fecha').style.display = 'none';
  $('.note-editor').hide();
  $('.rendered-content').show();
}

function restoreEditors() {
  $('.note-editor').show();
  $('.rendered-content').hide();
  document.getElementById('nombre-visual').style.display = 'none';
  document.getElementById('fecha-visual').style.display = 'none';
  document.getElementById('nombre').style.display = 'inline';
  document.getElementById('fecha').style.display = 'inline';
}

function preview() {
  alert('Previsualización lista.');
}

function downloadPDF() {
  renderForExport();
  const area = document.getElementById('recipe-area');
  area.classList.add('a4-export');
  const jsPDF = window.jspdf.jsPDF;
  html2canvas(area, {
    useCORS: true,
    width: 1000, // igual que en el CSS
    height: 624,
    windowWidth: 1500,
    windowHeight: 794
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', [297 * (1500 / 1123), 210]); // Escala el ancho en mm
    pdf.addImage(imgData, 'PNG', 0, 0, 297 * (1500 / 1123), 210);
    pdf.save("receta_medica.pdf");
    area.classList.remove('a4-export');
    restoreEditors();
  });
}

async function downloadImage() {
  renderForExport();
  const area = document.getElementById('recipe-area');
  area.classList.add('a4-export');
  await new Promise(resolve => setTimeout(resolve, 500));
  html2canvas(area, {
    useCORS: true,
    width: 1000,
    height: 624,
    windowWidth: 1500,
    windowHeight: 794
  }).then(canvas => {
    const a4canvas = document.createElement('canvas');
    a4canvas.width = 1500;
    a4canvas.height = 794;
    const ctx = a4canvas.getContext('2d');
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 1500, 794);
    ctx.drawImage(canvas, 0, 0, 1500, 794);

    a4canvas.toBlob(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'receta_medica.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      area.classList.remove('a4-export');
      restoreEditors();
    }, 'image/png');
  });
}
