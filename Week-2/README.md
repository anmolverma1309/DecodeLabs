# Iris Classification Using K-Nearest Neighbors (Week-2)

This is a supervised learning classification project using the Iris dataset and K-Nearest Neighbors (KNN) algorithm for DecodeLabs internship (Week 2).

## Project Overview
Build a basic classification model using the Iris dataset to predict iris species based on flower measurements (sepal length, sepal width, petal length, petal width).

## Dataset
- **Name:** Iris Benchmark
- **Samples:** 150 flower samples
- **Features:** 4 (sepal length, sepal width, petal length, petal width)
- **Classes:** 3 (Setosa, Versicolor, Virginica) 

## Algorithm
**K-Nearest Neighbors (KNN)** - A simple, non-parametric supervised learning algorithm that classifies data points based on the majority class among its K nearest neighbors.

## Key Steps
1. **Load & Explore Dataset** - Understand the iris dataset structure and statistics
2. **Feature Engineering** - Separate features (X) and labels (y)
3. **Feature Scaling** - Apply StandardScaler to normalize features (prevents data leakage by fitting on training data only)
4. **Data Splitting** - Train/Test split (80%/20%)
5. **Model Training** - Build and train KNN model with K=5
6. **Evaluation** - Generate confusion matrix, classification report, and F1 score

## Usage
1. Open a terminal in the `Week-2` directory.
2. Run the classification model:

```bash
python iris_classification.py
```

3. The script will:
   - Load and display iris dataset statistics
   - Train the KNN model
   - Display classification metrics and confusion matrix visualization

## Results
- **Confusion Matrices:** Generated for different K values
  - `final_confusion_matrix_k1.png` - Results with K=1
  - `confusion_matrix_k5.png` - Results with K=5
- **Tuning Results:** `tuning_k.png` - Performance across different K values

## Requirements
- Python 3.x
- pandas
- scikit-learn
- matplotlib

## Key Learnings
- Data must be split BEFORE scaling to prevent data leakage
- StandardScaler should be fitted on training data only
- KNN performance is sensitive to K value and feature scaling
- Confusion matrix helps identify which species are misclassified

---

**Author:** Anmol Verma  
**Framework:** Python + scikit-learn  
**Batch:** 2026 (DecodeLabs)
