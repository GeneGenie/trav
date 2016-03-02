var buildIds = {
    ambar: 11,
    sklad: 10,
    stable: 20,
    rally: 16,
    market: 17,
    baraks: 19,
    res1: 5,
    res2: 6,
    res3: 7,
    res4: 8,
    res5: 9,
    residense: 25,
    academy: 22,
    hero: 37,

    blacksmith: 12,
    armory: 13,
    cultury: 24,
    wall: 32,


    siege: 21,
    tradeoffice: 28,
    embassy: 18
}
var slots = {
    28: 'residense',
    29: 'academy',
    30: 'hero',
    31: 'blacksmith',
    32: 'armory',
    33: 'stable',
    34: 'cultury',


    35: 'res5',
    36: 'siege',
    37: 'tradeoffice',
    38: 'embassy',


    40: 'wall',
    26: 'main',
    39: 'rally',
    19: 'sklad',
    20: 'ambar',
    21: 'market',
    22: 'res1',
    23: 'res2',
    24: 'res3',
    25: 'res4',

    27: 'baraks'
}


var _ = require('underscore');
var request = require('request');
var async = require('async')
var cheerio = require('cheerio')
var farmQueue = async.queue(function (to, callback) {
    sendFarm(to, 100000000000, function () {
        console.log('send farm to ', to);
        setTimeout(callback, 2000);
    })
}, 1);
var cityIds = ["160435", "32", "159631", "833", "1636", "2037", "160029", "2036", "159627", "158424", "2433", "2432", "425", "3636", "157619", "157218", "1226", "4036", "156817", "3634", "4035", "156415", "159218", "3632", "20", "156814", "157214", "2025", "19", "155612", "4835", "156012", "156812", "158414", "5236", "4833", "156010", "418", "159214", "158813", "155208", "5233", "154807", "155207", "2823", "157609", "158811", "14", "160013", "4026", "157608", "157207", "154004", "6435", "156806", "157206", "1616", "2017", "4425", "154402", "2418", "11", "156804", "5227", "2016", "5628", "159207", "158806", "6832", "410", "160409", "160008", "155600", "3619", "160408", "6027", "3618", "157201", "155198", "155999", "152396", "152796", "5223", "154797", "156399", "5624", "152795", "4018", "159604", "153194", "2412", "8836", "3214", "155996", "154393", "157197", "151591", "151991", "156796", "155594", "153191", "8833", "152390", "158799", "4014", "5619", "4816", "155993", "5217", "2408", "157595", "8027", "150787", "9634", "4012", "151186", "8026", "5215", "154388", "10837", "150384", "2004", "5214", "8426", "10033", "157192", "153586", "156791", "5615", "6016", "157592", "155989", "4811", "10433", "3607", "1601", "5613", "2403", "8022", "6014", "154385", "156388", "155186", "157590", "149580", "151981", "154384", "8422", "6414", "7618", "2802", "9626", "149178", "8420", "7617", "796", "6814", "1598", "12036", "11634", "2400", "10428", "6412", "11633", "394", "1196", "11231", "159992", "7214", "3201", "12436", "148375", "148775", "9221", "157586", "8016", "10827", "7213", "9220", "7614", "10023", "148373", "9219", "1193", "6007", "159588", "12834", "12432", "154778", "149572", "791", "6006", "159988", "7210", "159587", "12832", "158785", "12430", "150772", "3598", "2795", "149570", "4399", "160788", "151571", "12026", "14035", "156378", "9616", "8813", "152772", "157981", "788", "13632", "158381", "149167", "146766", "154373", "10819", "157178", "386", "156777", "157979", "151568", "10818", "149966", "4797", "154772", "158379", "3593", "10817", "7204", "155573", "10415", "152768", "158378", "151566", "9210", "7203", "153168", "383", "160381", "2788", "381", "2386", "6799", "157573", "4391", "160379", "156771", "3989", "1181", "156770", "1582", "159977", "5593", "3587", "155567", "779", "160778", "156769", "1581", "158773", "3987", "377", "1580", "157569", "4387", "4788", "159172", "1577", "2379", "160372", "1977", "3581", "1573", "1974"];

farmQueue.drain = function () {
    console.log('Farm start over!!')
    if (cityIds.length)
        farmQueue.push(cityIds);
}
farmQueue.push(cityIds);

