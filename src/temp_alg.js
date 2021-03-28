const math = require('mathjs')
const rownum = 2, colnum = 3;

// notation for creating person
// var person = {Name:"John", priority:5, avail_map: avail};
// var group = {people: {list of people}, req: 1; priority: 3, avail_map: avail}
// var groups = list of groups

function updateAvailability(people = null, groups = null, reqs = false){
    let pg, reqMap, numPeople
    if (reqs) {
        pg = groups;
        reqMap = getReqMap(groups);
        numPeople = getTotalNumPeople(groups);
    }
    else {
       pg = people;
       reqMap = getPriority5Map(people);
       numPeople = people.length;
    }
    return updateAvail(pg, reqMap, numPeople);
}


function getReqMap(groups){
    let reqMap = math.ones(rownum, colnum)
    for (let i = 0; i < math.size(groups); i++) {
        reqMap = math.dotMultiply(reqMap, groups[i].avail_map >= groups[i].req);
    }
    return reqMap;
}

function updateAvail(pg, reqMap, numPeople, reqs = false){
    // people is a list of person objects
    // Called when someone changes or adds availability
    // returns updated availability map
    // for person/groups w/o reqs
    let updated = math.zeros(rownum, colnum);
    const weights = getWeights(numPeople);
    for (let i = 0; i < pg.length; i++) {
        let weightedMap = math.multiply(weights[pg[i].priority-1],pg[i].avail_map)
        updated = math.add(updated, weightedMap);
    }
    if (matSum(reqMap) > 1)
        return math.dotMultiply(updated, reqMap);
    return updated
}

function getPriority5Map(people){
    // avail is availability matrix
    // num is the number of priority 5 people
    let p5Map = math.ones(rownum, colnum)
    for (let i = 0; i < people.length; i++){
        if (people[i].priority == 5)
            p5Map = math.dotMultiply(p5Map, people[i].avail_map)
    }
    return p5Map;
}

function getWeights(numPeople){
    // Number of people per priority
    // return weights
    let weights = []
    let i
    for (i = 0; i < 5; i++) {
        weights[i] = numPeople / (numPeople ^ (4-i));
    }
    return weights
}

function createColorMap(avail){
    // avail is the availability matrix
    let max = math.max(avail);
    let min = math.min(avail);
    return math.dotMultiply(math.subtract(avail, min) / (max - min), 255);
}

function matSum(mat) {
    // calculate sum of a matrix
    // not sure if this is a js function but i couldn't find anything
    // i didn't try very hard though
    let sum = 0;
    for (let i = 0; i < rownum; i++)
        for (let j = 0; j < colnum; j++)
            sum += mat[i][j]
    return sum
}

function setGroupMap(group){
    // Get availability map for each group
    // Only need when more people are added to a group
    let map = math.zeros(rownum, colnum)
    for (let i = 0; i < group.people.length; i++){
        map = map + group.people[i].avail_map;
    }
    return map;
}

function getTotalNumPeople(groups){
    let num = 0
    for (let i = 0; i < groups.length; i++){
        num += groups[i].people.length
    }
    return num;
}

