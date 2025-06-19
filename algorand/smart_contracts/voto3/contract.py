# smart_contracts/voto3/contract.py
from algopy import ARC4Contract, UInt64, Asset, Global, Txn, itxn, String, Bytes
from algopy.arc4 import abimethod


class Voto3(ARC4Contract):
    # Contadores
    contador_compromisos: UInt64
    contador_raices: UInt64
    contador_anuladores: UInt64
    estado_contrato: UInt64
    asset_id: Asset

    def __init__(self) -> None:
        super().__init__()
        # Inicializar contadores
        self.contador_compromisos = UInt64(0)
        self.contador_raices = UInt64(0)
        self.contador_anuladores = UInt64(0)
        self.estado_contrato = UInt64(0)
        self.asset_id = Asset(0)

    # ---------------

    @abimethod(allow_actions=["NoOp"])
    def inicializar_eleccion(
        self,
        asset_name: String,
        unit_name: String,
        total: UInt64,
    ) -> UInt64:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede inicializar la elección"
        assert self.estado_contrato == UInt64(0), "El contrato ya está inicializado"

        name_bytes = asset_name.bytes
        unit_bytes = unit_name.bytes

        assert name_bytes.length <= 32, "asset_name demasiado largo"
        assert unit_bytes.length <= 8, "unit_name demasiado largo"

        asset_txn = itxn.AssetConfig(
            asset_name=name_bytes,
            unit_name=unit_bytes,
            total=total,
            decimals=0,
            manager=Global.current_application_address,
            clawback=Global.current_application_address,
        ).submit()

        self.asset_id = asset_txn.created_asset
        self.estado_contrato = UInt64(1)  # Cambiar estado tras inicialización
        return self.asset_id.id

    # ---------------

    @abimethod()
    def leer_estado_contrato(self) -> UInt64:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede leer el estado del contrato"
        return self.estado_contrato

    @abimethod()  # Agregar @abimethod
    def establecer_estado_contrato(self, nuevo_estado: UInt64) -> UInt64:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede establecer el estado del contrato"
        self.estado_contrato = nuevo_estado
        return self.estado_contrato

    # --------------

    # Métodos para compromisos
    @abimethod()
    def abrir_registro_compromisos(self) -> None:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede abrir el registro de compromisos"
        assert self.estado_contrato == UInt64(
            1
        ), "El contrato no está en el estado correcto"
        self.estado_contrato = UInt64(2)

    @abimethod()
    def cerrar_registro_compromisos(self) -> UInt64:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede cerrar el registro de compromisos"
        assert self.estado_contrato == UInt64(
            2
        ), "El contrato no está en el estado correcto"
        self.estado_contrato = UInt64(3)
        return self.contador_compromisos

    @abimethod()
    def registrar_compromiso(self) -> UInt64:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede registrar compromisos"
        assert self.estado_contrato == UInt64(
            2
        ), "El contrato no está en el estado correcto"
        current = self.contador_compromisos
        self.contador_compromisos = current + 1
        return current

    # --------------

    # Métodos para raíces
    @abimethod()
    def abrir_registro_raices(self) -> None:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede abrir el registro de raíces"
        assert self.estado_contrato == UInt64(
            3
        ), "El contrato no está en el estado correcto"
        self.estado_contrato = UInt64(4)

    @abimethod()
    def cerrar_registro_raices(self) -> UInt64:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede cerrar el registro de raíces"
        assert self.estado_contrato == UInt64(
            4
        ), "El contrato no está en el estado correcto"
        self.estado_contrato = UInt64(5)
        return self.contador_raices

    @abimethod()
    def registrar_raiz(self) -> UInt64:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede registrar raíces"
        assert self.estado_contrato == UInt64(
            4
        ), "El contrato no está en el estado correcto"
        current = self.contador_raices
        self.contador_raices = current + 1
        return current

    # --------------

    # Métodos para anuladores
    @abimethod()
    def abrir_registro_anuladores(self) -> None:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede abrir el registro de anuladores"
        assert self.estado_contrato == UInt64(
            5
        ), "El contrato no está en el estado correcto"
        self.estado_contrato = UInt64(6)

    @abimethod()
    def cerrar_registro_anuladores(self) -> UInt64:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede cerrar el registro de anuladores"
        assert self.estado_contrato == UInt64(
            6
        ), "El contrato no está en el estado correcto"
        self.estado_contrato = UInt64(7)
        return self.contador_anuladores

    @abimethod()
    def registrar_anulador(self) -> UInt64:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede registrar anuladores"
        assert self.estado_contrato == UInt64(
            6
        ), "El contrato no está en el estado correcto"
        current = self.contador_anuladores
        self.contador_anuladores = current + 1
        return current
