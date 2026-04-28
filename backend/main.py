from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from typing import Optional

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Define schema (must match frontend features)
class Feature(BaseModel):
    moves: int
    optimal_moves: Optional[int]
    excess_moves: Optional[int]
    avg_latency: float
    path_consistency: float
    repeat_error_rate: int
    success: bool

    class Config:
        extra = "allow" 


class PlayerData(BaseModel):
    player_id: str
    features: List[Feature]


# Test route
# @app.get("/")
# def root():
#     return {"message": "Backend is working"}


#save data to json file named after player_id, append if exists
@app.post("/submit")
def submit_data(data: PlayerData):
    filename = f"{DATA_DIR}/{data.player_id}.json"

    # 🔹 Load existing data if player already exists
    if os.path.exists(filename):
        with open(filename, "r") as f:
            existing = json.load(f)
    else:
        existing = []

    #Append new features
    existing.extend([
        {**f.dict(), "player_id": data.player_id}
        for f in data.features
    ])

    #save back to file
    with open(filename, "w") as f:
        json.dump(existing, f, indent=2)

    print(f"Saved data for {data.player_id}")

    return {"message": "Data saved successfully"}

@app.get("/all-data")
def get_all_data():
    all_data=[]
    for file in os.listdir(DATA_DIR):
        path=os.path.join(DATA_DIR, file)

        with open(path, "r") as f :
            data= json.load(f)
            all_data.extend(data)
    
    return all_data
    