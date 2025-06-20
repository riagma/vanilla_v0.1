-- Tabla: Administrador
CREATE TABLE Administrador (
  correo TEXT PRIMARY KEY,
  hashContrasena TEXT NOT NULL
);

-- Tabla: Votante
CREATE TABLE Votante (
  dni TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  primerApellido TEXT NOT NULL,
  segundoApellido TEXT NOT NULL,
  correoElectronico TEXT UNIQUE,
  hashContrasena TEXT
);

-- Tabla: Eleccion
CREATE TABLE Eleccion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT NOT NULL,
  fechaInicioRegistro TEXT NOT NULL,
  fechaFinRegistro TEXT NOT NULL,
  fechaInicioVotacion TEXT NOT NULL,
  fechaFinVotacion TEXT NOT NULL,
  fechaEscrutinio TEXT NOT NULL,
  contratoId INTEGER,
  estado TEXT NOT NULL,
  FOREIGN KEY (contratoId) 
    REFERENCES ContratoBlockchain(contratoId) 
    ON DELETE SET NULL
);

-- Tabla: Partido
CREATE TABLE Partido (
  siglas TEXT PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT NOT NULL
);

-- Tabla: PartidoEleccion (relación muchos a muchos)
CREATE TABLE PartidoEleccion (
  partidoId TEXT NOT NULL,
  eleccionId INTEGER NOT NULL,
  PRIMARY KEY (partidoId, eleccionId),
  FOREIGN KEY (partidoId) REFERENCES Partido(siglas),
  FOREIGN KEY (eleccionId) REFERENCES Eleccion(id)
);

-- Tabla: RegistroVotanteEleccion
CREATE TABLE RegistroVotanteEleccion (
  votanteId TEXT NOT NULL,
  eleccionId INTEGER NOT NULL,
  compromiso TEXT NOT NULL,
  compromisoIdx INTEGER NOT NULL,
  transaccion TEXT NOT NULL,
  fechaRegistro TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  datosPrivados TEXT,
  PRIMARY KEY (votanteId, eleccionId),
  FOREIGN KEY (votanteId) REFERENCES Votante(dni),
  FOREIGN KEY (eleccionId) REFERENCES Eleccion(id)
);

CREATE INDEX idx_registro_eleccion ON RegistroVotanteEleccion(eleccionId);
CREATE INDEX idx_registro_compromiso ON RegistroVotanteEleccion(eleccionId, compromisoIdx);

-- Tabla: ResultadoEleccion
CREATE TABLE ResultadoEleccion (
  eleccionId INTEGER PRIMARY KEY,
  censados INTEGER NOT NULL DEFAULT 0,
  votantes INTEGER NOT NULL DEFAULT 0,
  abstenciones INTEGER NOT NULL DEFAULT 0,
  votosBlancos INTEGER NOT NULL DEFAULT 0,
  votosNulos INTEGER NOT NULL DEFAULT 0,
  fechaRecuento TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (eleccionId) REFERENCES Eleccion(id)
);

-- Tabla: ResultadoPartido
CREATE TABLE ResultadoPartido (
  partidoId TEXT NOT NULL,
  eleccionId INTEGER NOT NULL,
  votos INTEGER NOT NULL DEFAULT 0,
  porcentaje REAL NOT NULL DEFAULT 0,
  PRIMARY KEY (partidoId, eleccionId),
  FOREIGN KEY (partidoId) REFERENCES Partido(siglas),
  FOREIGN KEY (eleccionId) REFERENCES ResultadoEleccion(eleccionId)
);

-- Tabla: CuentaBlockchain
CREATE TABLE CuentaBlockchain (
  cuentaId INTEGER PRIMARY KEY AUTOINCREMENT,
  accNet TEXT NOT NULL,
  accAddr TEXT NOT NULL,
  accSecret TEXT NOT NULL,
  UNIQUE(accNet, accAddr)
);

-- Tabla: ContratoBlockchain
CREATE TABLE ContratoBlockchain (
  contratoId INTEGER PRIMARY KEY AUTOINCREMENT,
  appId TEXT NOT NULL,
  appAddr TEXT NOT NULL,
  cuentaId INTEGER NOT NULL,

  UNIQUE(cuentaId, appId),
  FOREIGN KEY (cuentaId) REFERENCES CuentaBlockchain(cuentaId)
);
