import numpy as np
from scipy import stats
from typing import List, Dict, Any

class SciPyService:
    @staticmethod
    def calcular_metricas_atencion(tiempos: List[float]) -> Dict[str, Any]:
        """Calcula métricas estadísticas avanzadas (media, mediana, percentiles, moda)."""
        if not tiempos:
            return {
                "media": 0.0,
                "mediana": 0.0,
                "desviacion_estandar": 0.0,
                "percentil_90": 0.0,
                "moda": 0.0
            }

        datos = np.array(tiempos)

        media = float(np.mean(datos))
        mediana = float(np.median(datos))
        desviacion = float(np.std(datos))
        percentil_90 = float(np.percentile(datos, 90))
        
        # Moda usando SciPy
        moda_res = stats.mode(datos, keepdims=True)
        moda = float(moda_res.mode[0]) if len(moda_res.mode) > 0 else media

        return {
            "media": round(media, 2),
            "mediana": round(mediana, 2),
            "desviacion_estandar": round(desviacion, 2),
            "percentil_90": round(percentil_90, 2),
            "moda": round(moda, 2)
        }