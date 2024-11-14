import asyncio
import websockets
import json
import os

# Store connected clients
clients = set()

async def handle_client(websocket, path):  # `path` is kept to match your function signature
    # Register new client
    clients.add(websocket)
    try:
        # Receive username (client sends their name when connected)
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
    # Send the message to all connected clients
    for client in clients:
        await client.send(message)

async def main():
    # Use the port from the environment variable for Render
    port = int(os.getenv("PORT", 1060))  # Default to 1060 if PORT is not set
    server = await websockets.serve(handle_client, "0.0.0.0", port)
    print(f"WebSocket Server is running on ws://0.0.0.0:{port}")
    await server.wait_closed()

# Start the server
asyncio.run(main())
