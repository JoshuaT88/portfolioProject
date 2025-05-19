window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

document.getElementById('format-json').addEventListener('click', () => {
    const input = document.getElementById('json-input').value;
    const outputElement = document.getElementById('json-output');

    try {
        const pasrsed = JSON.parse(input);
        const formatted = JSON.stringify(pasrsed, null, 2);
        outputElement.textContent = formatted;
        outputElement.classList.remove('json-error'); // Remove error style if present
    }
    catch (err) {
        outputElement.textContent = "❌ Invalid JSON!";
        outputElement.classList.add('json-error'); // Add error style
        console.error("Parsing error:", err);
    }
});

document.getElementById('copy-json').addEventListener('click', () => {
    const output = document.getElementById('json-output').innerText;

    if (!output.trim()) {
        alert('Nothing to copy');
        return;
    }

    navigator.clipboard.writeText(output).then(() => {
        alert('Formatted JSON copied to clipboard');
    })
    .catch(err => {
        console.error("copy failed:", err);
        alert("Failed to copy JSON!")
    });
});



function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');

  if (hex.length !== 6) return null;

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}

function rgbToHex(rgbString) {
  const parts = rgbString.split(',').map(p => parseInt(p.trim()));
  if (parts.length !== 3 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return null;

  return (
    '#' +
    parts.map(p => p.toString(16).padStart(2, '0')).join('')
  );
}

// Event Listeners
document.getElementById('convert-to-rgb').addEventListener('click', () => {
  const hex = document.getElementById('hex-input').value;
  const rgb = hexToRgb(hex);
  const preview = document.getElementById('color-preview');

  if (rgb) {
    document.getElementById('rgb-input').value = rgb;
    preview.style.backgroundColor = `rgb(${rgb})`;
  } else {
    alert("Invalid HEX value.");
  }
});

document.getElementById('convert-to-hex').addEventListener('click', () => {
  const rgb = document.getElementById('rgb-input').value;
  const hex = rgbToHex(rgb);
  const preview = document.getElementById('color-preview');

  if (hex) {
    document.getElementById('hex-input').value = hex;
    preview.style.backgroundColor = hex;
  } else {
    alert("Invalid RGB value.");
  }
});

// Convert timestamp to readable date
document.getElementById('convert-to-date').addEventListener('click', () => {
  const ts = parseInt(document.getElementById('timestamp-input').value);
  if (isNaN(ts)) {
    alert("Invalid timestamp");
    return;
  }

  const date = new Date(ts * 1000); // convert seconds to ms
  const formatted = date.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
  document.getElementById('date-input').value = formatted;
});

// Convert readable date to timestamp
document.getElementById('convert-to-timestamp').addEventListener('click', () => {
  const input = document.getElementById('date-input').value;
  if (!input) {
    alert("Enter a valid date.");
    return;
  }

  const date = new Date(input);
  const timestamp = Math.floor(date.getTime() / 1000); // ms to seconds
  document.getElementById('timestamp-input').value = timestamp;
});

document.getElementById('reset-color').addEventListener('click', () => {
  document.getElementById('hex-input').value = '';
  document.getElementById('rgb-input').value = '';
  document.getElementById('color-preview').style.backgroundColor = 'transparent';
});

document.getElementById('reset-timestamp').addEventListener('click', () => {
  document.getElementById('timestamp-input').value = '';
  document.getElementById('date-input').value = '';
});

document.getElementById('reset-json').addEventListener('click', () => {
  document.getElementById('json-input').value = '';
  const outputElement = document.getElementById('json-output');
  outputElement.textContent = '';
  outputElement.classList.remove('json-error');
  // If you have a separate error element, clear it here:
  // document.getElementById('json-error').textContent = '';
});

// Fade-in each toolbox-tool card on scroll or load
function revealToolboxTools() {
  document.querySelectorAll('.toolbox-tool').forEach((tool, idx) => {
    const rect = tool.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      // Add a staggered delay for a modern effect
      setTimeout(() => tool.classList.add('visible'), idx * 120);
    }
  });
}

window.addEventListener('scroll', revealToolboxTools);
window.addEventListener('DOMContentLoaded', revealToolboxTools);
