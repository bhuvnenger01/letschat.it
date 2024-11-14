import asyncio
import websockets
import os

# Store connected clients
clients = set()

async def handle_client(websocket, path):
    # Register new client
    clients.add(websocket)
    try:
        username = await websocket.recv()
        print(f"{username} connected")

        # Notify all clients about new connection
        message = f"{username} has joined the chat."
        await broadcast(message)

        # Handle incoming messages from the client
        while True:
            message = await websocket.recv()
            print(f"{username}: {message}")
            await broadcast(message)

    except websockets.exceptions.ConnectionClosed as e:
        print(f"Connection closed: {e}")
    finally:
        # Remove client from the set on disconnection
        clients.remove(websocket)
        print(f"{username} disconnected")
        await broadcast(f"{username} has left the chat.")

async def broadcast(message):
    for client in clients:
        await client.send(message)

async def main():
    port = int(os.getenv("PORT", 1060))  # Render assigns the PORT environment variable
    server = await websockets.serve(handle_client, "0.0.0.0", port)
    print(f"WebSocket Server is running on ws://0.0.0.0:{port}")
    await server.wait_closed()

asyncio.run(main())
