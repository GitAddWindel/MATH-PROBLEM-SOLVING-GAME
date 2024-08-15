let exp = 0;
let level = 0;
const maxLevel = 50;
const expPerLevel = 100;
let fullName = '';

document.addEventListener('DOMContentLoaded', () => {
    // Check if user data already exists
    fullName = localStorage.getItem('userFullName');
    if (fullName) {
        const userData = JSON.parse(localStorage.getItem(fullName));
        if (userData) {
            exp = userData.exp;
            level = userData.level;
            document.getElementById('exp').textContent = exp;
            document.getElementById('level').textContent = level;
            if (level >= maxLevel) {
                document.getElementById('title').textContent = "Title: Math Master";
            }

            // Hide the name input section and show the game section
            document.getElementById('name-input-section').style.display = 'none';
            document.getElementById('game-section').style.display = 'block';

            // Generate the first problem
            generateProblem();
        }
    }
    updateLeaderboard();
});

function startGame() {
    fullName = document.getElementById('full-name').value.trim();

    if (fullName === '') {
        alert('Please enter your full name to start the game.');
        return;
    }

    // Save the full name for future reference
    localStorage.setItem('userFullName', fullName);

    // Save new user data
    saveUserData();

    // Hide the name input section and show the game section
    document.getElementById('name-input-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';

    // Generate the first problem
    generateProblem();

    // Update the leaderboard
    updateLeaderboard();
}

function generateProblem() {
    let num1, num2, operator, problemText, correctAnswer;

    if (level < 10) {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operator = '+';
        correctAnswer = num1 + num2;
    } else if (level < 20) {
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        operator = Math.random() < 0.5 ? '+' : '-';
        correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;
    } else if (level < 30) {
        num1 = Math.floor(Math.random() * 30) + 1;
        num2 = Math.floor(Math.random() * 30) + 1;
        operator = Math.random() < 0.33 ? '+' : Math.random() < 0.5 ? '-' : '*';
        correctAnswer = operator === '+' ? num1 + num2 :
                        operator === '-' ? num1 - num2 : num1 * num2;
    } else if (level < 40) {
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        operator = Math.random() < 0.25 ? '+' :
                   Math.random() < 0.5 ? '-' :
                   Math.random() < 0.75 ? '*' : '/';
        correctAnswer = operator === '+' ? num1 + num2 :
                        operator === '-' ? num1 - num2 :
                        operator === '*' ? num1 * num2 :
                        num1 / num2;
        correctAnswer = operator === '/' ? parseFloat(correctAnswer.toFixed(2)) : correctAnswer;
    } else {
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
        operator = Math.random() < 0.25 ? '+' :
                   Math.random() < 0.5 ? '-' :
                   Math.random() < 0.75 ? '*' : '/';
        correctAnswer = operator === '+' ? num1 + num2 :
                        operator === '-' ? num1 - num2 :
                        operator === '*' ? num1 * num2 :
                        num1 / num2;
        correctAnswer = operator === '/' ? parseFloat(correctAnswer.toFixed(2)) : correctAnswer;
    }

    problemText = `${num1} ${operator} ${num2}`;
    document.getElementById('math-problem').textContent = problemText;
    document.getElementById('answer').dataset.correctAnswer = correctAnswer;
}

function checkAnswer() {
    const userAnswer = parseFloat(document.getElementById('answer').value);
    const correctAnswer = parseFloat(document.getElementById('answer').dataset.correctAnswer);

    if (userAnswer === correctAnswer) {
        exp += 10;
        if (exp >= expPerLevel) {
            level++;
            exp = 0;
        }
        saveUserData();
        document.getElementById('exp').textContent = exp;
        document.getElementById('level').textContent = level;
        if (level >= maxLevel) {
            document.getElementById('title').textContent = "Title: Math Master";
        }
        generateProblem();
    } else {
        document.getElementById('result').textContent = 'Incorrect answer. Try again!';
    }
}

function saveUserData() {
    if (fullName) {
        localStorage.setItem(fullName, JSON.stringify({ exp, level }));
    }
}
function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = ''; // Clear previous entries

    // Gather user data
    const keys = Object.keys(localStorage).filter(key => key !== 'userFullName');
    const users = keys.map(key => {
        const userData = JSON.parse(localStorage.getItem(key));
        return { name: key, ...userData };
    });

    // Sort users by level and then by experience in descending order
    users.sort((a, b) => b.level - a.level || b.exp - a.exp);

    // Limit to top 10
    const topUsers = users.slice(0, 10);

    // Find the user with the highest level who has reached level 50 or above
    const mathMaster = topUsers.find(user => user.level >= 50);

    // Create list items for the leaderboard
    topUsers.forEach((user, index) => {
        const listItem = document.createElement('li');

        // Use innerHTML to style the "Top ${index + 1}:" part
        listItem.innerHTML = `<span style="color: red;">Top ${index + 1}:</span> ${user.name} - Level ${user.level} - EXP ${user.exp}`;
        
        leaderboardList.appendChild(listItem);
    });

    // Display Math Master title if applicable
    if (mathMaster) {
        const mathMasterSection = document.createElement('div');
        mathMasterSection.innerHTML = `
            <h2>Math Master</h2>
            <p>${mathMaster.name} - Level ${mathMaster.level} - EXP ${mathMaster.exp}</p>
        `;
        leaderboardList.insertBefore(mathMasterSection, leaderboardList.firstChild); // Insert at the top
    }
}

