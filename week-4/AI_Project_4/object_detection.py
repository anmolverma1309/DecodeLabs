import cv2
import numpy as np
import os
import argparse

# Define the list of class labels MobileNet SSD was trained to detect
CLASSES = ["background", "aeroplane", "bicycle", "bird", "boat",
           "bottle", "bus", "car", "cat", "chair", "cow", "diningtable",
           "dog", "horse", "motorbike", "person", "pottedplant", "sheep",
           "sofa", "train", "tvmonitor"]

# Generate random colors for each class bounding box
np.random.seed(42)
COLORS = np.random.uniform(0, 255, size=(len(CLASSES), 3))

def main():
    parser = argparse.ArgumentParser(description='Object Detection (Version 2)')
    parser.add_argument('-i', '--image', type=str, default='images/sample_objects.jpg',
                        help='Path to the input image')
    parser.add_argument('-c', '--confidence', type=float, default=0.2,
                        help='Minimum probability to filter weak detections')
    args = parser.parse_args()

    image_path = args.image
    min_confidence = args.confidence

    # Paths to the model files
    prototxt_path = "models/MobileNetSSD_deploy.prototxt"
    model_path = "models/MobileNetSSD_deploy.caffemodel"

    # 1. Check if files exist
    if not os.path.exists(image_path):
        print(f"[ERROR] Image file not found at {image_path}")
        return
    if not os.path.exists(prototxt_path) or not os.path.exists(model_path):
        print("[ERROR] MobileNetSSD model files not found in 'models/' directory.")
        return

    # 2. Load the image
    print(f"[INFO] Loading image from: {image_path}")
    image = cv2.imread(image_path)
    if image is None:
        print("[ERROR] Could not read the image.")
        return
    
    (h, w) = image.shape[:2]

    # 3. Preprocessing (Blob creation)
    print("[INFO] Preprocessing image and creating blob...")
    # Resize to 300x300 and apply mean subtraction (MobileNet SSD specific)
    blob = cv2.dnn.blobFromImage(cv2.resize(image, (300, 300)), 0.007843, (300, 300), 127.5)

    # 4. Load the pre-trained model
    print("[INFO] Loading MobileNet SSD model...")
    net = cv2.dnn.readNetFromCaffe(prototxt_path, model_path)

    # 5. Pass the blob through the network and obtain detections
    print("[INFO] Computing object detections...")
    net.setInput(blob)
    detections = net.forward()

    # 6. Process detections and draw bounding boxes
    objects_detected = 0
    for i in np.arange(0, detections.shape[2]):
        # Extract the confidence (i.e., probability) associated with the prediction
        confidence = detections[0, 0, i, 2]

        # Filter out weak detections by ensuring confidence is greater than the minimum
        if confidence > min_confidence:
            # Extract the index of the class label from the detections
            idx = int(detections[0, 0, i, 1])
            
            # Compute the (x, y)-coordinates of the bounding box
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")

            # Display the prediction (Label and confidence)
            label = f"{CLASSES[idx]}: {confidence * 100:.2f}%"
            print(f"[INFO] Detected {label}")
            objects_detected += 1

            # Draw the bounding box and label on the image
            cv2.rectangle(image, (startX, startY), (endX, endY), COLORS[idx], 2)
            y = startY - 15 if startY - 15 > 15 else startY + 15
            cv2.putText(image, label, (startX, y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, COLORS[idx], 2)

    print(f"\n[INFO] Total objects detected: {objects_detected}")

    # 7. Save output image
    os.makedirs('outputs', exist_ok=True)
    output_img_path = 'outputs/object_detection_result.jpg'
    cv2.imwrite(output_img_path, image)
    print(f"[INFO] Processed image saved to: {output_img_path}")

    # 8. Display processed image
    cv2.imshow("Output - Object Detection", image)
    print("[INFO] Press 'q' on the image window to exit.")
    while True:
        # Wait 1ms for a key press; exit loop when 'q' is pressed
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        # Also exit if the user closes the window manually
        if cv2.getWindowProperty("Output - Object Detection", cv2.WND_PROP_VISIBLE) < 1:
            break
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
