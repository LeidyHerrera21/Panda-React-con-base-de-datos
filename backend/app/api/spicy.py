from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import numpy as np
from scipy import stats

router = APIRouter(prefix="/scipy", tags=["Scientific Data"])

class DatosAtencionInput(BaseModel):
    tiempos_atencion: List[float]

@router.post("/estadisticas")
def calcular_estadisticas(data: DatosAtencionInput):
    datos = np.array(data.tiempos_atencion)
    
    if len(datos) == 0:
        return {"error": "La lista de datos no puede estar vacía"}

    # Cálculos con NumPy y SciPy
    media = float(np.mean(datos))
    mediana = float(np.median(datos))
    desviacion = float(np.std(datos))
    percentil_90 = float(np.percentile(datos, 90))
    
    # Moda estadística mediante SciPy
    moda_resultado = stats.mode(datos, keepdims=True)
    moda = float(moda_resultado.mode[0]) if len(moda_resultado.mode) > 0 else media

    return {
        "media": round(media, 2),
        "mediana": round(mediana, 2),
        "desviacion_estandar": round(desviacion, 2),
        "percentil_90": round(percentil_90, 2),
        "moda": round(moda, 2)
    }