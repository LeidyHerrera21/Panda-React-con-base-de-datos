from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.connection import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    rol = Column(String(50), default="operador")
    creado_en = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    empresa = Column(String(100), nullable=True)
    creado_en = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relación con comentarios
    comentarios = relationship("Comentario", back_populates="cliente", cascade="all, delete-orphan")


class Comentario(Base):
    __tablename__ = "comentarios"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False)
    texto = Column(Text, nullable=False)
    tiempo_atencion = Column(Float, nullable=True)  # Guardado en minutos para SciPy
    categoria = Column(String(50), nullable=True)    # Clasificación NLP (Soporte, Ventas, etc.)
    estado = Column(String(20), default="pendiente")
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relaciones
    cliente = relationship("Cliente", back_populates="comentarios")
    analisis_nlp = relationship("AnalisisNLP", back_populates="comentario", uselist=False)


class AnalisisNLP(Base):
    __tablename__ = "analisis_nlp"

    id = Column(Integer, primary_key=True, index=True)
    comentario_id = Column(Integer, ForeignKey("comentarios.id"), nullable=False)
    tokens_totales = Column(Integer)
    palabras_clave = Column(Text)  # Guardadas como cadena separada por comas
    sentimiento = Column(String(20), nullable=True)
    procesado_en = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relación
    comentario = relationship("Comentario", back_populates="analisis_nlp")