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
  estado TEXT NOT NULL
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
  contratoId INTEGER PRIMARY KEY,
  appId TEXT NOT NULL,
  appAddr TEXT NOT NULL,
  cuentaId INTEGER NOT NULL,

  UNIQUE(cuentaId, appId),
  FOREIGN KEY (contratoId) REFERENCES Eleccion(id),
  FOREIGN KEY (cuentaId) REFERENCES CuentaBlockchain(cuentaId)
);

-- Tabla: ContratoReciclado
CREATE TABLE ContratoReciclado (
  recicladoId INTEGER PRIMARY KEY AUTOINCREMENT,
  contratoId INTEGER NOT NULL,
  appId TEXT NOT NULL,
  appAddr TEXT NOT NULL,
  cuentaId INTEGER NOT NULL
);

-- Tabla: PruebaZK
CREATE TABLE PruebaZK (
  pruebaId INTEGER PRIMARY KEY,
  numBloques INTEGER NOT NULL,
  tamBloque INTEGER NOT NULL,
  tamResto INTEGER NOT NULL,
  urlCircuito TEXT NOT NULL,
  ipfsCircuito TEXT NOT NULL,
  claveVotoPublica TEXT,
  claveVotoPrivada TEXT,
  FOREIGN KEY (pruebaId) REFERENCES Eleccion(id)
);

-- Tabla: RaizZK
CREATE TABLE RaizZK (
  pruebaId INTEGER NOT NULL,
  bloqueIdx INTEGER NOT NULL,
  urlCompromisos TEXT NOT NULL,
  ipfsCompromisos TEXT NOT NULL,
  raiz TEXT NOT NULL,
  txnId TEXT NOT NULL,
  PRIMARY KEY (pruebaId, bloqueIdx),
  FOREIGN KEY (pruebaId) REFERENCES PruebaZK(pruebaId)
);

CREATE INDEX idx_RaizZK_raiz ON RaizZK(raiz);



