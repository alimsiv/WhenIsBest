const math = require('mathjs')

// notation for creating person
// var person = {Name: "John", priority:3, avail_map: avail, group = '', pref_map: pref, availability: avail, show: True};
// people = list of persons
// var group = {name: name, people: {list of people}, req: 0; priority: 3, avail_map: avail, pref_map: pref, all_avail = avail}
// var groups = list of groups

export function outputColorMap(people = null, groups = null, reqs = false, pref = false) {
    // get availability map
    console.log('Calculating Heat Map')
    let avail = updateAvailability(people, groups, reqs, pref);
    console.log('Creating map')
    return createColorMap(avail)
}

function updateAvailability(people = null, groups = null, reqs = false, pref = false) {
    let pg, reqMap, numPeople, i
    if (reqs) {
        console.log('Heatmap with groups')
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
        console.log('Heatmap with people')
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
    let reqMap = math.ones(math.size(groups[0].avail_map))
    for (let i = 0; i < math.size(groups); i++) {
        if (groups[i].show)
            reqMap = math.dotMultiply(reqMap, groups[i].avail_map >= groups[i].req);
    }
    return reqMap;
}

function updateAvail(pg, reqMap, numPeople, reqs = false) {
    // people is a list of person objects
    // Called when someone changes or adds availability
    // returns updated availability map
    // for person/groups w/o reqs
    let updated = math.zeros(math.size(pg[0].avail_map));
    const weights = getWeights(numPeople);
    for (let i = 0; i < pg.length; i++) {
        let weightedMap = math.multiply(weights[pg[i].priority - 1], pg[i].avail_map)
        if (pg[i].show)
            updated = math.add(updated, weightedMap);
    }
    if (math.sum(reqMap) > 0)
        return math.dotMultiply(updated, reqMap);
    return updated
}

function getPriority5Map(people) {
    // avail is availability matrix
    // num is the number of priority 5 people
    let p5Map = math.ones(math.size(people[0].avail_map))
    for (let i = 0; i < people.length; i++) {
        if (people[i].priority == 5 && people[i].show)
            p5Map = math.dotMultiply(p5Map, people[i].avail_map)
    }
    return p5Map;
}

function getWeights(numPeople) {
    // return weights based on total number of people
    let weights = []
    let i
    for (i = 0; i < 5; i++) {
        weights[i] = numPeople / (5 ** (4-i));
    }
    return weights
}

function createColorMap(avail) {
    // avail is the availability matrix
    let max = math.max(avail);
    let min = math.min(avail);
    const temp = avail.map(function(x) {return (x-min)/(max-min)*255;})
    return temp
}


function getGroupMap(people) {
    // Get availability map for each group
    // Only need when more people are added to a group
    let map = math.zeros(math.size(people[0].avail_map))
    for (let i = 0; i < people.length; i++) {
        if(people[i].show)
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

export function convertToGroups(people, GroupList) {
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


