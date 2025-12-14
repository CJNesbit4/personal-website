document.getElementById("interpolate").addEventListener("click", interpolate);
document.getElementById("clear").addEventListener("click", clear);

function interpolate() {
    const x1 = parseFloat(document.getElementById("x1").value);
    const y1 = parseFloat(document.getElementById("y1").value);
    const x2 = parseFloat(document.getElementById("x2").value);
    const y2 = parseFloat(document.getElementById("y2").value);
    const f11 = parseFloat(document.getElementById("f11").value);
    const f12 = parseFloat(document.getElementById("f12").value);
    const f21 = parseFloat(document.getElementById("f21").value);
    const f22 = parseFloat(document.getElementById("f22").value);

    const x = document.getElementById("x");
    const y = document.getElementById("y");
    const f = document.getElementById("f");

    const xVal = x.value === '' ? null : parseFloat(x.value);
    const yVal = y.value === '' ? null : parseFloat(y.value);
    const fVal = f.value === '' ? null : parseFloat(f.value);

    if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2) || isNaN(f11) || isNaN(f12) || isNaN(f21) || isNaN(f22)) {
        return;
    }

    if (x.disabled) { //TODO no idea why this isn't working
        xVal = null;
    } else if (y.disabled) {
        yVal = null;
    } else if (f.disabled) {
        fVal = null;
    }

    if (xVal === null && yVal === null) {
        x.placeholder = 'Enter x or y';
        y.placeholder = 'Enter x or y';
        x.disabled = false;
        y.disabled = false;
        return;
    }

    if ((xVal === null && fVal === null) || (yVal === null && fVal === null)) {
        x.placeholder = 'Underspecified.';
        y.placeholder = 'Underspecified.';
        f.placeholder = 'Underspecified.';
        return;
    }

    if (xVal !== null && yVal !== null && fVal !== null) {
        x.placeholder = 'Overspecified.';
        y.placeholder = 'Overspecified.';
        f.placeholder = 'Overspecified.';
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

    if (xVal !== null && yVal !== null && fVal === null) {
        const a = (xVal - x1) / (x2 - x1);
        const b = (yVal - y1) / (y2 - y1);

        const calculatedF = ((1 - a) * (1 - b) * f11) + ((1 - a) * b * f12) + (a * (1 - b) * f21) + (a * b * f22);
        f.value = calculatedF.toFixed(6);
        f.disabled = true;
        x.disabled = false;
        y.disabled = false;
        return;
    } else if (xVal !== null && yVal === null && fVal !== null) {
        const a = (xVal - x1) / (x2 - x1);
        const A = ((1 - a) * f11) + (a * f21);
        const B = ((1 - a) * f12) + (a * f22);

        if (B === A) {y.placeholder = 'Failed to find solution'; return;}

        const b = (fVal - A) / (B - A);
        const calculatedY = y1 + (b * (y2 - y1));

        y.value = calculatedY.toFixed(6);
        y.disabled = true;
        x.disabled = false;
        f.disabled = false;
        return;
    } else if (xVal === null && yVal !== null && fVal !== null) {
        const b = (yVal - y1) / (y2 - y1);
        const A = ((1 - b) * f11) + (b * f12);
        const B = ((1 - b) * f21) + (b * f22);

        if (B === A) {x.placeholder = 'Failed to find solution'; return;}

        const a = (fVal - A) / (B - A);
        const caclulatedX = x1 + (a * (x2 - x1));

        x.value = caclulatedX.toFixed(6);
        x.disabled = true;
        y.disabled = false;
        f.disabled = false;
        return;
    }
}

function clear() {
    x1.value = null;
    x2.value = null;
    y1.value = null;
    y2.value = null;
    f11.value = null;
    f12.value = null;
    f21.value = null;
    f22.value = null;

    x.disabled = false;
    x.value = null;
    y.disabled = false;
    y.value = null;
    f.disabled = false;
    f.value = null;
    return;
}