import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { IPty, spawn } from 'node-pty'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*', // 允许所有客户端连接
  },
  transports: ['websocket'],
})
export class TtyGateway {
  @WebSocketServer()
  server: Server
  terms = new Map<string, IPty>()

  handleConnection(client: Socket) {
    if (this.terms.has(client.id)) return
    const term = spawn('pwsh.exe', [], {
      name: 'xterm-color',
      cwd: process.env.HOME,
      env: process.env,
    })
    term.onData(data => {
      client.emit('output', data)
      // process.stdout.write(data);
    })

    // term.onExit(e => {
    //   console.log('退出终端', client.id, term.pid, e)
    // })
    // console.log('连接了', client.id, term.pid)
    this.terms.set(client.id, term)
  }

  handleDisconnect(client: Socket) {
    const term = this.terms.get(client.id)
    if (!term) return

    try {
      process.kill(term.pid)
      this.terms.delete(client.id)
    } catch (error) {
      console.log(`kill ${term.pid} error: `, error)
    }
  }

  @SubscribeMessage('input')
  input(@ConnectedSocket() client: Socket, @MessageBody() body: string) {
    const term = this.terms.get(client.id)
    if (!term) return
    term.write(body)
  }

  @SubscribeMessage('resize')
  resize(@ConnectedSocket() client: Socket, @MessageBody() body: { cols: number; rows: number }) {
    const term = this.terms.get(client.id)
    if (!term) return
    term.resize(body.cols, body.rows)
  }
}
