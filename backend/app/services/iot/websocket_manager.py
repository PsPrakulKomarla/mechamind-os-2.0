from fastapi import WebSocket
from typing import Dict, List
import json
import asyncio

class WebSocketManager:
    """
    Manages active WebSocket connections per factory for live dashboard broadcasts.
    """
    def __init__(self):
        # factory_id -> list of active connections
        self.active_connections: Dict[str, List[WebSocket]] = {}
        
    async def connect(self, websocket: WebSocket, factory_id: str):
        await websocket.accept()
        if factory_id not in self.active_connections:
            self.active_connections[factory_id] = []
        self.active_connections[factory_id].append(websocket)
        
    def disconnect(self, websocket: WebSocket, factory_id: str):
        if factory_id in self.active_connections:
            self.active_connections[factory_id].remove(websocket)
            
    async def broadcast_telemetry(self, factory_id: str, message: dict):
        if factory_id in self.active_connections:
            for connection in self.active_connections[factory_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    # Handle dead connections
                    pass

websocket_manager = WebSocketManager()
