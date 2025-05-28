let playerHealth = 100;
const playerMaxHealth = 100;
let enemyHealth = 100;
let isPaused = false;

const enemies = [
    {
        name: "Guerrero Sombrío",
        image: "images/enemy1.png",
        health: 100
    },
    {
        name: "Mantis Lords",
        image: "images/enemigo2.png",
        health: 150
    },
    {
        name: "Nosk el Acechador",
        image: "images/enemigo3.png",
        health: 250
    },
    {
        name: "Radiant Knight",
        image: "images/jefe-final.png",
        health: 500
    }
];

let currentEnemyIndex = 0;

// 🎵 Música de fondo
const music = new Audio('audio/battle-music.mp3');
music.loop = true;
music.volume = 0.5;

// Pausa con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        togglePause();
    }
});

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pause-menu').style.display = isPaused ? 'flex' : 'none';

    document.querySelectorAll('button').forEach(btn => {
        if (!btn.closest('#pause-menu')) {
            btn.disabled = isPaused;
        }
    });

    if (isPaused) {
        music.pause();
    } else {
        music.play();
    }
}

function resumeGame() {
    isPaused = false;
    document.getElementById('pause-menu').style.display = 'none';
    document.querySelectorAll('button').forEach(btn => btn.disabled = false);
    music.play();
}

function goToMainMenu() {
    location.reload();
}

function restartGame() {
    playerHealth = playerMaxHealth;
    currentEnemyIndex = 0;
    const enemy = enemies[currentEnemyIndex];
    enemyHealth = enemy.health;

    updateHealthBars();
    showMessage("Juego reiniciado. Tu turno.");
    document.getElementById('pause-menu').style.display = 'none';
    document.getElementById('player-options').style.display = 'block';
    document.querySelectorAll('button').forEach(btn => btn.disabled = false);
    isPaused = false;

    document.getElementById('enemy-img').src = enemy.image;
    document.getElementById('enemy-name').textContent = enemy.name;

    music.currentTime = 0;
    music.play();
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('.start').addEventListener('click', () => {
        document.querySelector('.screen-home').style.display = 'none';
        document.querySelector('.battle').style.display = 'block';
        
        currentEnemyIndex = 0;
        const enemy = enemies[currentEnemyIndex];
        enemyHealth = enemy.health;

        document.getElementById('enemy-img').src = enemy.image;
        document.getElementById('enemy-name').textContent = enemy.name;

        showMessage("¡Comienza el combate! Tu turno.");
        updateHealthBars();
        music.play();
    });
});

function showMessage(msg) {
    document.getElementById('status').textContent = msg;
}

function updateHealthBars() {
    const playerBar = document.getElementById('player-health-bar');
    const enemyBar = document.getElementById('enemy-health-bar');

    playerBar.style.width = `${(playerHealth / playerMaxHealth) * 100}%`;

    const maxEnemyHealth = enemies[currentEnemyIndex].health;
    enemyBar.style.width = `${(enemyHealth / maxEnemyHealth) * 100}%`;
}

function playerAttack(skill) {
    let damage = 0;
    const playerImg = document.getElementById('player-img');

    if (playerImg) {
        playerImg.src = `images/knight-ataque${skill}.png`;
    }

    if (skill === 1) damage = 10;
    else if (skill === 2) damage = 20;
    else if (skill === 3) damage = 35;

    enemyHealth -= damage;
    if (enemyHealth < 0) enemyHealth = 0;

    updateHealthBars();
    showMessage(`Atacaste con ${damage} de daño.`);

    if (enemyHealth <= 0) {
        showMessage("¡Has derrotado al enemigo!");
        document.getElementById('player-options').style.display = 'none';

        setTimeout(() => {
            if (playerImg) playerImg.src = 'images/knight_idle.png';
        }, 1000);

        setTimeout(spawnEnemy, 2000);
        return;
    }

    document.getElementById('player-options').style.display = 'none';

    setTimeout(() => {
        if (playerImg) playerImg.src = 'images/knight_idle.png';
        enemyTurn();
    }, 1000);
}

function enemyTurn() {
    if (isPaused) return;

    const damage = Math.floor(Math.random() * 30) + 10;
    window.pendingDamage = damage;
    showMessage(`¡El enemigo ataca con ${damage} de daño!`);
    document.getElementById('defense-options').style.display = 'block';
}

function defend(shield) {
    if (isPaused) return;

    let reduction = 0;
    if (shield === 1) reduction = 5;
    else if (shield === 2) reduction = 15;
    else if (shield === 3) reduction = 25;

    const realDamage = Math.max(0, window.pendingDamage - reduction);
    playerHealth -= realDamage;
    if (playerHealth < 0) playerHealth = 0;

    showMessage(`Reduciste el daño a ${realDamage} con tu escudo.`);
    updateHealthBars();

    document.getElementById('defense-options').style.display = 'none';

    if (playerHealth <= 0) {
        showMessage("¡Has sido derrotado!");
        document.getElementById('player-options').style.display = 'none';
    } else {
        setTimeout(() => {
            showMessage("Tu turno. Elige una habilidad.");
            document.getElementById('player-options').style.display = 'block';
        }, 1000);
    }
}

function spawnEnemy() {
    currentEnemyIndex++;

    if (currentEnemyIndex >= enemies.length) {
        showMessage("¡Has vencido a todos los enemigos! 🎉");
        document.getElementById('player-options').style.display = 'none';
        document.getElementById('defense-options').style.display = 'none';
        return;
    }

    const nextEnemy = enemies[currentEnemyIndex];
    enemyHealth = nextEnemy.health;

    const enemyName = document.getElementById('enemy-name');
    const enemyImg = document.getElementById('enemy-img');

    if (enemyName) enemyName.textContent = nextEnemy.name;
    if (enemyImg) {
        enemyImg.src = nextEnemy.image;
        enemyImg.style.display = "block";
    }

    const playerImg = document.getElementById('player-img');
    if (playerImg) {
        playerImg.src = 'images/knight_idle.png';
        playerImg.style.transform = "scale(1)";
    }

    updateHealthBars();
    showMessage(`¡Nuevo enemigo! ${nextEnemy.name} aparece.`);

    setTimeout(() => {
        document.getElementById('player-options').style.display = 'block';
    }, 1000);
}
