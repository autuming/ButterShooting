const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const crosshair = document.getElementById("crosshair");

let isAiming = false;
let power = 0;
let bullets = [];
const slingshot = {
    x: canvas.width * (25 / 100),
    y: canvas.height - 100,
};

// 마우스 위치 저장
const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

// 마우스 움직임 이벤트
canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // 크로스헤어 위치 업데이트
    crosshair.style.left = `${mouse.x - 10}px`;
    crosshair.style.top = `${mouse.y - 10}px`;
});

canvas.addEventListener("mousedown", () => {
    isAiming = true;
    power = 0;
});

canvas.addEventListener("mouseup", () => {
    if (isAiming) {
        bullets.push({
            x: slingshot.x,
            y: slingshot.y - 30, // 새총에서 약간 위쪽
            dx: (mouse.x - slingshot.x) / 20, // 조준 방향
            dy: (mouse.y - slingshot.y) / 20,
        });
        power = 0;
        isAiming = false;
    }
});

// 배경 그리기
function drawEnvironment() {
    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2); // 하늘
    ctx.fillStyle = "green";
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2); // 땅
}

// 새총 그리기
function drawSlingshot() {
    ctx.fillStyle = "red";
    ctx.fillRect(slingshot.x - 10, slingshot.y - 30, 20, 60); // 새총 손잡이
    if (isAiming) {
        ctx.beginPath();
        ctx.moveTo(slingshot.x, slingshot.y - 30);
        ctx.stroke();
    }
}

// 총알 그리기
function drawBullets() {
    ctx.fillStyle = "black";
    bullets.forEach((bullet, index) => {
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // 화면 밖으로 나가면 삭제
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(index, 1);
        }
    });
}

let enemies = [];

const enemyImages = [
    "minimies/1.png",
    "minimies/2.png",
    "minimies/3.png",
    "minimies/4.png",
    "minimies/5.png",
    "minimies/6.png"
]

function spawnEnemy() {
    // 무작위로 적 이미지 선택
    const randomImageIndex = Math.floor(Math.random() * enemyImages.length);
    const enemyImageSrc = enemyImages[randomImageIndex];

    const enemy = {
        x: Math.random() * canvas.width, // 화면의 랜덤 위치
        y: Math.random() * (canvas.height / 2), // 상단 영역에만 생성
        width: 100, // 기본 크기, 필요시 이미지 크기에 맞춰 변경 가능
        height: 100, // 기본 크기, 필요시 이미지 크기에 맞춰 변경 가능
        image: new Image(), // 이미지 객체 생성
        imageSrc: enemyImageSrc, // 이미지 경로
        hit: false, // 적이 맞았는지 여부
    };

    enemy.image.src = enemy.imageSrc; // 이미지를 로드

    enemies.push(enemy);
}

function drawEnemies() {
    enemies.forEach((enemy) => {
        if (!enemy.hit) {
            // 각 적의 이미지로 그리기
            ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            const dist = Math.sqrt(
                (bullet.x - enemy.x) ** 2 + (bullet.y - enemy.y) ** 2
            );
            if (dist < enemy.width / 2) {
                enemy.hit = true;
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
            }
        });
    });
}

// 게임 루프에서 적을 그림과 동시에 충돌 체크 추가
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // drawEnvironment();
    drawSlingshot();
    drawBullets();
    drawEnemies();
    checkCollisions();

    requestAnimationFrame(update);
}

// 일정 시간 간격으로 적 생성
setInterval(spawnEnemy, 2000); // 2초마다 적 생성

update();