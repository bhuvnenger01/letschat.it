import asyncio
import websockets
import json

# Store connected clients
clients = set()

async def handle_client(websocket):  # Add `path` as a parameter
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
    server = await websockets.serve(handle_client, "127.0.0.1", 1060)
    print("WebSocket Server is running on ws://127.0.0.1:1060")
    await server.wait_closed()

# Start the server
asyncio.run(main())

 
 