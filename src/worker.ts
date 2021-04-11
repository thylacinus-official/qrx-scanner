import jsQR from 'jsqr';

const ctx: Worker = self as any;

ctx.addEventListener('message', ({ data: { data: image, width, height } }) =>
    ctx.postMessage(jsQR(image, width, height))
);

export default null as any;
