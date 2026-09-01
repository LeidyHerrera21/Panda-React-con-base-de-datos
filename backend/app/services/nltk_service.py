import re
from collections import Counter
from typing import Dict, Any, List
import nltk
from nltk.corpus import stopwords

# Descarga defensiva de stopwords
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

class NLTKService:
    @staticmethod
    def obtener_stopwords() -> set:
        try:
            return set(stopwords.words('spanish'))
        except Exception:
            return {"de", "la", "que", "el", "en", "y", "a", "los", "del", "se", "por", "un", "para", "con"}

    @classmethod
    def procesar_texto(cls, texto: str) -> Dict[str, Any]:
        """Limpia el texto, elimina stopwords y genera estadísticas de frecuencia."""
        # Normalización a minúsculas y eliminación de caracteres especiales
        texto_limpio = re.sub(r'[^\w\s]', '', texto.lower())
        tokens = texto_limpio.split()
        
        stop_words = cls.obtener_stopwords()
        tokens_filtrados = [word for word in tokens if word not in stop_words and len(word) > 2]
        
        frecuencias = dict(Counter(tokens_filtrados))
        palabras_clave = sorted(frecuencias, key=frecuencias.get, reverse=True)[:5]

        return {
            "tokens_totales": len(tokens),
            "tokens_filtrados": len(tokens_filtrados),
            "frecuencias": frecuencias,
            "palabras_clave": palabras_clave
        }