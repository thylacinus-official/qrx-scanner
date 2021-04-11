import React, { CSSProperties } from 'react';
import Webcam, { WebcamProps } from 'react-webcam';
import { QRCode } from 'jsqr';

import {
    QRScannerAccessError,
    QRScannerCanvasError,
    QRScannerTimeoutError,
} from './error';
import Worker from './worker';
import { cls } from './utils';

import './style.css';

const DEFAULT_TIMEOUT = 30000;

type Coords = [number, number, number, number];

type ScanParams = {
    callback?: (img: ImageData) => void;
    silent?: boolean;
    timeout?: number;
};

type VideoResolution = {
    width: number;
    height: number;
};

export interface IQRScannerProps extends React.HTMLAttributes<HTMLDivElement> {
    autoStart: boolean;
    callback?: (img: ImageData) => void;
    cursorClassName?: string;
    cursorResolution: number;
    fullScreen: boolean;
    minCursorSize: number;
    onFailed?: (error: Error) => void;
    onSuccess?: (res: QRCode) => void;
    timeout: number;
    videoSize: 'contain' | 'cover';
    webcamProps: Partial<WebcamProps>;
}

export interface IQRScannerState {
    cursorSize: number | null;
    videoStyle: CSSProperties;
}

export const defaultWebcamProps = {
    videoConstraints: {
        facingMode: { exact: 'environment' },
        height: 1080,
    },
};

class QRScanner extends React.Component<IQRScannerProps, IQRScannerState> {
    static defaultProps = {
        autoStart: true,
        cursorResolution: 400,
        fullScreen: false,
        minCursorSize: 0.4,
        timeout: DEFAULT_TIMEOUT,
        videoSize: 'contain',
        webcamProps: defaultWebcamProps,
    };

    container: HTMLDivElement | null = null;
    loaded = false;
    videoTargetResolution: VideoResolution | null = null;
    webcam: Webcam | null = null;

    constructor(props: IQRScannerProps) {
        super(props);
        this.state = {
            cursorSize: null,
            videoStyle: { visibility: 'hidden' },
        };
    }

    adjustCursorToVideo(): [number, VideoResolution] {
        const { clientWidth, clientHeight } = this.container!;
        const { videoWidth, videoHeight } = this.webcam!.video!;

        const { cursorResolution } = this.props;
        let { minCursorSize: cursorSize } = this.props;
        const dir = this.calcVideoRelativeDirection();
        const videoScale =
            [videoWidth, videoHeight][dir] / [clientWidth, clientHeight][dir];

        const containerSize = Math.min(clientWidth, clientHeight);
        cursorSize <= 1 && (cursorSize *= containerSize);
        cursorSize = Math.max(cursorSize, cursorResolution / videoScale);
        cursorSize = Math.min(containerSize, cursorSize);

        const resolutionScale = cursorResolution / cursorSize / videoScale;

        const videoResolution = {
            width: videoWidth * resolutionScale,
            height: videoHeight * resolutionScale,
        };

        return [cursorSize, videoResolution];
    }

    adjustVideoToContainer(): CSSProperties {
        const dir = this.calcVideoRelativeDirection();
        return {
            [['width', 'height'][dir]]: '100%',
        };
    }

    calcVideoRelativeDirection(): number {
        const { clientWidth, clientHeight } = this.container!;
        const { videoWidth, videoHeight } = this.webcam!.video!;
        const contain = this.props.videoSize == 'contain';
        return +(
            clientWidth / clientHeight > videoWidth / videoHeight ==
            contain
        );
    }

    calcCaptureCoords(): Coords {
        const { width, height } = this.videoTargetResolution!;
        const { cursorResolution } = this.props;
        const mid = (dim: number) => (dim - cursorResolution!) / 2;
        return [mid(width), mid(height), cursorResolution!, cursorResolution!];
    }

    captureImage(...coords: Coords): ImageData {
        const canvas = this.webcam?.getCanvas(this.videoTargetResolution!);
        const context = canvas?.getContext('2d');

        if (!context) {
            throw new QRScannerCanvasError();
        }

        return context.getImageData(...coords);
    }

    scan_(args?: Omit<ScanParams, 'silent'>): Promise<QRCode> {
        const worker = new Worker();
        const time = () => new Date().getTime();
        const startTime = time();

        const { timeout, callback } = {
            ...this.props,
            ...args,
        };

        const promise = () =>
            new Promise<QRCode>((resolve, reject) => {
                const img = this.captureImage(...this.calcCaptureCoords());
                callback && callback(img!);
                worker.postMessage(img);
                worker.onmessage = ({ data }: { data: QRCode }) => {
                    if (data) {
                        resolve(data);
                        worker.terminate();
                    } else if (time() - startTime > timeout) {
                        reject(new QRScannerTimeoutError());
                        worker.terminate();
                    } else {
                        resolve(promise());
                    }
                };
            });

        return promise();
    }

    scan = async ({
        silent,
        ...args
    }: ScanParams = {}): Promise<QRCode | null> => {
        const { onFailed, onSuccess } = this.props;

        if (!this.webcam?.state.hasUserMedia) return null;

        try {
            const res = await this.scan_(args);
            onSuccess && onSuccess(res);
            return res;
        } catch (error) {
            onFailed && onFailed(error);
            if (silent === false) throw error;
            return null;
        }
    };

    componentDidMount(): void {
        const { video } = this.webcam!;
        video?.addEventListener('loadedmetadata', this.handleLoadedMetadata, {
            once: true,
        });
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount(): void {
        window.removeEventListener('resize', this.handleResize);
    }

    handleLoadedMetadata = (): void => {
        this.loaded = true;
        this.handleResize();
        this.props.autoStart && this.scan();
    };

    handleResize = (): void => {
        const [cursorSize, videoTargetResolution] = this.adjustCursorToVideo();
        const videoStyle = this.adjustVideoToContainer();
        this.videoTargetResolution = videoTargetResolution;
        this.setState({ cursorSize, videoStyle });
    };

    handleUserMediaError = (error: string | DOMException): void => {
        const {
            onFailed,
            webcamProps: { onUserMediaError },
        } = this.props;
        onFailed && onFailed(new QRScannerAccessError(error));
        onUserMediaError && onUserMediaError(error);
    };

    setContainerRef = (element: HTMLDivElement | null): void => {
        this.container = element;
    };

    setWebcamRef = (element: Webcam | null): void => {
        this.webcam = element;
    };

    render(): JSX.Element {
        const {
            autoStart,
            callback,
            children,
            className,
            cursorClassName,
            cursorResolution,
            fullScreen,
            minCursorSize,
            onFailed,
            onSuccess,
            timeout,
            videoSize,
            webcamProps: { style: webcamStyle, ...webcamProps },
            ...restProps
        } = this.props;

        const { cursorSize, videoStyle } = this.state;

        const scannerCls = cls(
            'qr-scanner',
            fullScreen && 'qr-scanner--fullscreen',
            className
        );

        return (
            <div
                className={scannerCls}
                ref={this.setContainerRef}
                {...restProps}
            >
                {cursorSize ? (
                    <div
                        className={cls('qr-scanner__cursor', cursorClassName)}
                        style={{ width: cursorSize, height: cursorSize }}
                    />
                ) : null}
                <Webcam
                    audio={false}
                    onUserMediaError={this.handleUserMediaError}
                    ref={this.setWebcamRef}
                    style={{ ...videoStyle, ...webcamStyle }}
                    {...webcamProps}
                />
                {children}
            </div>
        );
    }
}

export default QRScanner;
