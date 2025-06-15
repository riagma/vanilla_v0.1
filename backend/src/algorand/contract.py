# smart_contracts/voto3/contract.py
from algopy import ARC4Contract, UInt64, Account, Global, Txn, itxn
from algopy.arc4 import abimethod          # alias corto

class Voto3(ARC4Contract):
    def __init__(self) -> None:
        # --- Estado global --------------------------------------------------
        self.compromisos_registrados = UInt64(0)
        self.votos_registrados       = UInt64(0)
        self.asset_id                = UInt64(0)

    # -----------------------------------------------------------------------
    # CREATE: ejecuta __init__ y luego este método
    #   - create="require"  → exige selector
    #   - create="allow"    → selector opcional (accepts empty AppArgs)
    # -----------------------------------------------------------------------
    @abimethod(create="allow")
    def create(self) -> None:

        # asset_txn = itxn.AssetConfig(

        #     sender=Global.creator_address,
        #     asset_name=b"PAPELETA",
        #     unit_name=b"BAL",
        #     total=1000000000,
        #     decimals=0,
        #     fee=0,
        #     manager=Global.creator_address,
        #     clawback=Global.creator_address,

        # ).submit()

        # self.asset_id = asset_txn.created_asset.id   # guarda el ID del ASA
 
    # -----------------------------------------------------------------------
    # Distribuir 1 papeleta a un votante  (solo creador)
    # -----------------------------------------------------------------------
    @abimethod(allow_actions=["NoOp"])
    def distribuir_papeleta(self, votante: Account) -> None:
        assert Txn.sender == Global.creator_address

        asset_txn = itxn.AssetTransfer(

            xfer_asset=self.asset_id,
            asset_amount=UInt64(1),
            asset_receiver=votante,
            fee=UInt64(0),
 
        ).submit()

    @abimethod(allow_actions=["NoOp"])
    def registrar_compromiso(self) -> None:
        assert Txn.sender == Global.creator_address, "Solo el creador puede registrar compromisos"
        self.compromisos_registrados += UInt64(1)
