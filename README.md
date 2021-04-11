# qrx-scanner

QR code scanning component for React based on [jsQR](https://github.com/cozmo/jsQR) and [react-webcam](https://github.com/mozmorris/react-webcam) libraries.

## Install

```sh
npm install qrx-scanner
```

## Demo

```sh
npm install -D http-server

# http://localhost:8080/
http-server node_modules/qrx-scanner/dist/demo

# https://192.168.0.1:8080/
http-server -S -C cert.pem node_modules/qrx-scanner/dist/demo

```

## Usage

```typescript
import React from 'react';
import QRScanner from 'qrx-scanner';

const QRScannerComponent = () => <QRScanner />;
```

## Props

| Name             | Type                             | Default                                        |
| ---------------- | -------------------------------- | ---------------------------------------------- |
| autoStart        | boolean                          | true                                           |
| callback         | function(img: ImageData) => void |                                                |
| cursorClassName  | string                           |                                                |
| cursorResolution | number                           | 400                                            |
| fullScreen       | boolean                          | false                                          |
| minCursorSize    | number                           | 0.4                                            |
| onFailed         | function(error: Error) => void   |                                                |
| onSuccess        | function(res: QRCode) => void    |                                                |
| timeout          | number                           | 30000                                          |
| videoSize        | 'contain' \| 'cover'             | contain                                        |
| webcamProps      | Partial\<WebcamProps\>           | [`defaultWebcamProps`](####defaultWebcamProps) |

#### defaultWebcamProps

```typescript
const defaultWebcamProps = {
    videoConstraints: {
        facingMode: { exact: 'environment' },
        height: 1080,
    },
};
```

## Methods

| Name         | Args                           | Res                     |
| ------------ | ------------------------------ | ----------------------- |
| handleResize |                                | void                    |
| scan         | [`ScanParams`](####ScanParams) | Promise<QRCode \| null> |

#### ScanParams

```typescript
type ScanParams = {
    callback?: (img: ImageData) => void;
    silent?: boolean;
    timeout?: number;
};
```

## Properties

| Name   | Type    |
| ------ | ------- |
| loaded | boolean |
