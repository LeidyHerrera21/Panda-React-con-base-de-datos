from fastapi import APIRouter

router = APIRouter(prefix="/metricas", tags=["Métricas"])

@router.get("/dashboard")
def obtener_metricas_dashboard():
    # Devuelve los datos que alimentan las tarjetas y widgets del frontend
    return {
        "kpis": [
            {"title": "CLIENTES", "value": "245"},
            {"title": "COMENTARIOS", "value": "1,248"},
            {"title": "PROMEDIO ATENCIÓN", "value": "16.4 min"},
            {"title": "PROCESADOS NLP", "value": "94%"}
        ],
        "categorias_nlp": [
            {"nombre": "Soporte", "porcentaje": "42%"},
            {"nombre": "Ventas", "porcentaje": "27%"},
            {"nombre": "Reclamos", "porcentaje": "18%"}
        ],
        "palabras_frecuentes": ["servicio", "atención", "rápido", "producto", "soporte"]
    }