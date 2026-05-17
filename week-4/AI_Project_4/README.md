# Artificial Intelligence Project 4: Image and Text Recognition

Welcome to **AI Project 4** of the DecodeLabs Industrial Training Kit. This project is a complete, fully functional, beginner-friendly AI project focusing on fundamental computer vision tasks: Optical Character Recognition (OCR) and Object Detection.

## Project Structure

```text
AI_Project_4/
├── images/               # Sample input images
├── outputs/              # System generated outputs
├── models/               # Pre-trained deep learning models
├── ocr.py                # Implementation 1: Text Recognition
├── object_detection.py   # Implementation 2: Object Detection
├── requirements.txt      # Python dependencies
├── REPORT.md             # Full project documentation and theory
└── README.md             # This file
```

## Setup and Installation

### 1. Prerequisites
- **Python 3.10 or higher** must be installed on your system.
- **Tesseract-OCR** engine must be installed on your system to run the OCR version.

### 2. Installing Tesseract-OCR
**For Windows:**
1. Download the installer from [UB-Mannheim Tesseract Wiki](https://github.com/UB-Mannheim/tesseract/wiki).
2. Install the application.
3. Open the start menu, search for "Environment Variables", and click "Edit the system environment variables".
4. Click the "Environment Variables..." button.
5. Under "System variables", select `Path` and click "Edit...".
6. Click "New" and add the path to your Tesseract installation (usually `C:\Program Files\Tesseract-OCR`).
7. Click OK on all windows and restart your computer or VS Code terminal.

**For macOS:**
```bash
brew install tesseract
```

**For Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
```

### 3. Installing Python Dependencies
Open your terminal in the `AI_Project_4` folder and run:
```bash
pip install -r requirements.txt
```

---

## Execution Guide

### Version 1: OCR Text Recognition
This script extracts text from an image, displays the image with applied thresholding, and saves the extracted text to the `outputs/` folder.

**Run command:**
```bash
python ocr.py
```
*(By default, this uses the `images/sample_text.png` image.)*

To run on a specific image:
```bash
python ocr.py --image path/to/your/image.jpg
```

**Expected Output:** 
You will see the terminal print the extracted text. Two OpenCV windows will open (Original and Processed Image). Press 'q' on the keyboard while focused on the image window to close it.

### Version 2: Object Detection
This script detects objects in an image using the MobileNet-SSD deep learning model. It draws bounding boxes and confidence scores, and saves the annotated image to the `outputs/` folder.

**Run command:**
```bash
python object_detection.py
```
*(By default, this uses the `images/sample_objects.jpg` image.)*

To run on a specific image with a custom confidence threshold:
```bash
python object_detection.py --image path/to/your/image.jpg --confidence 0.5
```

**Expected Output:** 
You will see the terminal print the detected objects and their confidence scores. An OpenCV window will open displaying the image with bounding boxes. Press 'q' on the keyboard while focused on the image window to close it.

---

## Troubleshooting

1. **`TesseractNotFoundError`:** If you see an error saying tesseract is not installed or not in your PATH, double-check Step 2 of the installation guide. Ensure you restarted your terminal after adding it to the PATH.
2. **`ModuleNotFoundError: No module named 'cv2'`:** You need to install OpenCV. Run `pip install opencv-python`.
3. **`cv2.error` during image load:** The script cannot find the image file. Ensure you are running the script from inside the `AI_Project_4` directory and that the `images/` folder exists with the correct files.
4. **Model loading error:** Ensure the `MobileNetSSD_deploy.prototxt` and `MobileNetSSD_deploy.caffemodel` files are located inside the `models/` directory.

## Documentation
For a complete theoretical background, algorithms, flowcharts, viva questions, and architecture details, please read the [REPORT.md](./REPORT.md) file included in this repository.
