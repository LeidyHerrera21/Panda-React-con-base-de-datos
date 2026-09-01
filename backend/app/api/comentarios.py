from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/comentarios", tags=["Comentarios"])

class ComentarioBase(BaseModel):
    cliente_id: int
    texto: str

class ComentarioResponse(ComentarioBase):
    id: int
    estado: str

db_comentarios = [
    {"id": 1, "cliente_id": 1, "texto": "Excelente atención y servicio técnico muy rápido.", "estado": "procesado"},
    {"id": 2, "cliente_id": 2, "texto": "Tengo problemas con la facturación del servicio.", "estado": "pendiente"}
]

@router.get("/", response_model=List[ComentarioResponse])
def obtener_comentarios():
    return db_comentarios

@router.post("/", response_model=ComentarioResponse, status_code=201)
def registrar_comentario(comentario: ComentarioBase):
    nuevo = {
        "id": len(db_comentarios) + 1,
        "cliente_id": comentario.cliente_id,
        "texto": comentario.texto,
        "estado": "pendiente"
    }
    db_comentarios.append(nuevo)
    return nuevo