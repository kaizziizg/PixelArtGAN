import asyncio
import json
import websockets



connected = {}
players = {}

class Player:
    def __init__(self, name):
        self.name = name  
        self.PosX = 240 - (24*2)/2
        self.PosY = 320 - (24*2)-30
    def setPos(self,PosX,PosY):
        self.PosX = PosX
        self.PosY = PosY

async def play(websocket,name):
    async for message in websocket:
        event = json.loads(message)
        posX = event["posX"]
        posY = event["posY"]
        players[name].setPos(posX,posY)
        print(players[name].name," posX :",posX,"posY",posY)
        event = {
            "type": "move",
            "player": name,
            "posX": posX,
            "posY": posY,
        }
        websockets.broadcast(connected, json.dumps(event))

async def join(websocket,name):
    global connected

    if(not connected):
        connected = {websocket}
    else:
        connected.add(websocket)
    msg = {"type": "msg","msg":name+" join!! current online : " + str(len(connected))}
    websockets.broadcast(connected, json.dumps(msg))
    for key in players:
        msg = {"type": "init","name":players[key].name}
        await websocket.send(json.dumps(msg))
    p = Player(name)
    players[name] = p
    try:
        await play(websocket,name)
    finally:
        print("someone disconnect")
        connected.remove(websocket)
        try:
            del players[name]
        except KeyError:
            pass


async def handler(websocket):
    message = await websocket.recv()
    event = json.loads(message)
    print(event)
    # {"join":"name"}
    if "join" in event:
        await join(websocket,event["join"])


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())