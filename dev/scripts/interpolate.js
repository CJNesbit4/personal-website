document.getElementById("interpolate").addEventListener("click", interpolate);
document.getElementById("clear").addEventListener("click", clear);

function interpolate() {
    const x1 = parseFloat(document.getElementById("x1").value);
    const y1 = parseFloat(document.getElementById("y1").value);
    const x2 = parseFloat(document.getElementById("x2").value);
    const y2 = parseFloat(document.getElementById("y2").value);

    const x = document.getElementById("x");
    const y = document.getElementById("y");

    const xVal = x.value === '' ? null : parseFloat(x.value);
    const yVal = y.value === '' ? null : parseFloat(y.value);

    if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
        return;
    }

    if (x.disabled) { //TODO no idea why this isn't working
        xVal = null;
    } else if (y.disabled) {
        yVal = null;
    }

    if (xVal === null && yVal === null) {
        x.placeholder = 'Enter x or y';
        y.placeholder = 'Enter x or y';
        x.disabled = false;
        y.disabled = false;
        return;
    }

    if (xVal !== null && yVal !== null) {
        x.placeholder = 'Enter only one value';
        y.placeholder = 'Enter only one value';
        return;
    }

    if (x1 === x2 && xVal !== null) {
        y.placeholder = 'Error: x₁ = x₂';
        y.disabled = true;
        return;
    }

    if (y1 === y2 && yVal !== null) {
        x.placeholder = 'Error: y₁ = y₂';
        x.disabled = true;
        return;
    }

    if (xVal !== null) {
        const calculatedY = y1 + (xVal - x1) * (y2 - y1) / (x2 - x1);
        y.value = calculatedY.toFixed(6);
        y.disabled = true;
        xInput.disabled = false;
    } else if (yVal !== null) {
        const calculatedX = x1 + (yVal - y1) * (x2 - x1) / (y2 - y1);
        x.value = calculatedX.toFixed(6);
        x.disabled = true;
        y.disabled = false;
    }
}

function clear() {
    x1.value = null;
    x2.value = null;
    y1.value = null;
    y2.value = null;

    x.disabled = false;
    x.value = null;
    y.disabled = false;
    y.value = null;
}