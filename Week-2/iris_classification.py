import pandas as pd
from sklearn.datasets import load_iris
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import classification_report, confusion_matrix, ConfusionMatrixDisplay, f1_score
import matplotlib.pyplot as plt

def main():
    print("=== Step 1: Load & Explore the Dataset ===")
    iris = load_iris()
    df = pd.DataFrame(iris.data, columns=iris.feature_names)
    df['species'] = iris.target
    print(df.head())
    print("\nDataset Statistics:")
    print(df.describe())
    print("\nClass Balance:")
    print(df['species'].value_counts())

    print("\n=== Step 2: Separate Features (X) and Labels (y) ===")
    X = iris.data
    y = iris.target
    print(f"X shape: {X.shape}")
    print(f"y shape: {y.shape}")

    print("\n=== Step 3: Apply Feature Scaling (StandardScaler) ===")
    # It is best practice to split data BEFORE scaling to prevent data leakage!
    # The roadmap says: "Always fit the scaler on training data only (after the split). Fitting on the full data leaks test information."
    # Wait, in the roadmap, step 3 is Feature Scaling on X directly, BUT then it has a bullet point:
    # "Always fit the scaler on training data only (after the split)."
    # Let's do the split first as recommended by the bullet point.
    X_train_raw, X_test_raw, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        shuffle=True
    )
    
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train_raw)
    X_test = scaler.transform(X_test_raw)
    print("Data scaled successfully.")

    print("\n=== Step 4: Split Data - Train (80%) / Test (20%) ===")
    print(f"Training set: {X_train.shape}")
    print(f"Testing set: {X_test.shape}")

    print("\n=== Step 5: Build & Train the KNN Model ===")
    model = KNeighborsClassifier(n_neighbors=5)
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)
    print("Model trained with K=5 and predictions generated.")

    print("\n=== Step 6: Evaluate - Confusion Matrix & F1 Score ===")
    print("Classification Report:")
    print(classification_report(y_test, predictions, target_names=iris.target_names))
    
    cm = confusion_matrix(y_test, predictions)
    disp = ConfusionMatrixDisplay(cm, display_labels=iris.target_names)
    disp.plot(cmap='Blues')
    plt.title('Confusion Matrix (K=5)')
    plt.savefig('confusion_matrix_k5.png')
    print("Confusion matrix plot saved as 'confusion_matrix_k5.png'")
    plt.close()

    print("\n=== Step 7: Tune K - Find the Optimal Neighbour Count ===")
    k_values = range(1, 21)
    f1_scores = []
    
    for k in k_values:
        m = KNeighborsClassifier(n_neighbors=k)
        m.fit(X_train, y_train)
        preds = m.predict(X_test)
        f1_scores.append(f1_score(y_test, preds, average='weighted'))
        
    plt.figure()
    plt.plot(k_values, f1_scores, marker='o', color='steelblue')
    plt.xlabel('K value')
    plt.ylabel('F1 Score')
    plt.title('Tuning K - Find the Elbow')
    plt.grid(True)
    plt.savefig('tuning_k.png')
    print("Tuning K plot saved as 'tuning_k.png'")
    plt.close()
    
    best_k = k_values[f1_scores.index(max(f1_scores))]
    print(f"Best K: {best_k}")

    print("\n=== Step 8: Final Model - Retrain with Best K & Report ===")
    final_model = KNeighborsClassifier(n_neighbors=best_k)
    final_model.fit(X_train, y_train)
    final_preds = final_model.predict(X_test)
    
    print('=== FINAL RESULTS ===')
    print(classification_report(y_test, final_preds, target_names=iris.target_names))
    
    # Save final confusion matrix
    cm_final = confusion_matrix(y_test, final_preds)
    disp_final = ConfusionMatrixDisplay(cm_final, display_labels=iris.target_names)
    disp_final.plot(cmap='Blues')
    plt.title(f'Final Confusion Matrix (K={best_k})')
    plt.savefig(f'final_confusion_matrix_k{best_k}.png')
    print(f"Final confusion matrix plot saved as 'final_confusion_matrix_k{best_k}.png'")

if __name__ == "__main__":
    main()
