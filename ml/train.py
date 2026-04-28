import requests
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from sklearn.cluster import DBSCAN

#data load 
url = "http://127.0.0.1:8000/all-data"
data = requests.get(url).json()

df = pd.DataFrame(data)

print("Raw Data:\n", df.head())

#data cleaning
df = df.dropna(subset=[
    "excess_moves",
    "avg_latency",
    "path_consistency"
])

# remove rows where moves is 0 BEFORE ratio
df = df[df["moves"] > 0]

df["efficiency_ratio"] = df["moves"] / df["optimal_moves"]

#features to use for clustering
features = df[
    [
        "excess_moves",
        "efficiency_ratio",
        "avg_latency",
        "path_consistency",
        "repeat_error_rate"
    ]
]

#standardize features
scaler = StandardScaler()
X = scaler.fit_transform(features)

#train KMeans
kmeans = KMeans(n_clusters=3, random_state=42)
labels = kmeans.fit_predict(X)

df["cluster"] = labels

#results
print("\nClustered Data:\n")
print(df[[
    "level",
    "excess_moves",
    "avg_latency",
    "path_consistency",
    "repeat_error_rate",
    "efficiency_ratio",
    "cluster"
]])

#visualize clusters with PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

plt.figure(figsize=(8, 6))

scatter = plt.scatter(
    X_pca[:, 0],
    X_pca[:, 1],
    c=labels,
    cmap='viridis',
    s=50
)

# plot cluster centers
centers = pca.transform(kmeans.cluster_centers_)
plt.scatter(
    centers[:, 0],
    centers[:, 1],
    c='red',
    s=200,
    marker='X',
    label='Centroids'
)

plt.title("KMeans Clusters (PCA Reduced)")
plt.xlabel("PCA Component 1")
plt.ylabel("PCA Component 2")
plt.legend()

plt.colorbar(scatter, label="Cluster")
plt.grid(True)

plt.show()