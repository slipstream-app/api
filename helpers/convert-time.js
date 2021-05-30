module.exports = function(timeString) {

    if (!timeString || timeString == '---')
        return 0;


    let regex1 = /(-[0-9])\sVOLTA\(S\)/
    let strMatch = regex1.exec(timeString)
    if (strMatch) {
        return strMatch[1];
    }
    let arr = timeString.split(':');

    let size = arr.length
    if (size > 3) {
        throw new Error("Timestamp com formato inválido");
    }
    let sum = 0;
    for (let index = 0; index < size; index++) {
        let element = arr[index];
        let value = element * 1000;
        if (index < size - 1) {
            value = value * Math.pow(60, (size - index - 1));
        }
        sum += value;
    }
    return Math.floor(sum);

}