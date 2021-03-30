export class Socket {
  private connection: WebSocket
  constructor(uri: string) {
    this.connection = new WebSocket(uri)
  }
  get Connection(): WebSocket {
    return this.connection
  }
  listening<T>(callback: (data: T) => void): void {
    this.connection.onmessage = (evt): void => {
      const objData: T = JSON.parse(evt.data)
      callback(objData)
    }
  }
  onOpen(callback: (data: Event) => void): void {
    this.connection.onopen = (evt: Event): void => {
      callback(evt)
    }
  }
  close(): void {
    this.connection.close()
  }
  onClose(callback: (data: CloseEvent) => void): void {
    this.connection.onclose = (evt: CloseEvent): void => {
      callback(evt)
    }
  }
}
