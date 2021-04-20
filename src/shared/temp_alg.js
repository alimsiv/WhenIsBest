const math = require('mathjs')
const arrlength = 108;

//const dimensions = [ arr.length, arr[0].length ];

// notation for creating person
// var person = {Name: "John", priority:3, avail_map: avail, group = '', pref_map: pref, availability: avail};
// people = list of persons
// var group = {people: {list of people}, req: 0; priority: 3, avail_map: avail, pref_map: pref, all_avail = avail}
// var groups = list of groups

export function outputColorMap(people = null, groups = null, reqs = false, pref = false) {
    // get availability map
    let avail = updateAvailability(people, groups, reqs, pref);
    return createColorMap(avail)
}

function updateAvailability(people = null, groups = null, reqs = false, pref = false) {
    let pg, reqMap, numPeople, i
    if (reqs) {
        pg = groups;
        if (pref){
            for (i = 0; i < math.size(pg); i++)
                pg[i].avail_map = pg[i].pref_map
        }
        else {
            for (i = 0; i < math.size(pg); i++)
                pg[i].avail_map = pg[i].availability
        }
        reqMap = getReqMap(pg);
        numPeople = getTotalNumPeople(pg);
    } else {
        pg = people;
        if (pref){
            for (i = 0; i < math.size(pg); i++)
                pg[i].avail_map = pg[i].pref_map
        }
        else {
            for (i = 0; i < math.size(pg); i++)
                pg[i].avail_map = pg[i].availability
        }
        reqMap = getPriority5Map(people);
        numPeople = people.length;
    }
    return updateAvail(pg, reqMap, numPeople);
}



function getReqMap(groups) {
    let reqMap = math.ones(arrlength)
    for (let i = 0; i < math.size(groups); i++) {
        reqMap = math.dotMultiply(reqMap, groups[i].avail_map >= groups[i].req);
    }
    return reqMap;
}

function updateAvail(pg, reqMap, numPeople, reqs = false) {
    // people is a list of person objects
    // Called when someone changes or adds availability
    // returns updated availability map
    // for person/groups w/o reqs
    let updated = math.zeros(arrlength);
    const weights = getWeights(numPeople);
    for (let i = 0; i < pg.length; i++) {
        let weightedMap = math.multiply(weights[pg[i].priority - 1], pg[i].avail_map)
        updated = math.add(updated, weightedMap);
    }
    if (matSum(reqMap) > 0)
        return math.dotMultiply(updated, reqMap);
    return updated
}

function getPriority5Map(people) {
    // avail is availability matrix
    // num is the number of priority 5 people
    let p5Map = math.ones(arrlength)
    for (let i = 0; i < people.length; i++) {
        if (people[i].priority == 5)
            p5Map = math.dotMultiply(p5Map, people[i].avail_map)
    }
    return p5Map;
}

function getWeights(numPeople) {
    // return weights based on total number of people
    let weights = []
    let i
    for (i = 0; i < 4; i++) {
        weights[i] = numPeople / (4 ** (3-i));
    }
    return weights
}

function createColorMap(avail) {
    // avail is the availability matrix
    let max = math.max(avail);
    let min = math.min(avail);
    const temp = avail.map(function(x) {return (x-min)/(max-min)*255;})
    return temp._data
}

function matSum(mat) {
    // calculate sum of a matrix
    // not sure if this is a js function but i couldn't find anything
    // i didn't try very hard though
    let sum = 0;
    // let rownum = mat.length;
    // let colnum = mat[0].length;
    for (let i = 0; i < arrlength; i++)
            sum += mat[i]
    return sum
}

function getGroupMap(people) {
    // Get availability map for each group
    // Only need when more people are added to a group
    let map = math.zeros(arrlength)
    for (let i = 0; i < people.length; i++) {
        map = map + people[i].avail_map;
    }
    return map;
}

function getTotalNumPeople(groups) {
    let num = 0
    for (let i = 0; i < groups.length; i++) {
        num += groups[i].people.length
    }
    return num;
}

function convertToGroups(people, GroupList) {
    let groupDict = initializeGroups(GroupList)
    let groups = [];
    for (let i = 0; i < people.length; i++) {
        groupDict[people[i].group].push(people[i]);
    }

    for (let i = 0; GroupList.length; i++) {
        let peopleList = groupDict[GroupList[i]];
        let group = {people: peopleList, req: 0, priority: 3, avail_map: getGroupMap(peopleList)}
        groups.push(group);
    }

    return groups;
}

function initializeGroups(GroupList) {
    let groupDict = {}
    for (let i = 0; i < GroupList.length; i++)
        groupDict[GroupList[i]] = [];
    return groupDict;
}

function getPrefMap(avail_map) {
    let i
    let prefMap =  avail_map
    for (i = 0; i < arrlength; i++){
            if (prefMap[i] == 2)
                prefMap[i] = 1
            else
                prefMap[i] = 0
        }
    }

