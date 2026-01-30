// 全局测试设置文件
// 用于配置全局变量和模拟

// 模拟requestAnimationFrame以提高测试性能
if (!globalThis.requestAnimationFrame) {
  globalThis.requestAnimationFrame = jest.fn().mockImplementation(cb => {
    return setTimeout(cb, 0);
  });
}

// 模拟cancelAnimationFrame
if (!globalThis.cancelAnimationFrame) {
  globalThis.cancelAnimationFrame = jest.fn().mockImplementation(id => {
    clearTimeout(id);
  });
}

// 模拟IntersectionObserver
if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
}

// 模拟ResizeObserver
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
}

// 模拟MutationObserver
if (!globalThis.MutationObserver) {
  globalThis.MutationObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }));
}

// 模拟localStorage
if (!globalThis.localStorage) {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
    removeItem: jest.fn(),
    length: 0,
    key: jest.fn(),
  };
  globalThis.localStorage = localStorageMock as unknown as Storage;
}

// 模拟sessionStorage
if (!globalThis.sessionStorage) {
  const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
    removeItem: jest.fn(),
    length: 0,
    key: jest.fn(),
  };
  globalThis.sessionStorage = sessionStorageMock as unknown as Storage;
}

// 模拟matchMedia
if (!window.matchMedia) {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

// 模拟Performance API
if (!globalThis.performance) {
  globalThis.performance = {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntries: jest.fn(() => []),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn(),
    clearResourceTimings: jest.fn(),
    setResourceTimingBufferSize: jest.fn(),
    onresourcetimingbufferfull: null as unknown as ((event: Event) => void) | null,
    timeOrigin: Date.now(),
    toJSON: jest.fn(),
    eventCounts: {
      get: jest.fn(() => 0),
      entries: jest.fn(() => []),
    },
    navigation: {
      type: 0,
      redirectCount: 0,
      toJSON: jest.fn(),
    },
    timing: {
      navigationStart: 0,
      unloadEventStart: 0,
      unloadEventEnd: 0,
      redirectStart: 0,
      redirectEnd: 0,
      fetchStart: 0,
      domainLookupStart: 0,
      domainLookupEnd: 0,
      connectStart: 0,
      connectEnd: 0,
      secureConnectionStart: 0,
      requestStart: 0,
      responseStart: 0,
      responseEnd: 0,
      domLoading: 0,
      domInteractive: 0,
      domContentLoadedEventStart: 0,
      domContentLoadedEventEnd: 0,
      domComplete: 0,
      loadEventStart: 0,
      loadEventEnd: 0,
      toJSON: jest.fn(),
    },
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  } as unknown as Performance;
}

// 模拟Navigator API
if (!globalThis.navigator) {
  globalThis.navigator = {
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    language: "zh-CN",
    languages: ["zh-CN", "zh", "en-US", "en"],
    platform: "Win32",
    onLine: true,
    geolocation: {
      getCurrentPosition: jest.fn(success => {
        success({
          coords: {
            latitude: 39.9042,
            longitude: 116.4074,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
            toJSON: jest.fn(() => ({})),
          },
          timestamp: Date.now(),
          toJSON: jest.fn(() => ({})),
        });
      }),
      watchPosition: jest.fn(),
      clearWatch: jest.fn(),
    },
    clipboard: {
      writeText: jest.fn(() => Promise.resolve()),
      readText: jest.fn(() => Promise.resolve("")),
      read: jest.fn(() => Promise.resolve([])),
      write: jest.fn(() => Promise.resolve()),
      addEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      removeEventListener: jest.fn(),
    },
    share: jest.fn(() => Promise.resolve()),
    credentials: {},
    doNotTrack: null,
    login: jest.fn(),
    logout: jest.fn(),
    maxTouchPoints: 0,
    mediaCapabilities: {},
    mediaDevices: {},
    permissions: {},
    presentation: {},
    serviceWorker: {},
    storage: {},
    usb: {},
    xr: {},
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  } as unknown as Navigator;
}

// 模拟Window API
if (!globalThis.scrollTo) {
  globalThis.scrollTo = jest.fn();
}

if (!globalThis.scrollBy) {
  globalThis.scrollBy = jest.fn();
}

if (!globalThis.open) {
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.open = jest.fn(() => ({
    close: jest.fn(),
    focus: jest.fn(),
    blur: jest.fn(),
    postMessage: jest.fn(),
  }));
}

if (!globalThis.alert) {
  globalThis.alert = jest.fn();
}

if (!globalThis.confirm) {
  globalThis.confirm = jest.fn(() => true);
}

if (!globalThis.prompt) {
  globalThis.prompt = jest.fn(() => "");
}

if (!globalThis.fetch) {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(""),
      blob: () => Promise.resolve(new Blob()),
      headers: new Headers(),
      status: 200,
      statusText: "OK",
      redirected: false,
      type: "basic",
      url: "",
      clone: jest.fn(),
      formData: jest.fn(),
      arrayBuffer: jest.fn(),
      body: null,
      bodyUsed: false,
      bytes: jest.fn(() => Promise.resolve(new Uint8Array(0))),
      getReader: jest.fn(),
      readable: false,
      stream: jest.fn(),
      [Symbol.asyncIterator]: jest.fn(),
    } as Response)
  );
}

