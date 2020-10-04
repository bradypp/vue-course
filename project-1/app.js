function getRandomValue(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

const initialData = {
    playerHealth: 100,
    monsterHealth: 100,
    currentRound: 0,
    winner: null,
    logMessages: [],
};
const app = Vue.createApp({
    data() {
        return {
            ...initialData,
        };
    },
    computed: {
        monsterBarStyles() {
            if (this.monsterHealth < 0) {
                return {
                    width: '0%',
                };
            }
            return {
                width: this.monsterHealth + '%',
            };
        },
        playerBarStyles() {
            if (this.playerHealth < 0) {
                return {
                    width: '0%',
                };
            }
            return {
                width: this.playerHealth + '%',
            };
        },
        isSpecialAvailable() {
            return this.currentRound % 3 !== 0;
        },
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                this.winner = 'draw';
            }
            if (value <= 0) {
                this.winner = 'monster';
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                this.winner = 'draw';
            }
            if (value <= 0) {
                this.winner = 'player';
            }
        },
    },
    methods: {
        startNewGame() {
            this.playerHealth = initialData.playerHealth;
            this.monsterHealth = initialData.monsterHealth;
            this.currentRound = initialData.currentRound;
            this.winner = initialData.winner;
            this.logMessages = initialData.logMessages;
        },
        attackMonster() {
            this.currentRound++;
            const attackValue = getRandomValue(5, 12);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer();
        },
        attackPlayer() {
            const attackValue = getRandomValue(8, 15);
            this.playerHealth -= attackValue;
            this.addLogMessage('monster', 'attack', attackValue);
        },
        specialAttackMonster() {
            this.currentRound++;
            const attackValue = getRandomValue(10, 18);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer();
        },
        healPlayer() {
            this.currentRound++;
            const healValue = getRandomValue(8, 20);
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            }
            this.addLogMessage('player', 'heal', healValue);
            this.attackPlayer();
        },
        surrender() {
            this.winner = 'monster';
            this.playerHealth = 0;
        },
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value,
            });
        },
    },
});

app.mount('#game');
