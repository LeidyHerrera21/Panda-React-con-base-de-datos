-- Inserción de usuarios iniciales
INSERT INTO usuarios (nombre, email, hashed_password, rol) VALUES
('Administrador', 'admin@empresa.com', '$2b$12$eImiTXuWVxfM37uY4JANjOL.81F8.75m6G5x0y1M6.g2152M5.1y.', 'admin'),
('Operador Juan', 'juan@empresa.com', '$2b$12$eImiTXuWVxfM37uY4JANjOL.81F8.75m6G5x0y1M6.g2152M5.1y.', 'operador');

-- Inserción de clientes iniciales
INSERT INTO clientes (nombre, email, empresa) VALUES
('Carlos Mendoza', 'carlos.mendoza@techcorp.com', 'TechCorp'),
('Ana Torres', 'ana.torres@globalnet.com', 'GlobalNet'),
('Luis Gómez', 'luis.gomez@logistica.pe', 'Logística PE');

-- Inserción de comentarios iniciales
INSERT INTO comentarios (cliente_id, texto, tiempo_atencion, categoria, estado) VALUES
(1, 'El servicio técnico respondió de manera muy rápida y resolvió mi problema con el software.', 12.5, 'Soporte', 'procesado'),
(2, 'Necesito consultar sobre los precios y paquetes disponibles para la renovación de licencias de software.', 22.0, 'Ventas', 'procesado'),
(3, 'Tengo un reclamo importante por demoras en la entrega del producto durante esta semana.', 14.8, 'Reclamos', 'procesado');

-- Inserción de análisis NLP iniciales
INSERT INTO analisis_nlp (comentario_id, tokens_totales, palabras_clave, sentimiento) VALUES
(1, 14, 'servicio, técnico, rápida, software', 'Positivo'),
(2, 13, 'precios, paquetes, renovación, licencias', 'Neutral'),
(3, 12, 'reclamo, demoras, entrega, producto', 'Negativo');