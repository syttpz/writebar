// default 2000 words
function getGoal() {
    const saved = localStorage.getItem('word_goal');
    return saved ? parseInt(saved, 10) : 2000;
}

function setGoal(value) { localStorage.setItem('word_goal', value);}

function getWordCount() {
    const container = document.getElementById('kix-documentmetrics-widget-content'); 
    if (!container) return null;

    const numberSpan = container.querySelector('.kix-documentmetrics-widget-number');
    if (!numberSpan) return null;

    const count = parseInt(numberSpan.innerText.trim(), 10);
    return isNaN(count) ? null : count;
}

function insert() {
    if (document.getElementById('word-progress')) return;

    const container = document.createElement('div');
    container.id = 'word-progress';
    container.innerHTML = `
    <div id="label" title="Click to set word goal">
        <div style="display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
        <span id="status">Word count: 0 / 2000</span>
        </div>
        <div style="margin-top: 4px;">
            Progress: <span id="percent">0.00%</span>
        </div>
    </div>
    <div id="bar"><div id="bar-fill"></div></div>
`;
    document.body.appendChild(container);
}

//update wordword-progress bar
function update() {

    const count = getWordCount();
    const goal = getGoal();
    const percentText = document.getElementById('percent');
    const barFill = document.getElementById('bar-fill');
    const status = document.getElementById('status');

    if (count === null) {
        percentText.textContent = '0%';
        barFill.style.width = '0%';
        barFill.style.backgroundColor = 'gray';
        status.textContent = 'Please enable "Tool" -> "Display word count while typing"';
        return;
    }

    const percent = Math.min((count / goal) * 100, 100);
    percentText.textContent = percent.toFixed(2) + "%";
    barFill.style.width = percent + "%";

    if (percent < 40) {
        barFill.style.backgroundColor = "red";
    } else if (percent < 70) {
        barFill.style.backgroundColor = "orange";
    } else {
        barFill.style.backgroundColor = "green";
    }

    status.textContent = `Word count: ${count} / ${goal}`;
}

function bindGoal() {
    const label = document.getElementById('label');
    if (!label) return;

    label.addEventListener('click', () => {
        const current = getGoal();
        const input = prompt("Set your word goal:", current);
        if (input !== null) {
            const newGoal = parseInt(input, 10);
            if (!isNaN(newGoal) && newGoal > 0) {
                setGoal(newGoal);
                update(); 
            } else {
                alert("Please enter a valid number.");
            }
        }
    });
}


insert();
setInterval(update, 1000);
bindGoal();

