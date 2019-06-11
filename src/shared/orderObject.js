const compareBy = (...props) => (a, b) => {
    for (let i = 0; i < props.length; i++) {
        const ascValue = props[i].startsWith('-') ? -1 : 1;
        const prop = props[i].startsWith('-') ? props[i].substr(1) : props[i];
        if (a[prop] !== b[prop]) {
            return a[prop] > b[prop] ? ascValue : -ascValue;
        }
    }
    return 0;
};

module.exports = { compareBy };