//push spotIds
var singleBuildQueue = async.queue(function (action, callback) {

    if (typeof action == 'number') {
        var spotId = action;
        action = "build";
    } else if (typeof action == 'string') {
        spotId = action.split(":")[0];
        spotId2 = action.split(':')[2];
        action = action.split(":")[1];
    }

    if (action == 'build')
        build(spotId, buildIds[slots[spotId]], function (timeout) {
            setTimeout(callback, timeout);
        });
    else if (action == "full") {
        fullUpgrade(spotId, 0, callback);
    } else if (action == "sendres") {
        sendResource(spotId, spotId2, callback)
    }
}, 1);
var base = 'http://www.beta.gotravspeed.com',
    home = base + '/village1.php',
    url = base + '/build.php?id=27',
    slotUrl = base + '/build.php?',
    buildUrl = base + '/village2.php?',
    buildResourceUrl = base + '/village1.php?',
    cookieStr = "PHPSESSID=19t4m6cb3fj5aj14lor8fih172; c0f13c0cf6bc969c47432fc9b5a574a8=TzoxMDoiQ2xpZW50RGF0YSI6NDp7czo1OiJ1bmFtZSI7czo0OiJnZW5hIjtzOjQ6InVwd2QiO3M6ODoia3Jla2VyMTMiO3M6NjoidWlMYW5nIjtzOjI6ImVuIjtzOjEwOiJzaG93TGV2ZWxzIjtiOjA7fQ%3D%3D";

function BuildArmy() {
    //max(maceman)
    request({uri: url, headers: {Cookie: cookieStr}}, function (err, res, body) {
        var $ = cheerio.load(body);
        var maxMaceman = $('.build_details tr').eq(1).find('td').eq(2).text().slice(1, -1),
            maxSpears = $('.build_details tr').eq(2).find('td').eq(2).text().slice(1, -1),
            maxAxes = $('.build_details tr').eq(3).find('td').eq(2).text().slice(1, -1);

        var form = {
            'tf[11]': 0,
            'tf[12]': maxSpears,
            'tf[13]': 0,
            'tf[14]': 0,
            's1.x': 71,
            's1.y': 15,
            's1': 'ok'
        }
        request({uri: url, form: form, method: "POST", headers: {Cookie: cookieStr}}, function (err, res, body) {
            console.log('army built')
        })
    })


}

function sendGet(url, cb) {
    cb = cb || function () {
        }
    request({uri: url, headers: {Cookie: cookieStr}}, function (err, res, body) {
        if (err || !res.request) {
            setTimeout(function () {
                sendGet(url, cb);
            }, 5000)
            return;
        }
        if (res.request.href.indexOf('antibot') > -1) {
            var $ = cheerio.load(body);
            console.log('antiBot appear')
            console.log('question is: ', $('#content center b').text())
            console.log('answer is: ', eval($('#content center b').text()))
            request({
                    uri: res.request.href,
                    method: "POST",
                    headers: {Cookie: cookieStr},
                    form: {answer: eval($('#content center b').text())}
                },
                function () {
                    sendGet(url, cb);
                })
        } else {
            cb.apply(this, Array.prototype.slice.call(arguments, 0))
        }


    })
}

function build(spot, buildingId, cb) {
    if (typeof buildingId == 'function') {
        cb = buildingId;
        buildingId = null;
    }


    var url = (spot <= 18 ? buildResourceUrl : buildUrl) + "id=" + spot;

    console.log('Building', buildingId, ' at:', spot, "")
    sendGet(slotUrl + "id=" + spot, function (err, res, body) {
        var $ = cheerio.load(body);
        if ($('.none').length && $('.none').text().indexOf('Fully') > -1) {

            cb(null);
            return;
        }
        if ($('#build').text().indexOf('Sufficient resources') > -1) {
            setTimeout(function () {
                build(spot, buildingId, cb);
            }, getMilliseconds($('#build').text().match(/\d:\d\d:\d\d/g)[1]))
            console.log('Not enough minerals, waiting ', $('#build').text().match(/\d:\d\d:\d\d/g)[1]);
            return;
        }
        var token = $('a.build').attr('href').split('=').pop();
        url += (buildingId ? ("&b=" + buildingId) : "") + "&k=" + token;
        sendGet(url, function () {
            var contract = $('#contract').text();
            var timestr = (contract || $('#build').text()).match(/\d:\d\d:\d\d/)[0]
            cb(getMilliseconds(timestr));
        })
    })

}
function getMilliseconds(timeStr) {
    var buffer = 1000;
    if (!timeStr) return null;
    var parts = timeStr.split(':');

    return ((+parts[0] * 3600) + (+parts[1] * 60) + (+parts[2])) * 1000 + buffer;
}
function sendResource(from, to, cb) {
    switchCity(from, function () {
        var form = {
            act: 2,
            r1: 1000000,
            r2: 1000000,
            r3: 1000000,
            r4: 1000000,
            vid2: to,
            's1.x': 27,
            's1.y': 10,
            s1: 'ok'
        }
        //prepare form
        request({
            uri: 'http://travianwars.net/s4/build.php?id=30',
            headers: {Cookie: cookieStr},
            method: 'POST',
            form: form
        }, function (err, res, body) {


            switchCity(to, cb)
        })
    });


}
function switchCity(cityId, cb) {
    sendGet(home + "?vid=" + cityId, cb);
}
function setupCity(cityId) {
    //singleBuildQueue.push([19, 20, 19, 20, 26, 26, 26, 39]);
    //singleBuildQueue.push('1616:sendres:' + cityId);
    //singleBuildQueue.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
    //singleBuildQueue.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
    //singleBuildQueue.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
    //singleBuildQueue.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
    // singleBuildQueue.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
    //singleBuildQueue.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);

    //singleBuildQueue.push([19, 20, 19, 20, "26:full"]);
    //singleBuildQueue.push('1616:sendres:' + cityId);
    // singleBuildQueue.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
    //singleBuildQueue.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
    //singleBuildQueue.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
    //singleBuildQueue.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);

    //singleBuildQueue.push(["39:full", "19:full", "20:full"]);
    //singleBuildQueue.push('1616:sendres:' + cityId);
    //singleBuildQueue.push([21, "21:full", 22, "22:full", 23, "23:full", 24, "24:full", 25, "25:full", 27, "27:full"]);
    //singleBuildQueue.push([28, "28:full", 29, "29:full", 30, "30:full"]);
    //singleBuildQueue.push('1616:sendres:' + cityId);
    //singleBuildQueue.push([31, "31:full", 32, "32:full"]);
    //singleBuildQueue.push([33, "33:full", 34, "34:full", 40, "40:full"]);
    //singleBuildQueue.push([35, "35:full"]);
    //singleBuildQueue.push([36, "36:full"]);
    //singleBuildQueue.push([37, "37:full"]);
    //singleBuildQueue.push([38, "38:full"]);
    singleBuildQueue.push(['30:full']);
    //29 ,32 ,33,37 ,38 ,31 ,34
    //  singleBuildQueue.push(19, 20, 19, 20, '26:full');
    singleBuildQueue.push(["1:full", "2:full", "3:full", "4:full", "5:full", "6:full", "7:full", "8:full", "9:full", "10:full", "11:full", "12:full", "13:full", "14:full", "15:full", "16:full", "17:full", "18:full"]);
    // singleBuildQueue.push(['19:full', '20:full', '21:full', '22:full', '23:full', '24:full', '25:full', '27:full', '28:full', '29:full', '30:full', '31:full', '32:full', '33:full', '34:full', '35:full', '36:full', '37:full', '38:full']);
}


