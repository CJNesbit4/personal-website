const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const canvasContainer = document.getElementById('canvasContainer');
const originalCanvas = document.getElementById('originalCanvas');
const transformedCanvas = document.getElementById('transformedCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const status = document.getElementById('status');

const originalCtx = originalCanvas.getContext('2d');
const transformedCtx = transformedCanvas.getContext('2d');

const sqrt3 = Math.sqrt(3);

uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processImage(file);
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        processImage(file);
    }
});

function processImage(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const width = img.width;
            const height = img.height;
            
            originalCanvas.width = width;
            originalCanvas.height = height;
            originalCtx.drawImage(img, 0, 0);
            
            const originalData = originalCtx.getImageData(0, 0, width, height);
            
            transformImage(originalData, width, height);
            
            canvasContainer.classList.remove('hidden');
            downloadBtn.classList.remove('hidden');
        };
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

function transformImage(originalData, width, height) {
    transformedCanvas.width = width;
    transformedCanvas.height = height;
    
    const transformedData = transformedCtx.createImageData(width, height);
    
    //sets white background default for readability
    for (let i = 0; i < transformedData.data.length; i += 4) {
        transformedData.data[i] = 255;     
        transformedData.data[i + 1] = 255; 
        transformedData.data[i + 2] = 255; 
        transformedData.data[i + 3] = 255; 
    }
    
    for (let newY = 0; newY < height; newY++) {
        for (let newX = 0; newX < width; newX++) {
            const normNewX = (newX / width) * 100;
            const normNewY = ((height - 1 - newY) / height) * 100;
            
            const normOrigX = normNewX + normNewY / 2;
            //const normOrigY = normNewY * sqrt3 / 2; //FORMULA IF IMAGE IS NOT NORMALIZED from my experiments chemcad normalizes the diagrams
            const normOrigY = normNewY;
            
            const origX = (normOrigX / 100) * width;
            const origY = height - 1 - (normOrigY / 100) * height;
            
            if (origX >= 0 && origX < width - 1 && origY >= 0 && origY < height - 1) {
                const x0 = Math.floor(origX);
                const x1 = x0 + 1;
                const y0 = Math.floor(origY);
                const y1 = y0 + 1;
                
                const fx = origX - x0;
                const fy = origY - y0;
                
                const dstIdx = (newY * width + newX) * 4;
                
                for (let c = 0; c < 4; c++) {
                    const val00 = originalData.data[(y0 * width + x0) * 4 + c];
                    const val10 = originalData.data[(y0 * width + x1) * 4 + c];
                    const val01 = originalData.data[(y1 * width + x0) * 4 + c];
                    const val11 = originalData.data[(y1 * width + x1) * 4 + c];
                    
                    const val = (1 - fx) * (1 - fy) * val00 +
                                fx * (1 - fy) * val10 +
                                (1 - fx) * fy * val01 +
                                fx * fy * val11;
                    
                    transformedData.data[dstIdx + c] = Math.round(val);
                }
            }
        }
    }
    
    transformedCtx.putImageData(transformedData, 0, 0);
}

downloadBtn.addEventListener('click', () => {
    transformedCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Right-Angle-Diagram.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});