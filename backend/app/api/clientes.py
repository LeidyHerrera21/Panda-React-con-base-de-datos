from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/clientes", tags=["Clientes"])

class ClienteBase(BaseModel):
    nombre: str
    email: str
    empresa: str

class ClienteResponse(ClienteBase):
    id: int

# Base de datos simulada en memoria
db_clientes = [
    {"id": 1, "nombre": "Juan Pérez", "email": "juan@empresa.com", "empresa": "Tech Solutions"},
    {"id": 2, "nombre": "Maria Lopez", "email": "maria@global.com", "empresa": "Global Logistics"},
]

@router.get("/", response_model=List[ClienteResponse])
def listar_clientes():
    return db_clientes

@router.post("/", response_model=ClienteResponse, status_code=201)
def crear_cliente(cliente: ClienteBase):
    nuevo_id = len(db_clientes) + 1
    nuevo_cliente = {"id": nuevo_id, **cliente.dict()}
    db_clientes.append(nuevo_cliente)
    return nuevo_cliente

@router.get("/{cliente_id}", response_model=ClienteResponse)
def obtener_cliente(cliente_id: int):
    for cliente in db_clientes:
        if cliente["id"] == cliente_id:
            return cliente
    raise HTTPException(status_code=404, detail="Cliente no encontrado")