// 模拟Document API
if (!document.createRange) {
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  document.createRange = jest.fn(() => ({
    setStart: jest.fn(),
    setEnd: jest.fn(),
    commonAncestorContainer: {
      nodeName: "BODY",
      ownerDocument: document,
    },
    getBoundingClientRect: jest.fn(() => ({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
    })),
    cloneContents: jest.fn(() => document.createElement("div")),
    cloneRange: jest.fn(),
    collapse: jest.fn(),
    compareBoundaryPoints: jest.fn(),
    comparePoint: jest.fn(),
  }));
}

if (!document.execCommand) {
  document.execCommand = jest.fn(() => true);
}

if (!document.createEvent) {
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  document.createEvent = jest.fn(() => ({
    initEvent: jest.fn(),
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    bubbles: false,
    cancelable: false,
    animationName: "",
    elapsedTime: 0,
    pseudoElement: "",
  }));
}

// 模拟URL API
if (!globalThis.URL) {
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.URL = jest.fn(url => ({
    href: url,
    protocol: "http:",
    host: "localhost",
    hostname: "localhost",
    port: "3000",
    pathname: "/",
    search: "",
    hash: "",
    origin: "http://localhost:3000",
    toString: jest.fn(() => url),
  }));
}

if (typeof window !== "undefined") {
  window.__BASE_URL__ = "/";
}

if (!globalThis.URLSearchParams) {
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.URLSearchParams = jest.fn(() => ({
    append: jest.fn(),
    delete: jest.fn(),
    entries: jest.fn(() => []),
    forEach: jest.fn(),
    get: jest.fn(() => null),
    getAll: jest.fn(() => []),
    has: jest.fn(() => false),
    keys: jest.fn(() => []),
    set: jest.fn(),
    sort: jest.fn(),
    toString: jest.fn(() => ""),
    values: jest.fn(() => []),
    size: 0,
    [Symbol.iterator]: jest.fn(function* () {
      yield* [];
    }),
  }));
}

