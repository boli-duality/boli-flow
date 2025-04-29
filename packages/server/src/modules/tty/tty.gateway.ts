import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { IPty, spawn } from 'node-pty'
import { Server, Socket } from 'socket.io'
import { homedir } from 'node:os'
import which from 'which'
import { basename } from 'node:path'

function getShell() {
  const presets = ['pwsh', 'powershell', 'cmd']
  let shell = ''
  for (shell of presets) {
    try {
      shell = which.sync(shell)
      if (shell) break
    } catch {
      continue
    }
  }
  return basename(shell)
}

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
  shell: string

  constructor() {
    this.shell = getShell()
  }

  handleConnection(client: Socket) {
    if (this.terms.has(client.id)) return
    if (!this.shell) return
    const term = spawn(this.shell, [], {
      name: 'xterm-color',
      cwd: homedir(),
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
