from fastapi import APIRouter
from pydantic import BaseModel
from collections import Counter
import re
import nltk
from nltk.corpus import stopwords

# Asegurar la descarga de recursos básicos de NLTK
nltk.download('stopwords', quiet=True)

router = APIRouter(prefix="/nltk", tags=["Inteligencia NLP"])

class TextoInput(BaseModel):
    texto: str

@router.post("/analizar")
def analizar_texto(data: TextoInput):
    # Limpieza del texto
    texto_limpio = re.sub(r'[^\w\s]', '', data.texto.lower())
    tokens = texto_limpio.split()
    
    # Filtrar palabras vacías (stopwords) en español
    try:
        stop_words = set(stopwords.words('spanish'))
    except:
        stop_words = {"de", "la", "que", "el", "en", "y", "a", "los", "del", "se", "por", "un", "para", "con"}
        
    tokens_filtrados = [word for word in tokens if word not in stop_words and len(word) > 2]
    
    frecuencias = dict(Counter(tokens_filtrados))
    
    return {
        "tokens_totales": len(tokens),
        "tokens_filtrados": len(tokens_filtrados),
        "frecuencias": frecuencias,
        "palabras_clave": list(frecuencias.keys())[:5]
    }