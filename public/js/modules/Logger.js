export const Logger = () => {
    var _select;// HTMLSelectElement
    var _texPanel;// HTMLPreElement
    var _logDetail = [];

    const init = (selst, pre) => {
        _select = selst;    
        _texPanel = pre;
        _select.onchange = onSelect;
    }

    const add = (logText, logDetailText = "") => {
        // Update log list    
        var option = document.createElement('option');
        option.value = _logDetail.length;
        option.text = `${getTimestamp()} ${logText}`;
    
        _select.add(option);
        _select.value = _logDetail.length;
    
        // Update log detail
        var logDetailwithTitle = `${option.text}\n\n${logDetailText}`;
        _texPanel.textContent = logDetailwithTitle;
        _logDetail.push(logDetailwithTitle);
    }

    const clear = () => {
        while (_select.firstChild) {
            _select.removeChild(_select.lastChild);
        }
        _texPanel.textContent = "";
        _logDetail = [];
    }

    const getTimestamp = () => {
        const pad = (n,s=2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
        const d = new Date();    
        return `[${pad(d.getFullYear(),4)}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}]`;
    }

    const onSelect = () => {
        var index = parseInt(_select.value);
        _texPanel.textContent = _logDetail[index];
    }

    return {
        init:init,
        add:add,
        clear:clear
    }
}
