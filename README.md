# qrx-scanner

QR code scanning component for React based on [jsQR](https://github.com/cozmo/jsQR) and [react-webcam](https://github.com/mozmorris/react-webcam) libraries.

## Install

```sh
npm install qrx-scanner
```

## Demo

https://qrx-scanner.ddns.net/

```sh
git clone https://github.com/thylacinus-official/qrx-scanner .
npm install
npm run demo # https://localhost:8080/
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
