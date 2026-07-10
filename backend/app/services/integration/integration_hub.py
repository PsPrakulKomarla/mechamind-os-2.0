from typing import Dict, Any
from app.services.integration.connector_interface import IConnector
from app.services.integration.plugins.erp_sap import SapS4HanaPlugin
from app.services.integration.plugins.protocol_opcua import OpcUaPlugin

class IntegrationHub:
    """
    Central registry for all Integration Plugins.
    Routes generic requests to specific plugin implementations dynamically.
    """
    def __init__(self):
        self._plugins: Dict[str, IConnector] = {
            "sap_s4hana": SapS4HanaPlugin(),
            "opcua_client": OpcUaPlugin(),
            # "ibm_maximo": MaximoPlugin(),
            # "modbus_tcp": ModbusPlugin(),
        }

    def get_plugin(self, plugin_id: str) -> IConnector:
        plugin = self._plugins.get(plugin_id)
        if not plugin:
            raise ValueError(f"Plugin '{plugin_id}' is not installed or supported.")
        return plugin

integration_hub = IntegrationHub()
