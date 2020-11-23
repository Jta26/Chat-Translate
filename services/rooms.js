function getRoomID(users) {
    users.sort((a,b) => {
        return a.email.localeCompare(b.email);
    });
    const [first, second] = users;
    const hash = generateHash(first.email + second.email) + 'A';
    return hash;
}


function generateHash(string) {
    var hash = 0;
    if (string.length == 0)
        return hash;
    for (let i = 0; i < string.length; i++) {
        var charCode = string.charCodeAt(i);
        hash = ((hash << 7) - hash) + charCode;
        hash = hash & hash;
    }
    return hash;
}


module.exports = {
    getRoomID,
    generateHash
}