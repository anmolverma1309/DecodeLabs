import cv2
import pytesseract
import os
import argparse

def main():
    # Setup argument parser
    parser = argparse.ArgumentParser(description='OCR Text Recognition (Version 1)')
    parser.add_argument('-i', '--image', type=str, default='images/sample_text.png',
                        help='Path to the input image')
    args = parser.parse_args()

    image_path = args.image

    # 1. Load the image
    print(f"[INFO] Loading image from: {image_path}")
    if not os.path.exists(image_path):
        print(f"[ERROR] Image file not found at {image_path}")
        return

    image = cv2.imread(image_path)
    
    # Check if image was successfully loaded
    if image is None:
        print("[ERROR] Could not read the image.")
        return

    # 2. Preprocessing
    print("[INFO] Preprocessing image...")
    # Convert image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Apply thresholding to make text pop out against background
    # Using Otsu's thresholding
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # 3. Perform OCR
    print("[INFO] Extracting text using pytesseract...")
    # Configure pytesseract options if needed (e.g., --psm 6 for a block of text)
    custom_config = r'--oem 3 --psm 6'
    
    try:
        extracted_text = pytesseract.image_to_string(thresh, config=custom_config)
    except pytesseract.TesseractNotFoundError:
        print("[ERROR] Tesseract OCR is not installed or not in your PATH.")
        print("Please install tesseract-ocr and try again.")
        return

    # 4. Display the extracted text
    print("\n==============================")
    print("      EXTRACTED TEXT")
    print("==============================")
    print(extracted_text.strip() if extracted_text.strip() else "[No text detected]")
    print("==============================\n")

    # 5. Save the extracted text to a TXT file
    os.makedirs('outputs', exist_ok=True)
    output_txt_path = 'outputs/extracted_text.txt'
    with open(output_txt_path, 'w', encoding='utf-8') as f:
        f.write(extracted_text)
    print(f"[INFO] Extracted text saved to: {output_txt_path}")

    # 6. Show the input and processed output
    # Resize for display if the image is too large
    display_img = image.copy()
    display_thresh = thresh.copy()
    
    cv2.imshow("Original Image", display_img)
    cv2.imshow("Processed (Thresholded) Image", display_thresh)

    print("[INFO] Press 'q' on the image window to exit.")
    while True:
        # Wait 1ms for a key press; exit loop when 'q' is pressed
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        # Also exit if the user closes the window manually
        if cv2.getWindowProperty("Original Image", cv2.WND_PROP_VISIBLE) < 1:
            break
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
