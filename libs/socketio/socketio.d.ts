declare namespace egret.socketio {
    /**
     * class Emitter
     */
    class Emitter {
        protected callbacks: any;
        on<Z>(event: string, fn: Function, listenerContext?: Z): Emitter;
        once<Z>(event: string, fn: Function, listenerContext?: Z): Emitter;
        off(event?: string, fn?: Function, listenerContext?: any): Emitter;
        emit(event: string, ...args: any[]): void;
        $addListener(event: string, fn: Function, listenerContext?: any, dispatchOnce?: boolean): void;
        $removeListener(event?: string, fn?: Function, listenerContext?: any): void;
        $removeEventBin(list: any[], listener?: Function, thisObject?: any): void;
    }
}
declare namespace egret.socketio.engine {
    /**
    * Transport
    */
    abstract class Transport extends Emitter {
        opts: TransportUri;
        protected readyState: _emReadyState;
        writable: boolean;
        name: string;
        pause: Function;
        constructor(opts: TransportUri);
        protected onError(msg: string): Transport;
        open(): Transport;
        close(): Transport;
        send(packets: Packet[]): void;
        protected onOpen(): void;
        protected onData(data: any): void;
        protected onPacket(packet: Packet): void;
        protected onClose(): void;
        protected abstract write(packets: Packet[]): void;
        protected abstract doOpen(): void;
        protected abstract doClose(): void;
    }
}
declare namespace egret.socketio {
    type Primitive = string | number | boolean;
    class Uri {
        private uriParts;
        private queryPairs;
        private hasAuthorityPrefixUserPref;
        /**
         * Creates a new Uri object
         * @constructor
         * @param {string} str
         */
        constructor(str?: string);
        /**
         * if there is no protocol, the leading // can be enabled or disabled
         * @param  {Boolean}  val
         * @return {Boolean}
         */
        hasAuthorityPrefix(val?: boolean): boolean;
        isColonUri(val?: boolean): boolean;
        /**
        * Serializes the internal state of the query pairs
        * @param  {string} [val]   set a new query string
        * @return {string}         query string
        */
        query(val?: string): string;
        /**
         * returns the first query param value found for the key
         * @param  {string} key query key
         * @return {string}     first value found for key
         */
        getQueryParamValue(key: string): string;
        /**
         * returns an array of query param values for the key
         * @param  {string} key query key
         * @return {array}      array of values
         */
        getQueryParamValues(key: string): Primitive[];
        /**
         * removes query parameters
         * @param  {string} key     remove values for key
         * @param  {val}    [val]   remove a specific value, otherwise removes all
         * @return {Uri}            returns self for fluent chaining
         */
        deleteQueryParam(key: string, val?: string): Uri;
        /**
        * adds a query parameter
        * @param  {string}  key        add values for key
        * @param  {string}  val        value to add
        * @param  {integer} [index]    specific index to add the value at
        * @return {Uri}                returns self for fluent chaining
        */
        addQueryParam(key: string, val: Primitive, index?: number): Uri;
        /**
         * test for the existence of a query parameter
         * @param  {string}  key        check values for key
         * @return {Boolean}            true if key exists, otherwise false
         */
        hasQueryParam(key: string): boolean;
        /**
         * replaces query param values
         * @param  {string} key         key to replace value for
         * @param  {string} newVal      new value
         * @param  {string} [oldVal]    replace only one specific value (otherwise replaces all)
         * @return {Uri}                returns self for fluent chaining
         */
        replaceQueryParam(key: string, newVal: Primitive, oldVal?: Primitive): Uri;
        /**
         * Scheme name, colon and doubleslash, as required
         * @return {string} http:// or possibly just //
         */
        scheme(): string;
        /**
         * Same as Mozilla nsIURI.prePath
         * @return {string} scheme://user:password@host:port
         * @see  https://developer.mozilla.org/en/nsIURI
         */
        origin(): string;
        /**
         * Adds a trailing slash to the path
         */
        addTrailingSlash(): Uri;
        /**
         * Serializes the internal state of the Uri object
         * @return {string}
         */
        toString(): string;
        /**
         * Clone a Uri object
         * @return {Uri} duplicate copy of the Uri
         */
        clone(): Uri;
        protocol: string;
        userInfo: string;
        host: string;
        port: number;
        path: string;
        anchor: string;
    }
}
declare namespace egret.socketio.engine {
    abstract class Polling extends Transport {
        static NAME: string;
        private polling;
        private _readByte;
        private _writeByte;
        private _writeMessage;
        private _readMessage;
        constructor(opts: TransportUri);
        protected onData(data: any): void;
        protected _onData(message: string): void;
        protected write(packets: Packet[]): void;
        protected doOpen(): void;
        protected doClose(): void;
        private poll();
        protected uri(): string;
        pause: (onPause: Function) => void;
        protected abstract doPoll(): void;
        protected abstract doWrite(data: string, fn: Function): void;
    }
}
declare namespace egret.socketio {
    /**
        * path (String) name of the path that is captured on the server side (/socket.io)
        * reconnection (Boolean) whether to reconnect automatically (true)
        * reconnectionAttempts (Number) number of reconnection attempts before giving up (Infinity)
        * reconnectionDelay (Number) how long to initially wait before attempting a new reconnection (1000). Affected by +/- randomizationFactor, for example the default initial delay will be between 500 to 1500ms.
        * reconnectionDelayMax (Number) maximum amount of time to wait between
        * reconnections (5000). Each attempt increases the reconnection delay by 2x along with a randomization as above
        * randomizationFactor (Number) (0.5), 0 <= randomizationFactor <= 1
        * timeout (Number) connection timeout before a connect_error and connect_timeout events are emitted (20000)
        * autoConnect (Boolean) by setting this false, you have to call manager.open whenever you decide it's appropriate
        * query (Object): additional query parameters that are sent when connecting a namespace (then found in socket.handshake.query object on the server-side)
        * parser (Parser): the parser to use. Defaults to an instance of the Parser that ships with socket.io. See socket.io-parser.
        */
    interface ManagerOptions {
        path?: string;
        reconnection?: boolean;
        reconnectionAttempts?: number;
        reconnectionDelay?: number;
        reconnectionDelayMax?: number;
        randomizationFactor?: number;
        timeout?: number;
        autoConnect?: boolean;
        parser?: Parser;
        transports?: Array<any>;
    }
    /**
         * Manager
         */
    class Manager extends Emitter {
        readyState: _emReadyState;
        private _reconnection;
        private skipReconnect;
        private reconnecting;
        private _reconnectionAttempts;
        private _reconnectionDelay;
        private _reconnectionDelayMax;
        private _randomizationFactor;
        private _timeout;
        private backoff;
        private uri;
        private opts;
        nsps: {
            [name: string]: Socket;
        };
        private subs;
        private encoding;
        private decoding;
        private encoder;
        private decoder;
        private connecting;
        private packetBuffer;
        autoConnect: boolean;
        private lastPing;
        private engine;
        constructor(uri?: Uri, opts?: ManagerOptions);
        private emitAll(event, ...args);
        private updateSocketIds();
        private generateId(nsp);
        reconnection(v?: boolean): boolean | this;
        reconnectionAttempts(v?: number): number | this;
        reconnectionDelay(v?: number): number | this;
        randomizationFactor(v?: number): number | this;
        reconnectionDelayMax(v?: number): number | this;
        timeout(v?: number): number | this;
        maybeReconnectOnOpen(): void;
        open(fn?: Function, opts?: any): this;
        private onopen();
        private cleanup();
        socket(nsp: string, opts?: ManagerOptions): Socket;
        packet(packet: Packet): void;
        reconnect(): Manager;
        destroy(socket: Socket): void;
        private processPacketQueue();
        private close();
        private disconnect();
        private ondata(data);
        private onping();
        private onpong();
        private onerror(err);
        private onclose(reasion?);
        private ondecoded(packet);
        private onreconnect();
    }
}
declare namespace egret.socketio {
    interface Handle {
        destory(): void;
    }
    function on(obj: Emitter, ev: string, fn: Function, listenerContext?: any): Handle;
}
declare namespace egret.socketio {
    enum _emParser {
        CONNECT = 0,
        DISCONNECT = 1,
        EVENT = 2,
        ACK = 3,
        ERROR = 4,
        BINARY_EVENT = 5,
        BINARY_ACK = 6,
    }
    namespace parser {
        interface Encoder extends Emitter {
            encode(obj: Packet, callback: Function): void;
        }
        let Encoder: {
            new (): Encoder;
        };
        interface Decoder extends Emitter {
            add(obj: string): void;
            destory(): void;
            onDecoded(callback: Function): void;
        }
        let Decoder: {
            new (): Decoder;
        };
    }
    interface Parser {
        Encoder: parser.Encoder;
        Decoder: parser.Decoder;
    }
}
declare namespace egret.socketio {
    class Socket extends Emitter {
        id: string;
        private connected;
        private disconnected;
        private ids;
        private nsp;
        private io;
        private uri;
        private flags;
        private subs;
        private receiveBuffer;
        private sendBuffer;
        private acks;
        constructor(io: Manager, nsp: string, opts?: Uri);
        private subEvents();
        open(): Socket;
        send(...args: any[]): Socket;
        emit(event: string, ...args: any[]): Socket;
        connnect(): Socket;
        close(): Socket;
        private disconnect();
        private packet(packet);
        private ack(id);
        private destroy();
        private emitBuffered();
        private onopen();
        private onpacket(packet);
        private onconnect();
        private onevent(packet);
        private onack(packet);
        private ondisconnect();
        private onclose(reason?);
    }
}
declare namespace egret.socketio {
    class Backoff {
        ms: number;
        max: number;
        factor: number;
        jitter: number;
        attempts: number;
        constructor(opts?: any);
        setMin(v: number): Backoff;
        setMax(v: number): Backoff;
        setJitter(v: number): Backoff;
        setFactor(v: number): Backoff;
        reset(): void;
        duration(): number;
    }
}
declare namespace egret.socketio {
    class BinaryReconstructor {
        private reconPack;
        private buffers;
        constructor(packet: Packet);
        takeBinaryData(binData: any): Packet;
        private finishedReconstruction();
    }
}
declare namespace egret.socketio {
    /**
     * IO
     */
    interface Option extends ManagerOptions {
        forceNew?: boolean;
        multiplex?: boolean;
    }
    interface SocketIOClientStatic {
        (uri?: Uri | string, opts?: Option): Socket;
        connect(uri?: Uri | string, opts?: Option): Socket;
    }
    let SocketIOClientStatic: SocketIOClientStatic;
    let io: SocketIOClientStatic;
}
declare namespace SocketIOClient {
    type Socket = egret.socketio.Socket;
    type Manager = egret.socketio.Manager;
    type Emitter = egret.socketio.Emitter;
}
declare namespace egret.socketio {
    class Url {
        static PATTERN_HTTP: RegExp;
        static PATTERN_HTTPS: RegExp;
        private source;
        private uri;
        protocol: string;
        path: any;
        host: any;
        port: any;
        constructor(uri: Uri | string);
        toString(): string;
        static parse(uri: Uri | string): Url;
        static extractId(uri: Uri | string): string;
        static secure(uri: Uri | string): boolean;
    }
}
declare namespace egret.socketio.engine {
    enum _emPacketType {
        open = 0,
        close = 1,
        ping = 2,
        pong = 3,
        message = 4,
        upgrade = 5,
        noop = 6,
        error = 7,
    }
    class TransportUri extends Uri {
        timestampRequests?: boolean;
        timestampParam?: string;
        hostname?: string;
        socket?: Socket;
        secure?: boolean;
        policyPort?: number;
        constructor(str?: string);
        readonly ipv6: boolean;
        clone(): TransportUri;
    }
    class SocketUri extends TransportUri {
        transports?: Array<any>;
        upgrade?: boolean;
        rememberUpgrade?: boolean;
        transportOptions?: {
            [name: string]: TransportUri;
        };
        constructor(str?: string);
        clone(): SocketUri;
    }
    interface Packet {
        type: string;
        data?: any;
        options?: any;
    }
}
declare namespace egret.socketio.engine {
    class Parser {
        static decodePacket(data: string, utf8decode: boolean): Packet;
        static decodePayload(data: string, fn: Function): void;
        static encodePacket(packet: Packet, utf8decode: boolean, fn: Function): void;
        static encodePayload(packets: Packet[], fn: Function): any;
        private static setLengthHeader(message);
    }
}
declare namespace egret.socketio {
    enum _emReadyState {
        OPENING = 0,
        OPEN = 1,
        CLOSING = 2,
        CLOSED = 3,
        PAUSING = 4,
        PAUSED = 5,
    }
    enum _emEvent {
        EVENT_OPEN = "open",
        EVENT_CLOSE = "close",
        EVENT_PACKET = "packet",
        EVENT_MESSAGE = "message",
        EVENT_ERROR = "error",
        EVENT_UPGRADE_ERROR = "upgradeError",
        EVENT_FLUSH = "flush",
        EVENT_DRAIN = "drain",
        EVENT_HANDSHAKE = "handshake",
        EVENT_UPGRADING = "upgrading",
        EVENT_UPGRADE = "upgrade",
        EVENT_PACKET_CREATE = "packetCreate",
        EVENT_HEARTBEAT = "heartbeat",
        EVENT_DATA = "data",
        EVENT_CONNECT = "connect",
        EVENT_CONNECTING = "connecting",
        EVENT_CONNECT_ERROR = "connect_error",
        EVENT_CONNECT_TIMEOUT = "connect_timeout",
        EVENT_DISCONNECT = "disconnect",
        EVENT_RECONNECT = "reconnect",
        EVENT_RECONNECT_ERROR = "reconnect_error",
        EVENT_RECONNECT_FAILED = "reconnect_failed",
        EVENT_RECONNECT_ATTEMPT = "reconnect_attempt",
        EVENT_RECONNECTING = "reconnecting",
        EVENT_PING = "ping",
        EVENT_PONG = "pong",
        EVENT_TRANSPORT = "transport",
        EVENT_REQUEST_HEADERS = "requestHeaders",
        EVENT_RESPONSE_HEADERS = "responseHeaders",
        EVENT_POLL = "poll",
        EVENT_POLL_COMPLETE = "pollComplete",
        EVENT_DECODED = "decoded",
    }
    interface Packet {
        type: number;
        id?: number;
        data?: any;
        nsp?: string;
        query?: string;
        attachments?: number;
        options?: any;
    }
    function toArray(list: Array<any>, index?: number): Array<any>;
    function isArray(arr: any): boolean;
}
interface Error {
    data?: any;
    code?: any;
    transport?: any;
}
declare namespace egret.socketio.engine {
    interface RequestOption {
        method?: string;
        data?: string;
    }
    class PollingXHR extends Polling {
        protected request(opts?: RequestOption): HttpRequest;
        protected doPoll(): void;
        protected doWrite(data: string, fn: Function): void;
    }
}
declare namespace egret.socketio.engine {
    class Socket extends Emitter {
        private transport;
        static priorWebsocketSuccess: boolean;
        private opts;
        private readyState;
        id: string;
        private upgrades;
        private upgrading;
        private pingInterval;
        private pingTimeout;
        private pingIntervalTimer;
        private pingTimeoutTimer;
        private writeBuffer;
        private prevBufferLen;
        constructor(uri?: string | SocketUri);
        open(): Socket;
        flush(): void;
        probe(name: string): void;
        private ping();
        private createTransport(name, probe?);
        private setTransport(transport);
        private onDrain();
        private onPacket(packet);
        private onError(err);
        private onOpen();
        private onClose(reason?, desc?);
        close(): Socket;
        private onHandshake(data);
        private setPing();
        private onHeartbeat(timeout);
        write(msg: string, options?: Object, fn?: Function): Socket;
        send(msg: string, options?: Object, fn?: Function): Socket;
        private sendPacket(type, data);
        private sendPacket(type, fn);
        private sendPacket(type, data, options);
        private sendPacket(type, data, fn);
        private sendPacket(type, data, options, fn);
        private filterUpgrades(upgrades);
    }
}
declare namespace egret.socketio.engine {
    class WebSocket extends Transport {
        static NAME: string;
        private ws;
        constructor(opts: TransportUri);
        private addEventListeners();
        protected write(packets: Packet[]): void;
        protected onWsOpen(evt: egret.Event): void;
        protected onWsData(evt: egret.ProgressEvent): void;
        protected onWsError(evt: IOErrorEvent): void;
        protected onWsClose(): void;
        protected doOpen(): void;
        protected doClose(): void;
        protected uri(): string;
    }
}
declare namespace egret.socketio.engine.Yeast {
    function yeast(): string;
}
