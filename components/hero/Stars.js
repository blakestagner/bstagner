export function stars(objId, count) {
    let canvas = document.querySelector(`#${objId}`);
    let context = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    for (var i = 0; i < count; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let radius = Math.random() * 1.2;
        context.beginPath();
        context.arc(x, y, radius, 0, 360);
        context.fillStyle = 'hsla(200,100%,100%,0.8)';
        context.fill();
    }
}
