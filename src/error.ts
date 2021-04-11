export class QRScannerError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class QRScannerAccessError extends QRScannerError {
    constructor(error: string | DOMException) {
        if (typeof error != 'string') {
            const { name, message } = error;
            error = name + (message && ` - ${message}`);
        }
        super(error);
    }
}
export class QRScannerCanvasError extends QRScannerError {}
export class QRScannerTimeoutError extends QRScannerError {}
