import cv2
import numpy as np
import urllib.request
import os

os.makedirs('images', exist_ok=True)

# 1. Create a sample text image for OCR
print("Generating sample_text.png...")
# Create a white image
img_text = np.ones((300, 600, 3), dtype=np.uint8) * 255
# Add some text
font = cv2.FONT_HERSHEY_SIMPLEX
cv2.putText(img_text, 'DECODELABS', (50, 100), font, 2, (0, 0, 0), 3, cv2.LINE_AA)
cv2.putText(img_text, 'Artificial Intelligence', (50, 160), font, 1.5, (50, 50, 50), 2, cv2.LINE_AA)
cv2.putText(img_text, 'Project 4: OCR & Detection', (50, 220), font, 1, (100, 100, 100), 2, cv2.LINE_AA)
cv2.imwrite('images/sample_text.png', img_text)
print("Saved images/sample_text.png")

# 2. Download a sample image for Object Detection
print("Downloading sample_objects.jpg...")
url = "https://raw.githubusercontent.com/chuanqi305/MobileNet-SSD/master/images/004545.jpg"
try:
    urllib.request.urlretrieve(url, 'images/sample_objects.jpg')
    print("Saved images/sample_objects.jpg")
except Exception as e:
    print(f"Failed to download image: {e}")
    # Create a fallback image if download fails
    img_obj = np.ones((300, 400, 3), dtype=np.uint8) * 128
    cv2.putText(img_obj, 'Object Image', (50, 150), font, 1.5, (0, 0, 0), 2, cv2.LINE_AA)
    cv2.imwrite('images/sample_objects.jpg', img_obj)
