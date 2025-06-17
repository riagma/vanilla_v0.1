# smart_contracts/voto3/contract.py
from algopy import ARC4Contract, UInt64, Asset, Global, Txn, itxn
from algopy.arc4 import abimethod


# class Voto3(ARC4Contract):
#     def __init__(self) -> None:
#         self.compromisos_registrados = UInt64(0)
#         self.asset_id = Asset(0)

#     @abimethod(allow_actions=["NoOp"])
#     def inicializar_eleccion(self) -> None:
#         assert (
#             Txn.sender == Global.creator_address
#         ), "Solo el creador puede inicializar la elección"
#         asset_txn = itxn.AssetConfig(
#             asset_name=b"PAPELETA",
#             unit_name=b"V3P",
#             total=UInt64(100000000),
#             decimals=0,
#             manager=Global.current_application_address,
#             clawback=Global.current_application_address,
#         ).submit()
#         self.asset_id = asset_txn.created_asset

#     @abimethod(allow_actions=["NoOp"])
#     def registrar_compromiso(self) -> None:
#         assert (
#             Txn.sender == Global.creator_address
#         ), "Solo el creador puede registrar compromisos"
#         self.compromisos_registrados += UInt64(1)


# # pyright: reportMissingModuleSource=false
# from algopy import ARC4Contract, String, UInt64, Global, Txn, itxn, subroutine
# from algopy.arc4 import abimethod


class Voto3(ARC4Contract):
    # Contadores
    contador_compromisos: UInt64
    contador_raices: UInt64
    contador_anuladores: UInt64

    # Estados de registro
    registro_compromisos_abierto: bool
    registro_compromisos_cerrado: bool
    registro_raices_abierto: bool
    registro_raices_cerrado: bool
    registro_anuladores_abierto: bool
    registro_anuladores_cerrado: bool

    def __init__(self) -> None:
        super().__init__()
        # Inicializar contadores
        self.contador_compromisos = UInt64(0)
        self.contador_raices = UInt64(0)
        self.contador_anuladores = UInt64(0)

        # Inicializar estados de registro
        self.registro_compromisos_abierto = False
        self.registro_compromisos_cerrado = False
        self.registro_raices_abierto = False
        self.registro_raices_cerrado = False
        self.registro_anuladores_abierto = False
        self.registro_anuladores_cerrado = False

    # Métodos para compromisos
    @abimethod()
    def abrir_registro_compromisos(self) -> None:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede abrir el registro de compromisos"
        assert (
            not self.registro_compromisos_cerrado
        ), "El registro de compromisos ya fue cerrado"
        self.registro_compromisos_abierto = True

    @abimethod()
    def cerrar_registro_compromisos(self) -> UInt64:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede cerrar el registro de compromisos"
        assert (
            self.registro_compromisos_abierto
        ), "El registro de compromisos no está abierto"
        assert (
            not self.registro_compromisos_cerrado
        ), "El registro de compromisos ya fue cerrado"
        self.registro_compromisos_cerrado = True
        return self.contador_compromisos

    @abimethod()
    def registrar_compromiso(self) -> UInt64:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede registrar compromisos"
        assert (
            self.registro_compromisos_abierto
        ), "El registro de compromisos no está abierto"
        assert (
            not self.registro_compromisos_cerrado
        ), "El registro de compromisos ya fue cerrado"
        current = self.contador_compromisos
        self.contador_compromisos = current + 1
        return current

    # Métodos para raíces
    @abimethod()
    def abrir_registro_raices(self) -> None:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede abrir el registro de raíces"
        assert (
            self.registro_compromisos_cerrado
        ), "El registro de compromisos no está cerrado"
        assert not self.registro_raices_cerrado, "El registro de raíces ya fue cerrado"
        self.registro_raices_abierto = True

    @abimethod()
    def cerrar_registro_raices(self) -> UInt64:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede cerrar el registro de raíces"
        assert self.registro_raices_abierto, "El registro de raíces no está cerrado"
        assert not self.registro_raices_cerrado, "El registro de raíces ya fue cerrado"
        self.registro_raices_cerrado = True
        return self.contador_raices

    @abimethod()
    def registrar_raiz(self) -> UInt64:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede registrar raíces"
        assert self.registro_raices_abierto, "El registro de raíces no está abierto"
        assert not self.registro_raices_cerrado, "El registro de raíces ya fue cerrado"
        current = self.contador_raices
        self.contador_raices = current + 1
        return current

    # Métodos para anuladores
    @abimethod()
    def abrir_registro_anuladores(self) -> None:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede abrir el registro de anuladores"
        assert self.registro_raices_cerrado, "El registro de raíces no está cerrado"
        assert (
            not self.registro_anuladores_cerrado
        ), "El registro de anuladores ya fue cerrado"
        self.registro_anuladores_abierto = True

    @abimethod()
    def cerrar_registro_anuladores(self) -> UInt64:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede cerrar el registro de anuladores"
        assert self.registro_anuladores_abierto, "El registro de raíces no está cerrado"
        assert (
            not self.registro_anuladores_cerrado
        ), "El registro de raíces ya fue cerrado"
        self.registro_anuladores_cerrado = True
        return self.contador_anuladores

    @abimethod()
    def registrar_anulador(self) -> UInt64:
        assert (
            Txn.sender == Global.creator_address
        ), "Solo el creador puede registrar anuladores"
        assert (
            self.registro_anuladores_abierto
        ), "El registro de anuladores no está abierto"
        assert (
            not self.registro_anuladores_cerrado
        ), "El registro de anuladores ya fue cerrado"
        current = self.contador_anuladores
        self.contador_anuladores = current + 1
        return current
