const { spawn } = require('child_process')

const child = spawn(electron, process.argv.slice(2), { stdio: 'inherit', windowsHide: false })

child.on('close', (code, signal) => {
  if (code === null) {
    console.error(electron, 'exited with signal', signal)
    process.exit(1)
  }
  process.exit(code)
})

const handleTerminationSignal = (signal) => {
  process.on(signal, () => {
    if (!child.killed) {
      child.kill(signal)
    }
  })
}

handleTerminationSignal('SIGINT')
handleTerminationSignal('SIGTERM')