// 模拟WebSocket API
if (!globalThis.WebSocket) {
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.WebSocket = jest.fn(() => ({
    readyState: 1,
    url: "ws://localhost:8080",
    send: jest.fn(),
    close: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.WebSocket.CONNECTING = 0;
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.WebSocket.OPEN = 1;
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.WebSocket.CLOSING = 2;
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.WebSocket.CLOSED = 3;
}

// 模拟File API
if (!globalThis.File) {
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.File = jest.fn(() => ({
    name: "test.txt",
    size: 1024,
    type: "text/plain",
    lastModified: Date.now(),
    lastModifiedDate: new Date(),
    webkitRelativePath: "",
    arrayBuffer: jest.fn(() => Promise.resolve(new ArrayBuffer(0))),
    bytes: jest.fn(() => Promise.resolve(new Uint8Array(0))),
    slice: jest.fn(() => new Blob()),
    stream: jest.fn(() => ({
      getReader: () => ({ read: jest.fn(() => Promise.resolve({ done: true, value: null })) }),
    })),
    text: jest.fn(() => Promise.resolve("")),
  }));
}

if (!globalThis.Blob) {
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.Blob = jest.fn(() => ({
    size: 1024,
    type: "text/plain",
    slice: jest.fn(() => new Blob()),
    arrayBuffer: jest.fn(() => Promise.resolve(new ArrayBuffer(0))),
    bytes: jest.fn(() => Promise.resolve(new Uint8Array(0))),
    stream: jest.fn(() => ({
      getReader: () => ({ read: jest.fn(() => Promise.resolve({ done: true, value: null })) }),
    })),
    text: jest.fn(() => Promise.resolve("")),
  }));
}

if (!globalThis.FileReader) {
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.FileReader = jest.fn(function () {
    const reader = {
      readyState: 0,
      result: null,
      error: null,
      onloadstart: null,
      onprogress: null,
      onload: null,
      onabort: null,
      onerror: null,
      onloadend: null,
      readAsArrayBuffer: jest.fn(),
      readAsBinaryString: jest.fn(),
      readAsDataURL: jest.fn(() => {
        setTimeout(() => {
          reader.result = "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==";
          if (reader.onload) {
            const event = {
              type: "load",
              target: reader,
              lengthComputable: false,
              loaded: 0,
              total: 0,
              bubbles: false,
              cancelable: false,
              composed: false,
              currentTarget: reader,
              defaultPrevented: false,
              eventPhase: 0,
              isTrusted: false,
              path: [],
              returnValue: true,
              srcElement: reader,
              timeStamp: 0,
              cancelBubble: false,
              composedPath: jest.fn(() => []),
              preventDefault: jest.fn(),
              stopImmediatePropagation: jest.fn(),
              stopPropagation: jest.fn(),
            } as unknown as ProgressEvent<FileReader>;
            reader.onload(event);
          }
        }, 0);
      }),
      readAsText: jest.fn(() => {
        setTimeout(() => {
          reader.result = "Hello, World!";
          if (reader.onload) {
            const event = {
              type: "load",
              target: reader,
              lengthComputable: false,
              loaded: 0,
              total: 0,
              bubbles: false,
              cancelable: false,
              composed: false,
              currentTarget: reader,
              defaultPrevented: false,
              eventPhase: 0,
              isTrusted: false,
              path: [],
              returnValue: true,
              srcElement: reader,
              timeStamp: 0,
              cancelBubble: false,
              composedPath: jest.fn(() => []),
              preventDefault: jest.fn(),
              stopImmediatePropagation: jest.fn(),
              stopPropagation: jest.fn(),
            } as unknown as ProgressEvent<FileReader>;
            reader.onload(event);
          }
        }, 0);
      }),
      abort: jest.fn(),
    };
    return reader;
  });

  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.FileReader.EMPTY = 0;
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.FileReader.LOADING = 1;
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.FileReader.DONE = 2;
}

// 模拟Canvas API
if (!globalThis.HTMLCanvasElement) {
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.HTMLCanvasElement = class {
    height = 0;
    width = 0;
    captureStream = jest.fn();
    getContext = jest.fn();
  };
}

if (!HTMLCanvasElement.prototype.getContext) {
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    canvas: {},
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    drawImage: jest.fn(),
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(() => ({
      data: new Uint8ClampedArray(0),
    })),
    putImageData: jest.fn(),
    createImageData: jest.fn(() => ({
      data: new Uint8ClampedArray(0),
    })),
    setTransform: jest.fn(),
    resetTransform: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    strokeRect: jest.fn(),
    fillText: jest.fn(),
    strokeText: jest.fn(),
    measureText: jest.fn(() => ({
      width: 0,
    })),
    arc: jest.fn(),
    arcTo: jest.fn(),
    quadraticCurveTo: jest.fn(),
    bezierCurveTo: jest.fn(),
    isPointInPath: jest.fn(() => false),
    isPointInStroke: jest.fn(() => false),
  }));
}

