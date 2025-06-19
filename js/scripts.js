// script.js

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

function checkSiteSecurity(url) {
  if (!isValidURL(url)) {
    return "URL inválida";
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", url);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve("Sitio seguro");
      } else {
        reject("Sitio inseguro, código de estado: " + xhr.status);
      }
    };
    xhr.onerror = () => reject("Error al conectar con el sitio");
    xhr.send();
  });
}

// Uso
function validador() {
  const url = document.querySelector("#qrData").value;
  const inputValidar = document.querySelector("#qrData");
  let mensaje = document.querySelector("#qrMessage");
  if (url) {
    if (isValidURL(url)) {
      mensaje.textContent = "Sitio validado correctamente";
      mensaje.classList.remove("alert-danger", "alert-info");
      mensaje.classList.add("alert-success");
    } else {
      mensaje.textContent = "URL inválida";
      mensaje.classList.remove("alert-success", "alert-info");
      mensaje.classList.add("alert-danger");
      inputValidar.focus();
    }
  } else {
    mensaje.textContent = "Puedes ingresar cualquier enlace web.";
    mensaje.classList.remove("alert-success", "alert-danger");
    mensaje.classList.add("alert-info");
  }
}

// Generar y descargar QR
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("qrForm");
  const qrContainer = document.getElementById("qrCodeContainer");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = document.getElementById("qrData").value;
    const fileName = document.getElementById("qrFileName").value || "qr_code";

    if (!data || !fileName) {
      // Mostrar alerta de error arriba
      const alert = document.createElement("div");
      alert.className =
        "alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
      alert.role = "alert";
      alert.style.zIndex = "9999";
      alert.style.width = "auto";
      alert.textContent = "Por favor, completa todos los campos correctamente.";
      document.body.appendChild(alert);

      setTimeout(() => {
        alert.classList.remove("show");
        alert.classList.add("hide");
        setTimeout(() => {
          if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
          }
        }, 300);
      }, 2000);
      return;
    }

    // Crear QR en un div oculto (800x800)
    const tempDiv = document.createElement("div");
    tempDiv.style.display = "none";
    document.body.appendChild(tempDiv);

    const qr = new QRCode(tempDiv, {
      text: data,
      width: 800,
      height: 800,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    setTimeout(() => {
      let canvas = tempDiv.querySelector("canvas");
      if (canvas) {
        // Crear un nuevo canvas de 900x900 con fondo blanco
        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = 900;
        finalCanvas.height = 900;
        const ctx = finalCanvas.getContext("2d");
        // Fondo blanco
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 900, 900);
        // Dibujar el QR centrado (borde de 50px)
        ctx.drawImage(canvas, 50, 50, 800, 800);

        // Descargar automáticamente
        const urlData = finalCanvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = urlData;
        downloadLink.download = `${fileName}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
      document.body.removeChild(tempDiv);

      // Mostrar alerta Bootstrap en la parte superior de la página
      const alert = document.createElement("div");
      alert.className =
        "alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
      alert.role = "alert";
      alert.style.zIndex = "9999";
      alert.style.width = "auto";
      alert.textContent = "¡QR generado y descargado!";
      document.body.appendChild(alert);

      setTimeout(() => {
        alert.classList.remove("show");
        alert.classList.add("hide");
        setTimeout(() => {
          if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
          }
        }, 300);
      }, 2000);
    }, 500);
  });
});
