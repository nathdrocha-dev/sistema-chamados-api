CREATE DATABASE IF NOT EXISTS sistema_chamados
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

USE sistema_chamados;

CREATE TABLE IF NOT EXISTS chamados (
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    solicitante VARCHAR(100) NOT NULL,
    categoria ENUM(
        'Hardware',
        'Software',
        'Rede',
        'Acesso',
        'Outro'
    ) NOT NULL,
    prioridade ENUM(
        'Baixa',
        'Média',
        'Alta'
    ) NOT NULL,
    status ENUM(
        'Aberto',
        'Em andamento',
        'Finalizado'
    ) NOT NULL DEFAULT 'Aberto',

    PRIMARY KEY (id)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;
