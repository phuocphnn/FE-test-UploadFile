// DOM elements
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const uploadedImagesElements = document.getElementById('uploaded-images');

// Variables
const fileTypeAllow = ['jpg', 'jpeg', 'png', 'heic', 'gif'];
let uploadQueue = [];
let currentIndex = 0;
let isProcessing = false;

// Event listeners
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.style.border = '2px dashed #141414';
});

dropArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropArea.style.border = '2px dashed #ccc';
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.style.border = '2px dashed #ccc';
  const files = e.dataTransfer.files;
  handleFiles(files);
});

dropArea.addEventListener('click', (e) => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  const files = fileInput.files;
  handleFiles(files);
});

// Functions

function handleFiles(files) {
  addFilesToQueue(files);
  showImages();
  if (!isProcessing) {
    isProcessing = true;
    processQueue();
  }
}

function addFilesToQueue(files) {
  Object.values(files).forEach((file) => {
    const fileType = file.type.split('/')[1].toLowerCase();
    if (fileTypeAllow.includes(fileType)) {
      uploadQueue = [...uploadQueue, { file, index: currentIndex }];
      currentIndex++;
    }
  });
  countingUploadingFile();
  fileInput.value = '';
}

function showImages() {
  uploadQueue.forEach((item) => {
    const { file, index } = item;
    if (document.getElementById(`img-${index}`)) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      const container = createImageContainer(index);
      const img = createImageElement(e);
      const spinner = createLoadingSpinner(index);

      container.appendChild(img);

      const title = document.createElement('small');
      title.innerText = file.name;
      title.className = 'text-overflow';
      container.appendChild(title);

      const size = document.createElement('small');
      size.innerText = (file.size / 1024).toFixed(0) + 'KB';
      size.className = 'text-overflow';
      container.appendChild(size);

      container.appendChild(spinner);
      uploadedImagesElements.appendChild(container);
    };
    reader.readAsDataURL(file);
  });
}

function createImageContainer(index) {
  const container = document.createElement('div');
  container.className = 'spin-img-container';
  container.id = `img-${index}`;
  return container;
}

function createImageElement(e) {
  const img = document.createElement('img');
  img.src = e.target.result;
  img.className = 'uploaded-image';
  img.style.opacity = '0.4';
  return img;
}

function createLoadingSpinner(index) {
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  spinner.id = `spinner-${index}`;
  return spinner;
}

function processQueue() {
  countingUploadingFile();
  if (uploadQueue.length > 0) {
    const queue = uploadQueue[0];
    uploadFile(queue.file, queue.index).then(() => {
      const container = document.getElementById(`img-${queue.index}`);
      const spinner = document.getElementById(`spinner-${queue.index}`);
      container.removeChild(spinner);
      container.querySelector('img').style.opacity = '1';
      uploadQueue.shift();
      processQueue();
    });
  } else {
    isProcessing = false;
  }
}

function countingUploadingFile() {
  const countingText = document.getElementById('counting_text');
  countingText.innerText = `Uploading ${uploadQueue.length} photo(s) left`;
}

function uploadFile(file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`File "${file.name}" uploaded`);
      resolve();
    }, 1000);
  });
}
