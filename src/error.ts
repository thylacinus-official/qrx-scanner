export class QRScannerError extends Error {
    public name = 'QRScannerError';
}

export class QRScannerAccessError extends QRScannerError {
    constructor(error: string | DOMException) {
        if (typeof error != 'string') {
            const { name, message } = error;
            error = name + (message && ` - ${message}`);
        }
        super(error);
        this.name = 'QRScannerAccessError';
    }
}
export class QRScannerCanvasError extends QRScannerError {
    public name = 'QRScannerCanvasError';
}
export class QRScannerTimeoutError extends QRScannerError {
    public name = 'QRScannerTimeoutError';
}