function fullUpgrade(spotId, timeout, cb) {
    timeout = timeout || 0;
    setTimeout(function () {
        build(spotId, function (newtimeout) {
            console.log('Timeout:', newtimeout);
            if (newtimeout === null) {
                console.log('Finish grading ', spotId);
                cb();
                return;
            }
            fullUpgrade(spotId, newtimeout, cb)
        })
    }, timeout)
}
function isUnderAttack(cb) {
    sendGet('http://travianwars.net/s4/village1.php', function (err, res, body) {
        var $ = cheerio.load(body);
        if ($('.a1').length) {
            var millies = getMilliseconds($('.a1').last().parents('tr').text().match(/\d:\d\d:\d\d/)[0]);
            if (millies <= 8 * 1000) {
                console.log('we are under attack');
                cb(true)
                return;
            }
        }
        cb(false);
    })
}
function sendFarm(to, count, cb) {
    //check that rally has less then 20
    request({
        uri: base + '/village1.php',
        headers: {Cookie: cookieStr}
    }, function (err, res, body) {
        var $ = cheerio.load(body),
            countOfAttacks = parseInt($('.a2').eq(1).text())
        if (countOfAttacks >= 19) {
            console.log('Too much attacks now repeating in 5 secs')
            setTimeout(sendFarm.bind(this, to, count, cb), 5000)
            return;
        } else {
            request({
                uri: base + '/v2v.php',
                headers: {Cookie: cookieStr}
            }, function (err, res, body) {
                var $ = cheerio.load(body),
                    availableMaceman = $("#troops td").eq(0).find('a').text().slice(1, -1);

                if (count === 'max') {
                    count = availableMaceman;
                } else if (availableMaceman < count) {
                    console.log("Want to send ", count, 'but available only ', availableMaceman);
                    setTimeout(sendFarm.bind(this, to, count, cb), 5000)
                    return;
                }
                var form = {
                    id: to,
                    c: 4,
                    't[11]': count,
                    's1.x': 25,
                    's1.y': 6,
                    s1: 'ok'
                }
                request({
                    uri: base + '/v2v.php',
                    form: form,
                    method: "POST",
                    headers: {Cookie: cookieStr}
                }, function (err, res, body) {
                    cb && cb()
                })

            });
        }
    });


}
function sendAllArmy(cb) {
    sendFarm(160002, 'max', cb);
}
var stepCounter = 0;
setInterval(function () {
    isUnderAttack(function (is) {
        if (is) {
            farmQueue.pause()
            sendAllArmy()
            farmQueue.resume();
        }
    })
    stepCounter++;
    if (stepCounter % 3 == 0) {
        BuildArmy();
    }

}, 1000)


//setupCity(37)
BuildArmy();