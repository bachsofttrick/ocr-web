from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Mount the dist directory at root
app.mount("/", StaticFiles(directory="dist", html=True), name="static")
