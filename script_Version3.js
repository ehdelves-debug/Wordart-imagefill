class WordArtApp {
    constructor() {
        this.boldOutline = false;
        this.imageFill = '';
        this.offsetX = 0;
        this.offsetY = 0;
    }

    toggleBoldOutline() {
        this.boldOutline = !this.boldOutline;
    }

    setImageFill(image) {
        this.imageFill = image;
    }

    setOffsets(x, y) {
        this.offsetX = x;
        this.offsetY = y;
    }

    save() {
        // Save functionality implementation
        console.log('Saving current state...');
    }

    render() {
        // Rendering logic that uses boldOutline, imageFill, and offsets
    }
}