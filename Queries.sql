

-- -----------------------------------------------------
-- Table `mydb`.`tipos_documentos`
-- -----------------------------------------------------
CREATE SEQUENCE tipos_documentos_seq;

CREATE TABLE IF NOT EXISTS tipos_documentos (
  id INT NOT NULL DEFAULT NEXTVAL ('tipos_documentos_seq'),
  tipo_doc_id VARCHAR(45) NULL,
  descripcion VARCHAR(45) NULL,
  PRIMARY KEY (id))
;


-- -----------------------------------------------------
-- Table `mydb`.`usuarios`
-- -----------------------------------------------------
CREATE SEQUENCE usuarios_seq;

CREATE TABLE IF NOT EXISTS usuarios (
  usuario_id INT NOT NULL DEFAULT NEXTVAL ('usuarios_seq'),
  usuario VARCHAR(255) NULL,
  clave VARCHAR(255) NULL,
  tipo_doc_id INT NULL,
  nombres VARCHAR(45) NULL,
  apellidos VARCHAR(45) NULL,
  telefono VARCHAR(45) NULL,
  correo VARCHAR(45) NULL,
  numero_documento VARCHAR(45) NULL,
  estado CHAR(2) NULL,
  fecha_registro TIMESTAMP(0) NOW(),
  PRIMARY KEY (usuario_id)
 ,
  CONSTRAINT tipo_doc_id
    FOREIGN KEY (tipo_doc_id)
    REFERENCES tipos_documentos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE INDEX tipo_doc_id_idx ON usuarios (tipo_doc_id ASC);


-- -----------------------------------------------------
-- Table `mydb`.`administradores_parquedaderos`
-- -----------------------------------------------------
CREATE SEQUENCE administradores_parquedaderos_seq;

CREATE TABLE IF NOT EXISTS administradores_parquedaderos (
  id INT NOT NULL DEFAULT NEXTVAL ('administradores_parquedaderos_seq'),
  usuario_id INT NULL,
  PRIMARY KEY (id)
 ,
  CONSTRAINT usuario_id_admin
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios (usuario_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE INDEX usuario_id_admin_idx ON administradores_parquedaderos (usuario_id ASC);


-- -----------------------------------------------------
-- Table `mydb`.`clientes`
-- -----------------------------------------------------
CREATE SEQUENCE clientes_seq;

CREATE TABLE IF NOT EXISTS clientes (
  id INT NOT NULL DEFAULT NEXTVAL ('clientes_seq'),
  usuario_id INT NULL,
  PRIMARY KEY (id)
 ,
  CONSTRAINT usuario_id_clientes
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios (usuario_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE INDEX usuario_id_clientes_idx ON clientes (usuario_id ASC);


-- -----------------------------------------------------
-- Table `mydb`.`tipos_vehiculos`
-- -----------------------------------------------------
CREATE SEQUENCE tipos_vehiculos_seq;

CREATE TABLE IF NOT EXISTS tipos_vehiculos (
  id INT NOT NULL DEFAULT NEXTVAL ('tipos_vehiculos_seq'),
  descripcion VARCHAR(45) NULL,
  PRIMARY KEY (id))
;


-- -----------------------------------------------------
-- Table `mydb`.`vehiculos`
-- -----------------------------------------------------
CREATE SEQUENCE vehiculos_seq;

CREATE TABLE IF NOT EXISTS vehiculos (
  id INT NOT NULL DEFAULT NEXTVAL ('vehiculos_seq'),
  cliente_id INT NULL,
  tipo_id INT NULL,
  modelo VARCHAR(45) NULL,
  marca VARCHAR(45) NULL,
  PRIMARY KEY (id)
 ,
  CONSTRAINT cliente_vehiculo
    FOREIGN KEY (cliente_id)
    REFERENCES clientes (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT tipos_vehiculo_id
    FOREIGN KEY (tipo_id)
    REFERENCES tipos_vehiculos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE INDEX cliente_vehiculo_idx ON vehiculos (cliente_id ASC);
CREATE INDEX tipos_vehiculo_id_idx ON vehiculos (tipo_id ASC);


-- -----------------------------------------------------
-- Table `mydb`.`administradores_establecimientos`
-- -----------------------------------------------------
CREATE SEQUENCE administradores_establecimientos_seq;

CREATE TABLE IF NOT EXISTS administradores_establecimientos (
  id INT NOT NULL DEFAULT NEXTVAL ('administradores_establecimientos_seq'),
  usuario_id INT NULL,
  PRIMARY KEY (id)
 ,
  CONSTRAINT estable_admin_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios (usuario_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE INDEX estable_admin_usuario_idx ON administradores_establecimientos (usuario_id ASC);


-- -----------------------------------------------------
-- Table `mydb`.`tipos_establecimientos`
-- -----------------------------------------------------
CREATE SEQUENCE tipos_establecimientos_seq;

CREATE TABLE IF NOT EXISTS tipos_establecimientos (
  id INT NOT NULL DEFAULT NEXTVAL ('tipos_establecimientos_seq'),
  descripcion VARCHAR(45) NULL,
  PRIMARY KEY (id))
;


-- -----------------------------------------------------
-- Table `mydb`.`establecimientos`
-- -----------------------------------------------------
CREATE SEQUENCE establecimientos_seq;

CREATE TABLE IF NOT EXISTS establecimientos (
  id INT NOT NULL DEFAULT NEXTVAL ('establecimientos_seq'),
  administrador_id INT NULL,
  tipo_id INT NULL,
  nombre VARCHAR(45) NULL,
  direccion VARCHAR(45) NULL,
  PRIMARY KEY (id)
 ,
  CONSTRAINT admin_establecimiento
    FOREIGN KEY (administrador_id)
    REFERENCES administradores_establecimientos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT tipo_estable
    FOREIGN KEY (tipo_id)
    REFERENCES tipos_establecimientos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE INDEX admin_establecimiento_idx ON establecimientos (administrador_id ASC);
CREATE INDEX tipo_estable_idx ON establecimientos (tipo_id ASC);


-- -----------------------------------------------------
-- Table `mydb`.`parqueaderos`
-- -----------------------------------------------------
CREATE SEQUENCE parqueaderos_seq;

CREATE TABLE IF NOT EXISTS parqueaderos (
  id INT NOT NULL DEFAULT NEXTVAL ('parqueaderos_seq'),
  administrador_id INT NULL,
  direccion VARCHAR(255) NULL,
  lat VARCHAR(255) NULL,
  long VARCHAR(255) NULL,
  telefono VARCHAR(45) NULL,
  descripocion TEXT NULL,
  PRIMARY KEY (id)
 ,
  CONSTRAINT admin_parque
    FOREIGN KEY (administrador_id)
    REFERENCES administradores_parquedaderos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE INDEX admin_parque_idx ON parqueaderos (administrador_id ASC);


-- -----------------------------------------------------
-- Table `mydb`.`parqueaderos_de_administradores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS parqueaderos_de_administradores (
)
;


-- -----------------------------------------------------
-- Table `mydb`.`fotos_parqueaderos`
-- -----------------------------------------------------
CREATE SEQUENCE fotos_parqueaderos_seq;

CREATE TABLE IF NOT EXISTS fotos_parqueaderos (
  id INT NOT NULL DEFAULT NEXTVAL ('fotos_parqueaderos_seq'),
  parqueadero_id INT NULL,
  path VARCHAR(255) NULL,
  descripcion VARCHAR(255) NULL,
  PRIMARY KEY (id)
 ,
  CONSTRAINT parqueadero_id_foto
    FOREIGN KEY (parqueadero_id)
    REFERENCES parqueaderos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE INDEX parqueadero_id_foto_idx ON fotos_parqueaderos (parqueadero_id ASC);


-- -----------------------------------------------------
-- Table `mydb`.`servicios_parqueaderos`
-- -----------------------------------------------------
CREATE SEQUENCE servicios_parqueaderos_seq;

CREATE TABLE IF NOT EXISTS servicios_parqueaderos (
  id INT NOT NULL DEFAULT NEXTVAL ('servicios_parqueaderos_seq'),
  parqueadero_id INT NULL,
  descripcion VARCHAR(255) NULL,
  PRIMARY KEY (id)
 ,
  CONSTRAINT parqueadero_id_servicio
    FOREIGN KEY (parqueadero_id)
    REFERENCES parqueaderos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE INDEX parqueadero_id_servicio_idx ON servicios_parqueaderos (parqueadero_id ASC);


-- -----------------------------------------------------
-- Table `mydb`.`formas_pago`
-- -----------------------------------------------------
CREATE SEQUENCE formas_pago_seq;

CREATE TABLE IF NOT EXISTS formas_pago (
  id INT NOT NULL DEFAULT NEXTVAL ('formas_pago_seq'),
  descripcion VARCHAR(45) NULL,
  PRIMARY KEY (id))
;


-- -----------------------------------------------------
-- Table `mydb`.`parqueaderos_registro`
-- -----------------------------------------------------
CREATE SEQUENCE parqueaderos_registro_seq;

CREATE TABLE IF NOT EXISTS parqueaderos_registro (
  id INT NOT NULL DEFAULT NEXTVAL ('parqueaderos_registro_seq'),
  usuario_id INT NULL,
  vehiculo_id INT NULL,
  parqueadero_id INT NULL,
  fecha_registro TIMESTAMP(0) NOW(),
  fecha_salida TIMESTAMP(0) NULL,
  fecha_confirmacion_salida TIMESTAMP(0) NULL,
  tipo_pago_id INT NULL,
  PRIMARY KEY (id)
 ,
  CONSTRAINT usuario_registro
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios (usuario_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT vehiculo_registro
    FOREIGN KEY (vehiculo_id)
    REFERENCES vehiculos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT tipo_pago_registro
    FOREIGN KEY (tipo_pago_id)
    REFERENCES formas_pago (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE INDEX usuario_registro_idx ON parqueaderos_registro (usuario_id ASC);
CREATE INDEX vehiculo_registro_idx ON parqueaderos_registro (vehiculo_id ASC);
CREATE INDEX tipo_pago_registro_idx ON parqueaderos_registro (tipo_pago_id ASC);


-- -----------------------------------------------------
-- Table `mydb`.`parqueaderos_calificaciones`
-- -----------------------------------------------------
CREATE SEQUENCE parqueaderos_calificaciones_seq;

CREATE TABLE IF NOT EXISTS parqueaderos_calificaciones (
  id INT NOT NULL DEFAULT NEXTVAL ('parqueaderos_calificaciones_seq'),
  cliente_id INT NULL,
  parqueadero_id INT NULL,
  calificacion INT NULL,
  fecha_registro TIMESTAMP(0) NOW(),
  PRIMARY KEY (id)
 ,
  CONSTRAINT usuario_id_ca
    FOREIGN KEY (cliente_id)
    REFERENCES usuarios (usuario_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT parqueadero_id_ca
    FOREIGN KEY (parqueadero_id)
    REFERENCES parqueaderos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE INDEX parqueadero_id_ca_idx ON parqueaderos_calificaciones (parqueadero_id ASC);
CREATE INDEX usuario_id_ca_idx ON parqueaderos_calificaciones (cliente_id ASC);


-- -----------------------------------------------------
-- Table `mydb`.`comentarios_parqueaderos`
-- -----------------------------------------------------
CREATE SEQUENCE comentarios_parqueaderos_seq;

CREATE TABLE IF NOT EXISTS comentarios_parqueaderos (
  id INT NOT NULL DEFAULT NEXTVAL ('comentarios_parqueaderos_seq'),
  usuario_id INT NULL,
  parqueadero_id INT NULL,
  descripcion TEXT NULL,
  fecha_registro TIMESTAMP(0) NOW(),
  PRIMARY KEY (id)
 ,
  CONSTRAINT usuario_comentario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios (usuario_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT parqueadero_comentario
    FOREIGN KEY (parqueadero_id)
    REFERENCES parqueaderos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE INDEX usuario_comentario_idx ON comentarios_parqueaderos (usuario_id ASC);
CREATE INDEX parqueadero_comentario_idx ON comentarios_parqueaderos (parqueadero_id ASC);


/* SET SQL_MODE=@OLD_SQL_MODE; */
/* SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS; */
/* SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS; */