// 模拟Audio/Video API
if (!globalThis.HTMLAudioElement) {
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.HTMLAudioElement = class {
    addEventListener = jest.fn();
    removeEventListener = jest.fn();
    accessKey = "";
    accessKeyLabel = "";
  };
}

if (!HTMLAudioElement.prototype.play) {
  HTMLAudioElement.prototype.play = jest.fn(() => Promise.resolve());
}

if (!HTMLAudioElement.prototype.pause) {
  HTMLAudioElement.prototype.pause = jest.fn();
}

if (!globalThis.HTMLVideoElement) {
  // @ts-expect-error - 忽略类型错误，因为我们在模拟API
  globalThis.HTMLVideoElement = class {
    disablePictureInPicture = false;
    height = 0;
    onenterpictureinpicture = null;
    onleavepictureinpicture = null;
  };
}

if (!HTMLVideoElement.prototype.play) {
  HTMLVideoElement.prototype.play = jest.fn(() => Promise.resolve());
}

if (!HTMLVideoElement.prototype.pause) {
  HTMLVideoElement.prototype.pause = jest.fn();
}

// 模拟console.time和console.timeEnd以提高测试性能
console.time = jest.fn();
console.timeEnd = jest.fn();

// 模拟console.warn和console.error以减少测试输出
const originalWarn = console.warn;
const originalError = console.error;

console.warn = jest.fn((...args) => {
  // 过滤掉一些常见的警告
  const message = args.join(" ");
  if (
    message.includes("ReactDOM.render is no longer supported") ||
    message.includes("Deprecation warning") ||
    message.includes("Warning:") ||
    message.includes("Experimental feature") ||
    message.includes("Non-standard feature")
  ) {
    return;
  }
  originalWarn(...args);
});

console.error = jest.fn((...args) => {
  // 过滤掉一些常见的错误
  const message = args.join(" ");
  if (
    message.includes("Error:") ||
    message.includes("TypeError:") ||
    message.includes("ReferenceError:")
  ) {
    originalError(...args);
  }
});

// 模拟TextEncoder
if (!globalThis.TextEncoder) {
  // @ts-expect-error - 忽略类型错误，这只是测试环境的模拟实现
  globalThis.TextEncoder = class TextEncoder {
    readonly encoding: string = "utf-8";

    encode(input: string): Uint8Array {
      const bytes = new Uint8Array(input.length);
      for (let i = 0; i < input.length; i++) {
        bytes[i] = input.charCodeAt(i);
      }
      return bytes;
    }

    encodeInto(
      input: string,
      destination: Uint8Array
    ): {
      read: number;
      written: number;
    } {
      const length = Math.min(input.length, destination.length);
      for (let i = 0; i < length; i++) {
        destination[i] = input.charCodeAt(i);
      }
      return {
        read: input.length,
        written: length,
      };
    }
  };
}

// 模拟TextDecoder
if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = class TextDecoder {
    readonly encoding: string = "utf-8";
    readonly fatal: boolean = false;
    readonly ignoreBOM: boolean = false;

    decode(input?: BufferSource): string {
      if (!input) return "";
      try {
        const bytes = input instanceof Uint8Array ? input : new Uint8Array(input as ArrayBuffer);
        let result = "";
        for (let i = 0; i < bytes.length; i++) {
          result += String.fromCharCode(bytes[i]);
        }
        return result;
      } catch {
        return "";
      }
    }
  };
}

// 模拟事件监听器
if (!EventTarget.prototype.addEventListener) {
  EventTarget.prototype.addEventListener = jest.fn();
}

if (!EventTarget.prototype.removeEventListener) {
  EventTarget.prototype.removeEventListener = jest.fn();
}

if (!EventTarget.prototype.dispatchEvent) {
  EventTarget.prototype.dispatchEvent = jest.fn(() => true);
}

// 注意：移除了可能导致类型错误的全局模拟
// 这些模拟可能不是必要的，因为Jest和测试环境通常会提供这些API
