export function stars(objId, count) {
    let canvas = document.querySelector(`#${objId}`);
        let context = canvas.getContext("2d");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        let stars = count;
        for (var i = 0; i < stars; i++) {
            let x = Math.random() * canvas.getBoundingClientRect().width;
            let y = Math.random() * canvas.getBoundingClientRect().height,
            radius = Math.random() * 1.2;
            context.beginPath();
            context.arc(x, y, radius, 0, 360);
            context.fillStyle = "hsla(200,100%,100%,0.8)";
            context.fill();
        }
}