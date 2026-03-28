class WordArtImageFill {
    constructor() {
        // DOM Elements
        this.wordInput = document.getElementById('wordInput');
        this.fontSelect = document.getElementById('fontSelect');
        this.fontSizeInput = document.getElementById('fontSizeInput');
        this.fontSizeValue = document.getElementById('fontSizeValue');
        this.fillMode = document.getElementById('fillMode');
        this.imageUpload = document.getElementById('imageUpload');
        this.imageList = document.getElementById('imageList');
        this.imageCounter = document.getElementById('imageCounter');
        this.prevImageBtn = document.getElementById('prevImageBtn');
        this.nextImageBtn = document.getElementById('nextImageBtn');
        this.offsetXInput = document.getElementById('offsetX');
        this.offsetYInput = document.getElementById('offsetY');
        this.offsetXValue = document.getElementById('offsetXValue');
        this.offsetYValue = document.getElementById('offsetYValue');
        this.textDisplay = document.getElementById('textDisplay');
        this.canvas = document.getElementById('canvas');
        this.saveBtn = document.getElementById('saveBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.exportCanvas = document.getElementById('exportCanvas');

        // State
        this.images = []; // Array of {img: Image, data: DataURL}
        this.currentImageIndex = 0;
        this.offsetX = 0;
        this.offsetY = 0;

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Text input
        this.wordInput.addEventListener('input', () => this.updateDisplay());

        // Font changes
        this.fontSelect.addEventListener('change', () => this.updateDisplay());
        
        this.fontSizeInput.addEventListener('input', (e) => {
            this.fontSizeValue.textContent = e.target.value;
            this.updateDisplay();
        });

        // Fill mode
        this.fillMode.addEventListener('change', () => this.updateDisplay());

        // Image upload - multiple files
        this.imageUpload.addEventListener('change', (e) => this.handleMultipleImages(e));

        // Image navigation
        this.prevImageBtn.addEventListener('click', () => this.previousImage());
        this.nextImageBtn.addEventListener('click', () => this.nextImage());

        // Offset sliders
        this.offsetXInput.addEventListener('input', (e) => {
            this.offsetX = parseInt(e.target.value);
            this.offsetXValue.textContent = e.target.value;
            this.updateDisplay();
        });

        this.offsetYInput.addEventListener('input', (e) => {
            this.offsetY = parseInt(e.target.value);
            this.offsetYValue.textContent = e.target.value;
            this.updateDisplay();
        });

        // Buttons
        this.saveBtn.addEventListener('click', () => this.saveImage());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    handleMultipleImages(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        let loadedCount = 0;
        const validImageFiles = files.filter(f => f.type.startsWith('image/'));
        const newImages = [];

        if (validImageFiles.length === 0) {
            alert('Please select at least one image file');
            return;
        }

        validImageFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    newImages.push({
                        img: img,
                        data: e.target.result
                    });
                    loadedCount++;

                    // When all images are loaded
                    if (loadedCount === validImageFiles.length) {
                        this.images = newImages;
                        this.currentImageIndex = 0;
                        this.renderImageList();
                        this.updateImageCounter();
                        this.updateDisplay();
                        this.showSuccessMessage(`Loaded ${this.images.length} image(s)`);
                    }
                };
                img.onerror = () => {
                    loadedCount++;
                    if (loadedCount === validImageFiles.length) {
                        if (newImages.length > 0) {
                            this.images = newImages;
                            this.currentImageIndex = 0;
                            this.renderImageList();
                            this.updateImageCounter();
                            this.updateDisplay();
                            this.showSuccessMessage(`Loaded ${this.images.length} image(s)`);
                        }
                    }
                };
                img.src = e.target.result;
            };
            reader.onerror = () => {
                loadedCount++;
                if (loadedCount === validImageFiles.length && newImages.length > 0) {
                    this.images = newImages;
                    this.currentImageIndex = 0;
                    this.renderImageList();
                    this.updateImageCounter();
                    this.updateDisplay();
                    this.showSuccessMessage(`Loaded ${this.images.length} image(s)`);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    renderImageList() {
        this.imageList.innerHTML = '';
        this.images.forEach((imageObj, index) => {
            const item = document.createElement('div');
            item.className = `image-item ${index === this.currentImageIndex ? 'active' : ''}`;
            
            const img = document.createElement('img');
            img.src = imageObj.data;
            img.alt = `Image ${index + 1}`;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'image-item-remove';
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeImage(index);
            });
            
            item.appendChild(img);
            item.appendChild(removeBtn);
            item.addEventListener('click', () => this.selectImage(index));
            
            this.imageList.appendChild(item);
        });
        this.updateNavigationButtons();
    }

    selectImage(index) {
        this.currentImageIndex = index;
        this.renderImageList();
        this.updateDisplay();
    }

    removeImage(index) {
        this.images.splice(index, 1);
        if (this.images.length === 0) {
            this.currentImageIndex = 0;
            this.imageUpload.value = '';
        } else {
            this.currentImageIndex = Math.min(index, this.images.length - 1);
        }
        this.renderImageList();
        this.updateImageCounter();
        this.updateDisplay();
    }

    previousImage() {
        if (this.images.length > 0) {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
            this.renderImageList();
            this.updateDisplay();
        }
    }

    nextImage() {
        if (this.images.length > 0) {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
            this.renderImageList();
            this.updateDisplay();
        }
    }

    updateImageCounter() {
        if (this.images.length === 0) {
            this.imageCounter.textContent = 'No images';
            this.prevImageBtn.disabled = true;
            this.nextImageBtn.disabled = true;
        } else {
            this.imageCounter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;
            this.updateNavigationButtons();
        }
    }

    updateNavigationButtons() {
        if (this.images.length <= 1) {
            this.prevImageBtn.disabled = true;
            this.nextImageBtn.disabled = true;
        } else {
            this.prevImageBtn.disabled = false;
            this.nextImageBtn.disabled = false;
        }
    }

    updateDisplay() {
        const word = this.wordInput.value || 'Your Word';
        const fontSize = this.fontSizeInput.value;
        const fontFamily = this.fontSelect.value;
        const mode = this.fillMode.value;

        // Update text styling
        this.textDisplay.textContent = word;
        this.textDisplay.style.fontSize = fontSize + 'px';
        this.textDisplay.style.fontFamily = fontFamily;

        // Apply image fill if image is loaded
        if (this.images.length > 0) {
            this.applyImageFill(word, fontSize, mode);
        } else {
            // Default gradient if no image
            this.textDisplay.style.backgroundImage = 'linear-gradient(45deg, #667eea, #764ba2)';
        }
    }

    applyImageFill(word, fontSize, mode) {
        if (mode === 'word') {
            this.applyWordFill(word, fontSize);
        } else {
            this.applyLetterFill(word, fontSize);
        }
    }

    applyWordFill(word, fontSize) {
        const currentImageObj = this.images[this.currentImageIndex];
        if (!currentImageObj) return;

        const bgImage = currentImageObj.data;
        const bgSize = Math.max(currentImageObj.img.width, currentImageObj.img.height);
        const bgPosition = `${this.offsetX}px ${this.offsetY}px`;

        this.textDisplay.style.backgroundImage = `url('${bgImage}')`;
        this.textDisplay.style.backgroundSize = `${bgSize}px ${bgSize}px`;
        this.textDisplay.style.backgroundPosition = bgPosition;
    }

    applyLetterFill(word, fontSize) {
        const currentImageObj = this.images[this.currentImageIndex];
        if (!currentImageObj) return;

        const bgImage = currentImageObj.data;
        const bgSize = Math.max(currentImageObj.img.width, currentImageObj.img.height) * 0.5;
        const bgPosition = `${this.offsetX}px ${this.offsetY}px`;

        this.textDisplay.style.backgroundImage = `url('${bgImage}')`;
        this.textDisplay.style.backgroundSize = `${bgSize}px ${bgSize}px`;
        this.textDisplay.style.backgroundPosition = bgPosition;
    }

    async saveImage() {
        if (this.images.length === 0) {
            alert('Please upload at least one image');
            return;
        }

        if (!this.wordInput.value) {
            alert('Please enter a word');
            return;
        }

        try {
            this.saveBtn.disabled = true;
            this.saveBtn.textContent = '💾 Saving...';

            // Get the canvas dimensions
            const canvasRect = this.canvas.getBoundingClientRect();
            const padding = 40;
            const width = canvasRect.width + padding * 2;
            const height = canvasRect.height + padding * 2;

            this.exportCanvas.width = width;
            this.exportCanvas.height = height;

            const ctx = this.exportCanvas.getContext('2d');
            
            // Gradient background
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#f5f7fa');
            gradient.addColorStop(1, '#c3cfe2');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Draw text with image fill
            const word = this.wordInput.value;
            const fontSize = parseInt(this.fontSizeInput.value);
            const fontFamily = this.fontSelect.value;
            const currentImageObj = this.images[this.currentImageIndex];

            ctx.font = `bold ${fontSize}px ${fontFamily}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const x = width / 2;
            const y = height / 2;

            // Draw text with image pattern
            if (currentImageObj) {
                const pattern = ctx.createPattern(currentImageObj.img, 'repeat');
                ctx.save();
                ctx.translate(x, y);
                ctx.translate(this.offsetX, this.offsetY);
                ctx.translate(-x, -y);
                ctx.fillStyle = pattern;
                ctx.fillText(word, x, y);
                ctx.restore();
            } else {
                ctx.fillStyle = '#667eea';
                ctx.fillText(word, x, y);
            }

            // Convert to blob and download
            this.exportCanvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const timestamp = new Date().toISOString().split('T')[0];
                a.href = url;
                a.download = `word-art-${word}-${timestamp}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                this.showSuccessMessage('✅ Image saved successfully!');
            });
        } catch (error) {
            console.error('Error saving image:', error);
            alert('Error saving image. Please try again.');
        } finally {
            this.saveBtn.disabled = false;
            this.saveBtn.textContent = '💾 Save as PNG';
        }
    }

    reset() {
        this.wordInput.value = '';
        this.fontSelect.value = "Arial, sans-serif";
        this.fontSizeInput.value = '150';
        this.fontSizeValue.textContent = '150';
        this.fillMode.value = 'word';
        this.imageUpload.value = '';
        this.offsetXInput.value = '0';
        this.offsetYInput.value = '0';
        this.offsetXValue.textContent = '0';
        this.offsetYValue.textContent = '0';
        this.images = [];
        this.currentImageIndex = 0;
        this.imageList.innerHTML = '';
        this.offsetX = 0;
        this.offsetY = 0;
        this.updateImageCounter();
        this.updateDisplay();
    }

    showSuccessMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'success-message';
        messageEl.textContent = message;
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => messageEl.remove(), 300);
        }, 2500);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new WordArtImageFill();
});