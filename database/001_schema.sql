-- Creación de la tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'operador',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creación de la tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    empresa VARCHAR(100),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creación de la tabla de comentarios (atención)
CREATE TABLE IF NOT EXISTS comentarios (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    tiempo_atencion FLOAT,
    categoria VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creación de la tabla para análisis NLP
CREATE TABLE IF NOT EXISTS analisis_nlp (
    id SERIAL PRIMARY KEY,
    comentario_id INT NOT NULL REFERENCES comentarios(id) ON DELETE CASCADE,
    tokens_totales INT,
    palabras_clave TEXT,
    sentimiento VARCHAR(20),
    procesado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);