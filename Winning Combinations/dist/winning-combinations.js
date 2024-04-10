const nonPayingSymbols = [10, 11, 12, 13, 14, 15];
const wildSymbol = 0;
const minSequenceToWin = 3;
function call(lines) {
    let winningCombinations = [];
    let lineSequences = parseLine(lines);
    Object.keys(lineSequences).forEach(function (lineNumber) {
        let currentSequence = addWildSymbolToSequence(lineSequences, lineNumber);
        if (currentSequence.length < minSequenceToWin)
            return;
        const [isWinningSequence, nonSequenceNumbers] = checkIfIsWinningSequence(currentSequence);
        if (!isWinningSequence)
            return;
        currentSequence = removeNonWinningSequenceNumbers(currentSequence, nonSequenceNumbers);
        if (nonPayingSymbols.includes(parseInt(lineNumber)))
            return;
        winningCombinations.push([parseInt(lineNumber), currentSequence]);
    });
    winningCombinations = removeWildSequenceIfMultipleWins(winningCombinations);
    return winningCombinations;
}
function parseLine(line) {
    let sequence = {};
    line.filter((value, column) => {
        if (sequence[value]) {
            sequence[value].push(column);
            return;
        }
        sequence[value] = [column];
    });
    return sequence;
}
function addWildSymbolToSequence(lineSequences, lineNumber) {
    if (lineSequences[wildSymbol] && lineNumber != wildSymbol) {
        lineSequences[lineNumber] = lineSequences[lineNumber].concat(lineSequences[wildSymbol]);
        lineSequences[lineNumber].sort();
    }
    return lineSequences[lineNumber];
}
function checkIfIsWinningSequence(lineSequences) {
    let wrongNumbers = [];
    let sequences = 1;
    let lastNumber;
    lineSequences.map((value, index) => {
        if (lastNumber == null) {
            lastNumber = value;
            return;
        }
        if (value == (lastNumber + 1)) {
            sequences += 1;
            lastNumber = value;
            return;
        }
        const wrongNumber = (index + 1) == lineSequences.length ? value : lastNumber;
        if (sequences >= minSequenceToWin || sequences < 2) {
            wrongNumbers.push(wrongNumber);
            lastNumber = value;
            if (sequences >= minSequenceToWin) {
                return;
            }
        }
        if (sequences >= 2) {
            wrongNumbers.push(wrongNumber);
            wrongNumbers.push(lastNumber - 1);
        }
        lastNumber = value;
        sequences = 1;
    });
    const isSequence = sequences >= minSequenceToWin;
    return [isSequence, wrongNumbers];
}
function removeNonWinningSequenceNumbers(currentSequence, nonSequenceNumbers) {
    return currentSequence.filter((value) => {
        return !nonSequenceNumbers.includes(value);
    });
}
function removeWildSequenceIfMultipleWins(winningCombinations) {
    if (winningCombinations.length <= 1)
        return winningCombinations;
    return winningCombinations.filter((value) => {
        return ![wildSymbol].includes(value[0]);
    });
}
export const WinningCombinations = { call };
//# sourceMappingURL=winning-combinations.js.map