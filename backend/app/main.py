from fastapi import FastAPI
from app.api import clientes, comentarios, metricas, nltk, scipy
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="API Centro Inteligente",
    description="Backend en FastAPI con SciPy y NLTK",
    version="1.0.0"
)

# Permitir solicitudes desde el Frontend React (http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "API de FastAPI en funcionamiento"}



app = FastAPI(title="API Centro Inteligente")

# Registrar los enrutadores definidos arriba
app.include_router(clientes.router, prefix="/api")
app.include_router(comentarios.router, prefix="/api")
app.include_router(metricas.router, prefix="/api")
app.include_router(nltk.router, prefix="/api")
app.include_router(scipy.router, prefix="/api")    