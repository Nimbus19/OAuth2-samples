export const Logger = () => {
    var select;
    var textPanel;
    var logHistory = [];

    const init = (HTMLSelectElement, HTMLPreElement) => {
        select = HTMLSelectElement;    
        textPanel = HTMLPreElement;
        select.onchange = onSelect;
    }

    const add = (logTitle, logText = "", color = "black") => {
        // Update list of log title
        var option = document.createElement('option');
        option.value = logHistory.length;
        option.text = `${getTimestamp()} ${logTitle}`;
        option.style.color = color;
    
        select.add(option);
        select.value = logHistory.length;
    
        // Update log text to panel
        var logTextwithTitle = `${option.text}\n\n${logText}`;
        textPanel.textContent = logTextwithTitle;
        logHistory.push(logTextwithTitle);
    }

    const clear = () => {
        while (select.firstChild) {
            select.removeChild(select.lastChild);
        }
        textPanel.textContent = "";
        logHistory = [];
    }

    const getTimestamp = () => {
        const pad = (n,s=2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
        const d = new Date();    
        return `[${pad(d.getFullYear(),4)}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}]`;
    }

    const onSelect = () => {
        var index = parseInt(select.value);
        textPanel.textContent = logHistory[index];
    }

    return {
        init:init,
        add:add,
        clear:clear
    }
}
