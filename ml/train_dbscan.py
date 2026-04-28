import requests
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
from sklearn.decomposition import PCA

#load dta from API
url = "http://127.0.0.1:8000/all-data"
data = requests.get(url).json()

df = pd.DataFrame(data)

# print("Raw Data:\n", df.head())

#cleaning data 
df = df[
    (df["moves"] > 0) &
    (df["optimal_moves"].notna())
]

print("\nCleaned Data:\n", df.head())

print("\nData Info:\n", df.info())