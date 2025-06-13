import logging

import algokit_utils

logger = logging.getLogger(__name__)


# define deployment behavior based on supplied app spec
def deploy() -> None:
    from smart_contracts.artifacts.voto3.voto3_client import (
        Voto3Factory,
    )

    algorand = algokit_utils.AlgorandClient.from_environment()
    deployer_ = algorand.account.from_environment("DEPLOYER")

    factory = algorand.client.get_typed_app_factory(
        Voto3Factory, default_sender=deployer_.address
    )

    app_client, result = factory.deploy(
        on_update=algokit_utils.OnUpdate.AppendApp,
        on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
    )

    if result.operation_performed in [
        algokit_utils.OperationPerformed.Create,
        algokit_utils.OperationPerformed.Replace,
    ]:
        algorand.send.payment(
            algokit_utils.PaymentParams(
                amount=algokit_utils.AlgoAmount(algo=1),
                sender=deployer_.address,
                receiver=app_client.app_address,
            )
        )

    # Example usage of the new methods
    app_client.send.abrir_registro_compromisos()
    app_client.send.registrar_compromiso()
    app_client.send.cerrar_registro_compromisos()

    logger.info(
        f"Deployed voto3 app with id: {app_client.app_id}"
    )
