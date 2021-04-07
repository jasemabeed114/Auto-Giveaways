module.exports = {
    getLanguage(usersDB) {
        if (usersDB) {
            if (usersDB.lang) {
                let language = require(`../language/${usersDB.lang}.json`)
                return language
            } else {
                let language = require(`../language/fr.json`)
                return language
            }
        } else {
            let language = require(`../language/fr.json`)
            return language
        }
    },
    msToTime(ms){
        days = Math.floor(ms / 86400000); // 24*60*60*1000
        daysms = ms % 86400000; // 24*60*60*1000
        hours = Math.floor(daysms / 3600000); // 60*60*1000
        hoursms = ms % 3600000; // 60*60*1000
        minutes = Math.floor(hoursms / 60000); // 60*1000
        minutesms = ms % 60000; // 60*1000
        sec = Math.floor(minutesms / 1000);
      
        let str = "";
        if (days) str = str + days + (days > 1 ? " jours " : " jour ");
        if (hours) str = str + hours + (hours > 1 ? " heures " : " heure ");
        if (minutes) str = str + minutes + (minutes > 1 ? " minutes " : " minute ");
        if (sec) str = str + sec + (sec > 1 ? " secondes" : " seconde");
      
        return str;
    }
};
