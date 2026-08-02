/**
 * upload.js - document upload with browser-side compression
 * Uses canvas to compress before sending to reduce data on Kenyan mobile networks
 */

const Upload = {
  selectedFile: null,

  setFile(file) {
    this.selectedFile = file;
  },

  /**
   * Compress image to max 1200px wide and 0.82 JPEG quality
   * Critical for low-bandwidth mobile users
   */
  compressImage(file, maxWidth = 1200, quality = 0.82) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        resolve(file); // Don't compress PDFs
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width);
          const canvas = document.createElement('canvas');
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(blob => {
            if (!blob) { reject(new Error('Compression failed')); return; }
            const compressed = new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() });
            resolve(compressed);
          }, 'image/jpeg', quality);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  async submit({ docType, regNumber, ownerName, location, locationDetail, finderPhone }) {
    if (!this.selectedFile) throw new Error('No file selected');

    const compressed = await this.compressImage(this.selectedFile);

    const formData = new FormData();
    formData.append('photo', compressed);
    formData.append('docType', docType);
    formData.append('regNumber', regNumber || '');
    formData.append('ownerName', ownerName || '');
    formData.append('location', location);
    formData.append('locationDetail', locationDetail || '');
    formData.append('finderPhone', finderPhone || '');

    return window.API.uploadDocument(formData);
  },
};

window.Upload = Upload;
